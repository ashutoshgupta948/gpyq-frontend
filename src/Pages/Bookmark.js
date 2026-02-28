import React, { useState, useEffect } from 'react'
import { FaBookmark } from "react-icons/fa6";
import axios from "axios";
import parse from "html-react-parser";
import "./Questions.css";
import { API_BASE } from '../Config';

function Bookmark() {

    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showExplanation, setShowExplanation] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
          fetchBookmarkedQuestions();
        }
      }, []);

      const fetchBookmarkedQuestions = async () => {
        try {
          // const response = await axios.get(`http://localhost:8081/getBookmarkedQuestions?user_id=${user.id}`);
          const response = await axios.get(`${API_BASE}/getBookmarkedQuestions?user_id=${user.id}`);
          if (response.data.success) {
            setBookmarkedQuestions(response.data.questions);
          }
        } catch (error) {
          console.error("Error fetching bookmarked questions:", error);
        }
      };


  const handleOptionClick = (questionId, selectedOption, correctOption) => {
    const correctOptionsArray = correctOption
      ? correctOption.split(",").map(opt => opt.trim().toUpperCase())
      : [];

    setSelectedOptions((prev) => {
      const updatedSelection = prev[questionId] ? [...prev[questionId]] : [];

      if (updatedSelection.includes(selectedOption)) {
        updatedSelection.splice(updatedSelection.indexOf(selectedOption), 1);
      } else {
        updatedSelection.push(selectedOption);
      }

      const hasWrongSelection = updatedSelection.some(opt => !correctOptionsArray.includes(opt));
      const hasAllCorrect = correctOptionsArray.every(opt => updatedSelection.includes(opt)) &&
                            updatedSelection.length === correctOptionsArray.length;

      setShowExplanation((prev) => ({
        ...prev,
        [questionId]: hasAllCorrect || hasWrongSelection,
      }));

      return { ...prev, [questionId]: updatedSelection };
    });
  };

  const handleRemoveBookmark = async (questionId) => {
  try {
    // await axios.post("http://localhost:8081/removeBookmark", {
    //   user_id: user.id,
    //   question_id: questionId
    // });
    await axios.post(`${API_BASE}/removeBookmark`, {
      user_id: user.id,
      question_id: questionId
    });

    // Update the UI: remove the unbookmarked question from the list
    setBookmarkedQuestions(prev =>
      prev.filter(q => q.id !== questionId)
    );
  } catch (error) {
    console.error("Error removing bookmark:", error);
  }
};



  return (
    <div className="questions-container">
      <h2 className="topic-heading">Bookmarked Questions</h2>

      {bookmarkedQuestions.length > 0 ? (
        bookmarkedQuestions.map((q, index) => (
          <div key={index} className="question-box">
            <div className="quesAndBookmark">   
              <p className="question-text"><b>Ques {index + 1} :</b> {parse(q.question_text)} </p>
              <FaBookmark
                style={{ color: "Black", cursor: "pointer" }}
                title="Remove Bookmark"
                onClick={() => handleRemoveBookmark(q.id)}
              />
            </div>            
            
            <ul className="options-list">
              {["A", "B", "C", "D"].map((optionKey) => {
                const optionValue = q[`option_${optionKey.toLowerCase()}`];
                const isSelected = selectedOptions[q.id]?.includes(optionKey);
                const correctOptionsArray = q.correct_option
                  ? q.correct_option.split(",").map(opt => opt.trim().toUpperCase())
                  : [];
                const isCorrect = correctOptionsArray.includes(optionKey);
                const hasWrongSelection = selectedOptions[q.id]?.some(opt => !correctOptionsArray.includes(opt));
                const hasAllCorrect = correctOptionsArray.every(opt => selectedOptions[q.id]?.includes(opt)) &&
                                      selectedOptions[q.id]?.length === correctOptionsArray.length;

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
                    onClick={() => handleOptionClick(q.id, optionKey, q.correct_option)}
                  >
                    {optionKey}. {optionValue}
                  </li>
                );
              })}
            </ul>

            {showExplanation[q.id] && (
              <div className="explanation-box">
                <p><b>Correct Answer:</b> {q.correct_option}</p>
                <p>{q.explanation}</p>
                {q.youtube_link && (
                  <a href={q.youtube_link} target="_blank" rel="noopener noreferrer">
                    Watch Explanation
                  </a>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No bookmarked questions found.</p>
      )}
    </div>
  );
}
export default Bookmark