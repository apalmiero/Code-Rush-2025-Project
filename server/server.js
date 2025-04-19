const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Path to DB
const dbPath = path.join(__dirname, '../database/flashcards.db');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve frontend (public folder)
app.use(express.static(path.join(__dirname, '../public')));

// API route to get all flashcards for a specific user
app.get('/api/flashcards', (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const db = new sqlite3.Database(dbPath);

  db.all('SELECT * FROM flashcards WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      console.error("DB error:", err);
      res.status(500).json({ error: 'Database read error' });
    } else {
      res.json(rows);
    }

    db.close();
  });
});

app.post('/api/flashcards', (req, res) => {
  const { question, answer, user_id } = req.body;

  if (!question || !answer || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = new sqlite3.Database(dbPath);

  const query = `INSERT INTO flashcards (question, answer, user_id) VALUES (?, ?, ?)`;

  db.run(query, [question, answer, user_id], function (err) {
    if (err) {
      console.error("DB insert error:", err);
      res.status(500).json({ error: 'Failed to insert flashcard' });
    } else {
      res.status(201).json({ flashcard_id: this.lastID }); // Return the new ID
    }

    db.close();
  });
});

// API route for user login
app.post('/api/login', express.json(), (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = new sqlite3.Database(dbPath);

  db.get(
    'SELECT * FROM Users WHERE username = ? AND password_hash = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: 'Database query error' });
      } else if (row) {
        console.log("Login success. User row:", row);
        res.json({ success: true, userId: row.user_id });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }

      db.close();
    }
  );
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
