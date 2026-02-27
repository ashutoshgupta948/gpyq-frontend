import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS file
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isGateCSEHovered, setIsGateCSEHovered] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user session
    setUser(null); // Update UI
    navigate('/');
  };

  return (
    <nav className="navbar-container">
      <h1 className="navbar-title">Gate PYQ</h1>

      {/* Main Navbar */}
      <div className="navbar">
        <ul className="nav-list">
          <li><Link to="/" className="nav-item">Home</Link></li>

          {/* GATE CSE with Hover Dropdown */}
          <li 
            className="nav-item dropdown"
            onMouseEnter={() => setIsGateCSEHovered(true)}
            onMouseLeave={() => setIsGateCSEHovered(false)}
          >
            GATE CSE
            {isGateCSEHovered && (
              <ul className="dropdown-menu">
                <li><Link to="/gate-cse/topic-wise" className="dropdown-item">Topic Wise</Link></li>
                <li><Link to="/gate-cse/subject-wise" className="dropdown-item">Subject Wise</Link></li>
                <li><Link to="/gate-cse/year-wise" className="dropdown-item">Year Wise</Link></li>
              </ul>
            )}
          </li>
          
          {user ? (
            <>
              <li className="nav-item"> <Link to="/userProfile"> 👤 {user.first_name || `User ${user.id}`}</Link> </li>

              <li className="nav-item" onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
                Logout
              </li>

              <li><Link to="/upload-question" className="nav-item">Upload Question</Link></li>
            </>
          ) : (
            <li><Link to="/studentlogin" className="nav-item">Student Login</Link></li>
          )}

          <li><Link to="/EditQuestion" className="nav-item">Edit Ques</Link></li>
        
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;