import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBoxColor } from "../utils/getBoxColour";
import "./Wordle.css";

const API_URL = 'http://127.0.0.1:8000/api/games/'; // Configure this in env file
const randomGameId = Math.floor(Math.random() * 10) + 1;

const WordleGame = () => {
  const [word, setWord] = useState("");
  const [guess_word, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [guesses, setGuesses] = useState([]);

    // console.log("Random game id is :", randomGameId);

  useEffect(() => {
    axios
      .get(`${API_URL}${randomGameId}/`)
      .then((response) => {
        // console.log("Wordle word is: ", response.data);
        setWord(response.data.word);
      })
      .catch((error) => {
        console.error("There was an error fetching the word!", error);
        setFeedback(error?.response?.data?.error);
      });
  }, []);

  const handleInputChange = (e) => {
    setGuess(e.target.value);
  };

  const handleSubmitGuess = () => {
    if (guess_word.length === word.length) {
      axios
        .post(`${API_URL}${randomGameId}/make_guess/`, {
          guess_word,
          word,
        })
        .then((response) => {
        //   console.log("Response after guess", response);
          const feedback = response.data?.feedback;
          setFeedback(feedback);
          setGuesses((prevGuesses) => [
            ...prevGuesses,
            { guess: guess_word, feedback },
          ]);
          if (feedback === "GGGGG") {
            setIsGameOver(true);
          }
        })
        .catch((error) => {
          console.error("There was an error submitting the guess!", error);
          //setFeedback(error?.response?.data?.error);
          alert(`${error?.response?.data?.error}`);
        });
    } else {
      alert(`Your guess must be ${word.length} letters.`);
    }
  };

  return (
    <div>
      <div className="guess-box">
        {guesses.map((guess, idx) => (
          <div key={idx} className="guess-box-item">
            {guess.guess.split("").map((letter, index) => (
              <div
                key={index}
                className="box-color"
                style={{
                  backgroundColor: getBoxColor(letter, index, guess.feedback),
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Guess"
          value={guess_word}
          onChange={handleInputChange}
          maxLength={word.length}
          disabled={isGameOver}
          style={{
            fontSize: "16px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSubmitGuess}
          disabled={isGameOver}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "#fff",
          }}
        >
          Submit
        </button>
      </div>
      {/* {feedback && (
                <div>
                    <h3>Result:</h3>
                    <h4>{JSON.stringify(feedback, null, 2)}</h4>
                </div>
            )} */}
      {isGameOver && <h2>You Won!</h2>}
    </div>
  );
};

export default WordleGame;
