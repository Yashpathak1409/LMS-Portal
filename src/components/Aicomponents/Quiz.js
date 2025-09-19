import React, { useState } from "react";
import "./Quiz.css";
import StudentForm from "../StudentsPortal/StudentForm";
import SkillQuiz from "./SkillQuiz";
import Certificate from "../StudentsPortal/Certificate";

const skills = [
  "HTML", "CSS", "JavaScript",
  "React", "Node.js", "Express",
  "MongoDB", "SQL", "Python",
  "Java", "C++", "Git"
];

const Quiz = () => {
  const [currentSkill, setCurrentSkill] = useState(null); // selected skill
  const [studentName, setStudentName] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleStart = (skill) => {
    setCurrentSkill(skill);
  };

  const handleFormSubmit = (name) => {
    setStudentName(name);
  };

  const handleQuizComplete = (finalScore) => {
    setScore(finalScore);
    setQuizCompleted(true);
  };

  const handleRestart = () => {
    setCurrentSkill(null);
    setStudentName("");
    setQuizCompleted(false);
    setScore(0);
  };

  return (
    <div>
      {!currentSkill && (
        <section className="layout">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <span className="skill-name">{skill}</span>
              <button className="start-btn" onClick={() => handleStart(skill)}>
                Start Quiz
              </button>
            </div>
          ))}
        </section>
      )}

      {currentSkill && !studentName && (
        <StudentForm skill={currentSkill} onSubmit={handleFormSubmit} />
      )}

      {currentSkill && studentName && !quizCompleted && (
        <SkillQuiz
          skill={currentSkill}
          studentName={studentName}
          onComplete={handleQuizComplete}
        />
      )}

      {quizCompleted && (
        <Certificate
          studentName={studentName}
          skill={currentSkill}
          score={score}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Quiz;
