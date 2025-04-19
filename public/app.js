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


//automatically altername between two intervals
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
    timerDisplay.innerText = `${intervalType} interval: ${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
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
  const workMinutes = parseInt(document.getElementById("work-minutes").value, 10);
  const breakMinutes = parseInt(document.getElementById("break-minutes").value, 10);

  if (isNaN(workMinutes) || isNaN(breakMinutes) || workMinutes <= 0 || breakMinutes <= 0) {
    alert("Please enter valid positive numbers for work and break durations.");
    return;
  }

  timer(workMinutes, breakMinutes);
});