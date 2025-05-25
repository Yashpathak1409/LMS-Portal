import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./studentpanel.css";
import { useNavigate } from "react-router-dom";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:6500/coursesyash");
      setCourses(response.data);
    } catch (err) {
      setError("❌ Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="manage-courses">
      <h2>📚 Available Courses For Students</h2>

      <ToastContainer />

      {loading && <p>⏳ Loading courses...</p>}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchCourses} className="retry-button">🔄 Retry</button>
        </div>
      )}

      {!loading && !error && courses.length > 0 ? (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course._id} className="course-item">
              <span>{course.title}</span>
              <div className="button-group">
                {course.purchased ? (
                  <button
                    className="update-button"
                    onClick={() => navigate(`/ContentBox/myclasses${course._id}`)}
                  >
                    Join
                  </button>
                ) : (
                  <button
                    className="purchase-button"
                    onClick={() => navigate(`/purchase/${course._id}`)}
                  >
                    Purchase
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No courses available.</p>
      )}
    </div>
  );
};

export default StudentCourses;
