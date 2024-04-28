const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/', function (req, res) {
  axios.get('http://someAPIexample.com/books')
    .then(response => {
      const books = response.data;
      res.json(books);
    })
    .catch(error => {
      console.error('Error fetching books:', error);
      res.status(500).json({ message: 'Failed to fetch books' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://someAPIexample.com/books/isbn/${isbn}`)
    .then(response => {
      const book = response.data;
      res.json(book);
    })
    .catch(error => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error);
      res.status(500).json({ message: 'Failed to fetch book details' });
    });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://someAPIexample.com/books/author/${author}`)
    .then(response => {
      const booksByAuthor = response.data;
      res.json(booksByAuthor);
    })
    .catch(error => {
      console.error(`Error fetching books by author ${author}:`, error);
      res.status(500).json({ message: 'Failed to fetch books by author' });
    });
});


// Get books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://someAPIexample.com/books/title/${title}`)
    .then(response => {
      const booksByTitle = response.data;
      res.json(booksByTitle);
    })
    .catch(error => {
      console.error(`Error fetching books by title ${title}:`, error);
      res.status(500).json({ message: 'Failed to fetch books by title' });
    });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
