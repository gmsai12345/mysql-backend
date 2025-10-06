const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Create author
  router.post('/', (req, res) => {
    const { name, bio } = req.body;
    db.query('INSERT INTO authors (name, bio) VALUES (?, ?)', [name, bio], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, name });
    });
  });

  // Get all authors
  router.get('/', (req, res) => {
    db.query('SELECT * FROM authors', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // Get author by ID
  router.get('/:id', (req, res) => {
    db.query('SELECT * FROM authors WHERE id = ?', [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ error: 'Author not found' });
      res.json(results[0]);
    });
  });

  // Update author
  router.put('/:id', (req, res) => {
    const { name, bio } = req.body;
    db.query('UPDATE authors SET name = ?, bio = ? WHERE id = ?', [name, bio, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Author updated' });
    });
  });

  // Delete author
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM authors WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Author deleted' });
    });
  });

  return router;
};
