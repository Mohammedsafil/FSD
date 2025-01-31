import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header';
import './Categories.css';

const Categories = () => {
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const categories = [
        { name: 'Technology', icon: '💻' },
        { name: 'Travel', icon: '✈️' },
        { name: 'Fitness', icon: '💪' },
        { name: 'Food', icon: '🍳' },
        { name: 'Lifestyle', icon: '🌟' },
        { name: 'Business', icon: '💼' },
        { name: 'Health', icon: '🏥' },
        { name: 'Education', icon: '📚' },
        { name: 'Personal', icon: '📝' },
        { name: 'Fashion', icon: '👗' },
        { name: 'Sports', icon: '⚽' },
        { name: 'Entertainment', icon: '🎬' }
    ];

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchQuery(query);
            handleSearch(null, query);
        } else {
            fetchPosts();
        }
    }, [searchParams]);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/posts');
            if (response.ok) {
                const data = await response.json();
                setPosts(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleSearch = async (e, initialQuery = null) => {
        if (e) e.preventDefault();
        
        const query = initialQuery || searchQuery;
        if (!query.trim()) {
            setIsSearching(false);
            return;
        }

        setIsLoading(true);
        setIsSearching(true);
        
        try {
            const response = await fetch(`http://localhost:4000/api/posts/search?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
                // Update URL without page reload
                navigate(`/categories?q=${encodeURIComponent(query)}`, { replace: true });
            } else {
                throw new Error('Search failed');
            }
        } catch (error) {
            console.error('Error searching posts:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getPostsByCategory = (category) => {
        return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setIsSearching(false);
        setSearchQuery('');
        // Clear search params from URL
        navigate('/categories', { replace: true });
    };

    const displayedPosts = isSearching ? searchResults : (selectedCategory ? getPostsByCategory(selectedCategory) : posts);

    return (
        <div className="categories-container">
            <Header />
            <div className="categories-content">
                

                <div className="categories-list">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <span className="category-icon">{category.icon}</span>
                            <h3>{category.name}</h3>
                            <span className="post-count">
                                {getPostsByCategory(category.name).length} posts
                            </span>
                        </div>
                    ))}
                </div>

                <div className="posts-section">
                    {isSearching ? (
                        <h2>
                            {isLoading 
                                ? 'Searching...' 
                                : `Search Results for "${searchQuery}" (${searchResults.length} found)`}
                        </h2>
                    ) : selectedCategory && (
                        <h2>
                            <span className="category-icon">
                                {categories.find(c => c.name === selectedCategory)?.icon}
                            </span>
                            {selectedCategory} Posts
                        </h2>
                    )}

                    <div className="posts-grid">
                        {displayedPosts.length > 0 ? (
                            displayedPosts.map((post) => (
                                <div className="post-card" key={post._id}>
                                    <img
                                        src={post.coverImage || 'https://via.placeholder.com/400x200'}
                                        alt={post.title}
                                        className="post-image"
                                    />
                                    <div className="post-content">
                                        <h3>{post.title}</h3>
                                        <p>{post.content}</p>
                                        <div className="post-meta">
                                            <span className="author">By {post.author}</span>
                                            <button
                                                className="read-more"
                                                onClick={() => navigate(`/post/${post._id}`)}
                                            >
                                                Read More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-posts-message">
                                {isSearching
                                    ? `No posts found for "${searchQuery}"`
                                    : `No posts available in ${selectedCategory} category yet.`}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
