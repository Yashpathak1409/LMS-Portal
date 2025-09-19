import React, { useState } from "react";
import './MockInterview.css';

const MockInterview = () => {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [summary, setSummary] = useState([]);
  const [interviewId, setInterviewId] = useState(null);

  const API_URL = "http://localhost:6500/api/interviews";

  const getToken = () => localStorage.getItem("yashtoken") || "";

  const handleStartInterview = async () => {
    if (!role || !skills) return alert("Please enter role and skills!");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ role, skills }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error starting interview");

      setQuestions(data.questions.map((q) => q.question));
      setInterviewId(data.interviewId);
      setCurrentIndex(0);
      setSummary([]);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return alert("Enter your answer");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/${interviewId}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ questionId: currentIndex, answer }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error submitting answer");

      setSummary((prev) => [
        ...prev,
        { question: questions[currentIndex], answer, feedback: data.feedback },
      ]);

      setFeedback(data.feedback);
      setAnswer("");

      setTimeout(() => {
        setFeedback("");
        setCurrentIndex((prev) => prev + 1);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error submitting answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mock-interview-container">
      <h2 className="mock-interview-title">Mock Interview</h2>

      {questions.length === 0 && (
        <>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role (Backend Developer)"
            className="mock-input"
          />
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills (Node.js, MongoDB)"
            className="mock-input"
          />
          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="mock-button start-button"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </>
      )}

      {questions.length > 0 && currentIndex < questions.length && (
        <div className="question-section">
          <p className="question-text">Q: {questions[currentIndex]}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            className="mock-textarea"
          />
          <button
            onClick={submitAnswer}
            disabled={loading}
            className="mock-button submit-button"
          >
            Submit Answer
          </button>
          {feedback && <p className="feedback-text">{feedback}</p>}
        </div>
      )}

      {questions.length > 0 && currentIndex >= questions.length && (
        <div className="summary-section">
          <h3 className="summary-title">Interview Summary</h3>
          <ul className="summary-list">
            {summary.map((q, i) => (
              <li key={i}>
                <p><strong>Q:</strong> {q.question}</p>
                <p><strong>Your Answer:</strong> {q.answer}</p>
                <p><strong>Feedback:</strong> {q.feedback}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
