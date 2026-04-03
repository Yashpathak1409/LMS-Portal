import React, { useState, useEffect } from "react";
import "./MockInterview.css";
import jsPDF from "jspdf";

const MockInterview = () => {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [summary, setSummary] = useState([]);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [listening, setListening] = useState(false);

  // ================= QUESTION BANK =================
  const questionBank = {
    react: [
      "What is React?",
      "What are components?",
      "Difference between state and props?",
      "What is useEffect?",
      "What is virtual DOM?",
      "Controlled vs uncontrolled components?",
      "What is JSX?",
      "What are hooks?",
      "What is context API?",
      "What is React lifecycle?",
    ],
    javascript: [
      "What is closure?",
      "Difference between var, let, const?",
      "What is hoisting?",
      "Explain promises",
      "What is async/await?",
      "What is event loop?",
      "Difference between == and ===?",
      "What is callback?",
      "What is prototype?",
      "What is debounce?",
    ],
    java: [
      "What is OOP?",
      "What is inheritance?",
      "What is polymorphism?",
      "What is abstraction?",
      "Interface vs abstract class?",
      "What is JVM?",
      "Exception handling?",
      "Multithreading?",
      "Collections?",
      "Encapsulation?",
    ],
  };

  // ================= SHUFFLE =================
  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  // ================= AI FEEDBACK =================
  const getFeedback = (ans) => {
    if (!ans.trim()) return "❌ No answer given.";
    if (ans.length < 20)
      return "⚠️ Very short answer. Try to explain with example.";
    if (ans.length < 50)
      return "👍 Good attempt. Add definition + example.";
    if (ans.toLowerCase().includes("example"))
      return "🔥 Strong answer with example!";
    return "✅ Good answer. Adding example will improve it.";
  };

  // ================= START =================
  const handleStartInterview = () => {
    if (!role || !skills) return alert("Enter role & skills");

    const key = skills.toLowerCase().split(",")[0].trim();
    const selected = questionBank[key];

    if (!selected) return alert("Skill not supported!");

    const count =
      difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 7;

    const randomQ = shuffleArray([...selected]).slice(0, count);

    setQuestions(randomQ);
    setCurrentIndex(0);
    setSummary([]);
    setScore(0);
    setTimer(30);
  };

  // ================= TIMER =================
  useEffect(() => {
    if (questions.length === 0) return;

    if (timer === 0) {
      submitAnswer();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, questions]);

  // ================= VOICE =================
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setAnswer((prev) => prev + " " + text);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  // ================= SUBMIT =================
  const submitAnswer = () => {
    const feedbackText = getFeedback(answer);

    let newScore = score;
    if (answer.length > 40) newScore++;

    setScore(newScore);

    setSummary((prev) => [
      ...prev,
      {
        question: questions[currentIndex],
        answer,
        feedback: feedbackText,
      },
    ]);

    setFeedback(feedbackText);
    setAnswer("");
    setTimer(30);

    setTimeout(() => {
      setFeedback("");
      setCurrentIndex((prev) => prev + 1);
    }, 1200);
  };

  // ================= PDF =================
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Mock Interview Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Score: ${score}/${questions.length}`, 20, 30);

    let y = 40;

    summary.forEach((item, index) => {
      doc.text(`Q${index + 1}: ${item.question}`, 20, y);
      y += 8;

      doc.text(doc.splitTextToSize(item.answer, 170), 20, y);
      y += 10;

      doc.text(`Feedback: ${item.feedback}`, 20, y);
      y += 12;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("Mock_Interview_Report.pdf");
  };

  // ================= RESET =================
  const resetInterview = () => {
    setQuestions([]);
    setRole("");
    setSkills("");
    setSummary([]);
    setScore(0);
    setCurrentIndex(0);
    setTimer(30);
  };

  // ================= PROGRESS =================
  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="mock-interview-container">
      <h2>🚀 Mock Interview</h2>

      {/* START */}
      {questions.length === 0 && (
        <>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="mock-input"
          />

          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills"
            className="mock-input"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mock-input"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button onClick={handleStartInterview} className="mock-button">
            Start Interview
          </button>
        </>
      )}

      {/* QUESTION */}
      {questions.length > 0 && currentIndex < questions.length && (
        <div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p>⏱️ {timer}s | 🎯 {score}</p>

          <h3>{questions[currentIndex]}</h3>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mock-textarea"
          />

          <button onClick={submitAnswer} className="mock-button">
            Submit
          </button>

          <button onClick={startListening} className="mock-button">
            🎤 {listening ? "Listening..." : "Speak"}
          </button>

          {feedback && <p>{feedback}</p>}
        </div>
      )}

      {/* SUMMARY */}
      {currentIndex >= questions.length && questions.length > 0 && (
        <div className="summary-container">
          <h3>🎉 Finished</h3>
          <h2>Score: {score}/{questions.length}</h2>

          {summary.map((q, i) => (
            <div key={i} className="summary-card">
              <p><b>Q:</b> {q.question}</p>
              <p><b>Ans:</b> {q.answer}</p>
              <p><b>{q.feedback}</b></p>
            </div>
          ))}

          <button onClick={downloadPDF} className="mock-button">
            📄 Download PDF
          </button>

          <button onClick={resetInterview} className="mock-button">
            🔄 Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default MockInterview;