const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all events
router.get('/', (req, res) => {
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
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
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
      ticketLink: row.ticket_link
    }));

    res.json(events);
  });
});

// Get single event by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
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
  });
});

// Get all categories
router.get('/categories/list', (req, res) => {
  db.all('SELECT DISTINCT category FROM events ORDER BY category', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const categories = rows.map(row => row.category);
    res.json(categories);
  });
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
