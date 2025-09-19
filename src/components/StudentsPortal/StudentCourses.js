import React, { useEffect, useState } from "react";
import axios from "axios";
import "./studentpanel.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleDummyPurchase = (courseId) => {
    const updated = courses.map((course) =>
      course._id === courseId ? { ...course, purchased: true } : course
    );
    setCourses(updated);
    toast.success("✅ Course purchased (dummy simulation)!");
  };

  const handleJoinCourse = (course) => {
    if (!Array.isArray(course.videos) || course.videos.length === 0) {
      toast.error("⚠️ No videos available for this course.");
      return;
    }

    toast.success(`✅ You joined: ${course.title}`);
    localStorage.setItem("joinedCourseId", course._id);
    navigate("/ContentBox/myclasses", {
      state: { videos: course.videos },
    });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="manage-courses">
      <h2>📚 Available Courses</h2>
      <ToastContainer />

      {loading && <p>⏳ Loading courses...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && courses.length > 0 ? (
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <p className="course-title">{course.title}</p>
              {course.purchased ? (
                <button className="join-btn" onClick={() => handleJoinCourse(course)}>
                  Join
                </button>
              ) : (
                <button className="purchase-btn" onClick={() => handleDummyPurchase(course._id)}>
                  Purchase
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p>No courses available.</p>
      )}
    </div>
  );
};

export default StudentCourses;
