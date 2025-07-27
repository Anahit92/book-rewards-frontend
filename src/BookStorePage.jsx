import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Footer from './Footer';
import './BookListPage.css';

// Mock data for book store
const mockBookStore = [
  { 
    id: 1, 
    title: 'The Lean Startup', 
    author: 'Eric Ries', 
    coverImg: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800', 
    totalPages: 320, 
    price: 29.99,
    rating: 4.5,
    category: 'Business'
  },
  { 
    id: 2, 
    title: 'Designing Data-Intensive Applications', 
    author: 'Martin Kleppmann', 
    coverImg: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800', 
    totalPages: 616, 
    price: 39.99,
    rating: 4.8,
    category: 'Technology'
  },
  { 
    id: 3, 
    title: 'Atomic Habits', 
    author: 'James Clear', 
    coverImg: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=800', 
    totalPages: 306, 
    price: 24.99,
    rating: 4.7,
    category: 'Self-Help'
  },
  { 
    id: 4, 
    title: 'The Pragmatic Programmer', 
    author: 'David Thomas, Andrew Hunt', 
    coverImg: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800', 
    totalPages: 352, 
    price: 34.99,
    rating: 4.6,
    category: 'Technology'
  },
  { 
    id: 5, 
    title: 'Clean Architecture', 
    author: 'Robert C. Martin', 
    coverImg: 'https://images.unsplash.com/photo-1543002588-b9b6b622e8af?q=80&w=800', 
    totalPages: 432, 
    price: 44.99,
    rating: 4.4,
    category: 'Technology'
  },
  { 
    id: 6, 
    title: 'Deep Work', 
    author: 'Cal Newport', 
    coverImg: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800', 
    totalPages: 304, 
    price: 26.99,
    rating: 4.3,
    category: 'Productivity'
  },
  { 
    id: 7, 
    title: 'Thinking, Fast and Slow', 
    author: 'Daniel Kahneman', 
    coverImg: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800', 
    totalPages: 499, 
    price: 31.99,
    rating: 4.5,
    category: 'Psychology'
  },
  { 
    id: 8, 
    title: 'The Psychology of Money', 
    author: 'Morgan Housel', 
    coverImg: 'https://images.unsplash.com/photo-1549122728-f519709442a4?q=80&w=800', 
    totalPages: 256, 
    price: 22.99,
    rating: 4.6,
    category: 'Finance'
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
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
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

  const handlePurchase = (book) => {
    alert(`Added "${book.title}" to cart! Price: $${book.price}`);
  };

  return (
    <div className="blp-root">
      <Header />
      <div className="blp-content">
        <LeftSidebar />
        <main className="blp-main">
          <div className="library-header">
            <h1>Book Store</h1>
            <div className="store-stats">
              <span className="stat-item">
                <span className="stat-number">{books.length}</span>
                <span className="stat-label">Books Available</span>
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
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Sort by Rating</option>
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
                    <div className="book-card-price">
                      ${book.price}
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
                    </div>
                    <div className="book-card-actions">
                      <button 
                        className="purchase-btn"
                        onClick={() => handlePurchase(book)}
                      >
                        <span className="purchase-icon">🛒</span>
                        Add to Cart
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