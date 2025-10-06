# AI-Based Library Management System Backend

This project is a Node.js + Express.js backend for a library management system using MySQL and raw SQL queries (no ORM). It supports CRUD operations for users, books, authors, categories, and borrowing/returning books.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure MySQL:**
   - Create a database (default: `library_db`).
   - Run the SQL in `schema.sql` to create tables.
   - Update `.env` with your MySQL credentials.

3. **Start the server:**
   ```bash
   node index.js
   ```

## API Endpoints

### Users
- `POST /api/users` — Create user
- `GET /api/users` — List users
- `GET /api/users/:id` — Get user by ID
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

### Books
- `POST /api/books` — Add book
- `GET /api/books` — List books
- `GET /api/books/:id` — Get book by ID
- `PUT /api/books/:id` — Update book
- `DELETE /api/books/:id` — Delete book

### Authors
- `POST /api/authors` — Add author
- `GET /api/authors` — List authors
- `GET /api/authors/:id` — Get author by ID
- `PUT /api/authors/:id` — Update author
- `DELETE /api/authors/:id` — Delete author

### Categories
- `POST /api/categories` — Add category
- `GET /api/categories` — List categories
- `GET /api/categories/:id` — Get category by ID
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category

### Borrowings
- `POST /api/borrowings/borrow` — Borrow a book
- `POST /api/borrowings/return` — Return a book
- `GET /api/borrowings` — List borrowings
- `GET /api/borrowings/:id` — Get borrowing by ID

## Example Request
```bash
curl -X POST http://localhost:3000/api/books \
  -H 'Content-Type: application/json' \
  -d '{"title":"Book Title","author_id":1,"category_id":1,"isbn":"1234567890","published_year":2022,"copies":5}'
```

## Notes
- All endpoints use raw SQL queries via the `mysql` package.
- Passwords are stored as plain text for demo purposes. Use hashing in production.
- Add authentication/authorization as needed for your use case.