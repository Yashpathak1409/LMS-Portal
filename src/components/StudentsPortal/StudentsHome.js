import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

const StudentsHome = () => {
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedVideos, setExpandedVideos] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("yashtoken");

        fetch("http://localhost:6500/courses", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then((response) => {
                if (!response.ok) {
                    const message = response.status === 404 ? "Course not found!" : "Something went wrong!";
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

    const handleJoinCourse = (course) => {
        alert(`You have joined the course: ${course.title}`);
        localStorage.setItem("joinedCourseId", course._id);
        navigate("/ContentBox/myclasses", {
            state: { videos: course.videos },
        });
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-content">
                <h1 className="text-3xl font-bold text-blue-700">Welcome back, Student 👋</h1>
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
                                                onClick={() => handleJoinCourse(course)}
                                                aria-label={`Join course: ${course.title}`}
                                            >
                                                ✅ Join Course
                                            </button>
                                        </div>

                                        <h2 className="course-title">{course.title}</h2>
                                        <p><strong>Teacher:</strong> {course.teacher}</p>
                                        <p><strong>Start Date:</strong> {new Date(course.startDate).toLocaleDateString()}</p>
                                        <p><strong>End Date:</strong> {new Date(course.endDate).toLocaleDateString()}</p>
                                        <p><strong>Price:</strong> ₹{course.price}</p>
                                        <p><strong>Enrollements:</strong> {Number(course.enrollements).toLocaleString()}</p>
                                        <p><strong>Progress:</strong> {course.progress}%</p>

                                        <div className={`video-player-container ${isExpanded ? "expanded" : ""}`}>
                                            <strong>Course Video:</strong>
                                            <ReactPlayer
                                                url={course.link}
                                                controls
                                                width={isExpanded ? "100%" : "480px"}
                                                height={isExpanded ? "360px" : "250px"}
                                            />
                                            <button
                                                className="expand-btn"
                                                onClick={() => toggleExpand(course._id)}
                                                aria-label={isExpanded ? "Collapse video" : "Expand video"}
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
            </div>
        </div>
    );
};

export default StudentsHome;
