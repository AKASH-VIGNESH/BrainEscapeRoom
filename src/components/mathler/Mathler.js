import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import rules from '../Assests/mathler-rule.png';
import wordleBg from "../Assests/Ellipse11.png";
import illustration from "../Assests/download.png";
function Mathler() {
    const GAME_SETTINGS = {
        ANSWER_LENGTH: 6,
        MAX_GUESSES: 6,
        WORD_LIST: [
            {
                question: "Find the hidden calculation that equals 27",
                answer: ["5", "6", "/", "2", "-", "1"]
            },
            {
                question: "Find the hidden calculation that equals 66",
                answer: ["6", "0", "+", "9", "-", "3"]
            },
            {
                question: "Find the hidden calculation that equals 72",
                answer: ["1", "0", "0", "-", "2", "8"]
            },
            {
                question: "Find the hidden calculation that equals 54",
                answer: ["9", "0", "/", "2", "+", "9"]
            },
            {
                question: "Find the hidden calculation that equals 89",
                answer: ["1", "5", "*", "6", "-", "1"]
            },
            {
                question: "Find the hidden calculation that equals 33",
                answer: ["9", "0", "/", "3", "+", "3"]
            },
            {
                question: "Find the hidden calculation that equals 87",
                answer: ["3", "0", "*", "3", "-", "3"]
            },
            {
                question: "Find the hidden calculation that equals 19",
                answer: ["1", "0", "*", "2", "-", "1"]
            },
            {
                question: "Find the hidden calculation that equals 51",
                answer: ["5", "1", "0", "/", "1", "0"]
            },
            {
                question: "Find the hidden calculation that equals 73",
                answer: ["7", "5", "*", "1", "-", "2"]
            },
            {
                question: "Find the hidden calculation that equals 8248",
                answer: ["2", "0", "6", "2", "*", "4"]
            },
            {
                question: "Find the hidden calculation that equals 132",
                answer: ["7", "0", "*", "2", "-", "8"]
            },
            {
                question: "Find the hidden calculation that equals 121",
                answer: ["4", "0", "*", "3", "+", "1"]
            },
            {
                question: "Find the hidden calculation that equals 17",
                answer: ["4", "0", "/", "2", "-", "3"]
            },
            {
                question: "Find the hidden calculation that equals 109",
                answer: ["5", "1", "*", "2", "+", "7"]
            },
            {
                question: "Find the hidden calculation that equals 49",
                answer: ["2", "2", "*", "2", "+", "5"]
            },
            {
                question: "Find the hidden calculation that equals 75",
                answer: ["4", "2", "*", "2", "-", "9"]
            },
            {
                question: "Find the hidden calculation that equals 81",
                answer: ["3", "0", "*", "3", "-", "9"]
            },
            {
                question: "Find the hidden calculation that equals 67",
                answer: ["7", "0", "*", "1", "-", "3"]
            },
            {
                question: "Find the hidden calculation that equals 93",
                answer: ["1", "8", "*", "5", "+", "3"]
            },
        ]
    };
    useEffect(() => {
        document.addEventListener("contextmenu", (event) => event.preventDefault());
        document.addEventListener("keydown", (event) => {
            if (
                event.ctrlKey &&
                (event.key === "u" || event.key === "U" || event.key === "i" || event.key === "I" || event.key === "j" || event.key === "J")
            ) {
                event.preventDefault();
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "F12") {
                event.preventDefault();
            }
        });

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                window.location.href = "about:blank"; // Redirect to a blank page
            }
        });
    }, [])

    const navigate = useNavigate();

    const [showStats, setShowStats] = useState(false);

    function toggleStats() {
        setShowStats((prev) => !prev);
    }


    // State variables
    const [answer, setanswer] = useState("");
    const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
    const [played, setPlayed] = useState(0);
    const [wins, setWins] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameBoard, setGameBoard] = useState([]); // Stores user guesses
    const [gameStatus, setGameStatus] = useState("playing"); // "playing", "won", "lost"
    const [index, setindex] = useState(0);
    const [question, setquestion] = useState("");

    // Refs
    const guessInputRef = useRef(null);
    const timerInterval = useRef(null);

    // Start the game
    function startGame() {
        let indexvalue = Math.floor(Math.random() * 10);
        let newQuestion = GAME_SETTINGS.WORD_LIST[indexvalue].question;
        let newAnswer = GAME_SETTINGS.WORD_LIST[indexvalue].answer;
        setquestion(newQuestion);
        setanswer(newAnswer);
        setindex(indexvalue);
        setIsGameStarted(true);
        setElapsedTime(0);
        setCurrentGuessIndex(0);
        setGameBoard(Array(GAME_SETTINGS.MAX_GUESSES).fill("")); // Empty board
        setGameStatus("playing");

        setTimeout(() => {
            if (guessInputRef.current) guessInputRef.current.focus();
        }, 100);
    }

    // Timer Effect
    useEffect(() => {
        if (isGameStarted) {
            timerInterval.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerInterval.current);
    }, [isGameStarted]);

    // Format Timer
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    // Submit a guess
    function submitGuess() {
        if (!guessInputRef.current) return;
    
        const guess = guessInputRef.current.value.split(""); // Convert input to array
        if (guess.length !== answer.length) {
            alert(`Please enter a ${answer.length}-element expression.`);
            return;
        }
        guessInputRef.current.value = "";
    
        const newGameBoard = [...gameBoard];
        newGameBoard[currentGuessIndex] = guess;
        setGameBoard(newGameBoard);
    
        setPlayed((prev) => prev + 1);
    
        if (guess.join("") === answer.join("")) { // Compare array as string
            setWins((prev) => prev + 1);
            setCurrentStreak((prev) => prev + 1);
            setGameStatus("won");
            clearInterval(timerInterval.current);
            alert("🎉 Congratulations, you won!");
            localStorage.setItem("level", "3");
        } else if (currentGuessIndex < GAME_SETTINGS.MAX_GUESSES - 1) {
            setCurrentGuessIndex((prev) => prev + 1);
        } else {
            setCurrentStreak(0);
            setGameStatus("lost");
            clearInterval(timerInterval.current);
            alert(`❌ Game Over. The answer was ${answer.join("")}.`);
            localStorage.setItem("level", "null");
        }
    }
    

    // Check guess and assign colors
    function checkGuess(guess) {
        const answerLength = answer.length;
        const result = Array(answerLength).fill("incorrect"); // Default to incorrect
        const answerLetterCounts = {};
        const guessLetterCounts = {};
    
        // Count occurrences of letters in the answer
        for (let letter of answer) {
            answerLetterCounts[letter] = (answerLetterCounts[letter] || 0) + 1;
        }
    
        // First pass: Identify correct positions
        for (let i = 0; i < answerLength; i++) {
            if (guess[i] === answer[i]) {
                result[i] = "correct";
                guessLetterCounts[guess[i]] = (guessLetterCounts[guess[i]] || 0) + 1;
            }
        }
    
        // Second pass: Identify misplaced letters
        for (let i = 0; i < answerLength; i++) {
            if (result[i] === "correct") continue; // Skip already correct letters
    
            if (answer.includes(guess[i]) && (guessLetterCounts[guess[i]] || 0) < answerLetterCounts[guess[i]]) {
                result[i] = "close";
                guessLetterCounts[guess[i]] = (guessLetterCounts[guess[i]] || 0) + 1;
            }
        }
    
        return result;
    }
    
    function exitNavi() {
        if (localStorage.getItem('level') === '3' || localStorage.getItem('level') === 'null') {
            localStorage.setItem("round2Att", played);
            localStorage.setItem("round2Tim", formatTime(elapsedTime));
            navigate('/')
        }
    }

    return (
        <div className="wordle-container">
            <header>
                <h1 className="Wordle-title">MAthler</h1>
            </header>

            <main>
                {!isGameStarted ? (
                    <>
                        <img src={rules} alt="" className="rules-img"></img><br />
                        <button className="start-button" onClick={startGame}>
                            Start game
                        </button>
                        <br />
                        <img src={wordleBg} alt="" className="worldle-background" />
                    </>

                ) : (
                    <>
                        <div className="question-div" id="question">
                            <h2 className="math-question">{question}</h2>
                        </div>
                        < div className="wordle-flex">
                            <div className="game-board">
                                {gameBoard.map((guess, rowIndex) => (
                                    <div key={rowIndex} className="row">
                                        {Array(GAME_SETTINGS.ANSWER_LENGTH).fill("").map((_, colIndex) => {
                                            const letter = guess[colIndex] || "";
                                            const className = guess
                                                ? checkGuess(guess)[colIndex]
                                                : "";
                                            return (
                                                <div key={colIndex} className={`tile ${className}`}>
                                                    {letter}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                            {gameStatus === "playing" && (
                                <div className="input-wordle-outer">
                                    <input type="text" maxLength="6" autoComplete="off" ref={guessInputRef} className="wordle-input" placeholder="enter your answer here" />
                                    <button className="submit-button" onClick={submitGuess}>Submit</button>
                                </div>
                            )}
                            <div className="timer-stats">
                                <button className="stats-button" onClick={toggleStats}>view Stats</button>

                                {showStats && (
                                    <div className="stats-popup">
                                        <h1 className="greetings">Congratulations!</h1>
                                        <div>
                                            <img src={illustration} alt="" className="greet-img" />
                                        </div>
                                        <div className="greet-content-outer">
                                            <div className="greet-content">
                                                <h3 className="greet-content-head">duration</h3>
                                                <h2 className="greet-content-value">{formatTime(elapsedTime)}</h2>
                                            </div>
                                            <div className="greet-content">
                                                <h3 className="greet-content-head">Attempt</h3>
                                                <h2 className="greet-content-value">{played}</h2>
                                            </div>
                                        </div>
                                        <button onClick={toggleStats} className="close-stat">Close</button>
                                        <button onClick={() => { exitNavi() }} className="close-stat">Exit game</button>
                                    </div>
                                )}

                                <span className="timer">
                                    <span className="time-clock">{formatTime(elapsedTime)}</span>
                                </span>
                            </div>
                        </div>
                        <div className="wordly-footer">
                            <img src={rules} alt="" className="wordle-ingame-rule" />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Mathler;