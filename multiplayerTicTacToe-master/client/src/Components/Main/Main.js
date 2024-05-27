import { useEffect, useState } from "react";
import Cell from "../Cell/Cell";
import "./Main.css";

const Main = ({ socket, roomCode }) => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [canPlay, setCanPlay] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const questions = [
    {
    question: "a=...(input("+"donner un entier : "+"))\n\nfinish the line in order to get an integer stored in a\n\nWe can change the variable type by putting the name of the type in fron of it\nE.g : str() changes the type to a string, int() to an integer, float() to a float... etc"
    ,answer: "int",
    },
    {
      question: "x = "+"abc"+" \nh= x[::-1] \nprint(h) \n\nWhat is the output ?\n\nHint : R = hello[::-1] will go through R= olloh char by char and add the selected char to the new string R",
      answer: "cba",
    },
    {
      question: "L=[2,5,25,39,9,1,5,34] \n\nin one line, how can i print the smallest value stored in L ? \n\nmin is a python function that takes an array, list or tuple of integers, floats or doubles as an input and returns its smallest value \n\nE.g.: min([5,9,4,2])  returns 2 as an output",
      answer: "print(min(L))",
    },
    {
      question: "L=[1,5,6,7,1,2]\n\nWright one line of code to remove the 2nd 1 from the list ?\n\nmy_list.pop() :Removes the last element from my_list.\nmy_list.remove(n) : removes the first occurence of the element n in my_list.\ndel my_list[2] : Removes the element with index 2 from my_list ",
      answer: "del L[4]",
    },
    {
      
      question: "x=int(input("+"Donner une nombre"+"))\na=int(input("+"Donner une puissance"+")) \nfor i in range (1,a) :\n   x=x*a\n\nHow can replace this in one line ?\n\n Hint:  5**3=125",
      answer: "x**a",
    },
    {
      question: "def absolute(n):\n   if (n<0)\n      return (-n)\n    else:\n      return (n)\nprint(absolute(-7))\n\nReplace this code in one line\n\nabs is a predefined python function that takes an integer, float or double as an input and returns its absolute value. ",
      answer: "print(abs(-7))",
    },
    {
      question: "L=[5,6,1,6,8,2,4,7,9,3,4,1]\n\nIn one line, Calculate and print the average of these numbers\n\nSum is a function that takes a list of numerics as an input and returns the sum of them as an output\nlen is a function that takes a list and returns its lenght as an output",
      answer: "print(sum(L)/len(L)",
    },
    {
      question: "def area(...,...):\n  return a*b\n\nGive th e parameters of this function",
      answer: "a,b",
    },
    {
      question: "L=[2,5,25,39,9,1,5,34] \n\nin one line, how can i print the smallest value stored in L ? \n\nmin is a python function that takes an array, list or tuple of integers, floats or doubles as an input and returns its smallest value \n\nE.g.: min([5,9,4,2])  returns 2 as an output",
      answer: "print(min(L))",
    }
    
  ];

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [cellIndex, setCellIndex] = useState(null);

  const checkWinCondition = (player) => {
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return true;
      }
    }
    return false;
  };

  const updateScore = (player) => {
    const newScores = { ...scores };
    newScores[player]++;
    setScores(newScores);
  };

  const resetBoard = () => {
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setWinner(null);
    setCanPlay(true);
  };

  useEffect(() => {
    socket.on("updateGame", (id) => {
      if (winner) return;

      const updatedBoard = [...board];
      updatedBoard[id] = "O";
      setBoard(updatedBoard);
      setCanPlay(true);

      if (checkWinCondition("O")) {
        setWinner("O");
        updateScore("O");
        return;
      }

      if (updatedBoard.indexOf("") === -1) {
        setWinner("Tie");
        return;
      }

      const question = questions[id];
      setCurrentQuestion(question);
      setCellIndex(id);
    });

    return () => socket.off("updateGame");
  }, [board, socket, winner, scores, questions]);

  useEffect(() => {
    const winnerCheckInterval = setInterval(() => {
      if (!winner) {
        if (checkWinCondition("X")) {
          setWinner("X");
          updateScore("X");
        } else if (checkWinCondition("O")) {
          setWinner("O");
          updateScore("O");
        }
  
        if (board.indexOf("") === -1 && !winner) {
          setWinner("Tie");
        }
      }
    }, 100);
  
    return () => clearInterval(winnerCheckInterval);
  }, [winner, board]);

  const handleCellClick = (e) => {
    if (winner) return;

    const id = e.currentTarget.id;
    if (canPlay && board[id] === "") {
      const question = questions[id];
      
      if (question) {
       
        const userAnswer = window.prompt(question.question);

        if (userAnswer !== null) {
          if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
            const updatedBoard = [...board];
            updatedBoard[id] = "X";
            setBoard(updatedBoard);
            socket.emit("play", { id, roomCode });
          } else {
            alert("Incorrect answer. Try again.");
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="res">
        <div className="scores">
          <p>Your Score: {scores.X}</p>
          <p>Other Player Score: {scores.O}</p>
        </div>
        {winner && (
          <div className="win">
            {winner === "Tie" ? (
              <p>It's a Tie!</p>
            ) : (
              <p>Winner: {winner}</p>
            )}
            <button onClick={resetBoard}>Restart Game</button>
          </div>
        )}
      </div>
      <main>
        <section className="main-section">
          <Cell
            handleCellClick={handleCellClick}
            id={"0"}
            text={board[0]}
          />
          <Cell
            handleCellClick={handleCellClick}
            id={"1"}
            text={board[1]}
          />
          <Cell
            handleCellClick={handleCellClick}
            id={"2"}
            text={board[2]}
          />
          <Cell
            handleCellClick={handleCellClick}
            id={"3"}
            text={board[3]}
          />
          <Cell
            handleCellClick={handleCellClick}
            id={"4"}
            text={board[4]}
          />
          <Cell
            handleCellClick={handleCellClick}
            id={"5"}
            text={board[5]}
          />
          <Cell
            handleCellClick={handleCellClick}
            id={"6"}
            text={board[6]}
          />
          <Cell
            handleCellClick={handleCellClick}
            id={"7"}
            text={board[7]}
          />
          <Cell
            handleCellClick={handleCellClick}
            id={"8"}
            text={board[8]}
          />
        </section>
      </main>

    </div>
  );
};

export default Main;
