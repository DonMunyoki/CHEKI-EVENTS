const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Use persistent storage for Render
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/database/events.db'
  : path.join(__dirname, '../database/events.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  console.log('📁 Creating database directory:', dbDir);
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log('🗄️ Database path:', dbPath);

const db = new Database(dbPath);

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
