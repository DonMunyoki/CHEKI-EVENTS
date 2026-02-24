const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create database in memory first, then save to file
let db;
try {
  // Try to create in-memory database first
  db = new Database(':memory:');
  console.log('✅ In-memory database created successfully');
  
  // Initialize tables in memory
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admission_number TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
      ticketLink TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id)
    );
  `);
  
  console.log('✅ Tables created in memory');
  
  // Insert sample events
  const sampleEvents = [
    {
      title: 'Nairobi Jazz Night',
      description: 'Experience an unforgettable evening of live jazz music featuring Kenya\'s finest musicians',
      date: 'March 15, 2026',
      time: '7:00 PM',
      location: 'Carnivore Restaurant, Nairobi',
      category: 'Music',
      price: 'KES 1,500',
      image: 'https://images.unsplash.com/photo-1743791022256-40413c5f019b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBldmVufHx8fDE3NjEyNDY1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ticketLink: 'https://www.ticketsasa.com'
    },
    {
      title: 'Tech Summit 2026',
      description: 'Join industry leaders for a day of innovation and technology discussions',
      date: 'April 2, 2026',
      time: '9:00 AM',
      location: 'Kenya International Conference Centre, Nairobi',
      category: 'Technology',
      price: 'KES 2,000',
      image: 'https://images.unsplash.com/photo-1743791022256-40413c5f019b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx0ZWNobm9sb2d5JTIwY29uZmVyZW5jZXxlbnwwfHx8fDE3NjEyNDY1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ticketLink: 'https://www.ticketsasa.com'
    },
    {
      title: 'Comedy Night',
      description: 'Laugh out loud with Kenya\'s best comedians in an evening of pure entertainment',
      date: 'March 28, 2026',
      time: '8:00 PM',
      location: 'Alliance Française, Nairobi',
      category: 'Comedy',
      price: 'KES 800',
      image: 'https://images.unsplash.com/photo-1743791022256-40413c5f019b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjb21lZHklMjBzaG93JTIwbmlnaHR8ZW58MHx8fHwxNzYxMjQ2NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      ticketLink: 'https://www.ticketsasa.com'
    }
  ];
  
  const insertEvent = db.prepare('INSERT INTO events (title, description, date, time, location, category, price, image, ticketLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  sampleEvents.forEach(event => {
    insertEvent.run(event.title, event.description, event.date, event.time, event.location, event.category, event.price, event.image, event.ticketLink);
  });
  
  console.log('✅ Sample events inserted');
  
} catch (err) {
  console.error('❌ Failed to create in-memory database:', err);
  throw err;
}

module.exports = { db };
