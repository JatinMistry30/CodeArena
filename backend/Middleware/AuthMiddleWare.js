import jwt from 'jsonwebtoken';
import { db } from '../DB/db.js';

const JWT_SECRET = process.env.JWT_SECRET 

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      db.query('SELECT id, username, email FROM users WHERE id = ?', [decoded.userId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'User not found' });
        }

        req.user = results[0];
        next();
      });
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};


export const authAuthenticate = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.id = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
