import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import ReactPlayer from "react-player";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedVideos, setExpandedVideos] = useState({});
  const [exploreCourse, setExploreCourse] = useState(null); // for modal
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("yashtoken");

    fetch("http://localhost:6500/courses", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((response) => {
        if (!response.ok) {
          const message =
            response.status === 404 ? "Course not found!" : "Something went wrong!";
          throw new Error(message);
        }
        return response.json();
      })
      .then((data) => {
        setCourseData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedVideos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleJoinCourse = (courseId, courseVideos) => {
    alert(`You have joined the course with ID: ${courseId}`);
    localStorage.setItem("joinedCourseId", courseId);
    navigate("/ContentBox/myclasses", {
      state: { videos: courseVideos },
    });
  };

  const handleExplore = (course) => {
    setExploreCourse(course); // open modal
  };

  const closeModal = () => {
    setExploreCourse(null);
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="dashboard-content">
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>

        {loading ? (
          <div className="loading-container">
            <p className="loading-text">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-text">❌ {error}</p>
          </div>
        ) : (
          <ul className="course-list">
            {courseData.map((course) => {
              const isExpanded = expandedVideos[course._id] || false;
              return (
                <li key={course._id} className="course-item">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="course-image"
                  />
                  <div className="course-details">
                    <div className="button-left">
                      <button
                        className="btn btn-green"
                        onClick={() => handleJoinCourse(course._id, course.videos)}
                      >
                        ✅ Join
                      </button>
                      <button
                        className="btn btn-orange"
                        onClick={() => handleExplore(course)}
                      >
                        🔍 Explore
                      </button>
                    </div>

                    <h2 className="course-title">{course.title}</h2>
                    <p><strong>Teacher:</strong> {course.teacher}</p>
                    <p><strong>Start:</strong> {new Date(course.startDate).toLocaleDateString()}</p>
                    <p><strong>End:</strong> {new Date(course.endDate).toLocaleDateString()}</p>
                    <p><strong>Price:</strong> ₹{course.price}</p>
                    <p><strong>Enrollements:</strong> {Number(course.enrollements).toLocaleString()}</p>
                    <p><strong>Progress:</strong> {course.progress}%</p>

                    <div className={`video-player-container ${isExpanded ? "expanded" : ""}`}>
                      <strong>Course Video:</strong>
                      <ReactPlayer
                        url={course.link}
                        controls
                        width={isExpanded ? "100%" : "100%"}
                        height={isExpanded ? "360px" : "180px"}
                      />
                      <button
                        className="expand-btn"
                        onClick={() => toggleExpand(course._id)}
                      >
                        {isExpanded ? "Collapse" : "Expand"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

      {exploreCourse && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      {/* Course Image */}
      <img
        src={exploreCourse.image}
        alt={exploreCourse.title}
        className="modal-course-image"
      />
      <h2>{exploreCourse.title}</h2>
      <p><strong>Teacher:</strong> {exploreCourse.teacher}</p>
      <p><strong>Start Date:</strong> {new Date(exploreCourse.startDate).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(exploreCourse.endDate).toLocaleDateString()}</p>
      <p><strong>Price:</strong> ₹{exploreCourse.price}</p>
      <p><strong>Enrollements:</strong> {Number(exploreCourse.enrollements).toLocaleString()}</p>
      <p><strong>Progress:</strong> {exploreCourse.progress}%</p>
      <ReactPlayer url={exploreCourse.link} controls width="100%" height="400px" />
      <button className="close-modal" onClick={closeModal}>Close</button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default AdminDashboard;
