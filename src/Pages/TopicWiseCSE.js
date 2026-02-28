// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./TopicWise.css"; // Import the common CSS file

// function TopicWiseCSE() {
//   const navigate = useNavigate();

//   // Manually defined topics
//   const topics = [
//     { subject: "Operating System", subtopics: ["Process Scheduling", "Memory Management", "File System"] },
//     { subject: "Compiler Design", subtopics: ["Lexical Analysis", "Parsing", "Code Optimization"] },
//     { subject: "Computer Networks", subtopics: ["TCP/IP Model", "Routing Algorithms", "Network Security"] },
//   ];

//   const handleTopicClick = (topic) => {
//     navigate(`/questions?topic=${encodeURIComponent(topic)}`);
//   };

//   return (
//     <div className="topic-container">
//       <h2 className="topic-heading">GATE CSE - Topic Wise Questions</h2>
//       <div className="topic-box-container">
//         {topics.map((subject, index) => (
//           <div key={index} className="topic-box">
//             <h3 className="topic-title">{subject.subject}</h3>
//             <ul className="topic-list">
//               {subject.subtopics.map((topic, i) => (
//                 <li key={i} className="topic-item" onClick={() => handleTopicClick(topic)}>
//                   {topic}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default TopicWiseCSE;








// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./TopicWise.css"; // Import the common CSS file

// function TopicWiseCSE() {
//   const navigate = useNavigate();
//   const [topics, setTopics] = useState([]); // State to store fetched topics

//   // Fetch topics from the API when component mounts
//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:8081/topics") // Adjust API URL if needed
//       .then((response) => {
//         setTopics(response.data); // Set fetched topics in state
//       })
//       .catch((error) => {
//         console.error("Error fetching topics:", error);
//       });
//   }, []);

//   const handleTopicClick = (topic) => {
//     navigate(`/questions?topic=${encodeURIComponent(topic)}`);
//   };

//   return (
//     <div className="topic-container">
//       <h2 className="topic-heading">GATE CSE - Topic Wise Questions</h2>
//       <div className="topic-box-container">
//         {topics.length === 0 ? (
//           <p>Loading topics...</p>
//         ) : (
//           topics.map((subject, index) => (
//             <div key={index} className="topic-box">
//               <h3 className="topic-title">{subject.subject_name}</h3>
//               <ul className="topic-list">
//                 {subject.topics.map((topic, i) => (
//                   <li key={i} className="topic-item" onClick={() => handleTopicClick(topic)}>
//                     {topic}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default TopicWiseCSE;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TopicWise.css"; // Import the common CSS file
import { API_BASE } from "../Config";

function TopicWiseCSE() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]); // State to store fetched topics

  // Fetch topics from the API when component mounts
  useEffect(() => {
    axios
      .get(`${API_BASE}/topics`) // Adjust API URL if needed
      .then((response) => {
        setTopics(response.data); // Set fetched topics in state
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  }, []);

  const handleTopicClick = (topic) => {
    navigate(`/questions?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="topic-container">
      <h2 className="topic-heading">GATE CSE - Topic Wise Questions</h2>
      <div className="topic-box-container">
        {topics.length === 0 ? (
          <p>Loading topics...</p>
        ) : (
          topics.map((subject, index) => (
            <div key={index} className="topic-box">
              <h3 className="topic-title">{subject.subject_name}</h3>
              <ul className="topic-list">
                {subject.topics.map((topic, i) => (
                  <li
                    key={i}
                    className="topic-item"
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TopicWiseCSE;
