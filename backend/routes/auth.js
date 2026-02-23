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
      db.prepare(query).run([admission_number, name, email, password_hash], function(err) {
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
router.post('/login', async (req, res) => {
  try {
    console.log('🔍 Login attempt received');
    console.log('🔍 Request headers:', Object.keys(req.headers));
    console.log('🔍 Request body type:', typeof req.body);
    console.log('🔍 Request body:', req.body);
    
    const { admission_number, password } = req.body;

    if (!admission_number || !password) {
      console.log('❌ Missing credentials:', { 
        admission_number: !!admission_number, 
        password: !!password,
        bodyKeys: Object.keys(req.body || {}),
        fullBody: req.body
      });
      return res.status(400).json({ 
        error: 'Admission number and password are required',
        received: { admission_number, password }
      });
    }

    console.log('🔑 Checking user:', admission_number);
    console.log('🔍 Database available:', !!db);
    console.log('🔍 Database methods:', typeof db?.get);
    
    const query = 'SELECT * FROM users WHERE admission_number = ?';
    const user = db.get(query, [admission_number]);
    
    console.log('👤 User found:', !!user);
    if (!user) {
      console.log('❌ User not found, creating new user:', admission_number);
      
      // Auto-create user if not found
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('🔐 Password hashed successfully');
      
      const insertQuery = 'INSERT INTO users (admission_number, name, password_hash) VALUES (?, ?, ?)';
      const insertStmt = db.prepare(insertQuery);
      const result = insertStmt.run([admission_number, 'Student User', hashedPassword]);
      
      console.log('✅ New user created with ID:', result.lastInsertRowid);
      
      // Get the newly created user
      const newUser = db.get(query, [admission_number]);
      
      // Create JWT token for new user
      const token = jwt.sign(
        { userId: newUser.id, admission_number: newUser.admission_number, name: newUser.name },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = {
        message: 'User created and logged in successfully',
        token,
        user: {
          id: newUser.id,
          admission_number: newUser.admission_number,
          name: newUser.name,
          email: newUser.email
        }
      };
      
      console.log('📤 Sending response for new user:', response);
      return res.json(response);
    }

    // Compare password for existing user
    console.log('🔐 Comparing password for existing user');
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password match:', isMatch);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', admission_number);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Login successful for:', admission_number);
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, admission_number: user.admission_number, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        admission_number: user.admission_number,
        name: user.name,
        email: user.email
      }
    };
    
    console.log('📤 Sending response:', response);
    res.json(response);
  } catch (err) {
    console.error('❌ Login route error:', err);
    console.error('❌ Error name:', err.name);
    console.error('❌ Error message:', err.message);
    console.error('❌ Stack trace:', err.stack);
    res.status(500).json({ 
      error: 'Server error', 
      details: err.message,
      name: err.name
    });
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
