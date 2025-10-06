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

-- Sample data
INSERT INTO users (name, email, password, role) VALUES
('Alice', 'alice@example.com', 'password1', 'user'),
('Bob', 'bob@example.com', 'password2', 'user'),
('Admin', 'admin@example.com', 'adminpass', 'admin');

INSERT INTO authors (name, bio) VALUES
('J.K. Rowling', 'Author of Harry Potter'),
('George Orwell', 'Author of 1984'),
('J.R.R. Tolkien', 'Author of Lord of the Rings');

INSERT INTO categories (name) VALUES
('Fantasy'),
('Science Fiction'),
('Classic');

INSERT INTO books (title, author_id, category_id, isbn, published_year, copies) VALUES
('Harry Potter and the Sorcerer''s Stone', 1, 1, '9780439708180', 1997, 5),
('1984', 2, 2, '9780451524935', 1949, 3),
('The Hobbit', 3, 1, '9780547928227', 1937, 4);

INSERT INTO borrowings (user_id, book_id, borrow_date, return_date, returned) VALUES
(1, 1, '2025-10-01', '2025-10-05', TRUE),
(2, 2, '2025-10-02', NULL, FALSE),
(1, 3, '2025-10-03', NULL, FALSE);
