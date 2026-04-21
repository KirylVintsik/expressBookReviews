const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let doesExist = require('./auth_users.js').doesExist;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: 'User successfully registered. Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: 'Unable to register user.' });
});

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async (req, res) => {
  try {
    // Simulate async operation with Promise
    const bookList = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(JSON.stringify(books));
      }, 0);
    });
    return res.send(bookList);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books' });
  }
});

// Task 11: Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(JSON.stringify(books[isbn]));
        } else {
          reject('Book not found');
        }
      }, 0);
    });
    return res.send(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const bookList = await new Promise((resolve) => {
      setTimeout(() => {
        const filtered = Object.values(books).filter(
          (book) =>
            book.author.toLocaleLowerCase() === author.toLocaleLowerCase(),
        );
        resolve(filtered);
      }, 0);
    });
    return res.json(bookList);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by author' });
  }
});

// Task 13: Get all books based on title using async-await
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const bookList = await new Promise((resolve) => {
      setTimeout(() => {
        const filtered = Object.values(books).filter(
          (book) =>
            book.title.toLocaleLowerCase() === title.toLocaleLowerCase(),
        );
        resolve(filtered);
      }, 0);
    });
    return res.json(bookList);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by title' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;
