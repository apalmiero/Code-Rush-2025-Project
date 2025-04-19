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
  
  let counter;
  let countdown;
  let isPaused = false;
  let isWorkInterval = true;
  let timeLeft;
  let intervalType;
  const timerDisplay = document.getElementById("timer-status");
  
  // Automatically alternate between two intervals
  function timer(workMinutes, breakMinutes) {
  
    function updateDisplay() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.innerText = `${intervalType} interval: ${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
    }
  
    function startInterval() {
      if (!isPaused) {
        timeLeft = isWorkInterval ? workMinutes * 60 : breakMinutes * 60;
        intervalType = isWorkInterval ? "Work" : "Break";
      }
      updateDisplay();
  
      countdown = setInterval(() => {
        timeLeft--;
        updateDisplay();
  
        if (timeLeft <= 0) {
          clearInterval(countdown);
          isWorkInterval = !isWorkInterval; // Switch to the other interval
          isPaused = false;
          startInterval(); // Start next interval
        }
      }, 1000);
    }
  
    startInterval();
  }
  
  function pauseInterval() {
    clearInterval(countdown);
    isPaused = true;
    timerDisplay.innerText = "Timer Paused";
  }
  
  function resumeInterval() {
    isPaused = false;
  
    countdown = setInterval(() => {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.innerText = `${intervalType} interval: ${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
      if (timeLeft <= 0) {
        clearInterval(countdown);
        isWorkInterval = !isWorkInterval; // Switch to the other interval
        startInterval(); // Start next interval
      }
    }, 1000);
  }
  
  // Attach event listener to the start button
  document.getElementById("start-timer").addEventListener("click", () => {
    const workMinutes = parseInt(document.getElementById("work-minutes").value, 10);
    const breakMinutes = parseInt(document.getElementById("break-minutes").value, 10);
  
    if (isNaN(workMinutes) || isNaN(breakMinutes) || workMinutes <= 0 || breakMinutes <= 0) {
      alert("Please enter valid positive numbers for work and break durations.");
      return;
    }
  
    isPaused = false; // Ensure timer starts unpaused
    timer(workMinutes, breakMinutes);
  });
  
  // Attach event listener to the stop button
  document.getElementById("stop-timer").addEventListener("click", () => {
    const stopButton = document.getElementById("stop-timer");
    if (isPaused) {
      resumeInterval();
      stopButton.innerText = "Pause Timer";
    } else {
      pauseInterval();
      stopButton.innerText = "Resume Timer";
    }
  });