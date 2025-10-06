const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Create book
  router.post('/', (req, res) => {
    const { title, author_id, category_id, isbn, published_year, copies } = req.body;
    db.query(
      'INSERT INTO books (title, author_id, category_id, isbn, published_year, copies) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author_id, category_id, isbn, published_year, copies || 1],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ id: result.insertId, title });
      }
    );
  });

  // Book recommendations for a user (agentic AI)
  const { execFile } = require('child_process');
  router.get('/recommend/:user_id', (req, res) => {
    const userId = req.params.user_id;
    execFile('python3', ['recommend.py', userId], { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr || error.message });
      }
      try {
        const recommendations = JSON.parse(stdout);
        res.json(recommendations);
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse recommendations' });
      }
    });
  });

  // Get all books
  router.get('/', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // Get book by ID
  router.get('/:id', (req, res) => {
    db.query('SELECT * FROM books WHERE id = ?', [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ error: 'Book not found' });
      res.json(results[0]);
    });
  });

  // Update book
  router.put('/:id', (req, res) => {
    const { title, author_id, category_id, isbn, published_year, copies } = req.body;
    db.query(
      'UPDATE books SET title = ?, author_id = ?, category_id = ?, isbn = ?, published_year = ?, copies = ? WHERE id = ?',
      [title, author_id, category_id, isbn, published_year, copies, req.params.id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Book updated' });
      }
    );
  });

  // Delete book
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM books WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Book deleted' });
    });
  });

  return router;
};
