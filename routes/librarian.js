const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { SECRET } = require('./librarianAuth');

module.exports = (db) => {
  // Librarian login
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ? AND role = "admin"', [email, password], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials or not a librarian' });
      const user = results[0];
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '2h' });
      res.json({ token });
    });
  });

  return router;
};
