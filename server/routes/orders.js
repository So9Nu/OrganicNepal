const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all orders (Admin)
router.get('/', (req, res) => {
  db.query(
    'SELECT o.*, u.email, u.firstName, u.lastName FROM orders o JOIN users u ON o.userId = u.id ORDER BY o.createdAt DESC',
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }
      return res.status(200).json(results);
    }
  );
});

// Get user orders
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  db.query('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }
    return res.status(200).json(results);
  });
});

// Get order details
router.get('/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  db.query('SELECT * FROM orders WHERE id = ?', [orderId], (error, orderResults) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (orderResults.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get order items
    db.query('SELECT * FROM orderItems WHERE orderId = ?', [orderId], (error, itemResults) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      const order = { ...orderResults[0], items: itemResults };
      return res.status(200).json(order);
    });
  });
});

// Create order
router.post('/', (req, res) => {
  const { userId, items, totalAmount, shippingAddress, paymentMethod, status } = req.body;

  if (!userId || !items || items.length === 0 || !totalAmount) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  db.query(
    'INSERT INTO orders SET ?',
    {
      userId,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: status || 'pending',
    },
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error', error });
      }

      const orderId = results.insertId;

      // Insert order items
      const orderItems = items.map((item) => ({
        orderId,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      db.query('INSERT INTO orderItems SET ?', orderItems, (error) => {
        if (error) {
          return res.status(500).json({ message: 'Database error while saving items', error });
        }
        return res.status(201).json({ message: 'Order created successfully', orderId });
      });
    }
  );
});

// Update order status
router.put('/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error', error });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order updated successfully' });
  });
});

module.exports = router;
