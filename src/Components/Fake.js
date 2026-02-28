import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS file

function Navbar() {
  const [isGateCSEHovered, setIsGateCSEHovered] = useState(false);
  const [isGateETCHovered, setIsGateETCHovered] = useState(false);

  return (
    <nav className="navbar-container">

      <Link to="/" className="navbar-title-link">
        <h1 className="navbar-title">Gate PYQ</h1>
      </Link>

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

          {/* GATE ETC with Hover Dropdown */}
          <li 
            className="nav-item dropdown"
            onMouseEnter={() => setIsGateETCHovered(true)}
            onMouseLeave={() => setIsGateETCHovered(false)}
          >
            GATE ETC
            {isGateETCHovered && (
              <ul className="dropdown-menu">
                <li><Link to="/gate-etc/topic-wise" className="dropdown-item">Topic Wise</Link></li>
                <li><Link to="/gate-etc/subject-wise" className="dropdown-item">Subject Wise</Link></li>
                <li><Link to="/gate-etc/year-wise" className="dropdown-item">Year Wise</Link></li>
              </ul>
            )}

            

          </li>
          
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;