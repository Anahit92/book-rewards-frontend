import React from 'react';

const mockUser = {
  username: 'anahit',
  photo: 'https://ui-avatars.com/api/?name=Anahit&background=90b4e8&color=fff&size=64',
};

function Header() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', padding: '16px 32px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="9" width="24" height="18" rx="3" stroke="#90b4e8" strokeWidth="2" fill="#f4f7fa" />
          <path d="M12 15h12M12 18h12M12 21h6" stroke="#90b4e8" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: 22, color: '#1a202c', letterSpacing: 1 }}>Book Rewards</span>
      </div>
    </header>
  );
}

export default Header; 