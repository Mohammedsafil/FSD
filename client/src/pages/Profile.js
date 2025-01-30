import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        skills: '',
        education: '',
        experience: '',
        interests: '',
        social: {
            twitter: '',
            linkedin: '',
            github: '',
            instagram: ''
        },
        profileImage: ''
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/profile', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    navigate('/login');
                    return;
                }
                const userData = await response.json();
                setUser(userData);
                setFormData(userData);
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate('/login');
            }
        };
        checkAuth();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social.')) {
            const socialField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                social: {
                    ...prev.social,
                    [socialField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profileImage', file);
            
            try {
                const response = await fetch('http://localhost:4000/api/upload-profile-image', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                if (response.ok) {
                    const { imageUrl } = await response.json();
                    setFormData(prev => ({
                        ...prev,
                        profileImage: imageUrl
                    }));
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/profile', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <Header />
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-image-container">
                        <img 
                            src={formData.profileImage || 'https://via.placeholder.com/150'} 
                            alt={formData.name} 
                            className="profile-image"
                        />
                        {isEditing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="image-upload"
                            />
                        )}
                    </div>
                    <div className="profile-info">
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="edit-name"
                                placeholder="Your Name"
                            />
                        ) : (
                            <h1>{user.name}</h1>
                        )}
                        <button 
                            className="edit-button"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-section">
                        <h2>About Me</h2>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                            />
                        ) : (
                            <p>{user.bio}</p>
                        )}
                    </div>

                    <div className="form-section">
                        <h2>Skills</h2>
                        {isEditing ? (
                            <textarea
                                name="skills"
                                value={formData.skills}
                                onChange={handleInputChange}
                                placeholder="Your skills..."
                            />
                        ) : (
                            <p>{user.skills}</p>
                        )}
                    </div>

                    <div className="form-section">
                        <h2>Education</h2>
                        {isEditing ? (
                            <textarea
                                name="education"
                                value={formData.education}
                                onChange={handleInputChange}
                                placeholder="Your education..."
                            />
                        ) : (
                            <p>{user.education}</p>
                        )}
                    </div>

                    <div className="form-section">
                        <h2>Experience</h2>
                        {isEditing ? (
                            <textarea
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="Your experience..."
                            />
                        ) : (
                            <p>{user.experience}</p>
                        )}
                    </div>

                    <div className="form-section">
                        <h2>Interests</h2>
                        {isEditing ? (
                            <textarea
                                name="interests"
                                value={formData.interests}
                                onChange={handleInputChange}
                                placeholder="Your interests..."
                            />
                        ) : (
                            <p>{user.interests}</p>
                        )}
                    </div>

                    <div className="form-section">
                        <h2>Social Links</h2>
                        {isEditing ? (
                            <div className="social-links-edit">
                                <input
                                    type="text"
                                    name="social.twitter"
                                    value={formData.social.twitter}
                                    onChange={handleInputChange}
                                    placeholder="Twitter URL"
                                />
                                <input
                                    type="text"
                                    name="social.linkedin"
                                    value={formData.social.linkedin}
                                    onChange={handleInputChange}
                                    placeholder="LinkedIn URL"
                                />
                                <input
                                    type="text"
                                    name="social.github"
                                    value={formData.social.github}
                                    onChange={handleInputChange}
                                    placeholder="GitHub URL"
                                />
                                <input
                                    type="text"
                                    name="social.instagram"
                                    value={formData.social.instagram}
                                    onChange={handleInputChange}
                                    placeholder="Instagram URL"
                                />
                            </div>
                        ) : (
                            <div className="social-links">
                                {user.social.twitter && (
                                    <a href={user.social.twitter} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                )}
                                {user.social.linkedin && (
                                    <a href={user.social.linkedin} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                )}
                                {user.social.github && (
                                    <a href={user.social.github} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-github"></i>
                                    </a>
                                )}
                                {user.social.instagram && (
                                    <a href={user.social.instagram} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <button type="submit" className="save-button">
                            Save Changes
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
