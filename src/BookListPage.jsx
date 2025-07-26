import React from 'react';
import './BookListPage.css';

const mockBooks = [
  { id: 1, title: 'The Great Gatsby', points: 50 },
  { id: 2, title: 'To Kill a Mockingbird', points: 40 },
  { id: 3, title: '1984', points: 35 },
  { id: 4, title: 'Pride and Prejudice', points: 30 },
  { id: 5, title: 'Moby Dick', points: 25 },
];

function BookListPage() {
  return (
    <>
      <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32, color: '#1a202c', textAlign: 'center' }}>Book List</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {mockBooks.map(book => (
          <li key={book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: 24, color: '#374151', fontWeight: 500 }}>{book.title}</span>
            <span style={{ background: '#90b4e8', color: '#fff', borderRadius: 10, padding: '10px 28px', fontWeight: 700, fontSize: 20 }}>{book.points} pts</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default BookListPage; 