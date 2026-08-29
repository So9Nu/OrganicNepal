const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
});

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME ,
    port: Number(process.env.DB_PORT),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection failed');
        console.error('Code:', err.code);
        console.error('Message:', err.message);
        return;
    }

    console.log('✅ MySQL connected');
    console.log('Database:', process.env.DB_NAME );

    connection.release();
});

module.exports = db;
