import React, { useState } from 'react';
import './Resume.css';

const Profile = () => {
  const [name, setName] = useState("Yash Pathak");
  const [email, setEmail] = useState("yash.pathak@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [tenthMarks, setTenthMarks] = useState("92%");
  const [twelfthMarks, setTwelfthMarks] = useState("89%");
  const [education, setEducation] = useState("B.Tech in Computer Science, GLA University");
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({ company: "", role: "", duration: "" });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleAddItem = (value, setter, inputSetter) => {
    if (value.trim() !== "") {
      setter(prev => [...prev, value]);
      inputSetter("");
    }
  };

  const handleAddExperience = () => {
    const { company, role, duration } = newExperience;
    if (company && role && duration) {
      setExperience([...experience, newExperience]);
      setNewExperience({ company: "", role: "", duration: "" });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const generateResume = () => {
    const resumeWindow = window.open('', '_blank');
    resumeWindow.document.write(`
      <html>
        <head>
          <title>Resume - ${name}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #2c3e50; }
            h2 { color: #34495e; }
            ul { padding-left: 20px; }
            .resume-photo {
              position: absolute;
              top: 20px;
              right: 20px;
              width: 100px;
              height: 100px;
              border-radius: 50%;
              object-fit: cover;
            }
          </style>
        </head>
        <body>
          <h1>${name}</h1>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <hr />
          <h2>Education</h2>
          <p>${education}</p>
          <hr />
          <p><strong>10th Marks:</strong> ${tenthMarks}</p>
          <p><strong>12th Marks:</strong> ${twelfthMarks}</p>
          <hr />
          <h2>Skills</h2>
          <ul>${skills.map(skill => `<li>${skill}</li>`).join('')}</ul>
          <hr />
          <h2>Experience</h2>
          <ul>${experience.map(exp => `<li><strong>${exp.role}</strong> at ${exp.company} (${exp.duration})</li>`).join('')}</ul>
          <hr />
          <h2>Extracurricular Activities</h2>
          <ul>${activities.map(act => `<li>${act}</li>`).join('')}</ul>
          <hr />
          <h2>Certificates</h2>
          <ul>${certificates.map(cert => `<li>${cert}</li>`).join('')}</ul>
          <hr />
          <h2>Projects</h2>
          <ul>${projects.map(proj => `<li>${proj}</li>`).join('')}</ul>
          ${photo ? `<img src="${photo}" class="resume-photo" alt="Profile Photo"/>` : ''}
        </body>
      </html>
    `);
    resumeWindow.document.close();
    resumeWindow.print();
  };

  return (
    <div className="profile-container">
      <h1>Welcome, {name}</h1>

      <div className="form-section">
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label>Phone:</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />

        <label>10th Marks:</label>
        <input type="text" value={tenthMarks} onChange={e => setTenthMarks(e.target.value)} />

        <label>12th Marks:</label>
        <input type="text" value={twelfthMarks} onChange={e => setTwelfthMarks(e.target.value)} />

        <label>Education:</label>
        <input type="text" value={education} onChange={e => setEducation(e.target.value)} />

        <label>Upload Photo:</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {photo && <img src={photo} alt="Profile" className="uploaded-photo" />}
      </div>

      <h2>Skills</h2>
      <input
        type="text"
        value={newSkill}
        onChange={e => setNewSkill(e.target.value)}
        placeholder="Add a skill"
      />
      <button onClick={() => handleAddItem(newSkill, setSkills, setNewSkill)}>Add Skill</button>
      <ul>{skills.map((s, i) => <li key={i}>{s}</li>)}</ul>

      <h2>Experience</h2>
      <input
        type="text"
        placeholder="Company"
        value={newExperience.company}
        onChange={e => setNewExperience({ ...newExperience, company: e.target.value })}
      />
      <input
        type="text"
        placeholder="Role"
        value={newExperience.role}
        onChange={e => setNewExperience({ ...newExperience, role: e.target.value })}
      />
      <input
        type="text"
        placeholder="Duration"
        value={newExperience.duration}
        onChange={e => setNewExperience({ ...newExperience, duration: e.target.value })}
      />
      <button onClick={handleAddExperience}>Add Experience</button>
      <ul>{experience.map((e, i) => (
        <li key={i}><strong>{e.role}</strong> at {e.company} ({e.duration})</li>
      ))}</ul>

      <h2>Extracurricular Activities</h2>
      <input
        type="text"
        value={newActivity}
        onChange={e => setNewActivity(e.target.value)}
        placeholder="Add activity"
      />
      <button onClick={() => handleAddItem(newActivity, setActivities, setNewActivity)}>Add Activity</button>
      <ul>{activities.map((a, i) => <li key={i}>{a}</li>)}</ul>

      <h2>Certificates</h2>
      <input
        type="text"
        value={newCertificate}
        onChange={e => setNewCertificate(e.target.value)}
        placeholder="Add certificate"
      />
      <button onClick={() => handleAddItem(newCertificate, setCertificates, setNewCertificate)}>Add Certificate</button>
      <ul>{certificates.map((c, i) => <li key={i}>{c}</li>)}</ul>

      <h2>Projects</h2>
      <input
        type="text"
        value={newProject}
        onChange={e => setNewProject(e.target.value)}
        placeholder="Add project"
      />
      <button onClick={() => handleAddItem(newProject, setProjects, setNewProject)}>Add Project</button>
      <ul>{projects.map((p, i) => <li key={i}>{p}</li>)}</ul>

      <button className="generate-resume-btn" onClick={generateResume}>Generate Resume</button>
    </div>
  );
};

export default Profile;
