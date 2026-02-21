const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const router = express.Router();
const db = require('../config/database');

// Register new user
router.post('/register', async (req, res) => {
  const { admission_number, name, email, password } = req.body;

  // Validation
  if (!admission_number || !name || !password) {
    return res.status(400).json({ error: 'Admission number, name, and password are required' });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if user already exists
    db.get('SELECT * FROM users WHERE admission_number = ?', [admission_number], async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ error: 'User with this admission number already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Insert user
      const query = 'INSERT INTO users (admission_number, name, email, password_hash) VALUES (?, ?, ?, ?)';
      db.run(query, [admission_number, name, email, password_hash], function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }

        // Create JWT token
        const token = jwt.sign(
          { userId: this.lastID, admission_number, name },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: this.lastID,
            admission_number,
            name,
            email
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', (req, res) => {
  const { admission_number, password } = req.body;

  if (!admission_number || !password) {
    return res.status(400).json({ error: 'Admission number and password are required' });
  }

  const query = 'SELECT * FROM users WHERE admission_number = ?';
  db.get(query, [admission_number], async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

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
      { userId: user.id, admission_number: user.admission_number, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        admission_number: user.admission_number,
        name: user.name,
        email: user.email
      }
    });
  });
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
