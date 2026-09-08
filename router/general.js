const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
const public_users = express.Router();

// Task 10: Get all books using Async/Await or Promises
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const bookList = await getBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let matchedBooks = [];
    keys.forEach(key => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchedBooks.push(books[key]);
      }
    });
    if (matchedBooks.length > 0) {
      resolve(matchedBooks);
    } else {
      reject("Author not found");
    }
  })
  .then((result) => res.status(200).json(result))
  .catch((err) => res.status(404).json({ message: err }));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let matchedBooks = [];
    keys.forEach(key => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchedBooks.push(books[key]);
      }
    });
    if (matchedBooks.length > 0) {
      resolve(matchedBooks);
    } else {
      reject("Title not found");
    }
  })
  .then((result) => res.status(200).json(result))
  .catch((err) => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
