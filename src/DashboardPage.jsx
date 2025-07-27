import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Footer from './Footer';
import { fetchUserData } from './authUtils';
import './BookListPage.css';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const result = await fetchUserData();
      if (result.success) {
        setUser(result.data);
      }
      setLoading(false);
    };
    
    loadUserData();
  }, []);

  return (
    <div className="blp-root">
      <Header />
      <div className="blp-content">
        <LeftSidebar />
        <main className="blp-main">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32, color: '#1a202c' }}>Loading...</h2>
            </div>
          ) : user ? (
            <div>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16, color: '#1a202c' }}>
                Welcome back, {user.username}! 👋
              </h2>
              <p style={{ fontSize: 18, color: '#6b7280', marginBottom: 32 }}>
                Ready to continue your reading journey?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#1a202c' }}>Your Profile</h3>
                  <p style={{ color: '#6b7280', marginBottom: '8px' }}><strong>Username:</strong> {user.username}</p>
                  <p style={{ color: '#6b7280', marginBottom: '8px' }}><strong>Email:</strong> {user.email}</p>
                  <p style={{ color: '#6b7280' }}><strong>User ID:</strong> {user.id}</p>
                </div>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#1a202c' }}>Quick Actions</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      <a href="/rewards" style={{ color: '#90b4e8', textDecoration: 'none' }}>→ View My Rewards</a>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <a href="/my-books" style={{ color: '#90b4e8', textDecoration: 'none' }}>→ My Books</a>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <a href="/book-store" style={{ color: '#90b4e8', textDecoration: 'none' }}>→ Browse Book Store</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32, color: '#1a202c' }}>Dashboard</h2>
              <p style={{ color: '#6b7280' }}>Please log in to view your dashboard.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardPage; 