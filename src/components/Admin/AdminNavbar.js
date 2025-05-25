import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";// adjust the path
import './pannelstyle.css';

const AdminNavbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-sidebar">
      <ul className="admin-menu">
        {isLoggedIn && (
          <>
            <li>
              <Link to="/admin/Admindashboard" className="admin-link">
                Dashboard
              </Link>
            </li>
            {/* other links visible only when logged in */}
            <li>
              <Link to="/admin/Analyticalview" className="admin-link">
                Analytical view
              </Link>
            </li>
            <li>
              <Link to="/admin/ManageCourses" className="admin-link">
                Manage Courses
              </Link>
            </li>
            <li>
              <Link to="/admin/manageusers" className="admin-link">
                Manage Users
              </Link>
            </li>
            <li>
              <Link to="/admin/Courses" className="admin-link">
                Addup-Courses
              </Link>
            </li>
            <li>
              <Link to="/home" className="admin-link">
                Students Home
              </Link>
            </li>

            <li>
              <button onClick={handleLogout} className="admin-link logout-button">
                Logout
              </button>
            </li>
          </>
        )}

        {!isLoggedIn && (
          <li>
            <Link to="/admin/login" className="admin-link">
              Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default AdminNavbar;
