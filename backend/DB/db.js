import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100, // adjust based on your needs
  queueLimit: 0
}).promise();

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});
