import React from "react";
import { Link } from "react-router-dom";

const courses = [
  "HTML & CSS", "JavaScript", "React", "Node.js",
  "Python", "Java", "C++", "Linux",
  "Go", "Data Science", "ML", "Cloud","computer Networks","Os"
];

const colors = [
  "#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF6FD8","#845EC2",
  "#00C9A7","#FF9671","#FFC75F","#F9F871","#B5EAEA","#FFABAB",
];

const Material = () => {
  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px", // center content, narrower
        margin: "auto",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        Available Courses & Materials
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", // 4 smaller columns
          gap: "15px",
          maxHeight: "70vh",
          overflowY: "auto",
          paddingRight: "10px",
        }}
      >
        {courses.map((course, index) => (
          <div
            key={index}
            style={{
              padding: "15px",
              color: "#fff",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.12)",
              backgroundColor: colors[index % colors.length],
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "150px", // smaller height
              transition: "transform 0.2s",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              {course}
            </span>

            <Link
              to={`/StudentsPortal/skill/${encodeURIComponent(course)}/1`}
              style={{
                padding: "5px 12px",
                fontSize: "12px",
                backgroundColor: "rgba(255,255,255,0.85)",
                color: "#333",
                border: "none",
                borderRadius: "50px",
                textDecoration: "none",
                fontWeight: "600",
                alignSelf: "flex-start",
                textAlign: "center",
                transition: "background-color 0.2s",
              }}
            >
              Explore Content
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Material;