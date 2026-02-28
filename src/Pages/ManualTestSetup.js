import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './ManualTestSetup.css'; // optional styling
import { API_BASE } from "../Config";

function ManualTestSetup() {
  const [subjectData, setSubjectData] = useState([]);
  const [questionCount, setQuestionCount] = useState("");
  const [testDuration, setTestDuration] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch subjects with topics
    axios.get("http://127.0.0.1:8081/subjects-with-topics")
      .then(res => {
        const dataWithSelection = res.data.map(subject => ({
          ...subject,
          selected: false,
          topics: subject.topics.map(topic => ({ ...topic, selected: false }))
        }));
        setSubjectData(dataWithSelection);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleSubjectToggle = (subjectId) => {
    setSubjectData(prev =>
      prev.map(subject =>
        subject.id === subjectId
          ? { ...subject, selected: !subject.selected }
          : subject
      )
    );
  };

  const handleTopicToggle = (subjectId, topicId) => {
    setSubjectData(prev =>
      prev.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map(topic =>
                topic.id === topicId
                  ? { ...topic, selected: !topic.selected }
                  : topic
              )
            }
          : subject
      )
    );
  };

  const handleSubmit = async () => {
  const selectedSubjects = subjectData
    .filter(subject => subject.selected)
    .map(subject => ({
      subject_id: subject.id,
      topics: subject.topics.filter(topic => topic.selected).map(t => t.id)
    }))
    .filter(s => s.topics.length > 0);

  if (selectedSubjects.length === 0 || !questionCount || !testDuration) {
    alert("Please select subjects, topics, question count, and duration.");
    return;
  }

  const selectedTopicIds = selectedSubjects.flatMap(s => s.topics);
  const payload = {
    user_id: JSON.parse(localStorage.getItem("user"))?.id,
    questionCount,
    testDuration,
    selectedTopics: selectedTopicIds
  };

  try {
    // const response = await axios.post("http://localhost:8081/start-manual-test", payload);
    const response = await axios.post(`${API_BASE}/start-manual-test`, payload);
    const { test_id, start_time, duration } = response.data;

    navigate("/StartTest", {
      state: {
        selectedTopics: selectedTopicIds,
        questionCount,
        testDuration: duration,
        test_id,
        startTime: start_time
      }
    });
  } catch (err) {
    console.error("Error starting test:", err);
    alert("Error starting test");
  }
};


  return (
    <div className="manual-test-setup">
      <h2>Configure Your Manual Test</h2>

      {subjectData.map(subject => (
        <div key={subject.id} className="subject-block">
          <label>
            <input
              type="checkbox"
              checked={subject.selected}
              onChange={() => handleSubjectToggle(subject.id)}
            />
            {subject.name}
          </label>

          {subject.selected && (
            <div className="topic-list">
              {subject.topics.map(topic => (
                <label key={topic.id} className="topic-item">
                  <input
                    type="checkbox"
                    checked={topic.selected}
                    onChange={() => handleTopicToggle(subject.id, topic.id)}
                  />
                  {topic.name}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="dropdowns">
        <label>
          Number of Questions:
          <select value={questionCount} onChange={e => setQuestionCount(e.target.value)}>
            <option value="">--Select--</option>
            <option value="5">5 Questions</option>
            <option value="15">15 Questions</option>
            <option value="65">65 Questions</option>
          </select>
        </label>

        <label>
          Test Duration:
          <select value={testDuration} onChange={e => setTestDuration(e.target.value)}>
            <option value="">--Select--</option>
            <option value="20">20 Minutes</option>
            <option value="50">50 Minutes</option>
            <option value="180">180 Minutes</option>
          </select>
        </label>
      </div>

      <button onClick={handleSubmit} className="start-test-button">Start Test</button>
    </div>
  );
}

export default ManualTestSetup;