import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { fetchUserData, logout } from './authUtils';

function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const result = await fetchUserData();
      if (result.success) {
        setUser(result.data);
      } else if (result.error === 'HTTP 401') {
        navigate('/auth');
      }
      setLoading(false);
    };
    
    loadUserData();
  }, [navigate]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/auth');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Show loading state
  if (loading) {
    return (
      <aside className="sidebar-modern">
        <div className="sidebar-loading">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p>Loading...</p>
        </div>
      </aside>
    );
  }

  // Show default state if no user data
  if (!user) {
    return (
      <aside className="sidebar-modern">
        <div className="sidebar-no-user">
          <div className="no-user-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <p>Please log in</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar-modern">
      {/* Header with Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">BookRewards</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="user-profile">
        <div className="user-avatar">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=90b4e8&color=fff&size=120&font-size=0.4`} 
            alt={user.username}
          />
          <div className="status-badge online"></div>
        </div>
        <div className="user-details">
          <h3 className="user-name">{user.username}</h3>
          <span className="user-role">Reader</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-group">
          <h4 className="nav-title">Navigation</h4>
          <div className="nav-links">
            <Link 
              to="/dashboard" 
              className={`nav-item ${isActiveRoute('/dashboard') ? 'active' : ''}`}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/my-books" 
              className={`nav-item ${isActiveRoute('/my-books') ? 'active' : ''}`}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                </svg>
              </div>
              <span>My Books</span>
            </Link>
            
            <Link 
              to="/book-store" 
              className={`nav-item ${isActiveRoute('/book-store') ? 'active' : ''}`}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
              <span>Book Store</span>
            </Link>
            
            <Link 
              to="/rewards" 
              className={`nav-item ${isActiveRoute('/rewards') ? 'active' : ''}`}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span>Rewards</span>
            </Link>
          </div>
        </div>

        <div className="nav-group">
          <h4 className="nav-title">Account</h4>
          <div className="nav-links">
            <Link 
              to="/settings" 
              className={`nav-item ${isActiveRoute('/settings') ? 'active' : ''}`}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
              </div>
              <span>Settings</span>
            </Link>
            
            <Link 
              to="/profile" 
              className={`nav-item ${isActiveRoute('/profile') ? 'active' : ''}`}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <div className="logout-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default LeftSidebar; 