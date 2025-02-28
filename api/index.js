const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const dbName = 'BlogApp';
const url = `mongodb://localhost:27017/${dbName}`;
const App = express();

// Middleware setup
App.use(cors());
App.use(express.json({ limit: '50mb' }));
App.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log("Connected to MongoDB");
    
    // Check if we have any posts
    const count = await BlogPost.countDocuments();
    console.log(`Current post count: ${count}`);
    
    // Add some test data if no posts exist
    if (count === 0) {
        try {
            const testPosts = [
                {
                    title: "Getting Started with React",
                    content: "React is a popular JavaScript library for building user interfaces...",
                    category: "Technology",
                    author: "Mohammed Safil",
                    coverImage: "https://example.com/react.jpg"
                },
                {
                    title: "Healthy Living Tips",
                    content: "Maintaining a healthy lifestyle is crucial for overall wellbeing...",
                    category: "Health",
                    author: "Mohammed Safil",
                    coverImage: "https://example.com/health.jpg"
                },
                {
                    title: "Travel Adventures",
                    content: "Exploring new places and experiencing different cultures...",
                    category: "Travel",
                    author: "Mohammed Safil",
                    coverImage: "https://example.com/travel.jpg"
                }
            ];
            
            await BlogPost.insertMany(testPosts);
            console.log("Test posts added successfully");
        } catch (error) {
            console.error("Error adding test posts:", error);
        }
    }
})
.catch(err => console.error("Failed to connect to MongoDB:", err));

// Add error handler for MongoDB connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Session setup
App.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

App.use(passport.initialize());
App.use(passport.session());

// Define the User schema
const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    name: { type: String },
    bio: { type: String },
    skills: { type: String },
    education: { type: String },
    experience: { type: String },
    interests: { type: String },
    social: { type: String },
    profileImage: { type: String }
});

const User = mongoose.model('User', UserSchema);

// Debugging: Check if .env variables are loaded
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

// Passport Google OAuth configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

// Profile endpoints
App.get('/api/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

App.put('/api/profile', requireAuth, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.session.userId,
            { 
                $set: {
                    name: req.body.name,
                    bio: req.body.bio,
                    skills: req.body.skills,
                    education: req.body.education,
                    experience: req.body.experience,
                    interests: req.body.interests,
                    social: req.body.social,
                    profileImage: req.body.profileImage
                }
            },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
});

App.post('/api/upload-profile-image', requireAuth, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        await User.findByIdAndUpdate(req.session.userId, { profileImage: imageUrl });
        
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading image' });
    }
});

// Google Auth Routes
App.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

App.get('/auth/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login',
        successRedirect: 'http://localhost:3000/home'
    })
);

App.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// User Registration Route (Sign-up)
const saltRounds = 10;

App.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing password" });
        }

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        try {
            await newUser.save();
            res.status(200).json({ message: "User registered successfully" });
        } catch (err) {
            res.status(500).json({ message: "Error registering user", error: err });
        }
    });
});

// User Login Route
App.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Create user object without password
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        res.status(200).json({ 
            success: true,
            message: "Login successful",
            user: userResponse
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// Define the BlogPost schema
const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: String }],  // Array of user IDs who liked the post
    ratings: [{
        userId: { type: String },
        rating: { type: Number, min: 1, max: 5 }
    }],
    averageRating: { type: Number, default: 0 }
});

// Add text indexes for search
BlogPostSchema.index({ title: 'text', content: 'text', category: 'text' });

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

// Create blog post
App.post('/api/posts', async (req, res) => {
    try {
        const { title, content, category, coverImage, author } = req.body;
        const newPost = new BlogPost({
            title,
            content,
            category,
            coverImage,
            author
        });
        
        await newPost.save();
        res.status(201).json({ 
            success: true, 
            message: 'Blog post created successfully',
            post: newPost 
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Error creating blog post',
            error: error.message 
        });
    }
});

// Get all blog posts
App.get('/api/posts', async (req, res) => {
    try {
        const posts = await BlogPost.find({});
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching posts',
            error: error.message 
        });
    }
});

// Get posts by category
App.get('/api/posts/category/:category', async (req, res) => {
    try {
        const posts = await BlogPost.find({ category: req.params.category })
            .sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            posts 
        });
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching posts by category',
            error: error.message 
        });
    }
});

