function getAllFlashcards(userId) {
  fetch(`/api/flashcards?user_id=${userId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      console.log("Flashcards:", data);
      // Process and display the flashcards as needed
    })
    .catch((err) => {
      console.error("Error fetching flashcards:", err);
    });
}

function getUserID(username, password) {
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Invalid username or password");
      return res.json();
    })
    .then((data) => {
      console.log("Login response data:", data); // Add this line to log the entire response
      console.log("User ID:", data.userId);
      getAllFlashcards(data.userId);
    })
    .catch((err) => {
      console.error("Error during login:", err);
    });
}

// Example usage: Replace with actual username and password inputs
const username = "user1";
const password = "hashed_password_1"; // Replace with actual hashed password

// Initiate login and fetch flashcards for the user
getUserID(username, password);
