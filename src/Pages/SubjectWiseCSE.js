import React from "react";
import { useNavigate } from "react-router-dom";
import "./SubjectWise.css"; 

function SubjectWiseCSE() {
  const navigate = useNavigate();
  
  const subjects = [
    "Operating System",
    "Compiler Design",

    "Engineering Mathematics",
    "Digital Logic",

    "Computer Organization and Architecture",
    "Data Structures",

    
    "C Programming",
    "Algorithms",
    "Theory of Computation",
    "Databases",
    "General Aptitude",
    "testing"
  ];

  const handleSubjectClick = (subject) => {
    navigate(`/questions?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <div className="subject-container">
      <h2 className="subject-heading">GATE CSE - Subject Wise Questions</h2>
      <div className="subject-box">
        {subjects.map((subject, index) => (
          <div 
            key={index} 
            className="subject-item" 
            onClick={() => handleSubjectClick(subject)}
          >
            {subject}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectWiseCSE;