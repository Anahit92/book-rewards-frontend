// Authentication utility functions

// Function to call /api/auth/me endpoint
export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const meResponse = await fetch('http://localhost:8080/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (meResponse.ok) {
      const userData = await meResponse.json();
      // Update localStorage with fresh data
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('username', userData.username);
      return { success: true, data: userData };
    } else {
      console.error('Failed to fetch user data:', meResponse.status);
      // If token is invalid, clear storage
      if (meResponse.status === 401) {
        clearAuthData();
      }
      return { success: false, error: `HTTP ${meResponse.status}` };
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { success: false, error: error.message };
  }
};

// Function to clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('username');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Function to get current user data from localStorage
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Function to get username from localStorage
export const getUsername = () => {
  return localStorage.getItem('username');
};

// Function to logout user
export const logout = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    // Clear local storage regardless of response
    clearAuthData();
    return { success: true };
  } catch (err) {
    console.error('Logout error:', err);
    clearAuthData();
    return { success: false, error: err.message };
  }
}; 