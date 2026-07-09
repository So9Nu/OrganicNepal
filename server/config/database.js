const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'organic_grocery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.connect((error) => {
  if (error) {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (error.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Database access was denied.');
    }
    return;
  }

  console.log('MySQL is connected successfully.');
});

module.exports = db;
