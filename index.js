require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_db',
  multipleStatements: true
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
  // Execute schema.sql after connecting, statement by statement
  const fs = require('fs');
  let schema = fs.readFileSync('./schema.sql', 'utf8');
  // Remove comments
  schema = schema.replace(/--.*$/gm, '');
  // Split into statements
  const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);
  (async () => {
    for (const stmt of statements) {
      await new Promise((resolve) => {
        db.query(stmt, (err) => {
          if (err) {
            console.error('Error executing statement:', stmt, err);
          }
          resolve();
        });
      });
    }
    console.log('Database schema ensured.');
  })();
});

app.get('/', (req, res) => {
  res.send('Library Management System API');
});

// Route modules
const usersRouter = require('./routes/users')(db);
const booksRouter = require('./routes/books')(db);
const authorsRouter = require('./routes/authors')(db);
const categoriesRouter = require('./routes/categories')(db);
const borrowingsRouter = require('./routes/borrowings')(db);
const librarianRouter = require('./routes/librarian')(db);

app.use('/api/users', usersRouter);
app.use('/api/books', booksRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/borrowings', borrowingsRouter);
app.use('/api/librarian', librarianRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
