const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');

// Create in-memory database directly in routes
let db;
try {
  db = new Database(':memory:');
  console.log(' Events: In-memory database created successfully');
  
  // Initialize tables
  db.exec(`
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
  `);
  
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
  
  console.log(' Events: Sample events inserted');
} catch (err) {
  console.error(' Events: Failed to create in-memory database:', err);
  db = null;
}

// Get all events
router.get('/', (req, res) => {
  try {
    console.log('🔍 Fetching events with query:', req.query);
    
    // Check if database is available
    if (!db || typeof db.prepare !== 'function') {
      console.error('❌ Database not properly initialized');
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const { category, search } = req.query;
    
    let query = 'SELECT * FROM events';
    let params = [];
    
    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    if (search) {
      query += category && category !== 'All' 
        ? ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)'
        : ' WHERE (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      const searchTerm = `%${search}%`;
      if (category && category !== 'All') {
        params.push(searchTerm, searchTerm, searchTerm);
      } else {
        params.push(searchTerm, searchTerm, searchTerm);
      }
    }
    
    query += ' ORDER BY date ASC';
    console.log('📝 Final query:', query);
    console.log('📝 Parameters:', params);
    
    const stmt = db.prepare(query);
    if (!stmt) {
      console.error('❌ Failed to prepare statement');
      return res.status(500).json({ error: 'Database query preparation failed' });
    }
    
    const rows = stmt.all(params);
    console.log('📊 Found events:', rows.length);
    
    // Transform rows to match frontend Event interface
    const events = rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      date: row.date,
      time: row.time,
      location: row.location,
      category: row.category,
      price: row.price,
      image: row.image,
      ticketLink: row.ticket_link,
      availableTickets: row.available_tickets
    }));
    
    console.log('✅ Sending events to frontend');
    res.json(events);
  } catch (err) {
    console.error('❌ Events route error:', err);
    console.error('❌ Stack trace:', err.stack);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get single event by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get([id]);
    
    if (!row) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const event = {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      date: row.date,
      time: row.time,
      location: row.location,
      category: row.category,
      price: row.price,
      image: row.image,
      ticketLink: row.ticket_link,
      availableTickets: row.available_tickets
    };
    
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all categories
router.get('/categories/list', (req, res) => {
  try {
    console.log('🔍 Fetching categories');
    
    // Check if database is available
    if (!db || typeof db.prepare !== 'function') {
      console.error('❌ Database not properly initialized');
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const stmt = db.prepare('SELECT DISTINCT category FROM events ORDER BY category');
    if (!stmt) {
      console.error('❌ Failed to prepare categories statement');
      return res.status(500).json({ error: 'Database query preparation failed' });
    }
    
    const rows = stmt.all();
    console.log('📊 Found categories:', rows.length);
    const categories = rows.map(row => row.category);
    console.log('✅ Categories:', categories);
    res.json(categories);
  } catch (err) {
    console.error('❌ Categories route error:', err);
    console.error('❌ Stack trace:', err.stack);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Create new event (admin only)
router.post('/', (req, res) => {
  const { title, description, date, time, location, category, price, image, ticket_link } = req.body;

  if (!title || !description || !date || !time || !location || !category || !price || !image || !ticket_link) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `INSERT INTO events (title, description, date, time, location, category, price, image, ticket_link) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.prepare(query).run([title, description, date, time, location, category, price, image, ticket_link], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      id: this.lastID.toString(),
      title,
      description,
      date,
      time,
      location,
      category,
      price,
      image,
      ticket_link: ticket_link
    });
  });
});

// Update event (admin only)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, location, category, price, image, ticket_link } = req.body;

  const query = `UPDATE events 
                 SET title = ?, description = ?, date = ?, time = ?, location = ?, 
                     category = ?, price = ?, image = ?, ticket_link = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`;

  db.run(query, [title, description, date, time, location, category, price, image, ticket_link, id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully' });
  });
});

// Delete event (admin only)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.prepare('DELETE FROM events WHERE id = ?').run([id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  });
});

module.exports = router;
