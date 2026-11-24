
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import './App.css';

const API_URL =
  'https://bookstore-83b84-default-rtdb.firebaseio.com/books.json';

function Bookstore() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [isbn, setIsbn] = useState('');
  const [price, setPrice] = useState('');

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Could not load books');

      const data = await response.json();

      const bookList = data
        ? Object.entries(data).map(([id, book]) => ({
            id,
            ...book
          }))
        : [];

      setBooks(bookList);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async () => {
    if (
      !title.trim() ||
      !author.trim() ||
      !year ||
      !isbn.trim() ||
      !price
    ) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          year,
          isbn: isbn.trim(),
          price
        })
      });

      if (!response.ok) throw new Error('Could not add book');

      setTitle('');
      setAuthor('');
      setYear('');
      setIsbn('');
      setPrice('');

      await fetchBooks();
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteBook = async (id) => {
    try {
      const response = await fetch(
        `https://bookstore-83b84-default-rtdb.firebaseio.com/books/${id}.json`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Could not delete book');

      await fetchBooks();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredBooks = books
    .filter(book =>
      [
        book.title,
        book.author,
        book.year,
        book.isbn,
        book.price
      ].some(value =>
        String(value ?? '')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      const first = String(a[sortField] ?? '').toLowerCase();
      const second = String(b[sortField] ?? '').toLowerCase();

      const comparison = first.localeCompare(second, undefined, {
        numeric: true
      });

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1.5, minWidth: 150 },
    { field: 'author', headerName: 'Author', flex: 1.2, minWidth: 130 },
    { field: 'year', headerName: 'Year', flex: 0.6, minWidth: 80 },
    { field: 'isbn', headerName: 'ISBN', flex: 1.2, minWidth: 140 },
    { field: 'price', headerName: 'Price', flex: 0.6, minWidth: 90 },
    {
      field: 'actions',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Button
          color="error"
          variant="text"
          onClick={() => deleteBook(params.row.id)}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <div className="App bookstore-page">

      <header className="bookstore-header">
        <div className="bookstore-brand">
          <span className="bookstore-icon">📚</span>
          <span>BOOKSTORE</span>
        </div>

        <p>Your personal library, all in one place.</p>
      </header>

      <section className="book-section">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <h1>Bookstore</h1>
            <p>Manage your book collection</p>
          </div>
        </div>

        <div className="book-form-card">
          <h2>Add a new book</h2>
          <p className="section-description">
            Enter the details below to add a book to your collection.
          </p>

          <div className="book-form">
            <TextField
              label="Title"
              placeholder="Book title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              fullWidth
            />

            <TextField
              label="Author"
              placeholder="Author name"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              fullWidth
            />

            <TextField
              label="Year"
              placeholder="Publication year"
              value={year}
              onChange={e => setYear(e.target.value)}
              fullWidth
            />

            <TextField
              label="ISBN"
              placeholder="ISBN number"
              value={isbn}
              onChange={e => setIsbn(e.target.value)}
              fullWidth
            />

            <TextField
              label="Price"
              placeholder="Book price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={addBook}
              className="add-book-button"
            >
              + Add Book
            </Button>
          </div>
        </div>

        <div className="books-heading">
          <div>
            <span className="section-number">02</span>
            <h2>Your Books</h2>
          </div>
          <span className="book-count">
            {filteredBooks.length} books
          </span>
        </div>

        <div className="book-controls">
          <TextField
            label="Search your collection"
            placeholder="Search by title, author, ISBN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Sort by"
            value={sortField}
            onChange={e => setSortField(e.target.value)}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="price">Price</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            onClick={() =>
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
            }
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </Button>
        </div>

        <div className="book-grid">
          <DataGrid
            rows={filteredBooks}
            columns={columns}
            getRowId={row => row.id}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 }
              }
            }}
            disableRowSelectionOnClick
            autoHeight={false}
          />
        </div>
      </section>

      <footer className="bookstore-footer">
        Your Bookstore · Powered by Firebase
      </footer>

    </div>
  );
}

export default Bookstore;
