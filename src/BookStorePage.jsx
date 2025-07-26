import React from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Footer from './Footer';
import BookListPage from './BookListPage';
import './BookListPage.css';

function BookStorePage() {
  return (
    <div className="blp-root">
      <Header />
      <div className="blp-content">
        <LeftSidebar />
        <main className="blp-main">
          <BookListPage />
        </main>
        <RightSidebar />
      </div>
      <Footer />
    </div>
  );
}

export default BookStorePage; 