const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Create category
  router.post('/', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, name });
    });
  });

  // Get all categories
  router.get('/', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // Get category by ID
  router.get('/:id', (req, res) => {
    db.query('SELECT * FROM categories WHERE id = ?', [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ error: 'Category not found' });
      res.json(results[0]);
    });
  });

  // Update category
  router.put('/:id', (req, res) => {
    const { name } = req.body;
    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Category updated' });
    });
  });

  // Delete category
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM categories WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Category deleted' });
    });
  });

  return router;
};
