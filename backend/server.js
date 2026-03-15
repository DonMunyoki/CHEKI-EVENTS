const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open: sqliteOpen } = require('sqlite');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Initialize SQLite database
const dbPath = path.join(__dirname, '..', 'cheki_events.db');
let db;

// Initialize database with proper error handling
const initDB = async () => {
  try {
    db = await sqliteOpen({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admission_number TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        category TEXT NOT NULL,
        price TEXT NOT NULL,
        image TEXT NOT NULL,
        ticket_link TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { admissionNumber, password } = req.body;

    if (!admissionNumber || !password) {
      return res.status(400).json({ error: 'Admission number and password are required' });
    }

    if (password.length !== 6) {
      return res.status(400).json({ error: 'Password must be exactly 6 characters' });
    }

    if (admissionNumber.length < 10) {
      return res.status(400).json({ error: 'Admission number must be at least 10 characters' });
    }

    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE admission_number = ?',
      [admissionNumber]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'User with this admission number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db.run(
      'INSERT INTO users (admission_number, password) VALUES (?, ?)',
      [admissionNumber, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { admissionNumber, password } = req.body;

    if (!admissionNumber || !password) {
      return res.status(400).json({ error: 'Admission number and password are required' });
    }

    // Find user
    const user = await db.get(
      'SELECT * FROM users WHERE admission_number = ?',
      [admissionNumber]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid admission number or password' });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid admission number or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        admissionNumber: user.admission_number 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        admissionNumber: user.admission_number
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.all('SELECT * FROM categories ORDER BY name');
    res.json(categories.map(cat => cat.name));
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get Events (with optional filtering)
app.get('/api/events', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM events';
    let params = [];

    // Add category filter if provided
    if (category && category !== 'undefined') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    // Add search filter if provided
    if (search && search !== 'undefined') {
      if (params.length > 0) {
        query += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(location) LIKE ?)';
      } else {
        query += ' WHERE (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(location) LIKE ?)';
      }
      params.push(`%${search.toLowerCase()}%`);
    }

    query += ' ORDER BY date ASC';

    const events = await db.all(query, params);
    res.json(events);
  } catch (error) {
    console.error('Events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Protected route example
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, admission_number, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Initialize database and seed data
const seedData = async () => {
  try {
    // Insert categories
    const categories = [
      'Music', 'Art', 'Food', 'Comedy', 'Sports', 'Theater',
      'Business', 'Technology', 'Education', 'Science', 'Gaming', 'Fashion', 'Nightlife'
    ];

    for (const category of categories) {
      await db.run(
        'INSERT OR IGNORE INTO categories (name) VALUES (?)',
        [category]
      );
    }

    // Insert sample events
    const sampleEvents = [
      {
        title: "Nairobi Jazz Night",
        description: "Experience an unforgettable evening of live jazz music featuring Kenya's finest musicians",
        date: "March 15, 2026",
        time: "7:00 PM",
        location: "Carnivore Restaurant, Nairobi",
        category: "Music",
        price: "KES 1,500",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&crop=center&auto=format",
        ticket_link: "https://ticketskenya.com/nairobi-jazz-night"
      },
      {
        title: "Contemporary Art Exhibition",
        description: "Explore thought-provoking contemporary art pieces from East African artists",
        date: "February 28, 2026",
        time: "10:00 AM",
        location: "Nairobi National Museum",
        category: "Art",
        price: "KES 500",
        image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop&crop=center&auto=format",
        ticket_link: "https://ticketskenya.com/art-exhibition"
      },
      {
        title: "Nairobi Food Festival",
        description: "Savor cuisines from around the world and local Kenyan delicacies at this vibrant food festival",
        date: "March 7, 2026",
        time: "11:00 AM",
        location: "Karura Forest, Nairobi",
        category: "Food",
        price: "KES 800",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center&auto=format",
        ticket_link: "https://ticketskenya.com/food-festival"
      },
      {
        title: "Comedy Night with Churchill",
        description: "Laugh your heart out with Kenya's top comedians in this hilarious stand-up show",
        date: "March 21, 2026",
        time: "8:00 PM",
        location: "KICC, Nairobi",
        category: "Comedy",
        price: "KES 1,000",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center&auto=format",
        ticket_link: "https://ticketskenya.com/comedy-night"
      },
      {
        title: "Tusker FC vs Gor Mahia",
        description: "Watch the biggest football derby in Kenya at the iconic Kasarani Stadium",
        date: "February 22, 2026",
        time: "3:00 PM",
        location: "Kasarani Stadium, Nairobi",
        category: "Sports",
        price: "KES 500",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center&auto=format",
        ticket_link: "https://ticketskenya.com/football-match"
      },
      {
        title: "The Lion King - Live Theater",
        description: "Experience the magic of Disney's The Lion King brought to life on stage",
        date: "March 28, 2026",
        time: "6:00 PM",
        location: "Kenya National Theatre, Nairobi",
        category: "Theater",
        price: "KES 2,000",
        image: "https://images.unsplash.com/photo-1539964604210-db87088e0c2c?w=800&h=600&fit=crop&crop=center&auto=format",
        ticket_link: "https://ticketskenya.com/lion-king"
      }
    ];

    for (const event of sampleEvents) {
      await db.run(
        `INSERT INTO events (title, description, date, time, location, category, price, image, ticket_link) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [event.title, event.description, event.date, event.time, event.location, event.category, event.price, event.image, event.ticket_link]
      );
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

// Start server
const startServer = async () => {
  await initDB();
  await seedData();  
  app.listen(PORT, () => {
    console.log(`🚀 Cheki Events Backend Server running on port ${PORT}`);
    console.log(`📊 Database: ${dbPath}`);
    console.log(`🔐 JWT Secret: ${JWT_SECRET}`);
    console.log(`🌐 CORS enabled for frontend`);
  });
};

startServer().catch(console.error);
