import React from "react";
import "./SubjectWise.css"; // Using the same CSS file

function SubjectWiseETC() {
  const subjects = [
    "Electronic Devices",
    "Analog Circuits",
    "Digital Circuits",
    "Signals & Systems",
    "Control Systems",
    "Communications",
    "Electromagnetics",
    "Microprocessors",
    "Optical Fiber Communication",
    "Network Theory",
  ];

  return (
    <div className="subject-container">
      <h2 className="subject-heading">GATE ETC - Subject Wise Questions</h2>
      <div className="subject-box">
        {subjects.map((subject, index) => (
          <div key={index} className="subject-item">
            {subject}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectWiseETC;