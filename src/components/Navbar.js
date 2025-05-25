import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/global.css";
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
      <h1 className="logo">LMS Portal</h1>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/StudentsPortal/StudentCourses">Courses</Link></li>
        <li><Link to="/Dashboard">Profile</Link></li>
        <li><Link to="/admin/Admindashboard">Admin control</Link></li>

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
