import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBookmark } from "react-icons/fa6";
import parse from "html-react-parser";
import axios from "axios";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import "./Questions.css"; // reuse existing styling
import { API_BASE } from "../Config";

function StartTest() {
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [timeLeft, setTimeLeft] = useState(null);

  const questionsPerPage = 5;

  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { selectedTopics, questionCount, testDuration } = location.state || {};

  useEffect(() => {
    if (!selectedTopics || selectedTopics.length === 0 || !questionCount) {
      alert("Invalid test setup. Please configure again.");
      navigate("/ManualTestSetup");
      return;
    }

    fetchQuestions();
    if (location.state?.startTime && location.state?.testDuration) {
    const end = new Date(location.state.startTime);
    end.setMinutes(end.getMinutes() + parseInt(location.state.testDuration));

    const interval = setInterval(() => {
        const now = new Date();
        const diff = Math.max(0, Math.floor((end - now) / 1000)); // in seconds

        if (diff === 0) {
        clearInterval(interval);
        alert("Time's up!");
        // Optional: auto-submit logic
        }

        setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
    }

    if (user) fetchBookmarkedQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // const res = await axios.post("http://localhost:8081/get-questions-for-test", {
      //   topicIds: selectedTopics,
      //   questionCount: parseInt(questionCount)
      // });
      const res = await axios.post(`${API_BASE}/get-questions-for-test`, {
        topicIds: selectedTopics,
        questionCount: parseInt(questionCount)
      });
      setQuestions(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching test questions:", err);
    }
  };

  const fetchBookmarkedQuestions = async () => {
    try {
      // const response = await axios.get(`http://localhost:8081/getBookmarks?user_id=${user.id}`);
      const response = await axios.get(`${API_BASE}/getBookmarks?user_id=${user.id}`);
      

      if (response.data.success) {
        const state = {};
        response.data.bookmarks.forEach(b => { state[b.question_id] = true; });
        setBookmarked(state);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  const handleOptionClick = (questionId, selectedOption, correctOption) => {
    const correctArray = correctOption?.split(",").map(opt => opt.trim().toUpperCase()) || [];
    setSelectedOptions(prev => {
      const current = prev[questionId] ? [...prev[questionId]] : [];
      const index = current.indexOf(selectedOption);

      if (index > -1) current.splice(index, 1);
      else current.push(selectedOption);

      const hasWrong = current.some(opt => !correctArray.includes(opt));
      const hasAllCorrect = correctArray.every(opt => current.includes(opt)) && current.length === correctArray.length;

      setShowExplanation(prevExp => ({
        ...prevExp,
        [questionId]: hasWrong || hasAllCorrect
      }));

      return { ...prev, [questionId]: current };
    });
  };

  const handleBookmark = async (questionId) => {
    if (!user) {
      alert("You must be logged in to bookmark.");
      return;
    }

    const isBookmarked = bookmarked[questionId];

    try {
      if (isBookmarked) {
        // await axios.post("http://localhost:8081/removeBookmark", { user_id: user.id, question_id: questionId });
        await axios.post(`${API_BASE}/removeBookmark`, { user_id: user.id, question_id: questionId });
        setBookmarked(prev => {
          const updated = { ...prev };
          delete updated[questionId];
          return updated;
        });
      } else {
        // await axios.post("http://localhost:8081/bookmark", { user_id: user.id, question_id: questionId });
        await axios.post(`${API_BASE}/bookmark`, { user_id: user.id, question_id: questionId });
        setBookmarked(prev => ({ ...prev, [questionId]: true }));
      }
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <div className="questions-container">
      <h2 className="topic-heading">Manual Test</h2>
      {timeLeft !== null && (
            <p className="timer">
                ⏳ Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </p>
        )}


      {currentQuestions.map((q, index) => (
        <div key={q.id} className="question-box">
          <div className="quesAndBookmark">
            <p className="question-text">
              <b>Q{indexOfFirst + index + 1}:</b> {parse(q.question_text)}
            </p>
            {user && (
              <FaBookmark
                onClick={() => handleBookmark(q.id)}
                style={{ cursor: "pointer", color: bookmarked[q.id] ? "black" : "gray" }}
              />
            )}
          </div>

          {q.code && (
            <div className="code-snippet">
              <SyntaxHighlighter language="cpp" style={vscDarkPlus}>
                {q.code}
              </SyntaxHighlighter>
            </div>
          )}

          <ul className="options-list">
            {["A", "B", "C", "D"].map(opt => {
              const isSelected = selectedOptions[q.id]?.includes(opt);
              const correctArray = q.correct_option?.split(",").map(o => o.trim().toUpperCase()) || [];
              const isCorrect = correctArray.includes(opt);
              const hasWrong = selectedOptions[q.id]?.some(o => !correctArray.includes(o));
              const hasAllCorrect = correctArray.every(o => selectedOptions[q.id]?.includes(o)) && selectedOptions[q.id]?.length === correctArray.length;

              let optionClass = "";
              if (hasWrong || hasAllCorrect) {
                optionClass = isSelected && isCorrect ? "correct" :
                              isSelected && !isCorrect ? "wrong" : "";
              } else if (isSelected) {
                optionClass = "selected";
              }

              return (
                <li key={opt} className={`option-item ${optionClass}`} onClick={() => handleOptionClick(q.id, opt, q.correct_option)}>
                  {opt}. {q[`option_${opt.toLowerCase()}`]}
                </li>
              );
            })}
          </ul>

          {showExplanation[q.id] && (
            <div className="explanation-box">
              <p><strong>Correct Answer:</strong> {q.correct_option}</p>
              <p>{parse(q.explanation)}</p>
              {q.youtube_link && (
                <a href={q.youtube_link} target="_blank" rel="noopener noreferrer">Watch Explanation</a>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>Previous</button>
        <span className="page-numbers">
          {Array.from({ length: totalPages }, (_, idx) => (
            <span
              key={idx + 1}
              className={currentPage === idx + 1 ? "current-page" : ""}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </span>
          ))}
        </span>
        <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default StartTest;