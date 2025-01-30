import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Categories.css';

const Categories = () => {
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

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
        fetchPosts();
    }, []);

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

    const getPostsByCategory = (category) => {
        return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

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

                {selectedCategory && (
                    <div className="category-posts">
                        <h2>
                            <span className="category-icon">
                                {categories.find(c => c.name === selectedCategory)?.icon}
                            </span>
                            {selectedCategory} Posts
                        </h2>
                        <div className="posts-grid">
                            {getPostsByCategory(selectedCategory).map((post) => (
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
                            ))}
                            {getPostsByCategory(selectedCategory).length === 0 && (
                                <div className="no-posts-message">
                                    No posts available in this category yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
