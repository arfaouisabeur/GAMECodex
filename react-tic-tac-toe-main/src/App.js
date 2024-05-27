import React, { useState } from "react";
import { Board } from "./components/Board";
import { ResetButton } from "./components/ResetButton";
import { ScoreBoard } from "./components/ScoreBoard";
import './App.css';

const App = () => {
  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const [xPlaying, setXPlaying] = useState(true);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [scores, setScores] = useState({ xScore: 0, oScore: 0 });
  const [gameOver, setGameOver] = useState(false);

  const [questions] = useState([
    "Question 1: What is the capital of France?",
    "Question 2: What is 2 + 2?",
    "Question 3: What color is the sky?",
    // Add questions for all 9 boxes
  ]);

  const [questionShown, setQuestionShown] = useState(Array(9).fill(false));

  const expectedAnswers = [
    "Paris", // Answer to Question 1
    "4",     // Answer to Question 2
    "blue",  // Answer to Question 3
    // Add answers for all questions
  ];

  const handleBoxClick = (boxIdx) => {
    if (!questionShown[boxIdx]) {
      // Show the question
      setQuestionShown((prevQuestionShown) => {
        const updatedQuestionShown = [...prevQuestionShown];
        updatedQuestionShown[boxIdx] = true;
        return updatedQuestionShown;
      });
    } else {
      // Handle answering the question
      const userAnswer = window.prompt(questions[boxIdx]);
      const expectedAnswer = expectedAnswers[boxIdx];

      if (userAnswer && userAnswer.toLowerCase() === expectedAnswer.toLowerCase()) {
        // Correct answer
        setQuestionShown((prevQuestionShown) => {
          const updatedQuestionShown = [...prevQuestionShown];
          updatedQuestionShown[boxIdx] = false;
          return updatedQuestionShown;
        });

        // Update the board
        const updatedBoard = board.map((value, idx) => {
          if (idx === boxIdx) {
            return xPlaying ? "X" : "O";
          } else {
            return value;
          }
        });

        setBoard(updatedBoard);

        // Check for a winner
        const winner = checkWinner(updatedBoard);
        if (winner) {
          if (winner === "O") {
            let { oScore } = scores;
            oScore += 1;
            setScores({ ...scores, oScore });
          } else {
            let { xScore } = scores;
            xScore += 1;
            setScores({ ...scores, xScore });
          }
        }

        // Switch players
        setXPlaying(!xPlaying);
      } else {
        alert("Incorrect answer. Try again.");
      }
    }
  };

  const checkWinner = (board) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [x, y, z] = WIN_CONDITIONS[i];

      if (board[x] && board[x] === board[y] && board[y] === board[z]) {
        setGameOver(true);
        return board[x];
      }
    }
  };

  const resetBoard = () => {
    setGameOver(false);
    setBoard(Array(9).fill(null));
    setQuestionShown(Array(9).fill(false));
  };

  return (
    <div className="App">
      <ScoreBoard scores={scores} xPlaying={xPlaying} />
      <Board
        board={board}
        questions={questions}
        questionShown={questionShown}
        onClick={gameOver ? resetBoard : handleBoxClick}
      />
      <ResetButton resetBoard={resetBoard} />
    </div>
  );
};

export default App;