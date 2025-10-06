const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Create user
  router.post('/', (req, res) => {
    const { name, email, password, role } = req.body;
    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'user'],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ id: result.insertId, name, email, role: role || 'user' });
      }
    );
  });

  // Get all users
  router.get('/', (req, res) => {
    db.query('SELECT id, name, email, role, created_at FROM users', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // Get user by ID
  router.get('/:id', (req, res) => {
    db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ error: 'User not found' });
      res.json(results[0]);
    });
  });

  // Update user
  router.put('/:id', (req, res) => {
    const { name, email, password, role } = req.body;
    db.query(
      'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
      [name, email, password, role, req.params.id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'User updated' });
      }
    );
  });

  // Delete user
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'User deleted' });
    });
  });

  return router;
};
