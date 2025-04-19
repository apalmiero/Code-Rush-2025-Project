const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

const db = new sqlite3.Database('./database/flashcards.db');

app.use(cors());
app.use(express.json());

// Fetch all topics
app.get('/topics', (req, res) => {
  db.all('SELECT * FROM topics', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Fetch flashcards by topic
app.get('/flashcards/:topicId', (req, res) => {
  db.all('SELECT * FROM flashcards WHERE topic_id = ?', [req.params.topicId], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Add flashcard
app.post('/flashcards', (req, res) => {
  const { topic_id, term, definition } = req.body;
  db.run('INSERT INTO flashcards (topic_id, term, definition) VALUES (?, ?, ?)', [topic_id, term, definition], function(err) {
    if (err) return res.status(500).send(err.message);
    res.json({ id: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});