# AI-Based Library Management System Backend

## Project Overview
A Node.js + Express.js backend for a library management system using MySQL and raw SQL queries. Includes a Python-based recommendation system using collaborative filtering.

### Libraries Used
- Node.js
- Express.js
- mysql (Node.js package)
- dotenv
- Python: pandas, scikit-learn, mysql-connector-python

---

## Database Schema (SQL)
```
CREATE DATABASE IF NOT EXISTS sql12801540;
USE sql12801540;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author_id INT,
    category_id INT,
    isbn VARCHAR(20) UNIQUE,
    published_year INT,
    copies INT DEFAULT 1,
    FOREIGN KEY (author_id) REFERENCES authors(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    borrow_date DATE,
    return_date DATE,
    returned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
```

---

## ER/EER Diagram (Textual)
- **User** (id) 1---* **Borrowings** *---1 **Book** (id)
- **Book** (id) *---1 **Author** (id)
- **Book** (id) *---1 **Category** (id)
- **Borrowings** links users and books, with borrow/return dates and status

### Normalization
- All tables are in at least 3NF:
  - No repeating groups
  - All non-key attributes depend only on the key
  - No transitive dependencies
- Foreign keys ensure referential integrity

---

## API Routes & Endpoints
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
- `GET /api/books/recommend/:user_id` — Get book recommendations for user

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

---

## Librarian & Management APIs

### Authentication
- `POST /api/librarian/login` — Librarian login (returns JWT token)

### Role-based Access
- Librarian endpoints require JWT token with `role: admin`

### Planned Features (to be implemented)
- Book request, approval, rejection, and status tracking
- Inventory management (add/remove/update books, manage copies)
- User management (block/unblock users, view user activity)
- Request history and status tracking
- (Optional) Notifications for requests/status changes

### Example: Librarian Login
```
curl -X POST http://localhost:3000/api/librarian/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"adminpass"}'
```

---

## Recommendation System
- Implemented in Python (`recommend.py`)
- Uses collaborative filtering (cosine similarity) with pandas and scikit-learn
- Connects to MySQL database
- Endpoint: `GET /api/books/recommend/:user_id`
- Returns books borrowed by similar users but not yet borrowed by the target user

---

## Example Request
```
curl -X GET http://localhost:3000/api/books/recommend/1
```

---

## How to Run
1. Install Node.js dependencies: `npm install`
2. Install Python dependencies: `pip install pandas scikit-learn mysql-connector-python`
3. Configure `.env` for MySQL connection
4. Start backend: `node index.js`
5. Use API endpoints as documented above

---

## How to Use New APIs
1. Login as librarian to get JWT token
2. Use token in `Authorization` header for all librarian endpoints
3. Access management features as documented above

---

## Author & License
- Author: gmsai12345
- License: ISC
