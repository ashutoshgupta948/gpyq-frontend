  import React, { useEffect, useState } from "react";
  import { useLocation } from "react-router-dom";
  import { FaBookmark } from "react-icons/fa6";
  import parse from "html-react-parser";
  import axios from "axios";
  import "./Questions.css";

  import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
  import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'; // light theme with white background
  import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { API_BASE } from "../Config";

  function QuestionsPage(question) {
    const [questions, setQuestions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showExplanation, setShowExplanation] = useState({});
    const [bookmarked, setBookmarked] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const topic = queryParams.get("topic");
    const subject = queryParams.get("subject");
    const year = queryParams.get("year");

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
      if (topic) {
        fetchQuestionsByTopic(topic);
      } else if (subject) {
        fetchQuestionsBySubject(subject);
      } else if (year) {
        fetchQuestionsByYear(year);
      }
      if (user) {
        fetchBookmarkedQuestions(); // ✅ Fetch bookmarks when user is logged in
      }
    }, []);
    
    const fetchQuestionsByTopic = async (topic) => {
      try {
        // const response = await fetch(`http://localhost:8081/questions?topic=${encodeURIComponent(topic)}`);
        const response = await fetch(`${API_BASE}/questions?topic=${encodeURIComponent(topic)}`);
        const data = await response.json();
        setQuestions(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    const fetchQuestionsBySubject = async (subject) => {
      try {
        // const response = await fetch(`http://localhost:8081/questions?subject=${encodeURIComponent(subject)}`);
        const response = await fetch(`${API_BASE}/questions?subject=${encodeURIComponent(subject)}`);
        const data = await response.json();
        setQuestions(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    const fetchQuestionsByYear = async (year) => {
      try {
        // const response = await fetch(`http://localhost:8081/questions?year=${encodeURIComponent(year)}`);
        const response = await fetch(`${API_BASE}/questions?year=${encodeURIComponent(year)}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setQuestions(data);  // ✅ Ensure it's an array
        } else {
          console.error("Invalid data format:", data);
          setQuestions([]); // Fallback to empty array
        }      
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]); // Prevents slice error
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

        // Show explanation when:
        // - The user selects ALL correct options
        // - OR at least one wrong option is selected
        setShowExplanation((prev) => ({
          ...prev,
          [questionId]: hasAllCorrect || hasWrongSelection,
        }));

        return { ...prev, [questionId]: updatedSelection };
      });
    };

  const handleBookmark = async (questionId) => {
    if (!user) {
      alert("You must be logged in to bookmark questions.");
      return;
    }

    const isBookmarked = bookmarked[questionId];

    try {
      if (isBookmarked) {
        // REMOVE BOOKMARK
        console.log("Trying to remove the question from the bookmark list");
        // const response = await axios.post("http://localhost:8081/removeBookmark", {
        //   user_id: user.id,
        //   question_id: questionId
        // });
        const response = await axios.post(`${API_BASE}/removeBookmark`, {
          user_id: user.id,
          question_id: questionId
        });

        if (response.data.success) {
          setBookmarked((prev) => {
            const updated = { ...prev };
            delete updated[questionId];
            return updated;
          });
          alert("Bookmark removed successfully!");
        } else {
          alert(response.data.message || "Failed to remove bookmark.");
        }

      } else {
        // ADD BOOKMARK
        // const response = await axios.post("http://localhost:8081/bookmark", {
        //   user_id: user.id,
        //   question_id: questionId
        // });
        const response = await axios.post(`${API_BASE}/bookmark`, {
          user_id: user.id,
          question_id: questionId
        });

        if (response.data.success) {
          setBookmarked((prev) => ({ ...prev, [questionId]: true }));
          alert("Question bookmarked successfully!");
        } else {
          alert(response.data.message || "Bookmark failed.");
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      alert("Something went wrong while updating bookmark.");
    }
  };

  // ✅ Fetch bookmarked questions from the database for the logged-in user
  const fetchBookmarkedQuestions = async () => {
    try {
      // const response = await axios.get(`http://localhost:8081/getBookmarks?user_id=${user.id}`);
      const response = await axios.get(`${API_BASE}/getBookmarks?user_id=${user.id}`);

      if (response.data.success) {
        const bookmarkedIds = response.data.bookmarks.map((b) => b.question_id); // ✅ Extract bookmarked question IDs

        // ✅ Update state to mark bookmarked questions in gold
        const bookmarkedState = {};
        bookmarkedIds.forEach((id) => {
          bookmarkedState[id] = true;
        });

        setBookmarked(bookmarkedState);
      }
    } catch (error) {
      console.error("Error fetching bookmarked questions:", error);
    }
  };

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const totalPages = Math.ceil(questions.length / questionsPerPage);

    return (
      <div className="questions-container">
        <h2 className="topic-heading">{topic || subject || year}</h2>

        {currentQuestions.length > 0 ? (
          currentQuestions.map((q, index) => (
            
            <div key={index} className="question-box">
              
              <div className="quesAndBookmark">   
                <p className="question-text"><b>Ques {indexOfFirstQuestion + index + 1} :</b> {parse(q.question_text)} </p>
                {user && (
                            <FaBookmark
                            
                            onClick={() => handleBookmark(q.id)}

                            style={{cursor:"pointer", color: bookmarked[q.id] ? "black" : "gray"}}
                            />
                          )}
              </div>

              {/* Showing code snippet if exists */}
              {q.code && (
                <div className="code-snippet" style={{ margin: "10px 0" }}>
                  <SyntaxHighlighter language="cpp" style={vscDarkPlus} wrapLines={true} customStyle={{ borderRadius: "8px", fontSize: "14px" }}>
                    {q.code}
                  </SyntaxHighlighter>
                </div>
              )}

              {/* 📸 Question Image (if exists) */}
              {q.image_url && (
                <div className="question-image-wrapper">
                  {/* <img
                    src={`http://localhost:8081/ques_photos/${q.image_url}`}
                    alt="Question"
                    className="question-image"
                  /> */}
                  <img
                    src={`${API_BASE}/ques_photos/${q.image_url}`}
                    alt="Question"
                    className="question-image"
                  />
                </div>
              )}

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
                    // ✅ **Turn only selected correct options green**
                    if (isSelected && isCorrect) optionClass = "correct";
                    // ❌ **Turn only selected wrong options red**
                    else if (isSelected && !isCorrect) optionClass = "wrong";
                  } else if (isSelected) {
                    optionClass = "selected"; // Keep grey if no wrong is selected
                  }
                  console.log("Question Object:", q);
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

              <div className="question-meta">
                <span className="meta-item">📘 {q.subject_name || "N/A"}</span>
                <span className="meta-item">📌 {q.topic_name || "N/A"}</span>
                <span className="meta-item">📅 {q.year || "N/A"}</span>
              </div>

              {showExplanation[q.id] && (
                <div className="explanation-box">
                  <p><b>Correct Answer:</b> {q.correct_option}</p>
                  <p>{parse(q.explanation)}</p>
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
          <p>Loading questions...</p>
        )}

  <div className="pagination">
    <button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
      Previous
    </button>

    <span className="page-numbers">
      {Array.from({ length: totalPages }, (_, index) => (
        <span 
          key={index + 1} 
          className={currentPage === index + 1 ? "current-page" : ""}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </span>
      ))}
    </span>

    <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages}>
      Next
    </button>
  </div>
  </div>
    );
  }

  export default QuestionsPage;