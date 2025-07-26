import React from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Footer from './Footer';
import './BookListPage.css';

function MyRewardsPage() {
  return (
    <div className="blp-root">
      <Header />
      <div className="blp-content">
        <LeftSidebar />
        <main className="blp-main">
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32, color: '#1a202c', textAlign: 'center' }}>My Rewards</h2>
        </main>
        <RightSidebar />
      </div>
      <Footer />
    </div>
  );
}

export default MyRewardsPage; 