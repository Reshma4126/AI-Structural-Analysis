-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS structural_ai_db;
USE structural_ai_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Engineer', 'Researcher', 'Student', 'Admin') NOT NULL DEFAULT 'Engineer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_name VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('Active', 'Archived') NOT NULL DEFAULT 'Active',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Beam Designs Table
CREATE TABLE IF NOT EXISTS beam_designs (
  beam_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  beam_name VARCHAR(150) NOT NULL,
  beam_width FLOAT NOT NULL,
  beam_depth FLOAT NOT NULL,
  beam_length FLOAT NOT NULL,
  concrete_grade VARCHAR(50) NOT NULL,
  steel_grade VARCHAR(50) NOT NULL,
  cover FLOAT NOT NULL,
  number_of_tensile_bars INT NOT NULL,
  diameter_tensile_bars FLOAT NOT NULL,
  number_of_compression_bars INT NOT NULL,
  diameter_compression_bars FLOAT NOT NULL,
  stirrup_diameter FLOAT NOT NULL,
  stirrup_spacing FLOAT NOT NULL,
  loading_type VARCHAR(100) NOT NULL,
  applied_load FLOAT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);
