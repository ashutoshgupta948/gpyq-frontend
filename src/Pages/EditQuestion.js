import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import "./QuestionUpload.css"; // reuse same styles
import { API_BASE } from "../Config";

function EditQuestion() {
  const editor = useRef(null);
  const [searchId, setSearchId] = useState("");
  const [questionFound, setQuestionFound] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [years, setYears] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    question_text: "",
    code: "",
    remaining_question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: [],
    explanation: "",
    subject_id: "",
    topic_id: "",
    year_id: "",
    image_url: ""
  });

  // Jodit configs
  const questionEditorConfig = useMemo(() => ({
    readonly: false,
    placeholder: "Edit Question...",
  }), []);

  const explanationEditorConfig = useMemo(() => ({
    readonly: false,
    placeholder: "Edit Explanation...",
  }), []);

  // Load dropdowns
  useEffect(() => {
    axios.get("http://127.0.0.1:8081/UploadDropDownYears")
      .then(res => setYears(res.data || []));
    axios.get("http://127.0.0.1:8081/UploadDropDownSubjects")
      .then(res => setSubjects(res.data || []));
  }, []);

  // Fetch topics when subject changes
  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setFormData({ ...formData, subject_id: subjectId, topic_id: "" });

    if (!subjectId) {
      setTopics([]);
      return;
    }

    axios.get(`http://127.0.0.1:8081/UploadDropDownTopics?subject_id=${subjectId}`)
      .then(res => setTopics(res.data || []));
  };

  // Search by ID
  const handleSearch = () => {
    if (!searchId) return;
    axios.get(`http://127.0.0.1:8081/questions/${searchId}`)
      .then(res => {
        const data = res.data;
        setFormData({
          ...data,
          correct_option: data.correct_option ? data.correct_option.split(",") : []
        });
        setQuestionFound(true);
        // Load topics of this subject
        if (data.subject_id) {
          axios.get(`http://127.0.0.1:8081/UploadDropDownTopics?subject_id=${data.subject_id}`)
            .then(res => setTopics(res.data || []));
        }
      })
      .catch(() => {
        alert("No question found with this ID");
        setQuestionFound(false);
      });
  };

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Correct options checkbox
  const handleCorrectOptionChange = (e) => {
    const option = e.target.value;
    const isChecked = e.target.checked;
    setFormData((prev) => {
      let updatedOptions = [...prev.correct_option];
      if (isChecked) {
        if (!updatedOptions.includes(option)) updatedOptions.push(option);
      } else {
        updatedOptions = updatedOptions.filter(opt => opt !== option);
      }
      return { ...prev, correct_option: updatedOptions };
    });
  };

  // Save changes
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      correct_option: formData.correct_option.join(",")
    };

    // axios.put(`http://127.0.0.1:8081/questions/${formData.id}`, finalData)
    const payload = new FormData();

      Object.entries(finalData).forEach(([k, v]) => payload.append(k, v));
      if (newImage) payload.append("image", newImage);

      axios.put(
        `http://127.0.0.1:8081/questions/${formData.id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(() => {
        alert("Question updated successfully!");
      })
      .catch(() => alert("Error updating question"));
  };

  return (
    <div className="upload-container">
      <h2>Edit Question</h2>

      {/* Search by ID */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Enter Question ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {questionFound && (
        <form onSubmit={handleSubmit}>
          <select name="subject_id" value={formData.subject_id} onChange={handleSubjectChange} required>
            <option value="">Select Subject</option>
            {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.subject_name}</option>)}
          </select>

          <select name="topic_id" value={formData.topic_id} onChange={handleChange} required>
            <option value="">Select Topic</option>
            {topics.map(topic => <option key={topic.id} value={topic.id}>{topic.topic_name}</option>)}
          </select>

          <select name="year_id" value={formData.year_id} onChange={handleChange} required>
            <option value="">Select Year</option>
            {years.map(year => <option key={year.id} value={year.id}>{year.year}</option>)}
          </select>

          {/* Question text */}
          <JoditEditor
            ref={editor}
            value={formData.question_text}
            config={questionEditorConfig}
            onBlur={(newContent) => setFormData({ ...formData, question_text: newContent })}
          />

          <textarea name="code" value={formData.code} onChange={handleChange} placeholder="Code snippet" />
          <textarea name="remaining_question" value={formData.remaining_question} onChange={handleChange} placeholder="Remaining question" />

          <input type="text" name="option_a" value={formData.option_a} onChange={handleChange} placeholder="Option A" />
          <input type="text" name="option_b" value={formData.option_b} onChange={handleChange} placeholder="Option B" />
          <input type="text" name="option_c" value={formData.option_c} onChange={handleChange} placeholder="Option C" />
          <input type="text" name="option_d" value={formData.option_d} onChange={handleChange} placeholder="Option D" />

          {/* Correct options */}
          <div className="checkbox-group">
            {["A","B","C","D"].map(opt => (
              <label key={opt}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={formData.correct_option.includes(opt)}
                  onChange={handleCorrectOptionChange}
                /> {opt}
              </label>
            ))}
          </div>

          {/* Explanation */}
          <JoditEditor
            ref={editor}
            value={formData.explanation}
            config={explanationEditorConfig}
            onBlur={(newContent) => setFormData({ ...formData, explanation: newContent })}
          />

          {/* <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL" /> */}
          
          {formData.image_url && (
            <div style={{ marginBottom: "10px" }}>
              {/* <img
                src={`http://localhost:8081/ques_photos/${formData.image_url}`}
                alt="Current"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              /> */}
              <img
                src={`${API_BASE}/ques_photos/${formData.image_url}`}
                alt="Current"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
          />

          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
}

export default EditQuestion;