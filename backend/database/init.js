const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'events.db');

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Removed existing database');
}

const db = new Database(dbPath);
console.log('✅ Connected to SQLite database');

// Create tables
try {
  // Users table
  db.exec(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admission_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('✅ Users table created');

  // Events table
  db.exec(`CREATE TABLE events (
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
    available_tickets INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('✅ Events table created');

  // Tickets table
  db.exec(`CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    ticket_number TEXT UNIQUE NOT NULL,
    quantity INTEGER NOT NULL,
    total_price TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed',
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (event_id) REFERENCES events (id)
  )`);
  console.log('✅ Tickets table created');

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
      image: "https://images.unsplash.com/photo-1743791022256-40413c5f019b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBldmVudHxlbnwxfHx8fDE3NjEyNDY1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ticket_link: "https://mookh.com"
    },
    {
      title: "Contemporary Art Exhibition",
      description: "Explore thought-provoking contemporary art pieces from East African artists",
      date: "February 28, 2026",
      time: "10:00 AM",
      location: "Nairobi National Museum",
      category: "Art",
      price: "KES 500",
      image: "https://images.unsplash.com/photo-1713779490284-a81ff6a8ffae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjEyMzA0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ticket_link: "https://ticketyetu.com"
    },
    {
      title: "Nairobi Food Festival",
      description: "Savor cuisines from around the world and local Kenyan delicacies at this vibrant food festival",
      date: "March 7, 2026",
      time: "11:00 AM",
      location: "Karura Forest, Nairobi",
      category: "Food",
      price: "KES 800",
      image: "https://images.unsplash.com/photo-1675674683873-1232862e3c64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZmVzdGl2YWwlMjBtYXJrZXR8ZW58MXx8fHwxNzYxMjI1MzMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ticket_link: "https://www.ticketskenya.com"
    },
    {
      title: "Comedy Night with Churchill",
      description: "Laugh your heart out with Kenya's top comedians in this hilarious stand-up show",
      date: "March 21, 2026",
      time: "8:00 PM",
      location: "KICC, Nairobi",
      category: "Comedy",
      price: "KES 1,000",
      image: "https://images.unsplash.com/photo-1760582912320-79fcbc9f309b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBzaG93JTIwcGVyZm9ybWFuY2V8ZW58MXx8fHwxNzYxMTU5OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ticket_link: "https://standupcollective.co.ke/shows"
    },
    {
      title: "Tusker FC vs Gor Mahia",
      description: "Watch the biggest football derby in Kenya at the iconic Kasarani Stadium",
      date: "February 22, 2026",
      time: "3:00 PM",
      location: "Kasarani Stadium, Nairobi",
      category: "Sports",
      price: "KES 500",
      image: "https://images.unsplash.com/photo-1760508737418-a7add7ee3871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwZXZlbnR8ZW58MXx8fHwxNzYxMTUyMDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ticket_link: "https://tikiti.co.ke"
    }
  ];

  const stmt = db.prepare(`INSERT INTO events (title, description, date, time, location, category, price, image, ticket_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  sampleEvents.forEach(event => {
    stmt.run([
      event.title,
      event.description,
      event.date,
      event.time,
      event.location,
      event.category,
      event.price,
      event.image,
      event.ticket_link
    ]);
  });

  console.log('✅ Sample events inserted');
  console.log('🎉 Database initialization complete!');

} catch (err) {
  console.error('❌ Error during database initialization:', err.message);
} finally {
  db.close();
}
