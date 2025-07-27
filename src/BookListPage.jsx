import React, { useState, useEffect } from 'react';
import './BookListPage.css';

// Mock data for books with reading progress
const mockBooks = [
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
    id: 3, 
    title: 'Atomic Habits', 
    author: 'James Clear', 
    coverImg: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=800', 
    totalPages: 306, 
    currentPage: 1, 
    status: 'not-started', 
    lastRead: null,
    points: 35 
  },
  { 
    id: 4, 
    title: 'The Pragmatic Programmer', 
    author: 'David Thomas, Andrew Hunt', 
    coverImg: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800', 
    totalPages: 352, 
    currentPage: 1, 
    status: 'not-started', 
    lastRead: null,
    points: 30 
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
];

function BookListPage() {
  const [books, setBooks] = useState(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentReaderBook, setCurrentReaderBook] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState({ message: '', type: '' });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(4);

  // Filter and sort books
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
      return matchesSearch && matchesStatus;
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

  const handleFileSelect = (file) => {
    if (file.type !== 'application/pdf') {
      setUploadFeedback({ message: 'Invalid file format. Please upload a PDF.', type: 'error' });
      setSelectedFile(null);
      return;
    }
    if (file.size > 100 * 1024 * 1024) { // 100MB
      setUploadFeedback({ message: 'File size exceeds 100MB limit.', type: 'error' });
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setUploadFeedback({ message: '', type: '' });
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newBook = {
              id: Date.now(),
              title: selectedFile.name.replace('.pdf', ''),
              author: 'Unknown Author',
              coverImg: 'https://images.unsplash.com/photo-1549122728-f519709442a4?q=80&w=800',
              totalPages: Math.floor(Math.random() * 400) + 100,
              currentPage: 1,
              status: 'not-started',
              lastRead: null,
              points: Math.floor(Math.random() * 30) + 20
            };
            setBooks(prev => [newBook, ...prev]);
            setShowUploadModal(false);
            setSelectedFile(null);
            setUploadProgress(0);
            setIsUploading(false);
            setUploadFeedback({ message: `'${newBook.title}' uploaded successfully!`, type: 'success' });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const openReader = (book) => {
    setCurrentReaderBook(book);
    setShowReaderModal(true);
  };

  const updateReaderPage = (newPage) => {
    if (!currentReaderBook) return;
    
    const updatedBook = { ...currentReaderBook, currentPage: newPage, lastRead: new Date() };
    
    // Automatic status updates
    if (updatedBook.status === 'not-started' && newPage > 1) {
      updatedBook.status = 'in-progress';
    }
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
      case 'not-started': return '#64748b';
      case 'in-progress': return '#f59e0b';
      case 'completed': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div className="blp-root">
      <div className="blp-content">
        <main className="blp-main">
          <div className="library-header">
            <h1>My Library</h1>
            <button 
              className="upload-btn"
              onClick={() => setShowUploadModal(true)}
            >
              <span className="upload-icon">📤</span>
              Upload Book
            </button>
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
                <option value="all">All Statuses</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="sort-select">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="title-asc">Sort by Title (A-Z)</option>
                <option value="title-desc">Sort by Title (Z-A)</option>
                <option value="recent">Sort by Recently Read</option>
              </select>
            </div>
          </div>

          <div className="book-grid">
            {currentBooks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h2>Your library is empty</h2>
                <p>Upload your first PDF book to start reading and earning rewards.</p>
                <button 
                  className="upload-btn"
                  onClick={() => setShowUploadModal(true)}
                >
                  <span className="upload-icon">📤</span>
                  Upload Book
                </button>
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
                          {book.status === 'completed' ? 'Read Again' : 'Read Now'}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload a New Book</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="drop-zone">
                <div className="drop-icon">📚</div>
                <p>Drag & drop your PDF here, or <span>browse files</span></p>
                <small>Max file size: 100MB</small>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input" className="file-input-label">
                  Choose File
                </label>
              </div>
              {selectedFile && (
                <div className="file-info">
                  <p>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                </div>
              )}
              {uploadFeedback.message && (
                <div className={`upload-feedback ${uploadFeedback.type}`}>
                  {uploadFeedback.message}
                </div>
              )}
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default BookListPage; 