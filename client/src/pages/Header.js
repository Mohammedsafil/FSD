import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './Headerstyle.css';

const Header = ({ onWriteClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current path
  const currentPath = location.pathname;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <h1 className="logo">
            <a href="/home" className="logo-link">
              <span className="logo-text">Safil's Blog</span>
              <span className="logo-dot">.</span>
            </a>
          </h1>
          <p className="logo-tagline">Where Ideas Bloom</p>
        </div>

        {/* Navigation Section */}
        <nav className="nav-section">
          <ul className="nav-list">
            <li className="nav-item">
              <a 
                href="/home" 
                className={`nav-link ${currentPath === '/home' ? 'active' : ''}`}
              >
                Latest
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/categories" 
                className={`nav-link ${currentPath === '/categories' ? 'active' : ''}`}
              >
                Categories
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/contact" 
                className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}
              >
                Contact
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/about" 
                className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}
              >
                About
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/" 
                className='nav-link'              >
                Logout
              </a>
            </li>
          </ul>
        </nav>

        {/* Action Section */}
        <div className="action-section">
          <form onSubmit={handleSearch} className="search-box">
            <input 
              type="text" 
              placeholder="Search stories..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
          
          <button className="write-button" onClick={onWriteClick}>
            Write
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;