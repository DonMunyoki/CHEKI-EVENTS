const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('./auth');

// Get user's tickets
router.get('/my-tickets', verifyToken, (req, res) => {
  const query = `
    SELECT t.*, e.title, e.date, e.time, e.location, e.image, e.category
    FROM tickets t
    JOIN events e ON t.event_id = e.id
    WHERE t.user_id = ?
    ORDER BY t.purchase_date DESC
  `;

  db.all(query, [req.user.userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    const tickets = rows.map(row => ({
      id: row.id.toString(),
      ticketNumber: row.ticket_number,
      quantity: row.quantity,
      totalPrice: row.total_price,
      status: row.status,
      purchaseDate: row.purchase_date,
      event: {
        id: row.event_id.toString(),
        title: row.title,
        date: row.date,
        time: row.time,
        location: row.location,
        image: row.image,
        category: row.category
      }
    }));

    res.json(tickets);
  });
});

// Purchase tickets for an event
router.post('/purchase', verifyToken, (req, res) => {
  const { eventId, quantity } = req.body;

  if (!eventId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Event ID and quantity are required' });
  }

  // Start transaction
  db.serialize(() => {
    // Check event availability
    db.get('SELECT * FROM events WHERE id = ?', [eventId], (err, event) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.available_tickets < quantity) {
        return res.status(400).json({ error: 'Not enough tickets available' });
      }

      // Generate unique ticket number
      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Calculate total price (remove "KES " prefix and convert to number)
      const priceNumeric = parseInt(event.price.replace('KES ', '').replace(',', ''));
      const totalPrice = `KES ${(priceNumeric * quantity).toLocaleString()}`;

      // Update available tickets
      db.run(
        'UPDATE events SET available_tickets = available_tickets - ? WHERE id = ?',
        [quantity, eventId],
        function(err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error updating tickets' });
          }

          // Create ticket record
          const insertQuery = `
            INSERT INTO tickets (user_id, event_id, ticket_number, quantity, total_price)
            VALUES (?, ?, ?, ?, ?)
          `;

          db.run(insertQuery, [req.user.userId, eventId, ticketNumber, quantity, totalPrice], function(err) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Database error creating ticket' });
            }

            res.status(201).json({
              message: 'Tickets purchased successfully',
              ticket: {
                id: this.lastID.toString(),
                ticketNumber,
                quantity,
                totalPrice,
                status: 'confirmed',
                purchaseDate: new Date().toISOString(),
                event: {
                  id: eventId,
                  title: event.title,
                  date: event.date,
                  time: event.time,
                  location: event.location
                }
              }
            });
          });
        }
      );
    });
  });
});

// Get ticket details by ID
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT t.*, e.title, e.date, e.time, e.location, e.image, e.category
    FROM tickets t
    JOIN events e ON t.event_id = e.id
    WHERE t.id = ? AND t.user_id = ?
  `;

  db.get(query, [id, req.user.userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = {
      id: row.id.toString(),
      ticketNumber: row.ticket_number,
      quantity: row.quantity,
      totalPrice: row.total_price,
      status: row.status,
      purchaseDate: row.purchase_date,
      event: {
        id: row.event_id.toString(),
        title: row.title,
        date: row.date,
        time: row.time,
        location: row.location,
        image: row.image,
        category: row.category
      }
    };

    res.json(ticket);
  });
});

// Cancel ticket
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  // Get ticket details first
  db.get('SELECT * FROM tickets WHERE id = ? AND user_id = ?', [id, req.user.userId], (err, ticket) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.status === 'cancelled') {
      return res.status(400).json({ error: 'Ticket already cancelled' });
    }

    db.serialize(() => {
      // Update ticket status
      db.run('UPDATE tickets SET status = ? WHERE id = ?', ['cancelled', id], function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error updating ticket' });
        }

        // Restore available tickets
        db.run(
          'UPDATE events SET available_tickets = available_tickets + ? WHERE id = ?',
          [ticket.quantity, ticket.event_id],
          function(err) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Database error restoring tickets' });
            }

            res.json({ message: 'Ticket cancelled successfully' });
          }
        );
      });
    });
  });
});

module.exports = router;
