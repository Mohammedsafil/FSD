import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './createpoststyle.css';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        coverImage: '',
        author: ''
    });
    const [message, setMessage] = useState('');

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'script',
        'indent',
        'direction',
        'color', 'background',
        'link', 'image', 'video',
        'blockquote', 'code-block'
    ];

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/api/posts/${id}`);
            const data = await response.json();
            
            if (response.ok) {
                // Check if we have the post data
                if (data.title) {
                    setFormData(data);
                } else {
                    setError('Post data is incomplete');
                }
            } else {
                setError(data.message || 'Failed to fetch post data');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Error fetching post data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
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
                // Navigate after a short delay
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
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage('Post deleted successfully!');
                    // Navigate after a short delay
                    setTimeout(() => navigate('/home'), 1500);
                } else {
                    setMessage(data.message || 'Failed to delete post');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                setMessage('Error deleting post');
            }
        }
    };

    if (loading) {
        return <div className="create-post-container">Loading...</div>;
    }

    if (error) {
        return (
            <div className="create-post-container">
                <div className="message error">{error}</div>
                <button onClick={() => navigate('/home')} className="back-button">
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="create-post-container">
            <h2>Edit Post</h2>
            {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
            </div>}
            
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
                    <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                        modules={modules}
                        formats={formats}
                        placeholder="Write your post content here..."
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
                        required
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
                    <button 
                        type="button" 
                        onClick={handleDelete} 
                        className="cancel-button"
                    >
                        Delete Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;
