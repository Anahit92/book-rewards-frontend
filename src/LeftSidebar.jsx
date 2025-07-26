import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchUserData, logout } from './authUtils';

function LeftSidebar() {
  const navigate = useNavigate();
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

  // Show loading state
  if (loading) {
    return (
      <aside className="blp-sidebar blp-sidebar--left" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
      </aside>
    );
  }

  // Show default state if no user data
  if (!user) {
    return (
      <aside className="blp-sidebar blp-sidebar--left" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '20px', textAlign: 'center' }}>Please log in</div>
      </aside>
    );
  }

  return (
    <aside className="blp-sidebar blp-sidebar--left" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <img 
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=90b4e8&color=fff&size=64`} 
        alt="User" 
        className="blp-user-img" 
      />
      <div className="blp-username">{user.username}</div>
      <nav style={{ flex: 1 }}>
        <ul className="blp-nav">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/rewards">My Rewards</Link></li>
          <li><Link to="/my-books">My Books</Link></li>
          <li><Link to="/book-store">Book Store</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
        <div style={{ flexGrow: 1, minHeight: 120 }} />
      </nav>
      <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: 16 }}>
        <button onClick={handleLogout} className="blp-logout" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>Logout</button>
      </div>
    </aside>
  );
}

export default LeftSidebar; 