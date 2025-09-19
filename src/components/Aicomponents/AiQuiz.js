import React, { useState, useEffect } from "react";

const DynamicQuiz = () => {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [limit, setLimit] = useState(5);
  const [tags, setTags] = useState("");
  const [questions, setQuestions] = useState([{ question: "", tags: "" }]);
  const [loading, setLoading] = useState(false);

  // Fetch questions from MongoDB by skill/category
  const fetchQuestionsFromDB = async (skill) => {
    if (!skill) return;
    try {
      const res = await fetch(`http://localhost:6500/api/quiz/${skill}`);
      const data = await res.json();
      if (data?.questions) {
        setQuestions(
          data.questions.map((q) => ({
            question: q.question || "",
            tags: Array.isArray(q.tags) ? q.tags.join(",") : q.tags || "",
          }))
        );
      } else {
        setQuestions([{ question: "", tags: "" }]);
      }
    } catch (err) {
      console.error("Error fetching from DB:", err);
      setQuestions([{ question: "", tags: "" }]);
    }
  };

  // Add new empty question input
  const addQuestion = () => {
    setQuestions([...questions, { question: "", tags: "" }]);
  };

  // Remove question input
  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions.length ? newQuestions : [{ question: "", tags: "" }]);
  };

  // Handle input change
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Save questions to backend
  const handleSave = async () => {
    if (!category || questions.length === 0) {
      alert("Please enter a category and at least one question.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        skill: category,
        difficulty,
        questions: questions.map((q) => ({
          question: q.question,
          tags: q.tags ? q.tags.split(",").map((t) => t.trim()) : [],
        })),
      };

      const res = await fetch("http://localhost:6500/api/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      alert(data.message || "Questions saved successfully!");
      fetchQuestionsFromDB(category);
    } catch (err) {
      console.error(err);
      alert("Error saving questions.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions when category changes
  useEffect(() => {
    if (category) fetchQuestionsFromDB(category);
  }, [category]);

  return (
    <div style={{ padding: "40px", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#1e90ff" }}>Dynamic Quiz Seeder</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Category */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Linux, DevOps..."
            style={{ padding: "10px", borderRadius: "8px" }}
          />
        </div>

        {/* Difficulty */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px" }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Limit */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Limit</label>
          <input
            type="number"
            min="1"
            max="50"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px" }}
          />
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1,tag2..."
            style={{ padding: "10px", borderRadius: "8px" }}
          />
        </div>
      </div>

      {/* Fetch Questions Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => fetchQuestionsFromDB(category)}
          disabled={!category || loading}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Fetch Questions
        </button>
      </div>

      {/* Questions */}
      <div style={{ marginBottom: "20px" }}>
        {questions.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              value={q.question}
              placeholder={`Question ${i + 1}`}
              onChange={(e) => handleQuestionChange(i, "question", e.target.value)}
              style={{ flex: 3, padding: "10px", borderRadius: "8px" }}
            />
            <input
              type="text"
              value={q.tags}
              placeholder="tag1,tag2"
              onChange={(e) => handleQuestionChange(i, "tags", e.target.value)}
              style={{ flex: 2, padding: "10px", borderRadius: "8px" }}
            />
            <button onClick={() => removeQuestion(i)} style={{ flex: 0.5 }}>
              ❌
            </button>
          </div>
        ))}
        <button onClick={addQuestion} style={{ marginTop: "10px", padding: "10px 20px" }}>
          ➕ Add Question
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          padding: "12px 25px",
          borderRadius: "10px",
          backgroundColor: "#1e90ff",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Questions"}
      </button>
    </div>
  );
};

export default DynamicQuiz;
