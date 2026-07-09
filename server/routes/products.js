const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all products
router.get('/', (req, res) => {
  const { category, search, featured } = req.query;

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (featured === 'true') {
    query += ' AND featured = true';
  }

  query += ' ORDER BY createdAt DESC';

  db.query(query, params, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }
    return res.status(200).json(results);
  });
});

// Get single product
router.get('/:id', (req, res) => {
  const productId = req.params.id;

  db.query('SELECT * FROM products WHERE id = ?', [productId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(results[0]);
  });
});

// Create product (Admin)
router.post('/', (req, res) => {
  const { name, nepali, category, price, originalPrice, unit, description, farm, location, image, inStock, featured } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ message: 'Name, category, and price are required' });
  }

  db.query(
    'INSERT INTO products SET ?',
    {
      name,
      nepali,
      category,
      price,
      originalPrice,
      unit,
      description,
      farm,
      location,
      image,
      inStock,
      featured,
      rating: 0,
      reviews: 0,
    },
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }
      return res.status(201).json({ message: 'Product created successfully', productId: results.insertId });
    }
  );
});

// Update product (Admin)
router.put('/:id', (req, res) => {
  const productId = req.params.id;
  const updates = req.body;

  db.query('UPDATE products SET ? WHERE id = ?', [updates, productId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product updated successfully' });
  });
});

// Delete product (Admin)
router.delete('/:id', (req, res) => {
  const productId = req.params.id;

  db.query('DELETE FROM products WHERE id = ?', [productId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;