// Get post with reaction status
App.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // Add user's reaction status if userId is provided
        const userId = req.query.userId;
        const response = post.toObject();
        if (userId) {
            response.hasLiked = post.likes.includes(userId);
            response.hasDisliked = post.dislikedBy.includes(userId);
        }
        
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
});

// Update blog post
App.put('/api/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, coverImage, author } = req.body;
        
        const updatedPost = await BlogPost.findByIdAndUpdate(
            id,
            { title, content, category, coverImage, author },
            { new: true } // Return the updated document
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog post updated successfully',
            post: updatedPost
        });
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating blog post',
            error: error.message
        });
    }
});

// Delete blog post
App.delete('/api/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await BlogPost.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting blog post',
            error: error.message
        });
    }
});

// Like a post
App.post('/api/posts/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already liked or disliked
        const alreadyLiked = post.likes.includes(userId);
        const alreadyDisliked = post.dislikedBy.includes(userId);

        if (alreadyLiked) {
            // Remove like
            post.likes = Math.max(0, post.likes - 1);
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            // Add like and remove dislike if exists
            if (alreadyDisliked) {
                post.dislikes = Math.max(0, post.dislikes - 1);
                post.dislikedBy = post.dislikedBy.filter(id => id !== userId);
            }
            post.likes += 1;
            post.likes.push(userId);
        }

        await post.save();
        res.json({ 
            likes: post.likes, 
            dislikes: post.dislikes,
            hasLiked: post.likes.includes(userId),
            hasDisliked: post.dislikedBy.includes(userId)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error liking post', error: error.message });
    }
});

// Dislike a post
App.post('/api/posts/:id/dislike', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already liked or disliked
        const alreadyLiked = post.likes.includes(userId);
        const alreadyDisliked = post.dislikedBy.includes(userId);

        if (alreadyDisliked) {
            // Remove dislike
            post.dislikes = Math.max(0, post.dislikes - 1);
            post.dislikedBy = post.dislikedBy.filter(id => id !== userId);
        } else {
            // Add dislike and remove like if exists
            if (alreadyLiked) {
                post.likes = Math.max(0, post.likes - 1);
                post.likes = post.likes.filter(id => id !== userId);
            }
            post.dislikes += 1;
            post.dislikedBy.push(userId);
        }

        await post.save();
        res.json({ 
            likes: post.likes, 
            dislikes: post.dislikes,
            hasLiked: post.likes.includes(userId),
            hasDisliked: post.dislikedBy.includes(userId)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error disliking post', error: error.message });
    }
});

// Rating endpoint
App.post('/api/posts/:id/rate', async (req, res) => {
    try {
        const postId = req.params.id;
        const { rating } = req.body;
        
        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating. Must be between 1 and 5.' });
        }

        // Get the post
        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Add or update rating
        const userId = 'anonymous'; // You can replace this with actual user ID when you have authentication
        const existingRatingIndex = post.ratings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            post.ratings[existingRatingIndex].rating = rating;
        } else {
            post.ratings.push({ userId, rating });
        }

        // Calculate new average rating
        const totalRatings = post.ratings.reduce((sum, r) => sum + r.rating, 0);
        post.averageRating = totalRatings / post.ratings.length;

        // Save the updated post
        await post.save();

        res.json({ 
            success: true, 
            averageRating: post.averageRating,
            totalRatings: post.ratings.length
        });
    } catch (error) {
        console.error('Error rating post:', error);
        res.status(500).json({ message: 'Error rating post' });
    }
});

// Search endpoint
App.get('/api/posts/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Debug log
        console.log('Search query:', q);

        // First, check if there are any posts at all
        const totalPosts = await BlogPost.countDocuments();
        console.log('Total posts in database:', totalPosts);

        const searchResults = await BlogPost.find(
            {
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { content: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } },
                    { author: { $regex: q, $options: 'i' } }
                ]
            },
            null,
            { sort: { createdAt: -1 } }
        );

        // Debug log
        console.log('Search results count:', searchResults.length);
        console.log('First result (if any):', searchResults[0]);

        res.json(searchResults);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error performing search', error: error.message });
    }
});

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
        
        App.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
                App.listen(PORT + 1, () => {
                    console.log(`Server running on port ${PORT + 1}`);
                });
            } else {
                console.error('Server error:', err);
            }
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
};

startServer();
