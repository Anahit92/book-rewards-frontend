import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Footer from './Footer';
import { fetchUserData } from './authUtils';
import './BookListPage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadUserData = async () => {
      const result = await fetchUserData();
      if (result.success) {
        setUser(result.data);
        setFormData({
          username: result.data.username || '',
          email: result.data.email || '',
          firstName: result.data.firstName || '',
          lastName: result.data.lastName || '',
          bio: result.data.bio || '',
          avatar: null
        });
        if (result.data.avatar) {
          setAvatarPreview(result.data.avatar);
        }
      }
      setLoading(false);
    };
    
    loadUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('bio', formData.bio);
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Update localStorage
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        localStorage.setItem('username', updatedUser.username);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      avatar: null
    });
    setAvatarPreview(user?.avatar || null);
    setMessage({ type: '', text: '' });
  };

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) return user.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=90b4e8&color=fff&size=200&font-size=0.4`;
  };

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: 36, fontWeight: 700, color: '#1a202c' }}>Profile</h2>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
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
                    Edit Profile
                  </button>
                )}
              </div>

              {message.text && (
                <div style={{ 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  marginBottom: '24px',
                  background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: message.type === 'success' ? '#065f46' : '#dc2626',
                  border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
                }}>
                  {message.text}
                </div>
              )}

              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Profile Header */}
                <div style={{ 
                  background: '#fff', 
                  padding: '32px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '24px' }}>
                    <img 
                      src={getAvatarUrl()} 
                      alt={user.username}
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        border: '4px solid #f3f4f6'
                      }} 
                    />
                    {isEditing && (
                      <div style={{ marginTop: '16px' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAvatarChange}
                          style={{ display: 'none' }}
                          id="avatar-input"
                        />
                        <label 
                          htmlFor="avatar-input"
                          style={{ 
                            background: '#f3f4f6', 
                            color: '#374151', 
                            border: '1px solid #e5e7eb', 
                            padding: '8px 16px', 
                            borderRadius: '6px', 
                            fontSize: '14px', 
                            fontWeight: 500, 
                            cursor: 'pointer',
                            display: 'inline-block'
                          }}
                        >
                          Change Avatar
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <h3 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px', color: '#1a202c' }}>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName} 
                        onChange={handleInputChange}
                        placeholder="First Name"
                        style={{ 
                          width: '100%', 
                          padding: '8px 12px', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '6px', 
                          fontSize: '16px',
                          textAlign: 'center'
                        }} 
                      />
                    ) : (
                      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username
                    )}
                  </h3>
                  
                  {isEditing && (
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName} 
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      style={{ 
                        width: '100%', 
                        padding: '8px 12px', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '6px', 
                        fontSize: '16px',
                        textAlign: 'center',
                        marginTop: '8px'
                      }} 
                    />
                  )}
                  
                  <p style={{ color: '#6b7280', fontSize: '16px' }}>@{user.username}</p>
                </div>

                {/* Profile Information */}
                <div style={{ 
                  background: '#fff', 
                  padding: '32px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                  marginBottom: '24px' 
                }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: '#1a202c' }}>
                    Profile Information
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
                        Username
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="username"
                          value={formData.username} 
                          onChange={handleInputChange}
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '16px' 
                          }} 
                        />
                      ) : (
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
                      )}
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
                        Email
                      </label>
                      {isEditing ? (
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email} 
                          onChange={handleInputChange}
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '16px' 
                          }} 
                        />
                      ) : (
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
                      )}
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea 
                          name="bio"
                          value={formData.bio} 
                          onChange={handleInputChange}
                          rows="4"
                          placeholder="Tell us about yourself..."
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px', 
                            fontSize: '16px',
                            resize: 'vertical'
                          }} 
                        />
                      ) : (
                        <div style={{ 
                          padding: '12px', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px', 
                          fontSize: '16px', 
                          background: '#f9fafb', 
                          color: user.bio ? '#374151' : '#6b7280',
                          minHeight: '60px'
                        }}>
                          {user.bio || 'No bio added yet.'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reading Statistics */}
                <div style={{ 
                  background: '#fff', 
                  padding: '32px', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                  marginBottom: '24px' 
                }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: '#1a202c' }}>
                    Reading Statistics
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#90b4e8', marginBottom: '8px' }}>
                        {user.booksRead || 0}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>Books Read</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#90b4e8', marginBottom: '8px' }}>
                        {user.pointsEarned || 0}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>Points Earned</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#90b4e8', marginBottom: '8px' }}>
                        {user.currentStreak || 0}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>Day Streak</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div style={{ 
                    background: '#fff', 
                    padding: '24px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                  }}>
                    <button 
                      onClick={handleCancel}
                      disabled={saving}
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
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      style={{ 
                        background: '#90b4e8', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '12px 24px', 
                        borderRadius: '8px', 
                        fontSize: '16px', 
                        fontWeight: 500, 
                        cursor: 'pointer',
                        opacity: saving ? 0.6 : 1
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32, color: '#1a202c' }}>Profile</h2>
              <p style={{ color: '#6b7280' }}>Please log in to view your profile.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage; 