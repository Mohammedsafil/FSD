import React, { useEffect, useState } from 'react';
import './Content.css';
import GoogleLogin from './GoogleLogin';
import { useNavigate } from 'react-router-dom';

const Content = () => {
  const [currentText, setCurrentText] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: '#ff0000'
  });
  const navigate = useNavigate();

  // Safe storage function
  const safeStorage = {
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        try {
          sessionStorage.setItem(key, value);
        } catch (sessionErr) {
          console.warn('Storage not available:', sessionErr);
        }
      }
    },
    getItem: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (err) {
        try {
          return sessionStorage.getItem(key);
        } catch (sessionErr) {
          console.warn('Storage not available:', sessionErr);
          return null;
        }
      }
    }
  };

  const texts = [
    "Explore amazing articles, insights, and discussions.",
    "Join the community and share your thoughts!",
    "Stay updated with the latest blog posts.",
    "Get inspired and learn new things every day!",
    "Dive into a world of creativity and knowledge."
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(textInterval);
  }, []);

  const checkPasswordStrength = (password) => {
    let score = 0;
    let strengthMessage = '';
    let color = '#ff0000';

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character type checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set message and color based on score
    switch (true) {
      case score === 0:
        strengthMessage = 'Very Weak';
        color = '#ff0000';
        break;
      case score <= 2:
        strengthMessage = 'Weak';
        color = '#ff4500';
        break;
      case score <= 4:
        strengthMessage = 'Medium';
        color = '#ffa500';
        break;
      case score <= 5:
        strengthMessage = 'Strong';
        color = '#9acd32';
        break;
      default:
        strengthMessage = 'Very Strong';
        color = '#008000';
    }

    return { score, message: strengthMessage, color };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage('');

    // Check password strength when password field changes
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(formData.password)) {
      setMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const requestBody = isLogin 
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      // Try port 4000 first, then 4001 if that fails
      let response;
      try {
        response = await fetch(`http://localhost:4000/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
      } catch (err) {
        // If port 4000 fails, try port 4001
        response = await fetch(`http://localhost:4001/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Use safe storage
          safeStorage.setItem('user', JSON.stringify(data.user));
          console.log("Login successful");
        } else {
          console.log("Registration successful");
        }
        setMessage(data.message);
        setFormData({ username: '', email: '', password: '' });
        navigate('/home');
      } else {
        setMessage(data.message || 'Authentication failed');
        console.log(isLogin ? "Login failed" : "Registration failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage(`An error occurred while ${isLogin ? 'logging in' : 'registering'}`);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="container">
      <div className="blog-section">
        <h1>Welcome to Safil's Blog</h1>
        <p className="dynamic-text">{texts[currentText]}</p>
      </div>

      <div className="login-section">
        <h2>{isLogin ? 'Welcome Back!' : 'Join Us Today'}</h2>
        <p>{isLogin ? 'Login to continue' : 'Sign up and start sharing your thoughts!'}</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleInputChange}
          />
          {!isLogin && (
            <input 
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          )}
          <input 
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
          {formData.password && (
            <div className="password-strength-container">
              <div 
                className="password-strength-bar" 
                style={{
                  width: `${(passwordStrength.score / 6) * 100}%`,
                  backgroundColor: passwordStrength.color,
                  transition: 'all 0.3s ease'
                }}
              />
              <p className="password-strength-text" style={{ color: passwordStrength.color }}>
                Password Strength: {passwordStrength.message}
              </p>
            </div>
          )}
          <button type="submit" className="btn-primary">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {message && <p className={`message ${message.includes('error') ? 'error' : 'success'}`}>{message}</p>}

        <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
        <button className="btn-secondary" onClick={toggleMode}>
          {isLogin ? 'Sign Up' : 'Login In'}
        </button>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Content;
