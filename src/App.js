import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your components
import Dashboard from "./components/Resume";
import Home from "./components/Home";
import HelpCenter from "./components/helpcenter";
import Login from "./components/login";
import Register from "./components/register";
import ResetPassword from "./components/Resetpassword";
import Navbar from "./components/Navbar";

// Admin Panel Components
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageCourses from "./components/Admin/ManageCourses";
import UsersList from "./components/Admin/UsersList";
import AdminNavbar from "./components/Admin/AdminNavbar";
import Assistant from "./components/Admin/Assistant";
import Courses from "./components/Admin/Courses";
import RecordClass from "./components/Admin/RecordClass";
import Analyticaldata from "./components/Admin/Analyticaldata";

import MyClasses from "./components/ContentBox/myclasses";
import MyClassroom from "./components/ContentBox/myclassroom";
import UpdateCourse from "./components/Admin/UpdateCourse";

import StudentCourses from "./components/StudentsPortal/StudentCourses";
import StudentsHome from "./components/StudentsPortal/StudentsHome";
import StudentProfile from "./components/StudentsPortal/StudentProfile";

// PrivateRoute
import PrivateRoute from "./privateroute";

import "./App.css";

function App() {
  const [isSignedUp, setIsSignedUp] = useState(localStorage.getItem('isSignedUp') === 'true');

  const handleSignup = () => {
    setIsSignedUp(true);
    localStorage.setItem('isSignedUp', 'true');
    toast.success("Signup successful!");
  };

  return (
    <Router>
      <MainLayout isSignedUp={isSignedUp} setIsSignedUp={setIsSignedUp} handleSignup={handleSignup} />
    </Router>
  );
}

function MainLayout({ isSignedUp, setIsSignedUp, handleSignup }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? (
        <AdminNavbar />
      ) : (
        <Navbar onLoginClick={() => {
          if (!isSignedUp) toast.error("Please sign up first");
        }} />
      )}

      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register onSignup={handleSignup} />} />
          <Route path="/login" element={isSignedUp ? <Login /> : <Navigate to="/register" />} />
          <Route path="/" element={isSignedUp ? <ResetPassword /> : <Navigate to="/register" />} />
          <Route path="/Resetpassword" element={isSignedUp ? <ResetPassword /> : <Navigate to="/register" />} />

          {/* Protected User Routes using PrivateRoute */}
          <Route path="/Dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/helpcenter" element={<PrivateRoute><HelpCenter /></PrivateRoute>} />
          <Route path="/StudentsPortal/StudentsHome" element={<PrivateRoute><StudentsHome /></PrivateRoute>} />
          <Route path="/StudentsPortal/StudentCourses" element={<PrivateRoute><StudentCourses /></PrivateRoute>} />
          <Route path="/StudentsPortal/StudentProfile" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/adminDashboard" element={<AdminDashboard />} />
          <Route path="/admin/analyticalview" element={<Analyticaldata />} />
          <Route path="/admin/ManageCourses" element={<ManageCourses />} />
          <Route path="/admin/Assistant" element={<Assistant />} />
          <Route path="/admin/ManageUsers" element={<UsersList />} />
          <Route path="/admin/Courses" element={<Courses />} />
          <Route path="/admin/RecordClass" element={<RecordClass />} />
          <Route path="/ContentBox/myclasses" element={<MyClasses />} />
          <Route path="/ContentBox/myclassroom" element={<MyClassroom />} />
          <Route path="/admin/update-course/:courseId" element={<UpdateCourse />} />
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
