require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nano = require("nano")(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@${process.env.COUCHDB_HOST}:${process.env.COUCHDB_PORT}`);

const app = express();
const port = process.env.PORT || 5000;

// 1. CORS middleware first
const allowedOrigins = [
  "http://localhost:3000",       // local dev
  "http://192.168.0.178:3000", 
  "http://backend:5000",            // internal Docker call
  "http://frontend",                // Docker service name
  "http://frontend:80",             // Nginx inside Docker
  "http://172.188.96.249",     // external Azure IP (we’ll replace below)
  "http://172.188.96.249:80"   // explicit port if needed   // LAN access
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// 2. Body parser
app.use(bodyParser.json());

// Database setup
const dbName = process.env.DB_NAME || "books";
let db;

// Ensure DB exists
nano.db.get(dbName)
  .then(() => {
    console.log(`Using existing database: ${dbName}`);
    db = nano.use(dbName);
  })
  .catch(async (err) => {
    if (err.statusCode === 404) {
      await nano.db.create(dbName);
      console.log(`Database "${dbName}" created.`);
      db = nano.use(dbName);
    } else {
      console.error("Error checking database:", err);
    }
  });

// Root check
app.get("/", (req, res) => res.send("Backend is running"));

// Add book
app.post("/add", async (req, res) => {
  try {
    const { bookName, author, year } = req.body;
    if (!bookName || !author || !year) return res.status(400).send({ error: "All fields required" });

    const response = await db.insert({ bookName, author, year });
    res.send({ _id: response.id, bookName, author, year });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error adding book" });
  }
});

// Get all books
app.get("/all", async (req, res) => {
  try {
    const result = await db.list({ include_docs: true });
    const books = result.rows.map(row => ({
      _id: row.doc._id,
      bookName: row.doc.bookName,
      author: row.doc.author,
      year: row.doc.year
    }));
    res.send(books);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error fetching books" });
  }
});

// Delete book
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await db.get(id);
    await db.destroy(id, doc._rev);
    res.send({ message: "Book deleted", id });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error deleting book" });
  }
});

// Start server, listen on all interfaces
app.listen(port, '0.0.0.0', () => 
    console.log(`Server running on http://0.0.0.0:${port}`)
);
