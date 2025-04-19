

function getAllFlashcards(userId) {
  fetch(`/api/flashcards?user_id=${userId}`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      console.log("Flashcards:", data);
      // Process and display the flashcards as needed
    })
    .catch(err => {
      console.error("Error fetching flashcards:", err);
    });
}

// Example: Fetch flashcards for user with user_id = 1
getAllFlashcards(1);
