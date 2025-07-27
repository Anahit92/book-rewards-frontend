import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Footer from './Footer';
import './BookListPage.css';

// Mock data for user's books with reading progress
const mockMyBooks = [
  { 
    id: 1, 
    title: 'The Lean Startup', 
    author: 'Eric Ries', 
    coverImg: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800', 
    totalPages: 320, 
    currentPage: 80, 
    status: 'in-progress', 
    lastRead: new Date('2025-07-26T10:00:00Z'),
    points: 50 
  },
  { 
    id: 2, 
    title: 'Designing Data-Intensive Applications', 
    author: 'Martin Kleppmann', 
    coverImg: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800', 
    totalPages: 616, 
    currentPage: 616, 
    status: 'completed', 
    lastRead: new Date('2025-07-20T15:30:00Z'),
    points: 40 
  },
  { 
    id: 5, 
    title: 'Clean Architecture', 
    author: 'Robert C. Martin', 
    coverImg: 'https://images.unsplash.com/photo-1543002588-b9b6b622e8af?q=80&w=800', 
    totalPages: 432, 
    currentPage: 250, 
    status: 'in-progress', 
    lastRead: new Date('2025-07-25T18:00:00Z'),
    points: 25 
  },
  { 
    id: 6, 
    title: 'Refactoring', 
    author: 'Martin Fowler', 
    coverImg: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800', 
    totalPages: 448, 
    currentPage: 448, 
    status: 'completed', 
    lastRead: new Date('2025-07-15T14:20:00Z'),
    points: 45 
  },
  { 
    id: 7, 
    title: 'Domain-Driven Design', 
    author: 'Eric Evans', 
    coverImg: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800', 
    totalPages: 560, 
    currentPage: 180, 
    status: 'in-progress', 
    lastRead: new Date('2025-07-24T09:15:00Z'),
    points: 30 
  },
];

function MyBooksPage() {
  const [books, setBooks] = useState(mockMyBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [currentReaderBook, setCurrentReaderBook] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(4);

  // Filter and sort books - only show in-progress and completed
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
      // Only show in-progress and completed books
      const isActiveBook = book.status === 'in-progress' || book.status === 'completed';
      return matchesSearch && matchesStatus && isActiveBook;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'recent':
          const dateA = a.lastRead || new Date(0);
          const dateB = b.lastRead || new Date(0);
          return dateB - dateA;
        case 'progress':
          const progressA = (a.currentPage / a.totalPages) * 100;
          const progressB = (b.currentPage / b.totalPages) * 100;
          return progressB - progressA;
        default:
          return 0;
      }
    });

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy]);

  const openReader = (book) => {
    setCurrentReaderBook(book);
    setShowReaderModal(true);
  };

  const updateReaderPage = (newPage) => {
    if (!currentReaderBook) return;
    
    const updatedBook = { ...currentReaderBook, currentPage: newPage, lastRead: new Date() };
    
    // Automatic status updates
    if (updatedBook.status === 'in-progress' && newPage === updatedBook.totalPages) {
      updatedBook.status = 'completed';
    }
    
    setCurrentReaderBook(updatedBook);
    setBooks(prev => prev.map(book => book.id === updatedBook.id ? updatedBook : book));
  };

  const getStatusText = (status) => {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return '#f59e0b';
      case 'completed': return '#10b981';
      default: return '#64748b';
    }
  };

  const getProgressStats = () => {
    const inProgress = books.filter(book => book.status === 'in-progress').length;
    const completed = books.filter(book => book.status === 'completed').length;
    const totalPages = books.reduce((sum, book) => sum + book.totalPages, 0);
    const readPages = books.reduce((sum, book) => sum + book.currentPage, 0);
    const overallProgress = totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0;
    
    return { inProgress, completed, overallProgress, readPages, totalPages };
  };

  const stats = getProgressStats();

  return (
    <div className="blp-root">
      <Header />
      <div className="blp-content">
        <LeftSidebar />
        <main className="blp-main">
          <div className="library-header">
            <h1>My Books</h1>
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-number">{stats.inProgress}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.completed}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.overallProgress}%</span>
                <span className="stat-label">Overall Progress</span>
              </div>
            </div>
          </div>

          <div className="controls">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search my books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-select">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Active Books</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="sort-select">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="title-asc">Sort by Title (A-Z)</option>
                <option value="title-desc">Sort by Title (Z-A)</option>
                <option value="recent">Sort by Recently Read</option>
                <option value="progress">Sort by Progress</option>
              </select>
            </div>
          </div>

          <div className="book-grid">
            {currentBooks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h2>No active books found</h2>
                <p>You don't have any books in progress or completed yet. Start reading to see them here!</p>
              </div>
            ) : (
              currentBooks.map(book => {
                const progress = Math.round((book.currentPage / book.totalPages) * 100);
                return (
                  <div key={book.id} className="book-card">
                    <div 
                      className="book-card-cover"
                      style={{ backgroundImage: `url(${book.coverImg})` }}
                    >
                      <div 
                        className="book-card-status"
                        style={{ backgroundColor: getStatusColor(book.status) }}
                      >
                        {getStatusText(book.status)}
                      </div>
                    </div>
                    <div className="book-card-content">
                      <h3 className="book-card-title">{book.title}</h3>
                      <p className="book-card-author">by {book.author}</p>
                      <div className="progress-container">
                        <div className="progress-labels">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="progress-labels small">
                          Page {book.currentPage} of {book.totalPages}
                        </div>
                      </div>
                      <div className="book-card-actions">
                        <button 
                          className="read-now-btn"
                          onClick={() => openReader(book)}
                        >
                          <span className="read-icon">📖</span>
                          {book.status === 'completed' ? 'Read Again' : 'Continue Reading'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} of {filteredBooks.length} books
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="pagination-btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />

      {/* Reader Modal */}
      {showReaderModal && currentReaderBook && (
        <div className="modal-overlay" onClick={() => setShowReaderModal(false)}>
          <div className="reader-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentReaderBook.title}</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowReaderModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="reader-view">
              <div className="reader-page-content">
                <h3>Page {currentReaderBook.currentPage}</h3>
                <p>This is a placeholder for the PDF page content. In a real application, PDF.js would render the page here.</p>
                <p>You're reading "{currentReaderBook.title}" by {currentReaderBook.author}.</p>
                <p>Current progress: {Math.round((currentReaderBook.currentPage / currentReaderBook.totalPages) * 100)}%</p>
              </div>
            </div>
            <div className="reader-nav">
              <button 
                className="btn-secondary"
                onClick={() => updateReaderPage(currentReaderBook.currentPage - 1)}
                disabled={currentReaderBook.currentPage <= 1}
              >
                ← Prev
              </button>
              <div className="page-input-container">
                <input
                  type="number"
                  min="1"
                  max={currentReaderBook.totalPages}
                  value={currentReaderBook.currentPage}
                  onChange={(e) => {
                    const newPage = parseInt(e.target.value, 10);
                    if (newPage >= 1 && newPage <= currentReaderBook.totalPages) {
                      updateReaderPage(newPage);
                    }
                  }}
                />
                <span>/ {currentReaderBook.totalPages}</span>
              </div>
              <button 
                className="btn-secondary"
                onClick={() => updateReaderPage(currentReaderBook.currentPage + 1)}
                disabled={currentReaderBook.currentPage >= currentReaderBook.totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooksPage; 