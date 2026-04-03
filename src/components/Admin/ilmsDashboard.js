import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

// Dummy Data
const clusterData = [
  { name: "High-Performers", value: 40 },
  { name: "Average-Performers", value: 35 },
  { name: "At-Risk", value: 25 },
];

const clusterColors = ["#4D96FF", "#6BCB77", "#FF6B6B"];

// Skills and colors
const skills = ["Java", "C++", "React", "MongoDB", "Python"];
const skillColors = ["#FF6B6B", "#4D96FF", "#FFD93D", "#6BCB77", "#845EC2"];

// Mock Interview Progress Data (skill-wise per week)
const interviewProgressData = [
  { week: "W1", Java: 10, "C++": 8, React: 12, MongoDB: 5, Python: 7 },
  { week: "W2", Java: 15, "C++": 10, React: 15, MongoDB: 8, Python: 9 },
  { week: "W3", Java: 18, "C++": 12, React: 20, MongoDB: 10, Python: 12 },
  { week: "W4", Java: 20, "C++": 15, React: 22, MongoDB: 12, Python: 15 },
  { week: "W5", Java: 25, "C++": 18, React: 28, MongoDB: 15, Python: 18 },
];

// Weekly Learning Progress (skill-wise per week)
const weeklyLearningData = [
  { week: "W1", Java: 12, "C++": 7, React: 10, MongoDB: 6, Python: 8 },
  { week: "W2", Java: 18, "C++": 12, React: 15, MongoDB: 9, Python: 12 },
  { week: "W3", Java: 22, "C++": 15, React: 18, MongoDB: 12, Python: 15 },
  { week: "W4", Java: 25, "C++": 18, React: 20, MongoDB: 15, Python: 18 },
  { week: "W5", Java: 30, "C++": 22, React: 25, MongoDB: 18, Python: 22 },
];

// Dummy students with skills
const students = {
  "High-Performers": Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Student HP${i + 1}`,
    score: 90 - i,
    skills: skills.slice(0, Math.floor(Math.random() * skills.length) + 1), // random skills
  })),
  "Average-Performers": Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Student AP${i + 1}`,
    score: 70 - i,
    skills: skills.slice(0, Math.floor(Math.random() * skills.length) + 1),
  })),
  "At-Risk": Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Student AR${i + 1}`,
    score: 50 - i,
    skills: skills.slice(0, Math.floor(Math.random() * skills.length) + 1),
  })),
};

const GraphicalDashboardWithSkillBars = () => {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const styles = {
    container: {
      padding: "30px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1400px",
      margin: "auto",
    },
    title: { textAlign: "center", marginBottom: "40px", color: "#333", fontSize: "32px" },
    summaryCards: {
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "50px",
    },
    summaryCard: {
      flex: "1 1 200px",
      background: "#fff",
      borderRadius: "16px",
      padding: "20px",
      textAlign: "center",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      cursor: "pointer",
      transition: "transform 0.3s",
    },
    cardTitle: { fontWeight: "600", marginBottom: "10px" },
    chartsSection: { display: "flex", flexWrap: "wrap", gap: "40px" },
    chartWrapper: { flex: "1 1 600px", background: "#f7f7f7", borderRadius: "16px", padding: "20px" },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "16px",
      width: "80%",
      maxHeight: "80%",
      overflowY: "auto",
    },
    closeBtn: { position: "absolute", top: "10px", right: "20px", cursor: "pointer", fontSize: "20px", fontWeight: "600" },
  };

  const renderCustomLabel = ({ cx, cy, value }) => (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontSize: "20px", fontWeight: "700", fill: "#333" }}
    >
      {value}%
    </text>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>iLMS Dashboard</h1>

      {/* Summary Cards */}
      <div style={styles.summaryCards}>
        {clusterData.map((c, idx) => (
          <div key={idx} style={styles.summaryCard} onClick={() => setSelectedCluster(c.name)}>
            <h3 style={styles.cardTitle}>{c.name}</h3>
            <ResponsiveContainer width="100%" height={150}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: c.name, value: c.value }]} startAngle={180} endAngle={-180}>
                <RadialBar minAngle={15} clockWise dataKey="value" cornerRadius={20} fill={clusterColors[idx]} label={renderCustomLabel} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={styles.chartsSection}>
        {/* Pie Chart */}
        <div style={styles.chartWrapper}>
          <h3>Student Cluster Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={clusterData} dataKey="value" nameKey="name" outerRadius={100} label>
                {clusterData.map((entry, index) => <Cell key={index} fill={clusterColors[index % clusterColors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mock Interview Progress (Stacked Bar by Skills) */}
        <div style={styles.chartWrapper}>
          <h3>Mock Interview Progress (Students per Skill)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interviewProgressData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              {skills.map((skill, idx) => (
                <Bar key={idx} dataKey={skill} stackId="a" fill={skillColors[idx]} radius={[8, 8, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Learning Progress (Stacked Bar by Skills) */}
        <div style={styles.chartWrapper}>
          <h3>Weekly Learning Progress (Students per Skill)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyLearningData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              {skills.map((skill, idx) => (
                <Bar key={idx} dataKey={skill} stackId="a" fill={skillColors[idx]} radius={[8, 8, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal for Top Students */}
      {selectedCluster && (
        <div style={styles.modalOverlay} onClick={() => setSelectedCluster(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.closeBtn} onClick={() => setSelectedCluster(null)}>✖</div>
            <h2>Top 20 Students - {selectedCluster}</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px", textAlign: "left" }}>#</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Name</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Score</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Skills</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Analysis</th>
                </tr>
              </thead>
              <tbody>
                {students[selectedCluster].map((s, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f7f7f7" : "#fff" }}>
                    <td style={{ padding: "10px" }}>{i + 1}</td>
                    <td style={{ padding: "10px" }}>{s.name}</td>
                    <td style={{ padding: "10px" }}>{s.score}</td>
                    <td style={{ padding: "10px" }}>{s.skills.join(", ")}</td>
                    <td style={{ padding: "10px" }}>
                      <a
                        href="home"
                        style={{ color: "#4D96FF", textDecoration: "none", fontWeight: "600" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedStudent(s);
                        }}
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Individual Student Skill Progress Modal */}
      {selectedStudent && (
        <div style={styles.modalOverlay} onClick={() => setSelectedStudent(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.closeBtn} onClick={() => setSelectedStudent(null)}>✖</div>
            <h2>{selectedStudent.name} - Skill Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={selectedStudent.skills.map(skill => ({
                  skill,
                  score: Math.floor(Math.random() * 100) + 1 // dummy progress for demo
                }))}
              >
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#4D96FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphicalDashboardWithSkillBars;