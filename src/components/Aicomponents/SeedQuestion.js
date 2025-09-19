import React, { useState } from "react";

const SeedSQLQuestions = () => {
  const [loading, setLoading] = useState(false);

  const questions = [
    { question: "What is DBMS?", tags: ["DBMS", "Basics"] },
  { question: "What is a relational database?", tags: ["DBMS", "Relational"] },
  { question: "What is a primary key?", tags: ["DBMS", "Keys"] },
  { question: "What is a foreign key?", tags: ["DBMS", "Keys"] },
  { question: "What is normalization?", tags: ["DBMS", "Database Design"] },
  { question: "What is denormalization?", tags: ["DBMS", "Database Design"] },
  { question: "What is a transaction?", tags: ["DBMS", "Transactions"] },
  { question: "Explain ACID properties", tags: ["DBMS", "Transactions"] },
  { question: "What is a view?", tags: ["DBMS", "Views"] },
  { question: "What is an index?", tags: ["DBMS", "Performance"] },
  { question: "What is a stored procedure?", tags: ["DBMS", "Procedures"] },
  { question: "What is a trigger?", tags: ["DBMS", "Triggers"] },
  { question: "What is a schema?", tags: ["DBMS", "Database Design"] },
  { question: "What is a database constraint?", tags: ["DBMS", "Constraints"] },
  { question: "Difference between DELETE and TRUNCATE?", tags: ["DBMS", "DML"] },
  { question: "What is a cursor?", tags: ["DBMS", "Queries"] },
  { question: "What is a subquery?", tags: ["DBMS", "Queries"] },
  { question: "What is a join in DBMS?", tags: ["DBMS", "Joins"] },
  { question: "Types of joins?", tags: ["DBMS", "Joins"] },
  { question: "Difference between DBMS and RDBMS?", tags: ["DBMS", "Basics"] }
  ];

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:6500/api/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill: "SQL",
          difficulty: "easy",
          questions,
        }),
      });

      const data = await res.json();
      alert(data.message || "Seed completed!");
    } catch (err) {
      console.error(err);
      alert("Error seeding questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h2>Seed SQL Questions</h2>
      <button
        onClick={handleSeed}
        disabled={loading}
        style={{
          padding: "12px 25px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#1e90ff",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Seeding..." : "Seed Questions"}
      </button>
    </div>
  );
};

export default SeedSQLQuestions;
