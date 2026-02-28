import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfileCompletion.css";
import { API_BASE } from "../Config";

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    collegeName: "",
    branch: "",
    semester: "",
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/profile`, profileData);
      alert("Profile Completed Successfully!");
      navigate("/quizzes"); // Redirect to the quizzes page
    } catch (error) {
      console.error("Error completing profile:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="collegeName"
            placeholder="College Name"
            value={profileData.collegeName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={profileData.branch}
            onChange={handleChange}
            required
          />
          <select
            name="semester"
            value={profileData.semester}
            onChange={handleChange}
            required
          >
            <option value="">Select Semester</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
            <option value="Passout">Passout</option>
          </select>
          <button type="submit">Complete Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;