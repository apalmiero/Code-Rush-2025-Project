function getAllFlashcards(userId) {
  fetch(`/api/flashcards?user_id=${userId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      console.log("Flashcards:", data);
      flashcards = data; // Populate the flashcards array
      displayInitialFlashcard(flashcards); // Call this after flashcards are fetched
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
      userId = data.userId
      getAllFlashcards(data.userId); // Fetch flashcards after login
    })
    .catch((err) => {
      console.error("Error during login:", err);
    });
}

// Example usage: Replace with actual username and password inputs
const username = "user1";
const password = "hashed_password_1"; // Replace with actual hashed password
let userId;
let flashcards = [];
let currentFlashcardIndex = 0; // Initialize current flashcard index
getUserID(username, password); // Start the login process

function displayInitialFlashcard(flashcards) {
  if (flashcards.length === 0) {
    console.error("No flashcards available to display.");
    return;
  }

  const flashcardQuestion = document.getElementById("flashcardQuestion");
  const flashcardAnswer = document.getElementById("flashcardAnswer");

  flashcardQuestion.textContent = flashcards[currentFlashcardIndex].question;
  flashcardAnswer.textContent = flashcards[currentFlashcardIndex].answer;
}

document.getElementById("nextFlashcard").addEventListener("click", function () {
  currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length; // Increment index and wrap around if needed

  const flashcardQuestion = document.getElementById("flashcardQuestion");
  const flashcardAnswer = document.getElementById("flashcardAnswer");

  flashcardQuestion.textContent = flashcards[currentFlashcardIndex].question;
  flashcardAnswer.textContent = flashcards[currentFlashcardIndex].answer;
});

document.getElementById("previousFlashcard").addEventListener("click", function () {
  currentFlashcardIndex =
    (currentFlashcardIndex - 1 + flashcards.length) % flashcards.length; // Decrement index and wrap around if needed

  const flashcardQuestion = document.getElementById("flashcardQuestion");
  const flashcardAnswer = document.getElementById("flashcardAnswer");

  flashcardQuestion.textContent = flashcards[currentFlashcardIndex].question;
  flashcardAnswer.textContent = flashcards[currentFlashcardIndex].answer;
});

document.getElementById("addFlashcard").addEventListener("click", function () {
  // Prompt the user for the question and answer
  const question = prompt("Enter the question for the flashcard:");
  const answer = prompt("Enter the answer for the flashcard:");

  // Validate the inputs
  if (!question || !answer) {
    alert("Both question and answer are required to add a flashcard.");
    return;
  }

  // Create a new flashcard object
  const newFlashcard = {
    question: question,
    answer: answer,
    user_id: userId, // Assuming `userId` is available globally
    flashcard_id: flashcards.length+1
  };

  // Send the new flashcard to the database via a POST request
  fetch("/api/flashcards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newFlashcard),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to add flashcard to the database.");
      return res.json();
    })
    .then((data) => {
      console.log("Flashcard added to the database:", data);

      // Add the new flashcard to the flashcards array
      flashcards.push(newFlashcard);

      // Optionally display the new flashcard immediately
      currentFlashcardIndex = flashcards.length - 1; // Set to the last flashcard
      displayInitialFlashcard(flashcards);
    })
    .catch((err) => {
      console.error("Error adding flashcard to the database:", err);
      alert("Failed to add flashcard. Please try again.");
    });
});


// Automatically alternate between two intervals
function timer(workMinutes, breakMinutes) {
  let isWorkInterval = true; // Start with work
  let intervalDuration = workMinutes * 60; // in seconds
  let timeLeft = intervalDuration;
  let intervalType = "Work";
  let timerDisplay = document.getElementById("timer-status");
  let countdown;

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${intervalType} interval: ${minutes}:${seconds
      .toString()
      .padStart(2, "0")} remaining`;
  }

  function startInterval() {
    timeLeft = isWorkInterval ? workMinutes * 60 : breakMinutes * 60;
    intervalType = isWorkInterval ? "Work" : "Break";

    updateDisplay(); // Immediately show initial time

    countdown = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        clearInterval(countdown);
        isWorkInterval = !isWorkInterval; // Switch to the other interval
        startInterval(); // Start next interval
      }
    }, 1000);
  }

  startInterval(); // Begin first interval
}

// Attach event listener to the start button
document.getElementById("start-timer").addEventListener("click", () => {
  const workMinutes = parseInt(
    document.getElementById("work-minutes").value,
    10
  );
  const breakMinutes = parseInt(
    document.getElementById("break-minutes").value,
    10
  );

  if (
    isNaN(workMinutes) ||
    isNaN(breakMinutes) ||
    workMinutes <= 0 ||
    breakMinutes <= 0
  ) {
    alert("Please enter valid positive numbers for work and break durations.");
    return;
  }

  timer(workMinutes, breakMinutes);
});