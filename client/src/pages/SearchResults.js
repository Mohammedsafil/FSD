import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:4000/api/posts/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Search failed');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
            setLoading(false);
        };

        if (query) {
            fetchResults();
        } else {
            navigate('/home');
        }
    }, [query, navigate]);

    // Function to highlight matching text
    const highlightMatch = (text, searchTerm) => {
        if (!text || !searchTerm) return text;
        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) => 
            part.toLowerCase() === searchTerm.toLowerCase() 
                ? <mark key={index}>{part}</mark> 
                : part
        );
    };

    // Function to get content preview
    const getContentPreview = (content, searchTerm, maxLength = 200) => {
        if (!content) return '';
        
        // Find the position of the search term
        const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
        if (index === -1) {
            // If term not found, return start of content
            return content.slice(0, maxLength) + '...';
        }

        // Get a window of text around the match
        const start = Math.max(0, index - 100);
        const end = Math.min(content.length, index + 100);
        const preview = content.slice(start, end);

        return (start > 0 ? '...' : '') + preview + (end < content.length ? '...' : '');
    };

    return (
        <div className="search-results-container">
            <Header />
            <div className="search-results-content">
                <h2>Search Results for "{query}"</h2>
                <p className="results-count">
                    {posts.length} {posts.length === 1 ? 'result' : 'results'} found
                </p>
                
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Searching...</p>
                    </div>
                ) : posts.length > 0 ? (
                    <div className="search-results-list">
                        {posts.map(post => (
                            <Link to={`/post/${post._id}`} key={post._id} className="post-card">
                                <div className="post-card-content">
                                    <div className="post-image">
                                        <img src={post.coverImage} alt={post.title} />
                                    </div>
                                    <div className="post-info">
                                        <h3>{highlightMatch(post.title, query)}</h3>
                                        <div className="post-meta">
                                            <span className="post-category">{post.category}</span>
                                            <span className="post-author">By {post.author}</span>
                                            <span className="post-date">
                                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="post-preview">
                                            {highlightMatch(getContentPreview(post.content, query), query)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3>No posts found for "{query}"</h3>
                        <p>Try different keywords or check out our latest posts</p>
                        <div className="search-suggestions">
                            <h4>Suggestions:</h4>
                            <ul>
                                <li>Check your spelling</li>
                                <li>Try more general keywords</li>
                                <li>Try different keywords</li>
                                <li>Try searching in a specific category</li>
                            </ul>
                        </div>
                        <Link to="/home" className="browse-all-link">Browse All Posts</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
