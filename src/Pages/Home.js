import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file for styling
import cse from "../images/CSE3.jpg"
import etc from "../images/ETC.jpg"
import civil from "../images/Civil2.jpg"

function Home() {
  return (
    <div className="home-container">
      <div className="image-container">
        <Link to="/gate-cse/topic-wise"> {/* Link to the TopicWiseCSE page */}
            <img src={cse} alt="CSE" className="image" />
        </Link>

        <Link to="/gate-etc/topic-wise"> {/* Link to the TopicWiseETC page */}
          <img src={etc} alt="ETC" className="image" />
        </Link>
      </div>
      
      <div className="image-container">
        <img src={civil} alt='' className="image" />
      </div>
    </div>
  );
}

export default Home;