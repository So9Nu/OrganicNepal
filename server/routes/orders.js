const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyAdmin, verifyToken } = require('../middleware/auth');

const ORDER_STATUSES = new Set(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const [orders] = await db.promise().query('SELECT o.*, u.name, u.email FROM orders o JOIN users u ON o.userId = u.id ORDER BY o.createdAt DESC');
    return res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

router.get('/user/:userId', verifyToken, async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || (req.userId !== userId && req.userRole !== 'admin')) return res.status(403).json({ message: 'Access denied' });
  try {
    const [orders] = await db.promise().query('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

router.get('/:orderId', verifyToken, async (req, res) => {
  const orderId = Number(req.params.orderId);
  if (!Number.isInteger(orderId)) return res.status(400).json({ message: 'Invalid order ID' });
  try {
    const [orders] = await db.promise().query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!orders.length) return res.status(404).json({ message: 'Order not found' });
    if (orders[0].userId !== req.userId && req.userRole !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const [items] = await db.promise().query('SELECT * FROM orderItems WHERE orderId = ?', [orderId]);
    return res.json({ ...orders[0], items });
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!Array.isArray(items) || !items.length || !shippingAddress || !paymentMethod) return res.status(400).json({ message: 'Items, shipping address, and payment method are required' });
  if (items.some(({ id, quantity }) => !Number.isInteger(Number(id)) || !Number.isInteger(Number(quantity)) || Number(quantity) < 1)) return res.status(400).json({ message: 'Order contains invalid items' });

  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();
    const productIds = [...new Set(items.map(item => Number(item.id)))];
    const [products] = await connection.query('SELECT id, price, inStock FROM products WHERE id IN (?) FOR UPDATE', [productIds]);
    if (products.length !== productIds.length || products.some(product => !product.inStock)) throw new Error('One or more products are unavailable');
    const productsById = new Map(products.map(product => [product.id, product]));
    const orderItems = items.map(item => ({ ...item, product: productsById.get(Number(item.id)) }));
    const subtotal = orderItems.reduce((sum, item) => sum + Number(item.product.price) * Number(item.quantity), 0);
    const totalAmount = subtotal + (subtotal >= 1000 ? 0 : 80);
    const [order] = await connection.query('INSERT INTO orders (userId, totalAmount, shippingAddress, paymentMethod, status) VALUES (?, ?, ?, ?, ?)', [req.userId, totalAmount, shippingAddress, paymentMethod, 'pending']);
    await connection.query('INSERT INTO orderItems (orderId, productId, quantity, price) VALUES ?', [orderItems.map(item => [order.insertId, Number(item.id), Number(item.quantity), item.product.price])]);
    await connection.commit();
    return res.status(201).json({ message: 'Order created successfully', orderId: order.insertId });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    return res.status(500).json({ message: 'Unable to create order' });
  } finally {
    connection.release();
  }
});

router.put('/:orderId', verifyAdmin, async (req, res) => {
  const orderId = Number(req.params.orderId);
  const { status } = req.body;
  if (!Number.isInteger(orderId) || !ORDER_STATUSES.has(status)) return res.status(400).json({ message: 'A valid order status is required' });
  try {
    const [result] = await db.promise().query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Order not found' });
    return res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
