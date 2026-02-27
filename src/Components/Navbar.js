import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS file
// import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isGateCSEHovered, setIsGateCSEHovered] = useState(false);
  const [isGateETCHovered, setIsGateETCHovered] = useState(false);
  // const [user, setUser] = useState(null);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   // Retrieve user from localStorage
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  // // When again I will implement the feature for login and logout then will again use it
  // const handleLogout = () => {
  //   localStorage.removeItem("user"); // Clear user session
  //   setUser(null); // Update UI
  //   navigate('/');
  // };

  return (
    <nav className="navbar-container">
      {/* <h1 className="navbar-title">Gate PYQ</h1> */}

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
          
          {/* {user ? (
            <>
              <li className="nav-item"> <Link to="/userProfile"> 👤 {user.first_name || `User ${user.id}`}</Link> </li>

              <li className="nav-item" onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
                Logout
              </li>

              <li><Link to="/upload-question" className="nav-item">Upload Question</Link></li>
              
            </>
          ) : (
            <li><Link to="/studentlogin" className="nav-item">Student Login</Link></li>
          )} */}

          {/* <li><Link to="/random-question" className="nav-item">Random</Link></li> */}
          
          
          {/* <li><Link to="/upload-question" className="nav-item">Upload Question</Link></li> */}
        
          {/* <li><Link to="/EditQuestion" className="nav-item">Edit Ques</Link></li> */}
        
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;