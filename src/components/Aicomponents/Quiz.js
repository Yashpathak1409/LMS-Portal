import React, { useState } from "react";
import "./Quiz.css";
import { Network } from "lucide-react";

// ================= QUESTION BANK (dummy) =================
// (your existing quizData stays exactly the same)
const quizData = {
  html: [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "None"], answer: "Hyper Text Markup Language" },
    { question: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<span>"], answer: "<p>" },
    { question: "HTML is?", options: ["Programming language", "Markup language", "OS"], answer: "Markup language" },
    { question: "Which tag creates link?", options: ["<a>", "<link>", "<url>"], answer: "<a>" },
    { question: "Which tag is for image?", options: ["<img>", "<image>", "<pic>"], answer: "<img>" },
  ],
  css: [
    { question: "CSS stands for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System"], answer: "Cascading Style Sheets" },
    { question: "Property to change text color?", options: ["color", "background", "font"], answer: "color" },
    { question: "Select element by ID?", options: ["#id", ".class", "*"], answer: "#id" },
    { question: "Flexbox property for direction?", options: ["flex-direction", "justify-content", "align-items"], answer: "flex-direction" },
    { question: "CSS used for?", options: ["Design", "Logic", "Database"], answer: "Design" },
  ],
  javascript: [
    { question: "JS runs on?", options: ["Browser", "Server", "Both"], answer: "Both" },
    { question: "Strict equality operator?", options: ["===", "==", "="], answer: "===" },
    { question: "Variable keyword?", options: ["var", "let", "const"], answer: "var" },
    { question: "Loop keyword?", options: ["for", "if", "switch"], answer: "for" },
    { question: "JS is?", options: ["Language", "Framework", "Library"], answer: "Language" },
  ],
  react: [
    { question: "React is?", options: ["Library", "Framework", "Language"], answer: "Library" },
    { question: "JSX stands for?", options: ["JavaScript XML", "JSON XML", "None"], answer: "JavaScript XML" },
    { question: "Hook example?", options: ["useState", "setState", "init"], answer: "useState" },
    { question: "React used for?", options: ["UI", "Database", "OS"], answer: "UI" },
    { question: "Virtual DOM?", options: ["Copy of DOM", "Server", "None"], answer: "Copy of DOM" },
  ],
  nodejs: [
    { question: "Node.js is?", options: ["Server-side JS", "Client-side JS", "Database"], answer: "Server-side JS" },
    { question: "npm stands for?", options: ["Node Package Manager", "New Project Manager", "None"], answer: "Node Package Manager" },
    { question: "Node.js runs on?", options: ["Server", "Browser", "Both"], answer: "Server" },
    { question: "File system module?", options: ["fs", "http", "url"], answer: "fs" },
    { question: "Node.js is built on?", options: ["V8 engine", "Python", "Java"], answer: "V8 engine" },
  ],
  python: [
    { question: "Python is?", options: ["Language", "OS", "DB"], answer: "Language" },
    { question: "List syntax?", options: ["[]", "{}", "()"], answer: "[]" },
    { question: "Indentation used for?", options: ["Structure", "Loop", "Error"], answer: "Structure" },
    { question: "Python is?", options: ["Compiled", "Interpreted", "Both"], answer: "Interpreted" },
    { question: "Function keyword?", options: ["def", "func", "create"], answer: "def" },
  ],
  java: [
    { question: "Java is?", options: ["Language", "OS", "DB"], answer: "Language" },
    { question: "OOP stands for?", options: ["Object Oriented Programming", "Open Program", "None"], answer: "Object Oriented Programming" },
    { question: "Class keyword?", options: ["class", "define", "new"], answer: "class" },
    { question: "Java runs on?", options: ["JVM", "CPU", "Browser"], answer: "JVM" },
    { question: "Loop keyword?", options: ["for", "if", "switch"], answer: "for" },
  ],
  c: [
    { question: "C++ is?", options: ["Language", "OS", "DB"], answer: "Language" },
    { question: "Which is loop?", options: ["for", "if", "switch"], answer: "for" },
    { question: "Keyword for class?", options: ["class", "object", "define"], answer: "class" },
    { question: "C++ supports OOP?", options: ["Yes", "No"], answer: "Yes" },
    { question: "C++ developed by?", options: ["Bjarne Stroustrup", "Dennis Ritchie"], answer: "Bjarne Stroustrup" },
  ],
  linux: [
    { question: "Linux is?", options: ["OS", "Language", "DB"], answer: "OS" },
    { question: "Command to list files?", options: ["ls", "dir", "list"], answer: "ls" },
    { question: "Root user?", options: ["Administrator", "Guest"], answer: "Administrator" },
    { question: "Which shell?", options: ["Bash", "Python"], answer: "Bash" },
    { question: "Linux kernel type?", options: ["Monolithic", "Micro"], answer: "Monolithic" },
  ],
  go: [
    { question: "Go language developed by?", options: ["Google", "Microsoft"], answer: "Google" },
    { question: "Go is?", options: ["Compiled", "Interpreted"], answer: "Compiled" },
    { question: "Main file extension?", options: [".go", ".py"], answer: ".go" },
    { question: "Go supports OOP?", options: ["Yes", "No"], answer: "Yes" },
    { question: "Go concurrency tool?", options: ["Goroutine", "Thread"], answer: "Goroutine" },
  ],
  "data-science": [
    { question: "Data Science uses?", options: ["Python", "C++", "Both"], answer: "Both" },
    { question: "Which is visualization lib?", options: ["Matplotlib", "React"], answer: "Matplotlib" },
    { question: "ML stands for?", options: ["Machine Learning", "Modern Language"], answer: "Machine Learning" },
    { question: "Data cleaning needed?", options: ["Yes", "No"], answer: "Yes" },
    { question: "DS deals with?", options: ["Data", "OS", "Networking"], answer: "Data" },
  ],
  ml: [
    { question: "ML type?", options: ["Supervised", "Unsupervised"], answer: "Supervised" },
    { question: "Algorithm example?", options: ["Linear Regression", "React"], answer: "Linear Regression" },
    { question: "ML uses?", options: ["Data", "OS"], answer: "Data" },
    { question: "Train/Test split?", options: ["Yes", "No"], answer: "Yes" },
    { question: "Goal of ML?", options: ["Prediction", "Networking"], answer: "Prediction" },
  ],
  cloud: [
    { question: "AWS is?", options: ["Cloud", "OS"], answer: "Cloud" },
    { question: "Azure is?", options: ["Cloud", "OS"], answer: "Cloud" },
    { question: "IaaS stands for?", options: ["Infrastructure as a Service", "Internet as a Service"], answer: "Infrastructure as a Service" },
    { question: "PaaS stands for?", options: ["Platform as a Service", "Program as a Service"], answer: "Platform as a Service" },
    { question: "SaaS stands for?", options: ["Software as a Service", "Server as a Service"], answer: "Software as a Service" },
  ],
  dsa: [
    { question: "Stack is?", options: ["LIFO", "FIFO"], answer: "LIFO" },
    { question: "Queue is?", options: ["FIFO", "LIFO"], answer: "FIFO" },
    { question: "Linked list?", options: ["Dynamic", "Static"], answer: "Dynamic" },
    { question: "Binary tree?", options: ["Hierarchical", "Linear"], answer: "Hierarchical" },
    { question: "Hash table?", options: ["Key-Value", "Tree"], answer: "Key-Value" },
  ],
  csharp: [
    { question: "C# is?", options: ["Language", "OS"], answer: "Language" },
    { question: "Used with?", options: [".NET", "React"], answer: ".NET" },
    { question: "Keyword for class?", options: ["class", "define"], answer: "class" },
    { question: "C# supports OOP?", options: ["Yes", "No"], answer: "Yes" },
    { question: "C# developed by?", options: ["Microsoft", "Google"], answer: "Microsoft" },
  ],

  "Computer Network": [
    {
      question: "What is a computer network?",
      options: ["A group of computers connected together", "A single computer system", "A software program", "None"],
      answer: "A group of computers connected together",
    },
    {
      question: "Which topology has all nodes connected to a central hub?",
      options: ["Star", "Ring", "Bus", "Mesh"],
      answer: "Star",
    },
    {
      question: "IP stands for?",
      options: ["Internet Protocol", "Internal Program", "Internet Process", "Input Protocol"],
      answer: "Internet Protocol",
    },
    {
      question: "Which protocol is used for sending emails?",
      options: ["SMTP", "FTP", "HTTP", "TCP"],
      answer: "SMTP",
    },
    {
      question: "OSI model has how many layers?",
      options: ["7", "5", "4", "6"],
      answer: "7",
    },
  ],

  "Operating System": [
    {
      question: "What is an OS?",
      options: ["Software that manages hardware", "A programming language", "A database", "None"],
      answer: "Software that manages hardware",
    },
    {
      question: "Which OS is open source?",
      options: ["Linux", "Windows", "macOS", "DOS"],
      answer: "Linux",
    },
    {
      question: "What is multitasking?",
      options: ["Running multiple programs at the same time", "Running one program", "Running programs sequentially", "None"],
      answer: "Running multiple programs at the same time",
    },
    {
      question: "Virtual memory is?",
      options: ["Using disk as RAM", "Extra RAM", "Memory inside CPU", "None"],
      answer: "Using disk as RAM",
    },
    {
      question: "Which is a process scheduling algorithm?",
      options: ["FCFS", "HTTP", "FTP", "SMTP"],
      answer: "FCFS",
    },
  ],
};

