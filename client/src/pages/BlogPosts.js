import React, { useState, useEffect } from 'react';
import './BlogPosts.css';

const BlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Personal'];

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory]);

    const fetchPosts = async () => {
        try {
            const url = selectedCategory === 'all' 
                ? 'http://localhost:4000/api/posts'
                : `http://localhost:4000/api/posts/category/${selectedCategory}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setPosts(data.posts);
            } else {
                setError('Failed to fetch posts');
            }
        } catch (error) {
            setError('Error fetching posts');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="posts-loading">
                <div className="loader"></div>
                <p>Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="posts-error">
                <p>{error}</p>
                <button onClick={fetchPosts}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="blog-posts-container">
            {/* Category Filter */}
            <div className="category-filter">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.toLowerCase())}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            <div className="posts-grid">
                {posts.map((post) => (
                    <article key={post._id} className="post-card">
                        <div className="post-image">
                            <img src={post.coverImage} alt={post.title} />
                            <div className="post-category">{post.category}</div>
                        </div>
                        <div className="post-content">
                            <h2 className="post-title">{post.title}</h2>
                            <p className="post-excerpt">
                                {post.content.substring(0, 150)}...
                            </p>
                            <div className="post-meta">
                                <span className="post-author">By {post.author}</span>
                                <span className="post-date">
                                    {formatDate(post.createdAt)}
                                </span>
                            </div>
                            <a href={`/post/${post._id}`} className="read-more">
                                Read More
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>
                        </div>
                    </article>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="no-posts">
                    <h3>No posts found</h3>
                    <p>Be the first to write a post in this category!</p>
                </div>
            )}
        </div>
    );
};

export default BlogPosts;
