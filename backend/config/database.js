const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../database/events.db');

console.log('🗄️ Database path:', dbPath);

let db;
try {
  db = new Database(dbPath);
  console.log('✅ Database connected successfully');
  console.log('🔍 Database methods available:', Object.getOwnPropertyNames(db));
  console.log('🔍 db.prepare type:', typeof db.prepare);
} catch (err) {
  console.error('❌ Database connection error:', err);
  process.exit(1);
}

// Enable foreign keys
try {
  db.exec('PRAGMA foreign_keys = ON');
  console.log('✅ Foreign keys enabled');
} catch (err) {
  console.error('❌ Error enabling foreign keys:', err);
}

// Test database methods
try {
  const testStmt = db.prepare('SELECT 1');
  if (testStmt) {
    console.log('✅ Database methods working correctly');
    testStmt.finalize();
  }
} catch (err) {
  console.error('❌ Database methods test failed:', err);
}

module.exports = { db, Database };
