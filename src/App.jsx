import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import BookListPage from './BookListPage';
import DashboardPage from './DashboardPage';
import MyRewardsPage from './MyRewardsPage';
import MyBooksPage from './MyBooksPage';
import BookStorePage from './BookStorePage';
import SettingsPage from './SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/rewards" element={<MyRewardsPage />} />
        <Route path="/my-books" element={<MyBooksPage />} />
        <Route path="/book-store" element={<BookStorePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
