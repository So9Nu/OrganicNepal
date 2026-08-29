const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/database');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedName = typeof name === 'string' ? name.trim() : '';

    if (!normalizedName || !normalizedEmail || typeof password !== 'string') {
        return res.status(400).json({
            message: 'Name, email and password are required',
        });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || password.length < 8) {
        return res.status(400).json({ message: 'Provide a valid email and a password with at least 8 characters' });
    }

    try {
        const [existingUsers] = await db
            .promise()
            .query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: 'Email already in use',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.promise().query(
            `INSERT INTO users (name, email, password, phone)
       VALUES (?, ?, ?, ?)`,
            [normalizedName, normalizedEmail, hashedPassword, typeof phone === 'string' ? phone.trim() || null : null]
        );

        return res.status(201).json({
            message: 'Registration successful. Please login.',
        });
    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || typeof password !== 'string') {
        return res.status(400).json({
            message: 'Email and password are required',
        });
    }

    try {
        const [users] = await db
            .promise()
            .query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        const role = user.role || 'user';

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                role,
            },
            JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
});

module.exports = router;
