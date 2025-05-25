import React, { useState } from "react";
import axios from "axios";

function ClassroomForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:6500/classroom", formData);
      setMessage(response.data.message || "Resource uploaded successfully!");
      setFormData({ title: "", description: "", link: "" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "❌ Submission failed";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="classroom-form">
      <h2>Upload Classroom Resource</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Enter Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="link"
          placeholder="Enter Resource Link"
          value={formData.link}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default ClassroomForm;
