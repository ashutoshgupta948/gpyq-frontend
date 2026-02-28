import React, { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa6";
import parse from "html-react-parser";
import axios from "axios";
import "./Questions.css";
import { API_BASE } from "../Config";

function RandomQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch a random question when page loads
  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  // ✅ Fetch a new random question
  const fetchRandomQuestion = () => {
    axios.get("http://127.0.0.1:8081/getRandomQuestion")
      .then((res) => {
        setQuestion(res.data);
        setSelectedOptions([]); // Reset selections
        setShowExplanation(false);
        if (user) checkIfBookmarked(res.data.id);
      })
      .catch((err) => console.error("Error fetching question:", err));
  };

  // ✅ Handle option selection
  const handleOptionClick = (selectedOption) => {
    const correctOptionsArray = question.correct_option
      ? question.correct_option.split(",").map(opt => opt.trim().toUpperCase())
      : [];

    const updatedSelection = [...selectedOptions];

    if (updatedSelection.includes(selectedOption)) {
      updatedSelection.splice(updatedSelection.indexOf(selectedOption), 1);
    } else {
      updatedSelection.push(selectedOption);
    }

    const hasWrongSelection = updatedSelection.some(opt => !correctOptionsArray.includes(opt));
    const hasAllCorrect = correctOptionsArray.every(opt => updatedSelection.includes(opt)) &&
                          updatedSelection.length === correctOptionsArray.length;

    setShowExplanation(hasAllCorrect || hasWrongSelection);
    setSelectedOptions(updatedSelection);
  };

  // ✅ Check if question is already bookmarked
  const checkIfBookmarked = async (questionId) => {
    try {
      // const response = await axios.get(`http://localhost:8081/getBookmarks?user_id=${user.id}`);
      const response = await axios.get(`${API_BASE}/getBookmarks?user_id=${user.id}`);
      const bookmarkedIds = response.data.bookmarks.map(b => b.question_id);
      setBookmarked(bookmarkedIds.includes(questionId));
    } catch (error) {
      console.error("Error checking bookmark:", error);
    }
  };

  // ✅ Handle bookmarking
  const handleBookmark = async () => {
    if (!user) {
      alert("You must be logged in to bookmark questions.");
      return;
    }
    
    try {
      // const response = await axios.post("http://localhost:8081/bookmark", {
      //   user_id: user.id,
      //   question_id: question.id
      // });
      const response = await axios.post(`${API_BASE}/bookmark`, {
        user_id: user.id,
        question_id: question.id
      });

      if (response.data.success) {
        setBookmarked(true);
        alert("Question bookmarked successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Bookmark Error:", error);
      alert("Failed to bookmark question.");
    }
  };

  return (
    <div className="questions-container">
      <h2 className="topic-heading">Random Question</h2>

      {question ? (
        <div className="question-box">
          <div className="quesAndBookmark">
            <p className="question-text"> {question.question_text}</p>
            {user && (
              <FaBookmark
                onClick={handleBookmark}
                style={{ cursor: "pointer", color: bookmarked ? "black" : "gray" }}
              />
            )}
          </div>

          <ul className="options-list">
            {["A", "B", "C", "D"].map((optionKey) => {
              const optionValue = question[`option_${optionKey.toLowerCase()}`];
              const isSelected = selectedOptions.includes(optionKey);
              const correctOptionsArray = question.correct_option
                ? question.correct_option.split(",").map(opt => opt.trim().toUpperCase())
                : [];
              const isCorrect = correctOptionsArray.includes(optionKey);
              const hasWrongSelection = selectedOptions.some(opt => !correctOptionsArray.includes(opt));
              const hasAllCorrect = correctOptionsArray.every(opt => selectedOptions.includes(opt)) &&
                                    selectedOptions.length === correctOptionsArray.length;

              let optionClass = "";
              if (hasWrongSelection || hasAllCorrect) {
                if (isSelected && isCorrect) optionClass = "correct";
                else if (isSelected && !isCorrect) optionClass = "wrong";
              } else if (isSelected) {
                optionClass = "selected";
              }

              return (
                <li
                  key={optionKey}
                  className={`option-item ${optionClass}`}
                  onClick={() => handleOptionClick(optionKey)}
                >
                  {optionKey}. {optionValue}
                </li>
              );
            })}
          </ul>

          {showExplanation && (
            <div className="explanation-box">
              <p><b>Correct Answer:</b> {question.correct_option}</p>
              <p>{parse(question.explanation)}</p>
              {question.youtube_link && (
                <a href={question.youtube_link} target="_blank" rel="noopener noreferrer">
                  Watch Explanation
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Loading question...</p>
      )}
      
    <div className="button-container">
        <button className="fetch-random-btn" onClick={fetchRandomQuestion}>Next Random Question</button>
    </div>
    </div>
    
  );
}

export default RandomQuestion;