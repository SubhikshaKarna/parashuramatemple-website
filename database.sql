CREATE DATABASE temple_database;

USE temple_database;

CREATE TABLE zone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE pooja_names (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);



USE temple_database;

CREATE TABLE devotees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  email VARCHAR(255),
  pincode VARCHAR(6) NOT NULL,
  zone VARCHAR(255) NOT NULL,
  address VARCHAR(1024),  -- Storing full address in one field
  rashi VARCHAR(255),
  nakshatra VARCHAR(255),
  gotra VARCHAR(255),
  head_of_house ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PoojaRegistration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    devotee_id INT NOT NULL,
    devotee_name VARCHAR(255) NOT NULL,
    pooja_name VARCHAR(255) NOT NULL,
    pooja_date DATE NOT NULL,
    tithi VARCHAR(100) DEFAULT NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (devotee_id) REFERENCES devotees(id) ON DELETE CASCADE
);


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'common') NOT NULL
);

-- Insert Default Users (Password should be hashed before inserting)
INSERT INTO users (username, password, role) VALUES
('admin', 'password', 'admin'),
('common', 'password', 'common');
