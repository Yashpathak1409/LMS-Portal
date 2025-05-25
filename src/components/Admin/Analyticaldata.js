import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import "./pannelstyle.css";

const AdminDashboard = () => {
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("yashtoken");
        fetch("http://localhost:6500/courses", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Failed to fetch courses: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                console.log("✅ Courses fetched:", data);
                setCourseData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("❌ Fetch Error:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="admin-dashboard">
            <AdminNavbar />
            <div className="dashboard-content">
                <h1 className="text-3xl font-bold text-blue-700"> Welcome in Admin Dashboard</h1>
                {loading ? (
                    <p className="loading-text">Loading courses...</p>
                ) : error ? (
                    <p className="error-text">❌ {error}</p>
                ) : (
                    <>
                        {/* Bar Chart */}
                        <div className="bar-chart-container">
                            <h2 className="chart-title">Course Progress & Enrollments</h2>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={courseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="title" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="progress" fill="#1e88e5" name="Completion (%)" />
                                    <Bar dataKey="enrollements" fill="#ff7043" name="Enrollments" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}
                        <div className="pie-chart-container">
                            <h2 className="chart-title">Enrollment Distribution</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie 
                                        data={courseData} 
                                        dataKey="enrollements" 
                                        nameKey="title" 
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius={100} 
                                        label
                                    >
                                        {courseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`hsl(${(index * 50) % 360}, 70%, 50%)`} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Table */}
                        <div className="index-table-container">
                            <h2 className="chart-title">Course Enrollment Summary</h2>
                            <table className="index-table">
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Enrollments</th>
                                        <th>Progress (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.map((course) => (
                                        <tr key={course._id}>
                                            <td>{course.title}</td>
                                            <td>{course.enrollements}</td>
                                            <td>{course.progress}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td><strong>Total</strong></td>
                                        <td><strong>{courseData.reduce((acc, course) => acc + course.enrollements, 0)}</strong></td>
                                        <td>-</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;