import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"; // Import axios for API calls
import "./StudentRegister.css";
import Registration from "../images/Registration.png";
import { API_BASE } from "../Config";



const StudentRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // const response = await axios.post("http://localhost:8081/studentsregister", formData);
      const response = await axios.post(`${API_BASE}/studentsregister`, formData);
      
      alert(response.data.message);
      
      // Redirect to Profile Completion Page (if needed)
      // window.location.href = "/profile-completion";
      navigate("/profile-completion");
    } catch (error) {
      alert("Registration failed. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-image">
          <img src={Registration} alt="Students" />
        </div>
        <div className="register-form">
          <h2>Student Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="firstLast">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            </div>
            <input type="number" name="number" placeholder="Contact Number" value={formData.number} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            <div className="button">  
                <button type="submit">Register</button>
            </div>
          
            <p className="already-registered">
                If already registered, <Link to="/studentlogin">Log in</Link> here.
            </p>
          
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;