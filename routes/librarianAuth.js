const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'library_secret';

function authenticateLibrarian(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden: Not a librarian' });
    req.user = decoded;
    next();
  });
}

module.exports = { authenticateLibrarian, SECRET };
