import React from "react";
import "./StudentProfile.css";
import { FaEnvelope, FaUniversity, FaMapMarkerAlt, FaPhone, FaGraduationCap } from "react-icons/fa";

const Profile = () => {
  const user = {
    name: "Yash Pathak",
    email: "yash@example.com",
    phone: "+91 9876543210",
    location: "Mathura, India",
    university: "GLA University",
    degree: "BTech CSE - 3rd Year",
    avatar: "https://i.pravatar.cc/150?img=8",
    skills: ["React", "MongoDB", "HTML", "CSS", "JavaScript", "Node.js", "Python"],
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.avatar} alt="Profile" className="profile-avatar" />
        <h1>{user.name}</h1>
        <p>{user.degree} @ {user.university}</p>
      </div>

      <div className="profile-details">
        <div className="profile-card">
          <FaEnvelope className="card-icon" />
          <h3>Email</h3>
          <p>{user.email}</p>
        </div>

        <div className="profile-card">
          <FaPhone className="card-icon" />
          <h3>Phone</h3>
          <p>{user.phone}</p>
        </div>

        <div className="profile-card">
          <FaMapMarkerAlt className="card-icon" />
          <h3>Location</h3>
          <p>{user.location}</p>
        </div>
      </div>

      <div className="profile-skills">
        <h2>Skills</h2>
        <div className="skill-badges">
          {user.skills.map((skill, idx) => (
            <span key={idx} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
