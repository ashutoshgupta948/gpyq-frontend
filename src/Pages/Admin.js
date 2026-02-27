import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

function AdminControl() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const ADMIN_PASSWORD = "Ashutosh@26"; // change this

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        {!authorized ? (
          <>
            <h3>Admin Access</h3>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Enter</button>
          </>
        ) : (
          <>
            <h2>Admin Control Panel</h2>
            <ul className="admin-links">
              <li>
                <Link to="/upload-question">Upload Question</Link>
              </li>
              <li>
                <Link to="/EditQuestion">Edit Question</Link>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminControl;