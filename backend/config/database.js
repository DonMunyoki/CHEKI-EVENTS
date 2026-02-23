const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../database/events.db');

console.log('🗄️ Database path:', dbPath);

let db;
try {
  db = new Database(dbPath);
  console.log('✅ Database connected successfully');
} catch (err) {
  console.error('❌ Database connection error:', err);
  process.exit(1);
}

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

module.exports = { db, Database };
