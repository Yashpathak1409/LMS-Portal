import React, { useState } from "react";
import axios from "axios";
import "./AddQuestion.css";

const AddQuestion = () => {
  const [skill, setSkill] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:6500/api/add-question", {
        skill,
        question,
        options,
        answer,
      });

      setMessage("✅ Question added successfully!");
      setSkill("");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer("");
    } catch (err) {
      setMessage("❌ Failed to add question. Try again!");
    }
  };

  return (
    <div className="add-question-container">
      <h2>Add Quiz Question</h2>
      <form onSubmit={handleSubmit}>
        <label>Skill:</label>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          required
        />

        <label>Question:</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        ></textarea>

        <label>Options:</label>
        {options.map((opt, i) => (
          <input
            key={i}
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            required
          />
        ))}

        <label>Correct Answer:</label>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />

        <button type="submit">Add Question</button>
      </form>
      {message && <p className="status">{message}</p>}
    </div>
  );
};

export default AddQuestion;
