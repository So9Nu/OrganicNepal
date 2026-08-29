const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyAdmin } = require('../middleware/auth');

router.get('/summary', verifyAdmin, async (req, res) => {
  try {
    const [counts, recentOrders, categoryData, monthlyData, topProducts] = await Promise.all([
      db.promise().query(`SELECT
        (SELECT COUNT(*) FROM products) AS products,
        (SELECT COUNT(*) FROM users WHERE role = 'user') AS customers,
        (SELECT COUNT(*) FROM orders) AS orders,
        (SELECT COALESCE(SUM(totalAmount), 0) FROM orders WHERE status != 'cancelled') AS revenue`),
      db.promise().query(`SELECT o.id, o.totalAmount, o.status, o.createdAt, u.name, u.email,
        COUNT(oi.id) AS itemCount
        FROM orders o JOIN users u ON u.id = o.userId
        LEFT JOIN orderItems oi ON oi.orderId = o.id
        GROUP BY o.id, o.totalAmount, o.status, o.createdAt, u.name, u.email
        ORDER BY o.createdAt DESC LIMIT 5`),
      db.promise().query('SELECT category AS name, COUNT(*) AS value FROM products GROUP BY category ORDER BY value DESC'),
      db.promise().query(`SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS orders,
        COALESCE(SUM(CASE WHEN status != 'cancelled' THEN totalAmount ELSE 0 END), 0) AS revenue
        FROM orders WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(createdAt, '%Y-%m') ORDER BY month`),
      db.promise().query(`SELECT p.id, p.name, SUM(oi.quantity) AS sales
        FROM orderItems oi JOIN products p ON p.id = oi.productId
        JOIN orders o ON o.id = oi.orderId
        WHERE o.status != 'cancelled'
        GROUP BY p.id, p.name ORDER BY sales DESC LIMIT 5`),
    ]);
    return res.json({ counts: counts[0][0], recentOrders: recentOrders[0], categoryData: categoryData[0], monthlyData: monthlyData[0], topProducts: topProducts[0] });
  } catch (error) {
    console.error('Admin summary error:', error);
    return res.status(500).json({ message: 'Unable to load admin analytics' });
  }
});

module.exports = router;
