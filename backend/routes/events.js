const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');

// Create shared in-memory database
const db = new Database(':memory:');
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

// Insert current Nairobi events this month
const currentEvents = [
  {
    title: "Nairobi International Trade Fair 2026",
    description: "The biggest agricultural and trade exhibition in East Africa featuring hundreds of exhibitors, innovation showcases, and business networking opportunities.",
    date: "March 5-15, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Jamhuri Showground, Nairobi",
    category: "Business",
    price: "KES 200",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkZSUyMGZhaXJ8ZW58MHx8fHwxNzYxMjQ2NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://ticketsasa.com/events/nairobi-international-trade-fair-2026"
  },
  {
    title: "Sauti Sol Live in Concert",
    description: "Kenya's award-winning band Sauti Sol performs their greatest hits in an electrifying live concert experience at the KICC.",
    date: "March 8, 2026",
    time: "7:00 PM",
    location: "Kenyatta International Convention Centre (KICC)",
    category: "Music",
    price: "KES 3,500",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWN8ZW58MHx8fHwxNzYxMjQ2NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://ticketsasa.com/events/sauti-sol-live-concert-2026"
  },
  {
    title: "Nairobi Tech Week 2026",
    description: "East Africa's premier technology conference featuring keynote speakers from Google, Microsoft, and local startups. Includes workshops and networking sessions.",
    date: "March 12-14, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Edge Convention Centre, Nairobi",
    category: "Technology",
    price: "KES 5,000",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29uZmVyZW5jZXxlbnwwfHx8fDE3NjEyNDY1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://ticketsasa.com/events/nairobi-tech-week-2026"
  },
  {
    title: "Comedy Night with Eric Omondi",
    description: "Kenya's top comedian Eric Omondi brings his latest stand-up comedy show to Nairobi with special guest performances.",
    date: "March 10, 2026",
    time: "8:00 PM",
    location: "Carnivore Restaurant, Nairobi",
    category: "Comedy",
    price: "KES 2,000",
    image: "https://images.unsplash.com/photo-1516232698864-2b8c1fc6ab1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBzaG93JTIwbmlnaHR8ZW58MHx8fHwxNzYxMjQ2NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://ticketsasa.com/events/eric-omondi-comedy-night-2026"
  },
  {
    title: "Nairobi Fashion Week",
    description: "Showcasing the best of Kenyan and African fashion designers with runway shows, exhibitions, and networking events.",
    date: "March 16-18, 2026",
    time: "6:00 PM - 10:00 PM",
    location: "Sarit Centre Expo Centre, Nairobi",
    category: "Fashion",
    price: "KES 1,500",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvd3xlbnwwfHx8fDE3NjEyNDY1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://ticketsasa.com/events/nairobi-fashion-week-2026"
  },
  {
    title: "Nairobi Marathon 2026",
    description: "Annual Nairobi Marathon featuring 42km, 21km, 10km, and 5km races. Join thousands of runners in Kenya's premier marathon event.",
    date: "March 23, 2026",
    time: "6:00 AM",
    location: "Uhuru Gardens, Nairobi",
    category: "Sports",
    price: "KES 1,000",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5pbmd8ZW58MHx8fHwxNzYxMjQ2NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://ticketsasa.com/events/nairobi-marathon-2026"
  },
  {
    title: "Kenya Food Festival",
    description: "Celebrate Kenya's diverse culinary scene with food tastings, cooking demonstrations, and chef competitions from top restaurants.",
    date: "March 25-26, 2026",
    time: "10:00 AM - 8:00 PM",
    location: "KICC Grounds, Nairobi",
    category: "Food",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZmVzdGl2YWx8ZW58MHx8fHwxNzYxMjQ2NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://ticketsasa.com/events/kenya-food-festival-2026"
  },
  {
    title: "Nairobi Art Biennale",
    description: "Contemporary African art exhibition featuring works from over 50 artists across the continent. Includes workshops and artist talks.",
    date: "March 28-30, 2026",
    time: "10:00 AM - 6:00 PM",
    location: "National Museum of Kenya, Nairobi",
    category: "Art",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9ufGVufDB8fHx8MTc2MTI0NjU1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://ticketsasa.com/events/nairobi-art-biennale-2026"
  },
  {
    title: "Nairobi Jazz Festival",
    description: "Three-day jazz festival featuring international and local jazz artists, workshops, and jam sessions in the heart of Nairobi.",
    date: "March 31 - April 2, 2026",
    time: "5:00 PM - 11:00 PM",
    location: "Kilimani Primary School Grounds, Nairobi",
    category: "Music",
    price: "KES 2,500",
    image: "https://images.unsplash.com/photo-1463100095044-357583b65b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwZmVzdGl2YWx8ZW58MHx8fHwxNzYxMjQ2NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://ticketsasa.com/events/nairobi-jazz-festival-2026"
  }
];

const insertEvent = db.prepare('INSERT INTO events (title, description, date, time, location, category, price, image, ticketLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
currentEvents.forEach(event => {
  insertEvent.run(event.title, event.description, event.date, event.time, event.location, event.category, event.price, event.image, event.ticketLink);
});

console.log(' Events: Current Nairobi events inserted');

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
