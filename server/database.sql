-- Create Database
CREATE DATABASE IF NOT EXISTS sonu;
USE sonu;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nepali VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  originalPrice DECIMAL(10, 2),
  unit VARCHAR(50),
  description TEXT,
  farm VARCHAR(255),
  location VARCHAR(255),
  image LONGTEXT,
  inStock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3, 1) DEFAULT 0,
  reviews INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_featured (featured)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  totalAmount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shippingAddress TEXT,
  paymentMethod VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS orderItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_orderId (orderId),
  INDEX idx_productId (productId)
);

-- Sample Products
INSERT INTO products (name, nepali, category, price, originalPrice, unit, description, farm, location, inStock, featured, rating, reviews) VALUES
('Organic Spinach', 'जैविक पालुंगो', 'vegetables', 80, 100, '500g', 'Fresh organic spinach grown in the hills of Nepal. Rich in iron, vitamins, and minerals.', 'Himalayan Green Farms', 'Sindhupalchok', true, true, 4.8, 124),
('Mango', 'आँप', 'fruits', 80, 100, '500g', 'Fresh organic mango grown in the hills of Nepal. Rich in iron, vitamins, and minerals.', 'Himalayan Green Farms', 'Terai', true, true, 4.8, 124),
('WaterMelon', 'तरबुज', 'fruits', 50, 100, '1pc', 'Pure raw honey collected from wild hives in the Himalayan forests. Unprocessed and full of nutrients.', 'Nepal Bee Collective', 'Mustang', true, true, 4.9, 256),
('Farm Fresh Tomatoes', 'ताजा गोलभेँडा', 'vegetables', 60, 80, '1 kg', 'Sun-ripened tomatoes from organic farms in Chitwan. Perfect for cooking and salads.', 'Terai Organic Farm', 'Chitwan', true, false, 4.6, 89),
('Organic Basmati Rice', 'जैविक बासमती चामल', 'grains', 320, 380, '2 kg', 'Premium aromatic basmati rice grown without pesticides in the fertile Terai plains.', 'Golden Fields Nepal', 'Morang', true, true, 4.7, 201),
('Fresh Broccoli', 'ताजा ब्रोकाउली', 'vegetables', 120, 150, '500g', 'Fresh and crunchy broccoli packed with nutrients from organic farms.', 'Valley Greens', 'Kathmandu', true, false, 4.5, 67);

-- Create admin user (password: admin123 - hashed with bcrypt)
INSERT IGNORE INTO users (email, password, name, phone, role) VALUES
('admin@organic.com', '$2b$10$EZ7HLWbVp3Zzn4BMnQyC.ehgjxVsLodjF.LGYoIdW9fUrpVGqPhmq', 'Admin User', '9800000000', 'admin');
