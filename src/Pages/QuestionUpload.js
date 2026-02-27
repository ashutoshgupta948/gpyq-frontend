import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import "./QuestionUpload.css";

function QuestionUpload() {
  const editor = useRef(null);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [years, setYears] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    question_text: "",
    code: "", 
    remaining_question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: [], // ✅ Now an array
    explanation: "",
    subject_id: "",
    topic_id: "",
    year_id: "",
  });

  // 📝 Jodit Editor Configuration for the question
  const questionEditorConfig  = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter Quesiton.",
      toolbarSticky: false,
      toolbarAdaptive: false,
      spellcheck: true,
      
      enter: "P", // Ensures new paragraphs are created correctly
      buttons: [
        "bold", "italic", "underline", "strikethrough", "|", "superscript", 
        "subscript", "|", "ul", "ol", "|", "outdent", "indent", "|", "font", 
        "fontsize", "brush", "paragraph", "|", "align", "undo", "redo", "|",
        "hr", "eraser", "copyformat", "symbol", "|", "source",
      ],
    }),
    []
  );

  const explanationEditorConfig = useMemo(
  () => ({
    readonly: false,
    toolbarSticky: false,
    placeholder: "Enter Explanation / Description here...",
    spellcheck: true,
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|", "superscript", 
      "subscript", "|", "ul", "ol", "|", "outdent", "indent", "|", "font", 
      "fontsize", "brush", "paragraph", "|", "align", "undo", "redo", "|",
      "hr", "eraser", "copyformat", "symbol", "|", "source",
    ],
  }),
  []
);

  const handleExplanationChange = (value) => {
    setFormData((prev) => ({ ...prev, explanation: value }));
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8081/UploadDropDownYears")
      .then(res => setYears(res.data || []))
      .catch(err => console.error("Error fetching years:", err));
  }, []);

  const fetchSubjects = () => {
    if (subjects.length === 0) {
      axios.get("http://127.0.0.1:8081/UploadDropDownSubjects")
        .then(res => setSubjects(res.data))
        .catch(err => console.error("Error fetching subjects:", err));
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setFormData({ ...formData, subject_id: subjectId, topic_id: "" });

    if (!subjectId) {
      setTopics([]);
      return;
    }

    axios.get(`http://127.0.0.1:8081/UploadDropDownTopics?subject_id=${subjectId}`)
      .then(res => setTopics(res.data || []))
      .catch(err => console.error("Error fetching topics:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ **Handle Multiple Correct Options Selection**
  const handleCorrectOptionChange = (e) => {
    const option = e.target.value;
    const isChecked = e.target.checked;
  
    setFormData((prev) => {
      let updatedOptions = Array.isArray(prev.correct_option) ? [...prev.correct_option] : [];
  
      if (isChecked) {
        if (!updatedOptions.includes(option)) updatedOptions.push(option); // Add selected option
      } else {
        updatedOptions = updatedOptions.filter(opt => opt !== option); // Remove if unchecked
      }
      return { ...prev, correct_option: updatedOptions }; // Keep as an array
    });
  };
  
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Submitting Explanation:", formData.explanation);
  //   const finalData = { 
  //     ...formData, 
  //     correct_option: formData.correct_option.join(",") // Convert array to a string
  //   };
  
  //   axios.post("http://127.0.0.1:8081/uploadQuestion", finalData)
  //     .then(() => {
  //       alert("Question uploaded successfully!");
  //       setTimeout(() => {
  //       setFormData({
  //         question_text: "",
  //         code: "",
  //         remaining_question:"",
  //         option_a: "",
  //         option_b: "",
  //         option_c: "",
  //         option_d: "",
  //         correct_option: [],  // ✅ Reset as an empty array
  //         explanation: "",
  //         subject_id: "",
  //         topic_id: "",
  //         year_id: "",
  //       });
  //       }, 300) // Adding 300 ms delay so that every field can get cleared once the question is uploaded to the database.
  //     })
  //     .catch(err => console.error("Error uploading question:", err));
  // };



  const handleSubmit = async (e) => {
  e.preventDefault();

  const formPayload = new FormData();

  Object.entries({
    ...formData,
    correct_option: formData.correct_option.join(","),
  }).forEach(([key, value]) => {
    formPayload.append(key, value);
  });

  if (imageFile) {
    formPayload.append("image", imageFile);
  }

  try {
    await axios.post(
      "http://127.0.0.1:8081/uploadQuestion",
      formPayload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Question uploaded successfully!");

    setFormData({
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
    });
    setImageFile(null);

  } catch (err) {
    console.error("Error uploading question:", err);
  }
};
  
  
  return (
    <div className="upload-container">
      <h2>Upload a New Question</h2>
      <form onSubmit={handleSubmit}>
        
        <select name="subject_id" onClick={fetchSubjects} onChange={handleSubjectChange} required>
          <option value="">Select Subject</option>
          {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.subject_name}</option>)}
        </select>

        <select name="topic_id" onChange={handleChange} required disabled={!formData.subject_id}>
          <option value="">Select Topic</option>
          {topics.map(topic => <option key={topic.id} value={topic.id}>{topic.topic_name}</option>)}
        </select>

        <select name="year_id" onChange={handleChange} required>
          <option value="">Select Year</option>
          {years.map(year => <option key={year.id} value={year.id}>{year.year}</option>)}
        </select>

        {/* <textarea name="question_text" placeholder="Enter question" onChange={handleChange} required /> */}

        {/* 📌 Question Text - Jodit Editor */}
        <JoditEditor
          ref={editor}
          value={formData.question_text}
          config={questionEditorConfig}
          tabIndex={1}
          onBlur={(newContent) => setFormData({ ...formData, question_text: newContent })}
          onChange={() => {}}
        />

        <textarea 
          name="code" 
          placeholder="Enter code snippet (if applicable)" 
          onChange={handleChange} 
          style={{ fontFamily: "monospace", minHeight: "100px" }} 
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <textarea name="remaining_question" placeholder="Enter question after code part" onChange={handleChange} />

        <input type="text" name="option_a" placeholder="Option A" onChange={handleChange} required />
        <input type="text" name="option_b" placeholder="Option B" onChange={handleChange} required />
        <input type="text" name="option_c" placeholder="Option C" onChange={handleChange} required />
        <input type="text" name="option_d" placeholder="Option D" onChange={handleChange} required />

        {/* ✅ Multiple Correct Answer Checkboxes */}
        <div className="checkbox-group"> 
          <label><input type="checkbox" value="A" onChange={handleCorrectOptionChange} /> A</label>
          <label><input type="checkbox" value="B" onChange={handleCorrectOptionChange} /> B</label>
          <label><input type="checkbox" value="C" onChange={handleCorrectOptionChange} /> C</label>
          <label><input type="checkbox" value="D" onChange={handleCorrectOptionChange} /> D</label>
        </div>

        {/* <textarea name="explanation" placeholder="Explanation" onChange={handleChange} required /> */}

        {/* 📌 Explanation - Jodit Editor */}
        <JoditEditor
          ref={editor}
          value={formData.explanation}
          config={explanationEditorConfig}
          tabIndex={1}
          onBlur={(newContent) => setFormData({ ...formData, explanation: newContent })}
          onChange={() => {}}
        />
        <button type="submit">Upload Question</button>
      </form>
    </div>
  );
}

export default QuestionUpload;