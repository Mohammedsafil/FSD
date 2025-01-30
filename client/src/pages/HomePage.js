import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import CreatePost from './createpost';
import './HomePage.css';

const HomePage = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/posts');
      const data = await response.json();
      
      if (response.ok) {
        // Ensure posts is an array
        setPosts(Array.isArray(data) ? data : data.posts || []);
      } else {
        setError(data.message || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Error fetching posts');
    }
  };

  const handleCreateClick = () => {
    setShowCreatePost(true);
  };

  const handleCancelCreate = () => {
    setShowCreatePost(false);
  };

  return (
    <div className="home-container">
      <Header onWriteClick={handleCreateClick} />
      {showCreatePost ? (
        <CreatePost onCancel={handleCancelCreate} onPostCreated={fetchPosts} />
      ) : (
        <div className="posts-container">
          {error && <div className="error-message">{error}</div>}
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <div className="post-card" key={post._id}>
                <div className="post-category-badge">
                  {post.category}
                </div>
                <img 
                  src={post.coverImage || 'https://via.placeholder.com/400x200'} 
                  alt={post.title} 
                  className="post-image" 
                />
                <div className="post-content">
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                  <div className="post-meta">
                    <div className="post-author">
                      Author : 
                      <span className="author-name">{post.author}</span>
                    </div>
                    <button 
                      className="edit-button"
                      onClick={() => navigate(`/edit/${post._id}`)}
                    >
                      Edit Post
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-posts">No posts available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
