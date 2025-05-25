import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/global.css";
import { AuthContext } from "../AuthContext"; // adjust path if needed

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both fields!");
      return;
    }

    const normalizedRole = role.toLowerCase();

    if (!["user", "admin", "teacher"].includes(normalizedRole)) {
      toast.error("Invalid role selected!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:6500/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: normalizedRole }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (response.ok) {
        toast.success("Login successful! Redirecting...");

        // Save token and user data
        localStorage.setItem("yashtoken", data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", data.name || "User");
        localStorage.setItem("role", data.role || normalizedRole);
        localStorage.setItem("lastLogin", new Date().toISOString());

        // Update context
        login(data.token);

        // Navigate based on role
        setTimeout(() => {
          switch (data.role) {
            case "admin":
              navigate("/admin/Admindashboard");
              break;
            case "teacher":
              navigate("/StaffDashboard");
              break;
            case "user":
              navigate("/StudentsPortal/StudentsHome");
              break;
            default:
              toast.error("Unknown role! Redirecting to default.");
              navigate("/UserDashboard");
              break;
          }
        }, 2000);
      } else {
        toast.error(data.message || "Login failed! Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="role-select"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        Click here to <Link to="/Resetpassword">Reset Password</Link>
      </p>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
