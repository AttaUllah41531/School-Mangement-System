const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

// Books
router.get('/books', libraryController.getAllBooks);
router.post('/books', libraryController.createBook);
router.put('/books/:id', libraryController.updateBook);
router.delete('/books/:id', libraryController.deleteBook);

// Issuing
router.get('/issues', libraryController.getAllIssuedBooks);
router.post('/issues', libraryController.issueBook);
router.post('/returns', libraryController.returnBook);

module.exports = router;