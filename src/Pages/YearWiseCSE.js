import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./YearWise.css";

function YearWiseCSE() {
  const [years, setYears] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8081/UploadDropDownYears")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setYears(res.data.map((item) => item.year)); // Directly store years
        }
      })
      .catch((err) => console.error("Error fetching years:", err));
  }, []);

  // Handle click on a year to navigate to the Questions page
  const handleYearClick = (year) => {
    navigate(`/questions?year=${encodeURIComponent(year)}`); // ✅ Navigate using query parameter
  };
  

  return (
    <div className="year-container">
      <h2 className="year-heading">GATE CSE - Year Wise Questions</h2>
      <div className="year-box">
        {years.length > 0 ? (
          years.map((year, index) => (
            <div key={index} className="year-item" onClick={() => handleYearClick(year)}>
              {year}
            </div>
          ))
        ) : (
          <p>Loading years...</p>
        )}
      </div>
    </div>
  );
}

export default YearWiseCSE;