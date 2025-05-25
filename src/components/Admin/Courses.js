import React, { useState } from "react";
import "./pannelstyle.css";

const CourseForm = () => {
  const [course, setCourse] = useState({
    title: "",
    teacher: "",
    image: "",
    startDate: "",
    endDate: "",
    price: "",
    enrollements: "",
    progress: "",
    videos: [{ link: "", title: "", description: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...course.videos];
    updatedVideos[index][field] = value;
    setCourse({ ...course, videos: updatedVideos });
  };

  const addVideoField = () => {
    setCourse({
      ...course,
      videos: [...course.videos, { link: "", title: "", description: "" }],
    });
  };

  const removeVideoField = (index) => {
    const updatedVideos = course.videos.filter((_, i) => i !== index);
    setCourse({ ...course, videos: updatedVideos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:6500/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        alert("Course added successfully!");
        setCourse({
          title: "",
          teacher: "",
          image: "",
          startDate: "",
          endDate: "",
          price: "",
          enrollements: "",
          progress: "",
          videos: [{ link: "", title: "", description: "" }],
        });
      } else {
        alert("Failed to add course");
      }
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <div className="course-form-container">
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit} className="course-form">
        <input type="text" name="title" value={course.title} onChange={handleChange} placeholder="Course Title" required />

        <input type="text" name="teacher" value={course.teacher} onChange={handleChange} placeholder="Instructor Name" required />

        <input type="url" name="image" value={course.image} onChange={handleChange} placeholder="Image URL" required />

        <label>Start Date:</label>
        <input type="date" name="startDate" value={course.startDate} onChange={handleChange} required />

        <label>End Date:</label>
        <input type="date" name="endDate" value={course.endDate} onChange={handleChange} required />

        <input type="number" name="price" value={course.price} onChange={handleChange} placeholder="Price (₹)" required />

        <input type="number" name="enrollements" value={course.enrollements} onChange={handleChange} placeholder="Enrollements" required />

        <input type="number" name="progress" value={course.progress} onChange={handleChange} placeholder="Progress (%)" min="0" max="100" required />

        <div className="video-links-container">
          <label>Video Details:</label>
          {course.videos.map((video, index) => (
            <div key={index} className="video-link-field">
              <input
                type="url"
                placeholder={`Video Link ${index + 1}`}
                value={video.link}
                onChange={(e) => handleVideoChange(index, "link", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Video Title"
                value={video.title}
                onChange={(e) => handleVideoChange(index, "title", e.target.value)}
                required
              />
              <textarea
                placeholder="Video Description"
                value={video.description}
                onChange={(e) => handleVideoChange(index, "description", e.target.value)}
                required
              ></textarea>
              {index > 0 && (
                <button type="button" onClick={() => removeVideoField(index)} className="remove-btn">❌</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addVideoField} className="add-btn">➕ Add Video</button>
        </div>

        <button type="submit" className="submit-btn">Submit Course</button>
      </form>
    </div>
  );
};

export default CourseForm;
