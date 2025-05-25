import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./UpdateCourse.css";

export default function UpdateCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    link: ""
  });

  // ✅ Memoized fetchCourse to avoid useEffect warning
  const fetchCourse = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6500/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    }
  }, [courseId]);

  const handleInputChange = (e) => {
    setNewVideo({ ...newVideo, [e.target.name]: e.target.value });
  };

  const handleAddVideo = async () => {
    try {
      await axios.put(`http://localhost:6500/courses/${courseId}`, newVideo);
      setShowDialog(false);
      setNewVideo({ title: "", description: "", link: "" });
      fetchCourse(); // Refresh course after adding video
    } catch (error) {
      console.error("Failed to add video:", error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="course-container">
      <div className="course-card">
        <img src={course.image} alt="Course" />
        <h2>{course.title}</h2>
        <p><strong>Teacher:</strong> {course.teacher}</p>
        <p><strong>Start:</strong> {new Date(course.startDate).toDateString()}</p>
        <p><strong>End:</strong> {new Date(course.endDate).toDateString()}</p>
        <p><strong>Price:</strong> ₹{course.price}</p>
        <p><strong>Enrollements:</strong> {course.enrollements}</p>
        <p><strong>Progress:</strong> {course.progress}%</p>
        <button className="add-video-btn" onClick={() => setShowDialog(true)}>Add Video</button>

        <h3>Videos</h3>
        {course.videos.map((video, idx) => (
          <div key={video._id} className="video-card">
            <h4>{idx + 1}. {video.title}</h4>
            <p>{video.description}</p>
            <a href={video.link} target="_blank" rel="noopener noreferrer">Watch Video</a>
          </div>
        ))}
      </div>

      {showDialog && (
        <div className="dialog">
          <div className="dialog-box">
            <h3>Add New Video</h3>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newVideo.title}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newVideo.description}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="link"
              placeholder="Video Link"
              value={newVideo.link}
              onChange={handleInputChange}
            />
            <button onClick={handleAddVideo}>Submit</button>
            <button onClick={() => setShowDialog(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
