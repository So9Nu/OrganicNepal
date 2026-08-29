const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const db = require('./config/database');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5008;

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
// GET /api/health
app.get('/api/health', async (req, res) => {
    try {
        await db.promise().query('SELECT 1');

        return res.status(200).json({
            status: 'ok',
            database: 'connected',
        });
    } catch (error) {
        console.error('Health check error:', error);

        return res.status(503).json({
            status: 'error',
            database: 'disconnected',
        });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);

    res.status(500).json({
        message: 'Internal server error',
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
