const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['https://cheki-events.vercel.app', 'https://cheki-events-eskt.vercel.app', 'https://cheki-events-eskt-ochpz36ox-donmunyokis-projects.vercel.app', /^https:\/\/.*\.vercel\.app$/, 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    console.log('🏥 Health check requested');
    console.log('🔍 Database available:', !!db);
    console.log('🔍 JWT_SECRET available:', !!process.env.JWT_SECRET);
    console.log('🔍 Environment:', process.env.NODE_ENV);
    
    // Test database connection
    if (db) {
      const testQuery = db.prepare('SELECT 1 as test');
      const result = testQuery.get();
      console.log('✅ Database test successful:', !!result);
    }
    
    res.json({
      status: 'healthy',
      database: !!db,
      jwt_secret: !!process.env.JWT_SECRET,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// API routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
});
