const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using Axios
public_users.get('/', async function (req, res) {
  try {
    // Making an external/internal call via Axios
    const response = await axios.get(`${BASE_URL}/books_internal`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching all books", error: error.message });
  }
});

// Helper endpoint serving raw JSON for Axios
public_users.get('/books_internal', function (req, res) {
  return res.status(200).json(books);
});

// Task 11: Get book details based on ISBN using Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`${BASE_URL}/books_internal`)
    .then(response => {
      const bookList = response.data;
      if (bookList[isbn]) {
        return res.status(200).json(bookList[isbn]);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(error => {
      return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    });
});

// Task 12: Get book details based on Author using Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/books_internal`);
    const bookList = response.data;
    let matchedBooks = [];
    
    Object.keys(bookList).forEach(key => {
      if (bookList[key].author.toLowerCase() === author.toLowerCase()) {
        matchedBooks.push({
          isbn: key,
          author: bookList[key].author,
          title: bookList[key].title,
          reviews: bookList[key].reviews
        });
      }
    });

    if (matchedBooks.length > 0) {
      return res.status(200).json(matchedBooks);
    } else {
      return res.status(404).json({ message: "Author not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 13: Get book details based on Title using Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/books_internal`);
    const bookList = response.data;
    let matchedBooks = [];

    Object.keys(bookList).forEach(key => {
      if (bookList[key].title.toLowerCase() === title.toLowerCase()) {
        matchedBooks.push({
          isbn: key,
          author: bookList[key].author,
          title: bookList[key].title,
          reviews: bookList[key].reviews
        });
      }
    });

    if (matchedBooks.length > 0) {
      return res.status(200).json(matchedBooks);
    } else {
      return res.status(404).json({ message: "Title not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

module.exports.general = public_users;
