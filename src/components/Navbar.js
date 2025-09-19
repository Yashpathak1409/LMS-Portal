import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";
import { AuthContext } from "../AuthContext"; // adjust path if needed

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleLoginClick = (e) => {
    const isSignedUp = localStorage.getItem("isSignedUp") === "true";

    if (!isSignedUp) {
      e.preventDefault();
      toast.error("Please sign up first!");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout(); // Call context logout
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">ILMS Portal</h1>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/StudentsPortal/StudentCourses">Courses</Link></li>
        <li><Link to="/Dashboard">Profile</Link></li>
        <li><Link to="/StudentsPortal/Quiz">Quiz-section</Link></li>
        <li><Link to="/admin/Admindashboard">Admin control</Link></li>
          <li><Link to="/StudentsPortal/MockInterview">Mock-interview</Link></li>
                    <li><Link to="/Aicomponents/Aichatbot">MAGEN-AI</Link></li>
                                        <li><Link to="/Aicomponents/SeedQuestion">Seeding</Link></li>

 <li><Link to="/Aicomponents/AiQuiz">Ai-Quiz</Link></li>

        {!isLoggedIn ? (
          <>
            <li><a href="/login" onClick={handleLoginClick}>Login</a></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/StudentsPortal/StudentsHome">Dashboard</Link></li>
            <li>
              <button className="navelink logout button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
