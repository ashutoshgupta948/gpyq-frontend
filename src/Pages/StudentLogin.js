import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation after login
import axios from "axios";
import "./StudentLogin.css"; // Import CSS for styling

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/studentlogin", formData);

      if (response.data.success) {
        const { first_name, id } = response.data.user; // Assuming API returns user details

        
        // Store user details in localStorage
        localStorage.setItem("user", JSON.stringify({ first_name, id }));

        
        // alert("Login Successful!");
        navigate("/"); // Redirect to student dashboard or home page
      } else {
        alert("Password not same!"); // Incorrect password
      }
    } catch (error) {
      alert("Login failed. Please check your email and password.");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Student Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          <p className="already-registered">If not registered, <Link to="/StudentRegister">Register</Link> here.</p>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;