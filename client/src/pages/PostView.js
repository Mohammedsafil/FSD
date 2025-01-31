import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostView.css';
import gpayQR from '../asserts/gpay.jpg';

const StarRating = ({ rating, averageRating, totalRatings, onRatingChange }) => {
    const [hover, setHover] = useState(0);
    
    return (
        <div className="star-rating">
            <div className="stars-container">
                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        className={`star ${star <= (hover || rating) ? 'active' : ''}`}
                        onClick={() => onRatingChange(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <div className="rating-stats">
                {averageRating > 0 && (
                    <span className="average-rating">
                        Average: {averageRating.toFixed(1)} ★ ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
                    </span>
                )}
            </div>
        </div>
    );
};

const PostView = () => {
    const [post, setPost] = useState(null);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showSubscribePopup, setShowSubscribePopup] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/posts/${id}`);
            if (response.ok) {
                const data = await response.json();
                setPost(data);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleLike = () => {
        if (hasDisliked) {
            setHasDisliked(false);
        }
        setHasLiked(!hasLiked);
    };

    const handleDislike = () => {
        if (hasLiked) {
            setHasLiked(false);
        }
        setHasDisliked(!hasDisliked);
    };

    const handleFollow = async () => {
        try {
            // TODO: Implement actual API call to follow/unfollow user
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleSubscribe = () => {
        setShowSubscribePopup(true);
    };

    const closeSubscribePopup = () => {
        setShowSubscribePopup(false);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            const newComment = {
                id: Date.now(),
                text: comment.trim(),
                author: 'Guest User',
                timestamp: new Date().toISOString()
            };
            setComments([newComment, ...comments]);
            setComment('');
        }
    };

    const handleRating = async (value) => {
        try {
            const response = await fetch(`http://localhost:4000/api/posts/${id}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating: value })
            });

            if (response.ok) {
                const data = await response.json();
                setUserRating(value);
                setHasRated(true);
                // Update the post with new rating data
                setPost(prev => ({
                    ...prev,
                    averageRating: data.averageRating,
                    totalRatings: data.totalRatings
                }));
            } else {
                console.error('Failed to submit rating');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!post) {
        return (
            <div className="post-view-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="post-view-container">
            <div className="post-view-content">
                <div className="post-header">
                    <h1>{post.title}</h1>
                    <div className="author-info">
                        <div className="author-avatar">
                            {post.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="author-details">
                            <div className="author-name-follow">
                                <span className="author-name">Written by {post.author}</span>
                                <button 
                                    className={`follow-button ${isFollowing ? 'following' : ''}`}
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            </div>
                            <span className="post-date">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="category-badge">{post.category}</div>
                    </div>
                </div>

                <div className="post-image-container">
                    <img
                        src={post.coverImage || 'https://via.placeholder.com/800x400'}
                        alt={post.title}
                        className="post-main-image"
                    />
                </div>

                <article className="post-content">
                    <p>{post.content}</p>
                </article>

                <div className="post-interactions">
                    

                    <div className="reactions">
                        <button 
                            className={`reaction-button like-button ${hasLiked ? 'active' : ''}`}
                            onClick={handleLike}
                            title={hasLiked ? "Remove like" : "Like this post"}
                        >
                            👍
                        </button>
                        <button 
                            className={`reaction-button dislike-button ${hasDisliked ? 'active' : ''}`}
                            onClick={handleDislike}
                            title={hasDisliked ? "Remove dislike" : "Dislike this post"}
                        >
                            👎
                        </button>
                        <button 
                            className="subscribe-button"
                            onClick={handleSubscribe}
                            title="Subscribe for exclusive content"
                        >
                            ⭐ Subscribe
                        </button>
                    </div>
                    
                    <div className="rating-section">
                        <h4>Rate this post</h4>
                        <StarRating 
                            rating={userRating}
                            averageRating={post.averageRating}
                            totalRatings={post.ratings ? post.ratings.length : 0}
                            onRatingChange={handleRating}
                        />
                        {hasRated && (
                            <p className="rating-message">Thanks for rating!</p>
                        )}
                    </div>

                    <div className="comment-section">
                        <h3>Share your thoughts</h3>
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your comment here..."
                                rows="4"
                            />
                            <button 
                                type="submit"
                                className="submit-comment"
                                disabled={!comment.trim()}
                            >
                                Post Comment
                            </button>
                        </form>

                        <div className="comments-list">
                            <h4>Comments ({comments.length})</h4>
                            {comments.length === 0 ? (
                                <p className="no-comments">No comments yet. Be the first to comment!</p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-header">
                                            <div className="comment-author">
                                                <div className="comment-avatar">
                                                    {comment.author.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{comment.author}</span>
                                            </div>
                                            <span className="comment-time">
                                                {formatTimestamp(comment.timestamp)}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="post-footer">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        ← Back to Posts
                    </button>
                </div>
            </div>
            {showSubscribePopup && (
                <div className="popup-overlay" onClick={closeSubscribePopup}>
                    <div className="popup-content" onClick={e => e.stopPropagation()}>
                        <button className="close-popup" onClick={closeSubscribePopup}>&times;</button>
                        <h2>Support the Author</h2>
                        <p>Scan the QR code to support with GPay</p>
                        <div className="gpay-container">
                            <img src={gpayQR} alt="GPay QR Code" className="gpay-qr" />
                        </div>
                        <p>Subscribe to access exclusive content</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostView;
