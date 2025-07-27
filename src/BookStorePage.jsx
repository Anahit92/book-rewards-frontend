import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Footer from './Footer';
import './BookListPage.css';

// Mock data for book store - all books are free
const mockBookStore = [
  { 
    id: 1, 
    title: 'The Lean Startup', 
    author: 'Eric Ries', 
    coverImg: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800', 
    totalPages: 320, 
    rating: 4.5,
    category: 'Business',
    format: 'PDF'
  },
  { 
    id: 2, 
    title: 'Designing Data-Intensive Applications', 
    author: 'Martin Kleppmann', 
    coverImg: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800', 
    totalPages: 616, 
    rating: 4.8,
    category: 'Technology',
    format: 'PDF'
  },
  { 
    id: 3, 
    title: 'Atomic Habits', 
    author: 'James Clear', 
    coverImg: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=800', 
    totalPages: 306, 
    rating: 4.7,
    category: 'Self-Help',
    format: 'EPUB'
  },
  { 
    id: 4, 
    title: 'The Pragmatic Programmer', 
    author: 'David Thomas, Andrew Hunt', 
    coverImg: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800', 
    totalPages: 352, 
    rating: 4.6,
    category: 'Technology',
    format: 'PDF'
  },
  { 
    id: 5, 
    title: 'Clean Architecture', 
    author: 'Robert C. Martin', 
    coverImg: 'https://images.unsplash.com/photo-1543002588-b9b6b622e8af?q=80&w=800', 
    totalPages: 432, 
    rating: 4.4,
    category: 'Technology',
    format: 'PDF'
  },
  { 
    id: 6, 
    title: 'Deep Work', 
    author: 'Cal Newport', 
    coverImg: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800', 
    totalPages: 304, 
    rating: 4.3,
    category: 'Productivity',
    format: 'EPUB'
  },
  { 
    id: 7, 
    title: 'Thinking, Fast and Slow', 
    author: 'Daniel Kahneman', 
    coverImg: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800', 
    totalPages: 499, 
    rating: 4.5,
    category: 'Psychology',
    format: 'PDF'
  },
  { 
    id: 8, 
    title: 'The Psychology of Money', 
    author: 'Morgan Housel', 
    coverImg: 'https://images.unsplash.com/photo-1549122728-f519709442a4?q=80&w=800', 
    totalPages: 256, 
    rating: 4.6,
    category: 'Finance',
    format: 'EPUB'
  }
];

function BookStorePage() {
  const [books, setBooks] = useState(mockBookStore);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(4);

  // Filter and sort books
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'rating':
          return b.rating - a.rating;
        case 'pages-low':
          return a.totalPages - b.totalPages;
        case 'pages-high':
          return b.totalPages - a.totalPages;
        default:
          return 0;
      }
    });

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, sortBy]);

  const handleDownload = (book) => {
    alert(`Downloading "${book.title}" in ${book.format} format! This book is completely free.`);
  };

  return (
    <div className="blp-root">
      <Header />
      <div className="blp-content">
        <LeftSidebar />
        <main className="blp-main">
          <div className="library-header">
            <h1>Free Book Library</h1>
            <div className="store-stats">
              <span className="stat-item">
                <span className="stat-number">{books.length}</span>
                <span className="stat-label">Free Books Available</span>
              </span>
            </div>
          </div>

          <div className="controls">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-select">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Productivity">Productivity</option>
                <option value="Psychology">Psychology</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="sort-select">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="title-asc">Sort by Title (A-Z)</option>
                <option value="title-desc">Sort by Title (Z-A)</option>
                <option value="rating">Sort by Rating</option>
                <option value="pages-low">Pages: Low to High</option>
                <option value="pages-high">Pages: High to Low</option>
              </select>
            </div>
          </div>

          <div className="book-grid">
            {currentBooks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h2>No books found</h2>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              currentBooks.map(book => (
                <div key={book.id} className="book-card">
                  <div 
                    className="book-card-cover"
                    style={{ backgroundImage: `url(${book.coverImg})` }}
                  >
                    <div className="book-card-free-badge">
                      FREE
                    </div>
                    <div className="book-card-rating">
                      ⭐ {book.rating}
                    </div>
                  </div>
                  <div className="book-card-content">
                    <h3 className="book-card-title">{book.title}</h3>
                    <p className="book-card-author">by {book.author}</p>
                    <div className="book-card-details">
                      <span className="book-category">{book.category}</span>
                      <span className="book-pages">{book.totalPages} pages</span>
                      <span className="book-format">{book.format}</span>
                    </div>
                    <div className="book-card-actions">
                      <button 
                        className="download-btn"
                        onClick={() => handleDownload(book)}
                      >
                        <span className="download-icon">📥</span>
                        Download Free
                      </button>
                    </div>
                  </div>
                </div>
              ))
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
    </div>
  );
}

export default BookStorePage; 