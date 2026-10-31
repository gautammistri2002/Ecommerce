-- ==============================================================
-- ELECTROMART DATABASE & SQL QUERIES SETUP FOR WORKBENCH
-- Database: electromart
-- Tables: users, password_reset_token
-- ==============================================================
-- NOTE: Your MySQL tables are ALREADY CREATED (as seen in Workbench).
-- The error "Backend Offline (Start Spring Boot)" happens because
-- Spring Boot is not running on port 8080 yet.
-- MySQL runs on 3306, while Java Spring Boot runs on 8080.
-- ==============================================================

-- 1. Create and select the database
CREATE DATABASE IF NOT EXISTS electromart;
USE electromart;

-- 2. Users Table
-- Stores customer name, email, encrypted password hash and creation time
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Password Reset & OTP Token Table
-- Stores verification tokens with expiration timestamps
CREATE TABLE IF NOT EXISTS password_reset_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================================
-- SQL QUERIES FOR ELECTROMART IN MYSQL WORKBENCH:
-- ==============================================================

-- Query 1: View all registered users in MySQL
SELECT id, name, email, created_at FROM users ORDER BY created_at DESC;

-- Query 2: Insert your account Gutam (Password: 123456)
-- BCrypt Hash below corresponds to password '123456'
INSERT INTO users (name, email, password_hash, created_at) 
VALUES ('Gutam', 'gutam@gmail.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', NOW())
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- Query 3: Select user to verify Gutam's credentials
SELECT id, name, email, password_hash, created_at 
FROM users 
WHERE LOWER(email) = LOWER('gutam@gmail.com');

-- Query 4: Check OTP & password verification tokens
SELECT * FROM password_reset_token ORDER BY created_at DESC;
