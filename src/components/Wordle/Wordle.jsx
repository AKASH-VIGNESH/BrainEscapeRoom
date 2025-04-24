import React, { useState, useEffect, useRef } from "react";
import "./Wordle.css";
import { useNavigate } from "react-router-dom";
import rules from './wordle- rule.png';
import wordleBg from "../Assests/Ellipse11.png";
import illustration from "../Assests/download.png";
function Wordle() {
    const GAME_SETTINGS = {
        ANSWER_LENGTH: 5,
        MAX_GUESSES: 6,
        WORD_LIST: ["FEVER","BRISK","TOUCH","SHOUT","DRAFT","CROWN","QUIET","COUCH","POUND","COUNT","POUCH","POWER","CRAFT","USAGE","FOUND","BLANK","FETCH","BOARD","TIRED","THUMB","DRIVE","CRAMP","CLAIM","CLIMB","ANKLE","FLUTE","SHARP","WHEAT","CHASE","CRACK","LAYER"]
    };
    useEffect(()=>{
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
    },[])

    const navigate = useNavigate();

    const [showStats, setShowStats] = useState(false);

    function toggleStats() {
        setShowStats((prev) => !prev);
    }


    // State variables
    const [answer, setAnswer] = useState("");
    const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
    const [played, setPlayed] = useState(0);
    const [wins, setWins] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameBoard, setGameBoard] = useState([]); // Stores user guesses
    const [gameStatus, setGameStatus] = useState("playing"); // "playing", "won", "lost"

    // Refs
    const guessInputRef = useRef(null);
    const timerInterval = useRef(null);

    // Start the game
    function startGame() {
        const newAnswer = GAME_SETTINGS.WORD_LIST[Math.floor(Math.random() * GAME_SETTINGS.WORD_LIST.length)];
        setAnswer(newAnswer);
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

        const guess = guessInputRef.current.value.toUpperCase();
        if (guess.length !== GAME_SETTINGS.ANSWER_LENGTH) {
            alert(`Please enter a ${GAME_SETTINGS.ANSWER_LENGTH}-letter word.`);
            return;
        }
        guessInputRef.current.value = "";

        const newGameBoard = [...gameBoard];
        newGameBoard[currentGuessIndex] = guess;
        setGameBoard(newGameBoard);

        checkGuess(guess);

        setPlayed((prev) => prev + 1);

        if (guess === answer) {
            setWins((prev) => prev + 1);
            setCurrentStreak((prev) => prev + 1);
            setGameStatus("won");
            clearInterval(timerInterval.current);
            alert("🎉 Congratulations, you won!");
            localStorage.setItem("level", "2");
        } else if (currentGuessIndex < GAME_SETTINGS.MAX_GUESSES - 1) {
            setCurrentGuessIndex((prev) => prev + 1);
        } else {
            setCurrentStreak(0);
            setGameStatus("lost");
            clearInterval(timerInterval.current);
            alert(`❌ Game Over. The word was ${answer}.`);
            localStorage.setItem('level','null');
        }
    }

    // Check guess and assign colors
    function checkGuess(guess) {
        const result = Array(GAME_SETTINGS.ANSWER_LENGTH).fill("incorrect"); // Default to incorrect
        const answerLetterCounts = {};
        const guessLetterCounts = {};

        // Count occurrences of letters in the answer
        for (let letter of answer) {
            answerLetterCounts[letter] = (answerLetterCounts[letter] || 0) + 1;
        }

        // First pass: Identify correct positions
        for (let i = 0; i < GAME_SETTINGS.ANSWER_LENGTH; i++) {
            if (guess[i] === answer[i]) {
                result[i] = "correct";
                guessLetterCounts[guess[i]] = (guessLetterCounts[guess[i]] || 0) + 1;
            }
        }

        // Second pass: Identify misplaced letters
        for (let i = 0; i < GAME_SETTINGS.ANSWER_LENGTH; i++) {
            if (result[i] === "correct") continue; // Skip already correct letters

            if (answer.includes(guess[i]) && (guessLetterCounts[guess[i]] || 0) < answerLetterCounts[guess[i]]) {
                result[i] = "close";
                guessLetterCounts[guess[i]] = (guessLetterCounts[guess[i]] || 0) + 1;
            }
        }

        return result;
    }
    function exitNavi()
    {
        if(localStorage.getItem('level')==='2'||localStorage.getItem('level')==='null')
        {
            localStorage.setItem("round1Att",played);
            localStorage.setItem("round1Tim",formatTime(elapsedTime));
            navigate('/')
        }
    }

    return (
        <div className="wordle-container">
            <header>
                <h1 className="Wordle-title">Wordle</h1>
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
                                    <input type="text" maxLength="5" autoComplete="off" ref={guessInputRef} className="wordle-input" placeholder="enter your answer here" />
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
                                        <button onClick={()=>{exitNavi()}} className="close-stat">Exit game</button>
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

export default Wordle;
