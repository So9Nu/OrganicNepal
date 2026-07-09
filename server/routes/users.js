const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all users (Admin)
router.get('/', (req, res) => {
  db.query('SELECT id, email, firstName, lastName, phone, createdAt FROM users ORDER BY createdAt DESC', (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }
    return res.status(200).json(results);
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;

  db.query('SELECT id, email, firstName, lastName, phone, createdAt FROM users WHERE id = ?', [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(results[0]);
  });
});

// Update user profile
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, phone } = req.body;

  db.query('UPDATE users SET firstName = ?, lastName = ?, phone = ? WHERE id = ?', [firstName, lastName, phone, userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully' });
  });
});

// Delete user (Admin)
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  db.query('DELETE FROM users WHERE id = ?', [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
