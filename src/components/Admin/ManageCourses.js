import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./pannelstyle.css";
import { useNavigate } from "react-router-dom";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingCourseId, setDeletingCourseId] = useState(null); // To track which course is being deleted
  const [confirmText, setConfirmText] = useState("");
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

  const deleteCourse = async (id) => {
    if (confirmText !== "CONFIRM") {
      toast.error("❌ Type 'CONFIRM' to delete the course!", { position: "top-right" });
      return;
    }

    setDeletingCourseId(id); // Set the deleting course ID to track loading state for that specific course

    try {
      await axios.delete(`http://localhost:6500/courses/${id}`);
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== id));
      toast.success("✅ Course deleted successfully!", { position: "top-right" });
      setConfirmText("");
    } catch (err) {
      toast.error("❌ Failed to delete course.");
    } finally {
      setDeletingCourseId(null); // Reset deleting state after action
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="manage-courses">
      <h2>📚 Available Courses</h2>

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
                <button
                  className="update-button"
                  onClick={() => navigate(`/admin/update-course/${course._id}`)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteCourse(course._id)}
                  disabled={deletingCourseId === course._id} // Disable button for the course being deleted
                >
                  {deletingCourseId === course._id ? "⏳ Deleting..." : "🗑 Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No courses available.</p>
      )}

      <div className="confirm-box">
        <p>Type <strong>CONFIRM</strong> To Delete a Course From The Table:</p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="confirm-input"
        />
      </div>
    </div>
  );
};

export default ManageCourses;