// ================= DUMMY LEADERBOARD =================
let dummyLeaderboard = [
  { name: "Alice", skill: "Computer Network", score: 4 },
  { name: "Bob", skill: "Operating System", score: 3 },
  { name: "Charlie", skill: "Computer Network", score: 5 },
];

// ================= COMPONENT =================
const SkillQuiz = () => {
  const allSkills = Object.keys(quizData);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [studentName, setStudentName] = useState("");

  const questions = quizData[selectedSkill] || [];

  const handleAnswer = (option) => {
    if (option === questions[index].answer) setScore(score + 1);

    if (index + 1 < questions.length) setIndex(index + 1);
    else {
      setQuizCompleted(true);
      // Add current student to dummy leaderboard
      dummyLeaderboard.push({
        name: studentName,
        skill: selectedSkill,
        score: score + (option === questions[index].answer ? 1 : 0),
      });
    }
  };

  const handleRestart = () => {
    setSelectedSkill("");
    setIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setStudentName("");
  };

  // ================= UI =================
  if (!selectedSkill) {
    return (
      <div className="quiz-container">
        <h2>Select a Skill to Start Quiz</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <div className="skill-list">
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => {
                if (!studentName.trim()) return alert("Enter your name first!");
                setSelectedSkill(skill);
              }}
              className="skill-btn"
            >
              {skill.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* ================= Leaderboard ================= */}
        <h3>🏆 Leaderboard (Dummy Data)</h3>
        <table className="leaderboard">
          <thead>
            <tr>
              <th>Student</th>
              <th>Skill</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {dummyLeaderboard.map((entry, i) => (
              <tr key={i}>
                <td>{entry.name}</td>
                <td>{entry.skill}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <h2>🎉 Quiz Completed!</h2>
        <p>👤 {studentName}</p>
        <p>
          Your Score: {score} / {questions.length}
        </p>
        <button onClick={handleRestart} className="skill-btn">
          Restart / Choose Another Skill
        </button>

        {/* ================= Leaderboard ================= */}
        <h3>🏆 Leaderboard</h3>
        <table className="leaderboard">
          <thead>
            <tr>
              <th>Student</th>
              <th>Skill</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {dummyLeaderboard.map((entry, i) => (
              <tr key={i}>
                <td>{entry.name}</td>
                <td>{entry.skill}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>{selectedSkill.replace("-", " ").toUpperCase()} Quiz</h2>
      <p>👤 {studentName}</p>
      <h3>{questions[index].question}</h3>
      <div className="options">
        {questions[index].options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>
      <p>
        Question {index + 1} / {questions.length}
      </p>
    </div>
  );
};

export default SkillQuiz;