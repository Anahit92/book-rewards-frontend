import React, { useState } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Footer from './Footer';
import './BookListPage.css';

function MyRewardsPage() {
  const [earnedPoints] = useState(1250);

  return (
    <div className="blp-root">
      <Header />
      <div className="blp-content">
        <LeftSidebar />
        <main className="blp-main">
          <div className="simple-rewards-container">
            <div className="rewards-header">
              <h1>My Rewards</h1>
              <p>Track your reading progress and earned points</p>
            </div>
            
            <div className="points-display">
              <div className="points-card">
                <div className="points-icon">⭐</div>
                <div className="points-content">
                  <h2>{earnedPoints}</h2>
                  <p>Total Points Earned</p>
                </div>
              </div>
            </div>

            <div className="points-info">
              <h3>How to earn more points:</h3>
              <ul className="earning-list">
                <li>📖 Complete a book: <strong>50 points</strong></li>
                <li>✍️ Write a book review: <strong>15 points</strong></li>
                <li>🔥 Daily reading streak: <strong>10 points</strong></li>
                <li>📚 Read different genres: <strong>25 points</strong></li>
                <li>🏆 Monthly challenges: <strong>100 points</strong></li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MyRewardsPage; 