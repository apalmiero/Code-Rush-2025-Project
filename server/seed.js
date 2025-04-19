const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to DB
const dbPath = path.join(__dirname, '../database/flashcards.db');

// Open the database
const db = new sqlite3.Database(dbPath);

// Insert dummy users and flashcards
db.serialize(() => {
  // Create Users table if it doesn't exist
  db.run('CREATE TABLE IF NOT EXISTS Users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL)');
  
  // Create Flashcards table if it doesn't exist
  db.run('CREATE TABLE IF NOT EXISTS Flashcards (flashcard_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, question TEXT NOT NULL, answer TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES Users(user_id))');

  // Insert dummy users
  const insertUsers = db.prepare('INSERT INTO Users (username, password_hash) VALUES (?, ?)');
  insertUsers.run('user1', 'hashed_password_1');
  insertUsers.run('user2', 'hashed_password_2');
  insertUsers.run('user3', 'hashed_password_3');
  insertUsers.finalize();

  // Insert dummy flashcards
  const insertFlashcards = db.prepare('INSERT INTO Flashcards (user_id, question, answer) VALUES (?, ?, ?)');
  insertFlashcards.run(1, 'What is the capital of France?', 'Paris');
  insertFlashcards.run(1, 'What is 2 + 2?', '4');
  insertFlashcards.run(2, 'What is the tallest mountain in the world?', 'Mount Everest');
  insertFlashcards.run(2, 'Who developed the theory of relativity?', 'Albert Einstein');
  insertFlashcards.run(3, 'What is the square root of 16?', '4');
  insertFlashcards.run(3, 'What is the chemical symbol for water?', 'H2O');
  insertFlashcards.finalize();
});

// Close the database
db.close(() => {
  console.log('Dummy data inserted');
});
