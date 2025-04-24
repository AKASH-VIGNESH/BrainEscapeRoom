// Game Settings
const GAME_SETTINGS = {
    ANSWER_LENGTH: 5,
    MAX_GUESSES: 6,
    WORD_LIST: [
        "HOUSE",
        "STAMP",
        "FABLE",
        "KNIFE",
        "LEMON",
        "SPACE",
        "GRAVE",
        "SLATE",
        "SPEAR",
        "BRAID"
    ],
    elapsedTime: 0
};

// Randomly select a word from the list
const ANSWER = GAME_SETTINGS.WORD_LIST[Math.floor(Math.random() * GAME_SETTINGS.WORD_LIST.length)];

// Game State
let currentState = {
    currentGuess: 0,
    played: 0,
    wins: 0,
    currentStreak: 0
};

// DOM Elements
const DOM_ELEMENTS = {
    gameBoard: document.querySelector(".game-board"),
    guessInput: document.getElementById("guess-input"),
    submitBtn: document.getElementById("submit-btn"),
    statsBtn: document.getElementById("stats-btn"),
    statsModal: document.getElementById("stats-modal"),
    closeStatsBtn: document.getElementById("close-stats-btn"),
    playCountSpan: document.getElementById("played"),
    startGameBtn: document.getElementById("start-game-btn"),
    timerDisplay: document.getElementById("elapsed-time"),
    totalTime: document.getElementById("total-playtime-display"),
};

let startTime; // Variable to hold the start time
let intervalId; // To store the interval ID for clearing

// Function to format time for display
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Function to update the timer display
function updateTimer() {
    GAME_SETTINGS.elapsedTime = Math.floor((new Date() - startTime) / 1000);
    DOM_ELEMENTS.timerDisplay.innerText = formatTime(GAME_SETTINGS.elapsedTime);
}

// Initialize Game Board
function initializeGameBoard() {
    for (let i = 0; i < GAME_SETTINGS.MAX_GUESSES; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < GAME_SETTINGS.ANSWER_LENGTH; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            row.appendChild(tile);
        }
        DOM_ELEMENTS.gameBoard.appendChild(row);
    }
}

// Function to Handle Guess Submission
function submitGuess() {
    const guess = DOM_ELEMENTS.guessInput.value.toUpperCase();
    if (guess.length !== GAME_SETTINGS.ANSWER_LENGTH) {
        alert(`Please enter a ${GAME_SETTINGS.ANSWER_LENGTH}-letter word.`);
        return;
    }
    DOM_ELEMENTS.guessInput.value = ""; // Clear input field

    const currentRow = DOM_ELEMENTS.gameBoard.children[currentState.currentGuess];
    const tiles = currentRow.children;

    let correctCount = 0;
    const answerLetterCounts = {}; // Count occurrences of each letter in ANSWER
    const guessLetterCounts = {}; // Track letters used from ANSWER in guess

    // Populate answerLetterCounts with how many times each letter appears in ANSWER
    for (let letter of ANSWER) {
        answerLetterCounts[letter] = (answerLetterCounts[letter] || 0) + 1;
    }

    // First pass: Check for correct positions (green)
    for (let i = 0; i < GAME_SETTINGS.ANSWER_LENGTH; i++) {
        const tile = tiles[i];
        tile.innerText = guess[i];

        if (guess[i] === ANSWER[i]) {
            tile.classList.add("correct"); // Green
            correctCount++;
            guessLetterCounts[guess[i]] = (guessLetterCounts[guess[i]] || 0) + 1;
        }
    }

    // Second pass: Check for misplaced letters (yellow) without exceeding ANSWER count
    for (let i = 0; i < GAME_SETTINGS.ANSWER_LENGTH; i++) {
        const tile = tiles[i];

        if (!tile.classList.contains("correct") && ANSWER.includes(guess[i])) {
            if ((guessLetterCounts[guess[i]] || 0) < answerLetterCounts[guess[i]]) {
                tile.classList.add("close"); // Yellow
                guessLetterCounts[guess[i]] = (guessLetterCounts[guess[i]] || 0) + 1;
            } else {
                tile.classList.add("incorrect"); // Gray
            }
        } else if (!tile.classList.contains("correct")) {
            tile.classList.add("incorrect"); // Gray for incorrect letters
        }
    }

    // Update Statistics
    currentState.played++;
    updateStatistics();

    if (correctCount === GAME_SETTINGS.ANSWER_LENGTH) {
        currentState.wins++;
        currentState.currentStreak++;
        updateStatistics();
        alert("Congratulations, you've won!");
        clearInterval(intervalId); // Stop timer
    } else if (currentState.currentGuess < GAME_SETTINGS.MAX_GUESSES - 1) {
        currentState.currentGuess++; // Move to next guess
    } else {
        currentState.currentStreak = 0; // Reset streak on loss
        updateStatistics();
        alert(`Game Over. The word was ${ANSWER}.`);
        clearInterval(intervalId); // Stop timer
    }
}


// Update Statistics Display
function updateStatistics() {
    DOM_ELEMENTS.playCountSpan.innerText = currentState.played;
    
    DOM_ELEMENTS.totalTime.innerText = formatTime(GAME_SETTINGS.elapsedTime);
}

// ... (rest of the code remains the same)

// Function to start the game
function startGame() {
    initializeGameBoard();
    startTime = new Date();
    intervalId = setInterval(updateTimer, 1000); // Update every second
    DOM_ELEMENTS.startGameBtn.style.display = "none"; // Hide the start button
    DOM_ELEMENTS.guessInput.focus(); // Focus on the input field
}

// Add event listener to the start game button
DOM_ELEMENTS.startGameBtn.addEventListener("click", startGame);

// Add event listener to the submit button
DOM_ELEMENTS.submitBtn.addEventListener("click", submitGuess);

// Add event listener to the stats button
DOM_ELEMENTS.statsBtn.addEventListener("click", function () {
    DOM_ELEMENTS.statsModal.style.display = "block";
});

// Add event listener to the close stats button
DOM_ELEMENTS.closeStatsBtn.addEventListener("click", function () {
    DOM_ELEMENTS.statsModal.style.display = "none";
});
