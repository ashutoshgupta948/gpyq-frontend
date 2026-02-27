import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ManualTestOptions.css";

function ManualTestOptions() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSubjects = location.state?.selectedSubjects || [];

  const [questionCount, setQuestionCount] = useState("");
  const [duration, setDuration] = useState("");

  const handleStartTest = () => {
    if (!questionCount || !duration) {
      alert("Please select both question count and duration.");
      return;
    }

    // Navigate to actual test page and pass test config
    navigate("/start-test", {
      state: {
        subjects: selectedSubjects,
        questionCount,
        duration,
      },
    });
  };

  return (
    <div className="test-options-container">
      <h2>Configure Your Manual Test</h2>

      <div className="section">
        <h4>Selected Subjects:</h4>
        <ul>
          {selectedSubjects.map((subject, idx) => (
            <li key={idx}>{subject}</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <label>Choose Number of Questions:</label>
        <select
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="5">5 Questions</option>
          <option value="15">15 Questions</option>
          <option value="65">65 Questions</option>
        </select>
      </div>

      <div className="section">
        <label>Select Duration:</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="20">20 Minutes</option>
          <option value="50">50 Minutes</option>
          <option value="180">180 Minutes</option>
        </select>
      </div>

      <button className="start-button" onClick={handleStartTest}>
        Start Test
      </button>
    </div>
  );
}

export default ManualTestOptions;