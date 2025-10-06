const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Borrow a book
  router.post('/borrow', (req, res) => {
    const { user_id, book_id } = req.body;
    db.query('SELECT copies FROM books WHERE id = ?', [book_id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0 || results[0].copies < 1) return res.status(400).json({ error: 'Book not available' });
      db.query('UPDATE books SET copies = copies - 1 WHERE id = ?', [book_id], (err) => {
        if (err) return res.status(500).json({ error: err });
        db.query('INSERT INTO borrowings (user_id, book_id, borrow_date) VALUES (?, ?, CURDATE())', [user_id, book_id], (err, result) => {
          if (err) return res.status(500).json({ error: err });
          res.status(201).json({ message: 'Book borrowed', borrowing_id: result.insertId });
        });
      });
    });
  });

  // Return a book
  router.post('/return', (req, res) => {
    const { borrowing_id } = req.body;
    db.query('SELECT book_id, returned FROM borrowings WHERE id = ?', [borrowing_id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ error: 'Borrowing not found' });
      if (results[0].returned) return res.status(400).json({ error: 'Book already returned' });
      const book_id = results[0].book_id;
      db.query('UPDATE books SET copies = copies + 1 WHERE id = ?', [book_id], (err) => {
        if (err) return res.status(500).json({ error: err });
        db.query('UPDATE borrowings SET return_date = CURDATE(), returned = TRUE WHERE id = ?', [borrowing_id], (err) => {
          if (err) return res.status(500).json({ error: err });
          res.json({ message: 'Book returned' });
        });
      });
    });
  });

  // Get all borrowings
  router.get('/', (req, res) => {
    db.query('SELECT * FROM borrowings', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // Get borrowing by ID
  router.get('/:id', (req, res) => {
    db.query('SELECT * FROM borrowings WHERE id = ?', [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ error: 'Borrowing not found' });
      res.json(results[0]);
    });
  });

  return router;
};
