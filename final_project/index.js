const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const registeredUsers = []
const app = express();

app.use(express.json());

app.use("/customer", session({secret: "fingerprint_customer", resave: true, saveUninitialized: true}));

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token not provided' });
  
    jwt.verify(token, 'BOA', (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Token authentication failed' });
      req.user = decoded; 
      next();
    });
});

const books = [
  { id: 1, title: 'LivroBOM1', author: 'Ocara1', isbn: '1234567890', review: 'gurizada curti' },
  { id: 2, title: 'LivroBOM2', author: 'Ocara2', isbn: '0987654321', review: 'de guri' },
  { id: 3, title: 'LivroBOM3', author: 'Ocara3', isbn: '9876543210', review: 'bah' }
];

const public_users = express.Router();

public_users.get('/', function (req, res) {
  res.json(books);
});


public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  const booksByAuthor = books.filter(book => book.author === author);
  
  if (booksByAuthor.length === 0) {

    return res.status(404).json({ message: 'Nenhum livro encontrado para o autor fornecido' });
  }
  

  res.json(booksByAuthor);
});


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  

  const book = books.find(b => b.isbn === isbn);
  

  if (!book) {
    return res.status(404).json({ message: 'Livro não encontrado' });
  }
  
  res.json(book);
});

public_users.post('/addreview/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const { review } = req.body;
  
    const bookIndex = books.findIndex(b => b.isbn === isbn);
  
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Livro não encontrado' });
    }
  
    books[bookIndex].review = review;
  
    res.status(200).json({ message: 'Avaliação de livro adicionada ou modificada com sucesso' });
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  const booksByTitle = books.filter(book => book.title === title);
  
  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: 'Nenhum livro encontrado para o título fornecido' });
  }
  res.json(booksByTitle);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: 'Livro não encontrado' });
  }
  
  res.json({
    review: book.review });
});

public_users.post('/register', function (req, res) {
const { username, password } = req.body;
const userExists = registeredUsers.some(user => user.username === username);
if (userExists) {
return res.status(400).json({ message: 'Username already exists' });
}

registeredUsers.push({ username, password });

res.status(201).json({ message: 'User registered successfully' });
});

public_users.post('/login', function (req, res) {
    const { username, password } = req.body;
    const user = registeredUsers.find(user => user.username === username);
  
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Usuario ou senha invalido' });
    }
  
    const token = jwt.sign({ username: user.username }, 'BOA');
  
    res.status(200).json("Logado com sucesso");
  });


public_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    const bookIndex = books.findIndex(b => b.isbn === isbn);

    if (bookIndex === -1) {

        return res.status(404).json({ message: 'Livro não encontrado' });
    }
    

    if (!books[bookIndex].review) {
        return res.status(400).json({ message: 'Livro não possui uma avaliação' });
    }
    
    delete books[bookIndex].review;
    
    res.status(200).json({ message: 'Avaliação de livro removida com sucesso' });
});


const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.use("/public", public_users);

app.listen(PORT,()=>console.log("Server is running"));