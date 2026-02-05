-- MySQL Database Schema for Food Rescue System

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS food_rescue_system;
USE food_rescue_system;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL DEFAULT 0,
  longitude DECIMAL(11,8) NOT NULL DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Food posts table
CREATE TABLE food_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  quantity INT NOT NULL,
  latitude DECIMAL(10,8) NOT NULL DEFAULT 0,
  longitude DECIMAL(11,8) NOT NULL DEFAULT 0,
  address VARCHAR(255),
  postedBy INT NOT NULL,
  claimedBy INT,
  status ENUM('available', 'claimed') DEFAULT 'available',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (postedBy) REFERENCES users(id),
  FOREIGN KEY (claimedBy) REFERENCES users(id),
  INDEX idx_latitude_longitude (latitude, longitude),
  INDEX idx_status (status),
  INDEX idx_postedBy (postedBy),
  INDEX idx_claimedBy (claimedBy)
);
