const express = require('express');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register
router.post('/register', (req, res) => {
  const { email, password, name, firstName, lastName, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Split name into firstName and lastName if name is provided
  let first = firstName;
  let last = lastName;
  
  if (name && !firstName && !lastName) {
    const nameParts = name.trim().split(' ');
    first = nameParts[0];
    last = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  }

  // Check if user exists
  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    db.query(
      'INSERT INTO users SET ?',
      { email, password: hashedPassword, firstName: first, lastName: last, phone },
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error', error });
        }
        return res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    const token = jwt.sign({ id: results[0].id, email: results[0].email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const user = {
      id: results[0].id,
      email: results[0].email,
      firstName: results[0].firstName,
      lastName: results[0].lastName,
      phone: results[0].phone,
    };

    return res.status(200).json({ message: 'Login successful', token, user });
  });
});

module.exports = router;
