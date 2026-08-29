const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyAdmin, verifyToken } = require('../middleware/auth');

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const [users] = await db.promise().query('SELECT id, name, email, phone, role, createdAt FROM users ORDER BY createdAt DESC');
    return res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || (req.userId !== userId && req.userRole !== 'admin')) return res.status(403).json({ message: 'Access denied' });
  try {
    const [users] = await db.promise().query('SELECT id, name, email, phone, role, createdAt FROM users WHERE id = ?', [userId]);
    if (!users.length) return res.status(404).json({ message: 'User not found' });
    return res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const userId = Number(req.params.id);
  const { name, phone } = req.body;
  if (!Number.isInteger(userId) || req.userId !== userId) return res.status(403).json({ message: 'Access denied' });
  if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
  try {
    const [result] = await db.promise().query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name.trim(), phone?.trim() || null, userId]);
    if (!result.affectedRows) return res.status(404).json({ message: 'User not found' });
    const [users] = await db.promise().query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [userId]);
    return res.json({ message: 'User updated successfully', user: users[0] });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId === req.userId) return res.status(400).json({ message: 'Invalid user deletion request' });
  try {
    const [result] = await db.promise().query('DELETE FROM users WHERE id = ?', [userId]);
    if (!result.affectedRows) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
