import React from "react";
import { Link } from "react-router-dom";
import "./home.css"; // Custom styles

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-content">
          <h1>Welcome to LMS Portal 📘</h1>
          <p>Empower your learning journey with expert courses and certifications.</p>
          <div className="hero-buttons">
            <Link to="/Dashboard" className="home-btn primary">Create-Resume</Link>
            <Link to="/StudentsPortal/StudentsHome" className="home-btn primary">Explore Courses</Link>
            <Link to="/register" className="home-btn secondary">Join Now</Link>
            <Link to="/helpcenter" className="home-btn secondary">Contact-us</Link>
          </div>
        </div>
        <img
          src="https://img.freepik.com/free-vector/online-learning-isometric-landing-page_107791-11588.jpg?w=1060&t=st=1713808887~exp=1713809487~hmac=80e10d456b5e7a4a765e37e7349f5d198f25b2d28a88a8c25e43855d65d14e90"
          alt="Learning"
          className="hero-image"
          
        />
        
      </div>

      {/* Highlights Section */}
      <div className="highlights">
        <div className="highlight-card">
          <h2>5000+ Students</h2>
          <p>Join a thriving learning community.</p>
        </div>
        <div className="highlight-card">
          <h2>100+ Courses</h2>
          <p>Explore courses across all domains.</p>
        </div>
        <div className="highlight-card">
          <h2>Top Instructors</h2>
          <p>Learn from industry-leading experts.</p>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="featured-courses">
        <h2>🔥 Featured Courses</h2>
        <div className="course-cards">
          <div className="course-card">
            <img src="https://img.icons8.com/fluency/96/000000/code.png" alt="Coding" />
            <h3>Full Stack Web Development</h3>
            <p>Master HTML, CSS, JS, React & Node.js</p>
          </div>
          <div className="course-card">
            <img src="https://img.icons8.com/color/96/000000/artificial-intelligence.png" alt="AI" />
            <h3>Artificial Intelligence</h3>
            <p>Learn AI concepts, ML models, and real-world projects.</p>
          </div>
          <div className="course-card">
            <img src="https://img.icons8.com/color/96/000000/data-configuration.png" alt="Data" />
            <h3>Data Science</h3>
            <p>Analyze, visualize, and unlock data-driven insights.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2025 LMS Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
