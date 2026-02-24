const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Use /tmp directory for Render (always available)
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/events.db'
  : path.join(__dirname, '../database/events.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  console.log('📁 Creating database directory:', dbDir);
  try {
    fs.mkdirSync(dbDir, { recursive: true });
  } catch (err) {
    console.error('❌ Failed to create directory:', err);
  }
}

console.log('🗄️ Database path:', dbPath);

let db;
try {
  db = new Database(dbPath);
  console.log('✅ Database created successfully');
} catch (err) {
  console.error('❌ Failed to create database:', err);
  // Try fallback to /tmp
  try {
    const fallbackPath = '/tmp/events.db';
    console.log('🔄 Trying fallback path:', fallbackPath);
    db = new Database(fallbackPath);
    console.log('✅ Database created with fallback path');
  } catch (fallbackErr) {
    console.error('❌ Fallback also failed:', fallbackErr);
    throw fallbackErr;
  }
}

// Enable foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Test database methods
try {
  const testStmt = db.prepare('SELECT 1');
  if (testStmt) {
    console.log('✅ Database methods working correctly');
    testStmt.run(); // better-sqlite3 doesn't need finalize()
  }
} catch (err) {
  console.error('❌ Database methods test failed:', err);
}

module.exports = { db };
