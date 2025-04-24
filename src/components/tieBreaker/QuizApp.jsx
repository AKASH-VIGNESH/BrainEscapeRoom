import { useState, useEffect } from "react";
import './quiz.css';

function QuizApp() {
  const maxAttempts = 4;
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(100);
  const [completed, setCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [index, setIndex] = useState(0);

  const aptitudeQuestions = [
    "A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    "If a + b = 12 and ab = 32, find the value of a² + b².",
    "The sum of three consecutive odd numbers is 45. Find the largest number.",
    "A shopkeeper offers a 10% discount on an item priced at $500. What is the selling price?",
    "If the cost price of an item is $200 and the profit is 25%, what is the selling price?",
    "A man can complete a work in 15 days. Another man can do the same work in 10 days. How long will they take to complete it together?",
    "A sum of money doubles itself in 5 years at simple interest. Find the rate of interest per annum.",
    "A car covers a distance of 120 km in 2 hours. What is its speed?",
    "A rectangular field has a length of 20m and a width of 15m. What is its area?",
    "If 5 people can complete a work in 20 days, how many people are needed to complete the same work in 5 days?",
    "The average of five numbers is 25. If one number is removed, the new average becomes 20. Find the removed number.",
    "A train crosses a bridge in 30 seconds. If the bridge is 200m long and the train is 100m long, find the speed of the train.",
    "A number when increased by 20% becomes 180. What is the original number?",
    "A fruit seller buys mangoes at 5 for $10 and sells them at 4 for $10. Find his profit percentage.",
    "If 40% of a number is 80, find the number.",
    "A cube has a volume of 216 cubic cm. Find its surface area.",
    "If the sum of the angles of a polygon is 1080°, how many sides does it have?",
    "A person buys 2 shirts for $300 each and sells one at a 10% loss and the other at a 20% profit. Find the overall gain or loss percentage.",
    "The LCM of two numbers is 120 and their HCF is 10. If one number is 40, find the other.",
    "The population of a town increases by 10% annually. If the present population is 10,000, what will it be after 2 years?"
  ];

  const aptitudeAnswers = [
    "150 meters", // Train length
    "112", // a² + b²
    "17", // Largest odd number
    "$450", // Discounted price
    "$250", // Selling price with profit
    "6 days", // Work completion together
    "20% per annum", // Simple interest rate
    "60 km/hr", // Speed calculation
    "300 square meters", // Area of the field
    "20 people", // Work completion in 5 days
    "45", // Removed number
    "36 km/hr", // Speed of train
    "150", // Original number
    "25%", // Profit percentage
    "200", // Number calculation
    "144 square cm", // Cube surface area
    "8", // Number of sides in polygon
    "5% profit", // Overall gain or loss percentage
    "30", // Other number using LCM & HCF
    "12,100", // Population after 2 years
  ];
  
  

  useEffect(() => {
    setIndex(Math.floor(Math.random() * aptitudeQuestions.length));
  }, []);

  useEffect(() => {
    if (started && timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCompleted(true);
    }
  }, [timeLeft, started, completed]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleSubmit = () => {
    if (completed) return;
    if (answer.trim().toLowerCase() === aptitudeAnswers[index].toLowerCase()) {
      setCompleted(true);
      setTimeTaken(60 - timeLeft);
    } else {
      setAttempts(attempts + 1);
      setScore(score - 25);
      alert("attempt used!");
      if (attempts + 1 >= maxAttempts) {
        setCompleted(true);
        setTimeTaken(60 - timeLeft);
      }
    }
  };

  return (
    <div>
      {!started ? (
        <div className="initial-start-tie">
            <button onClick={handleStart} className="startertie">Start Quiz</button>
        </div>
        
      ) : (
        <div>
          <h2>Question:</h2>
          <p>{aptitudeQuestions[index]}</p>
          <p>Time Left: {timeLeft}s</p>
          {!completed && (
            <>
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer here"
                className="input-field"
              />
              <button onClick={handleSubmit} className="button">Submit Answer</button>
            </>
          )}
          {completed && (
            <button onClick={() => alert(`Score: ${score}\nTime Taken: ${timeTaken}s`)}>
              View Stats
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizApp;
