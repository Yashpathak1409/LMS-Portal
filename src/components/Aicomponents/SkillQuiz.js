import React, { useEffect, useState } from "react";
import axios from "axios";

// Utility function to shuffle an array
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Utility function to sanitize strings for comparison
const sanitize = (str) =>
  str.trim().replace(/\s+/g, " ").toLowerCase();

const SkillQuiz = ({ skill, studentName, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    // Fetch questions from backend
    axios
      .get(`http://localhost:6500/api/get-questions/${skill}`)
      .then((res) => {
        // Shuffle questions and their options
        const shuffled = shuffleArray(res.data).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        setQuestions(shuffled);
      })
      .catch((err) => console.error(err));
  }, [skill]);

  const handleNext = () => {
    const currentQuestion = questions[current];
    const isCorrect = sanitize(selected) === sanitize(currentQuestion.answer);

    if (isCorrect) setScore(score + 1);

    setSelected("");

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      // Pass final score
      onComplete(score + (isCorrect ? 1 : 0));
    }
  };

  if (questions.length === 0) return <p>Loading questions...</p>;

  const question = questions[current];

  return (
    <div style={{ textAlign: "center", marginTop: "40px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
      <h2>{skill} Quiz</h2>
      <p>Question {current + 1} of {questions.length}</p>
      <h3>{question.question}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {question.options.map((opt, i) => (
          <li
            key={i}
            onClick={() => setSelected(opt)}
            style={{
              margin: "8px 0",
              padding: "12px 16px",
              backgroundColor: selected === opt ? "#1e90ff" : "#eee",
              color: selected === opt ? "#fff" : "#000",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: selected === opt ? "600" : "400"
            }}
          >
            {opt}
          </li>
        ))}
      </ul>
      <button
        onClick={handleNext}
        disabled={!selected}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#1e90ff",
          color: "#fff",
          cursor: selected ? "pointer" : "not-allowed",
          fontWeight: "600"
        }}
      >
        {current + 1 === questions.length ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default SkillQuiz;
