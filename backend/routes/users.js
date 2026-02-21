const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('./auth');

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  const query = 'SELECT id, admission_number, name, email, created_at FROM users WHERE id = ?';
  
  db.get(query, [req.user.userId], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  });
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  const { name, email } = req.body;
  
  let query = 'UPDATE users SET ';
  const updates = [];
  const params = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
  }

  if (email) {
    updates.push('email = ?');
    params.push(email);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  query += updates.join(', ') + ' WHERE id = ?';
  params.push(req.user.userId);

  db.run(query, params, function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  });
});

// Get user statistics
router.get('/stats', verifyToken, (req, res) => {
  const queries = {
    totalTickets: `
      SELECT COALESCE(SUM(quantity), 0) as total
      FROM tickets 
      WHERE user_id = ? AND status = 'confirmed'
    `,
    totalSpent: `
      SELECT COALESCE(COUNT(*), 0) as count
      FROM tickets 
      WHERE user_id = ? AND status = 'confirmed'
    `,
    upcomingEvents: `
      SELECT COUNT(*) as count
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      WHERE t.user_id = ? AND t.status = 'confirmed' AND e.date >= date('now')
    `,
    recentTickets: `
      SELECT t.*, e.title, e.date, e.time, e.location
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      WHERE t.user_id = ?
      ORDER BY t.purchase_date DESC
      LIMIT 5
    `
  };

  const stats = {};

  db.get(queries.totalTickets, [req.user.userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    stats.totalTickets = row.total;

    db.get(queries.totalSpent, [req.user.userId], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      stats.totalPurchases = row.count;

      db.get(queries.upcomingEvents, [req.user.userId], (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        stats.upcomingEvents = row.count;

        db.all(queries.recentTickets, [req.user.userId], (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
          }

          stats.recentTickets = rows.map(row => ({
            id: row.id.toString(),
            ticketNumber: row.ticket_number,
            quantity: row.quantity,
            totalPrice: row.total_price,
            purchaseDate: row.purchase_date,
            event: {
              title: row.title,
              date: row.date,
              time: row.time,
              location: row.location
            }
          }));

          res.json(stats);
        });
      });
    });
  });
});

module.exports = router;
