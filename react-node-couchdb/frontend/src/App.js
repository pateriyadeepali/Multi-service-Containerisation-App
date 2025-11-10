import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch books from backend
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/all`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBooks(data);
        else console.error("Unexpected response:", data);
      })
      .catch((err) => console.error("Error fetching books:", err))
      .finally(() => setLoading(false));
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookName || !author || !year) return;

    const newBook = { bookName, author, year };
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });

      const data = await res.json();
      if (data && data._id) {
        setBooks((prevBooks) => [...prevBooks, data]);
        setBookName("");
        setAuthor("");
        setYear("");
      } else {
        console.error("Unexpected response from backend:", data);
      }
    } catch (err) {
      console.error("Error adding book:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete book
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
      setBooks((prevBooks) => prevBooks.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title"> Book Store Application</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Book Name"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Year Published"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <button type="submit" className="btn-add" disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>

      {loading && <p className="loading-text"> Loading...</p>}

      <table className="book-table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Year Published</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book._id}>
                <td>{book.bookName}</td>
                <td>{book.author}</td>
                <td>{book.year}</td>
                <td>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="btn-delete"
                    disabled={loading}
                  >
                     Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No books available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
