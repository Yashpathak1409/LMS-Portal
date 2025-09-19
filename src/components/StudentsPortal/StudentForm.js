import React, { useState } from "react";

const StudentForm = ({ skill, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== "") {
      onSubmit(name.trim());
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Enter your name to start the {skill} quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "8px", fontSize: "16px", marginRight: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", fontSize: "16px" }}>
          Start
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
