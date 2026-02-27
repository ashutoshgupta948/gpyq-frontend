import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const navigate = useNavigate();

  const handleBookmarkButtonClick = () => {
    console.log("Clicking is working or not?");
    navigate('/bookmark');
  };

  const handleStartManualButtonClick = () => {
    navigate('/ManualTestSetup')
  }

  return (
    <div className="user-profile-container">
        <button className="profile-button" onClick={handleBookmarkButtonClick}>Your Bookmark Questions</button>
        {/* <button className="profile-button manual-test-button" onClick={handleStartManualButtonClick}> Start Manual Tests </button> */}
      </div>
  );
}
export default UserProfile;