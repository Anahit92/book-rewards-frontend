import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Footer from './Footer';
import { fetchUserData } from './authUtils';
import './BookListPage.css';

function SettingsPage() {
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
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32, color: '#1a202c' }}>Settings</h2>
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: '#1a202c' }}>Profile Information</h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>Username</label>
                      <input 
                        type="text" 
                        value={user.username} 
                        readOnly 
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px', 
                          fontSize: '16px', 
                          background: '#f9fafb', 
                          color: '#6b7280' 
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>Email</label>
                      <input 
                        type="email" 
                        value={user.email} 
                        readOnly 
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px', 
                          fontSize: '16px', 
                          background: '#f9fafb', 
                          color: '#6b7280' 
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>User ID</label>
                      <input 
                        type="text" 
                        value={user.id} 
                        readOnly 
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px', 
                          fontSize: '16px', 
                          background: '#f9fafb', 
                          color: '#6b7280' 
                        }} 
                      />
                    </div>
                  </div>
                </div>
                
                <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: '#1a202c' }}>Account Settings</h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <button 
                      style={{ 
                        background: '#90b4e8', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '12px 24px', 
                        borderRadius: '8px', 
                        fontSize: '16px', 
                        fontWeight: 500, 
                        cursor: 'pointer' 
                      }}
                    >
                      Change Password
                    </button>
                    <button 
                      style={{ 
                        background: '#f3f4f6', 
                        color: '#374151', 
                        border: '1px solid #e5e7eb', 
                        padding: '12px 24px', 
                        borderRadius: '8px', 
                        fontSize: '16px', 
                        fontWeight: 500, 
                        cursor: 'pointer' 
                      }}
                    >
                      Export Data
                    </button>
                    <button 
                      style={{ 
                        background: '#fee2e2', 
                        color: '#dc2626', 
                        border: '1px solid #fecaca', 
                        padding: '12px 24px', 
                        borderRadius: '8px', 
                        fontSize: '16px', 
                        fontWeight: 500, 
                        cursor: 'pointer' 
                      }}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32, color: '#1a202c' }}>Settings</h2>
              <p style={{ color: '#6b7280' }}>Please log in to view your settings.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SettingsPage; 