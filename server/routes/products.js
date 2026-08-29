const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyAdmin } = require('../middleware/auth');

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
router.post('/', verifyAdmin, (req, res) => {
  const { name, nepali, category, price, originalPrice, unit, description, farm, location, image, inStock, featured } = req.body;

  if (!name || !category || !Number.isFinite(Number(price)) || Number(price) < 0) {
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
router.put('/:id', verifyAdmin, (req, res) => {
  const productId = req.params.id;
  const allowedFields = ['name', 'nepali', 'category', 'price', 'originalPrice', 'unit', 'description', 'farm', 'location', 'image', 'inStock', 'featured'];
  const updates = Object.fromEntries(
    allowedFields
      .filter(field => Object.prototype.hasOwnProperty.call(req.body, field))
      .map(field => [field, req.body[field]])
  );

  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: 'No valid product fields were provided' });
  }
  if ((updates.name !== undefined && !String(updates.name).trim()) ||
      (updates.category !== undefined && !String(updates.category).trim()) ||
      (updates.price !== undefined && (!Number.isFinite(Number(updates.price)) || Number(updates.price) < 0))) {
    return res.status(400).json({ message: 'Name, category, and a valid price are required' });
  }

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
router.delete('/:id', verifyAdmin, (req, res) => {
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
