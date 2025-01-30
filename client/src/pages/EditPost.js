import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './createpoststyle.css';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        coverImage: '',
        author: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch the post data when component mounts
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/posts/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data.post);
                } else {
                    setMessage('Failed to fetch post data');
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                setMessage('Error fetching post data');
            }
        };

        fetchPost();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Post updated successfully!');
                setTimeout(() => navigate('/home'), 1500);
            } else {
                setMessage(data.message || 'Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            setMessage('Error updating post');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setMessage('Post deleted successfully!');
                    setTimeout(() => navigate('/home'), 1500);
                } else {
                    const data = await response.json();
                    setMessage(data.message || 'Failed to delete post');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                setMessage('Error deleting post');
            }
        }
    };

    return (
        <div className="create-post-container">
            <h2>Edit Post</h2>
            {message && <div className="message">{message}</div>}
            
            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Content:</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Cover Image URL:</label>
                    <input
                        type="text"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Author:</label>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-button">Update Post</button>
                    <button type="button" className="cancel-button" onClick={handleDelete}>
                        Delete Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;
