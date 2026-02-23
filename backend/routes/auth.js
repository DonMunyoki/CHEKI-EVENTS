const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Import database with fallback
let db;
try {
  db = require('../config/database').db;
  console.log(' Auth: Database imported successfully');
} catch (err) {
  console.error(' Auth: Failed to import database:', err);
  db = null;
}

// Register user
router.post('/register', async (req, res) => {
  try {
    const { admission_number, email, password } = req.body;

    // Validation
    if (!admission_number || !email || !password) {
      return res.status(400).json({ error: 'Admission number, email, and password are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = db.get('SELECT * FROM users WHERE admission_number = ? OR email = ?', [admission_number, email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const insertQuery = 'INSERT INTO users (admission_number, email, password_hash) VALUES (?, ?, ?)';
    const insertStmt = db.prepare(insertQuery);
    const result = insertStmt.run([admission_number, email, hashedPassword]);

    // Create JWT token
    const token = jwt.sign(
      { userId: result.lastInsertRowid, admission_number },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.lastInsertRowid,
        admission_number,
        email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { admission_number, password } = req.body;

    if (!admission_number || !password) {
      return res.status(400).json({ 
        error: 'Admission number and password are required'
      });
    }

    // Get user from database
    const query = 'SELECT * FROM users WHERE admission_number = ?';
    const user = db.get(query, [admission_number]);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, admission_number: user.admission_number },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        admission_number: user.admission_number,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get current user info
router.get('/me', verifyToken, (req, res) => {
  const query = 'SELECT id, admission_number, name, email, created_at FROM users WHERE id = ?';
  db.get(query, [req.user.userId], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
