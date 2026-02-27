import React from "react";
import "./YearWise.css"; // Using the same CSS file

function YearWiseETC() {
  const years = Array.from({ length: 26 }, (_, i) => 2025 - i); // Generates years from 2025 to 2000

  return (
    <div className="year-container">
      <h2 className="year-heading">GATE ETC - Year Wise Questions</h2>
      <div className="year-box">
        {years.map((year, index) => (
          <div key={index} className="year-item">
            {year}
          </div>
        ))}
      </div>
    </div>
  );
}

export default YearWiseETC;