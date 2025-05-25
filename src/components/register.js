import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = ({ onSignup }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only letters and spaces for name
    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) return;

    // Ensure role is lowercase
    setFormData({
      ...formData,
      [name]: name === "role" ? value.toLowerCase() : value,
    });
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]{6,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const allowedDomains =
      /@([a-zA-Z0-9]+\.)+(com|org|gov|gov\.in|nic\.in|ac\.in|edu\.in|mil|gouv\.fr|gov\.uk|canada\.ca|gc\.ca|gov\.au|bund\.de|gov\.sg|state\.gov|usda\.gov|cia\.gov)$/;
    return emailRegex.test(email) && allowedDomains.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email! Must have at least 6 letters before '@' and use a valid domain.");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Weak password! Must be at least 8 characters, include uppercase, number, and special character.");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a role!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:6500/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Registration successful! Redirecting...");
        setFormData({ name: "", email: "", password: "", role: "" });

        // Call onSignup to set the isSignedUp flag in the parent
        onSignup();

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Registration failed! Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="role-select"
          required
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;
