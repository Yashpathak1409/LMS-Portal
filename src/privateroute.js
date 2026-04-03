import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("yashtoken"); // ✅ FIXED
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
