import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const [tab, setTab] = useState('signin');
  // Add state for sign-in form fields
  const [signinUsername, setSigninUsername] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [signinError, setSigninError] = useState('');
  // Add state for password visibility
  const [signinPasswordVisible, setSigninPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Function to call /api/auth/me endpoint
  const callMeEndpoint = async (token) => {
    try {
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
        console.log('User data from /me endpoint:', userData);
        // Store user data in localStorage, including username
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', userData.username);
        console.log('Username retrieved:', userData.username);
      } else {
        console.error('Failed to fetch user data:', meResponse.status);
      }
    } catch (error) {
      console.error('Error calling /me endpoint:', error);
    }
  };

  // Handle sign in form submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    setSigninError('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // send cookies if needed
        body: JSON.stringify({
          username: signinUsername,
          password: signinPassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setSigninError(errorData.message || 'Sign in failed');
        return;
      }
      
      // Extract token from response
      const responseData = await response.json();
      const token = responseData.token || responseData.access_token;
      
      if (token) {
        // Call /api/auth/me endpoint with the token
        await callMeEndpoint(token);
      }
      
      // You can handle the response here (e.g., redirect, store token, etc.)
      navigate('/dashboard');
    } catch (err) {
      setSigninError('Network error');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f4f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '48px 40px', width: 400, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 8 }}>
            <rect x="8" y="12" width="32" height="24" rx="4" stroke="#90b4e8" strokeWidth="2" fill="#f4f7fa" />
            <path d="M16 20h16M16 24h16M16 28h8" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Book Rewards</h1>
          <div style={{ color: '#6b7280', fontSize: 16, marginTop: 4, textAlign: 'center' }}>Your personal reading sanctuary.</div>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
          <button onClick={() => setTab('signin')} style={{ flex: 1, background: 'none', border: 'none', borderBottom: tab === 'signin' ? '2px solid #90b4e8' : 'none', color: tab === 'signin' ? '#1a202c' : '#6b7280', fontWeight: 600, fontSize: 18, padding: '8px 0', cursor: 'pointer' }}>Sign In</button>
          <button onClick={() => setTab('signup')} style={{ flex: 1, background: 'none', border: 'none', borderBottom: tab === 'signup' ? '2px solid #90b4e8' : 'none', color: tab === 'signup' ? '#1a202c' : '#6b7280', fontWeight: 600, fontSize: 18, padding: '8px 0', cursor: 'pointer' }}>Sign Up</button>
        </div>
        {tab === 'signin' ? (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ color: '#374151', fontWeight: 500, marginBottom: 4 }}>Username
              <input type="text" value={signinUsername} onChange={e => setSigninUsername(e.target.value)} placeholder="yourusername" style={{ width: '100%', marginTop: 4, padding: '12px', paddingRight: 40, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 16, background: '#f9fafb', color: '#374151', boxSizing: 'border-box' }} />
            </label>
            <label style={{ color: '#374151', fontWeight: 500, marginBottom: 4 }}>Password
              <div style={{ position: 'relative' }}>
                <input
                  type={signinPasswordVisible ? 'text' : 'password'}
                  value={signinPassword}
                  onChange={e => setSigninPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', marginTop: 4, padding: '12px', paddingRight: 40, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 16, background: '#f9fafb', color: '#374151', boxSizing: 'border-box' }}
                />
                <span
                  onClick={() => setSigninPasswordVisible(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#90b4e8', fontSize: 20, background: 'none', border: 'none', padding: 0, lineHeight: 1 }}
                  tabIndex={0}
                  aria-label={signinPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {signinPasswordVisible ? (
                    // Eye-off SVG
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.05 10.05 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a12.35 12.35 0 0 1 3.06-4.36M6.53 6.53A9.98 9.98 0 0 1 12 5c5 0 9.27 3.11 11 7.5a12.35 12.35 0 0 1-2.19 3.19M1 1l22 22" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    // Eye SVG
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </span>
              </div>
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <a href="#" style={{ color: '#90b4e8', fontSize: 14, textDecoration: 'none' }}>Forgot password?</a>
            </div>
            {signinError && <div style={{ color: '#e53e3e', fontSize: 14, marginBottom: 4 }}>{signinError}</div>}
            <button type="submit" disabled={!signinUsername || !signinPassword} style={{ background: (!signinUsername || !signinPassword) ? '#e5e7eb' : '#b5cef9', color: '#fff', fontWeight: 600, fontSize: 18, border: 'none', borderRadius: 8, padding: '12px 0', marginTop: 8, cursor: (!signinUsername || !signinPassword) ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>Sign In</button>
          </form>
        ) : (
          <SignUpForm />
        )}
      </div>
    </div>
  );
}

function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Add state for password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  // Determine if the sign up button should be enabled
  const isSignUpEnabled = username && email && password && confirmPassword && password === confirmPassword;

  // Function to call /api/auth/me endpoint
  const callMeEndpoint = async (token) => {
    try {
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
        console.log('User data from /me endpoint:', userData);
        // Store user data in localStorage, including username
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', userData.username);
        console.log('Username retrieved:', userData.username);
      } else {
        console.error('Failed to fetch user data:', meResponse.status);
      }
    } catch (error) {
      console.error('Error calling /me endpoint:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Sign up failed');
        return;
      }
      
      // Extract token from response
      const responseData = await response.json();
      const token = responseData.token || responseData.access_token;
      
      if (token) {
        // Call /api/auth/me endpoint with the token
        await callMeEndpoint(token);
      }
      
      setSuccess('Sign up successful!');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/dashboard');
    } catch (err) {
      setError('Network error');
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <label style={{ color: '#374151', fontWeight: 500, marginBottom: 4 }}>Username
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="yourusername" style={{ width: '100%', marginTop: 4, padding: '12px', paddingRight: 40, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 16, background: '#f9fafb', color: '#374151', boxSizing: 'border-box' }} />
      </label>
     <label style={{ color: '#374151', fontWeight: 500, marginBottom: 4 }}>Email
       <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', marginTop: 4, padding: '12px', paddingRight: 40, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 16, background: '#f9fafb', color: '#374151', boxSizing: 'border-box' }} />
     </label>
      <label style={{ color: '#374151', fontWeight: 500, marginBottom: 4 }}>Password
        <div style={{ position: 'relative' }}>
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', marginTop: 4, padding: '12px', paddingRight: 40, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 16, background: '#f9fafb', color: '#374151', boxSizing: 'border-box' }}
          />
          <span
            onClick={() => setPasswordVisible(v => !v)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#90b4e8', fontSize: 20, background: 'none', border: 'none', padding: 0, lineHeight: 1 }}
            tabIndex={0}
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          >
            {passwordVisible ? (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.05 10.05 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a12.35 12.35 0 0 1 3.06-4.36M6.53 6.53A9.98 9.98 0 0 1 12 5c5 0 9.27 3.11 11 7.5a12.35 12.35 0 0 1-2.19 3.19M1 1l22 22" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
        </div>
      </label>
      <label style={{ color: '#374151', fontWeight: 500, marginBottom: 4 }}>Confirm Password
        <div style={{ position: 'relative' }}>
          <input
            type={confirmPasswordVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', marginTop: 4, padding: '12px', paddingRight: 40, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 16, background: '#f9fafb', color: '#374151', boxSizing: 'border-box' }}
          />
          <span
            onClick={() => setConfirmPasswordVisible(v => !v)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#90b4e8', fontSize: 20, background: 'none', border: 'none', padding: 0, lineHeight: 1 }}
            tabIndex={0}
            aria-label={confirmPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {confirmPasswordVisible ? (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.05 10.05 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a12.35 12.35 0 0 1 3.06-4.36M6.53 6.53A9.98 9.98 0 0 1 12 5c5 0 9.27 3.11 11 7.5a12.35 12.35 0 0 1-2.19 3.19M1 1l22 22" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
        </div>
      </label>
     {success && <div style={{ color: '#38a169', fontSize: 14, marginBottom: 4 }}>{success}</div>}
      {error && <div style={{ color: '#e53e3e', fontSize: 14, marginBottom: 4 }}>{error}</div>}
      <button type="submit" disabled={!isSignUpEnabled} style={{ background: isSignUpEnabled ? '#90b4e8' : '#e5e7eb', color: '#fff', fontWeight: 600, fontSize: 18, border: 'none', borderRadius: 8, padding: '12px 0', marginTop: 8, cursor: isSignUpEnabled ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>Sign Up</button>
    </form>
  );
}

export default AuthPage; 