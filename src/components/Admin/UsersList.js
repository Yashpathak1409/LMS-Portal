import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./pannelstyle.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("yashtoken");

    if (!token) {
      setError("⚠️ Authentication failed. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:6500/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter out soft deleted users (those marked with 'deleted: true')
      const activeUsers = response.data.filter(user => !user.deleted);

      setUsers(activeUsers);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Unable to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm("❗ Are you sure you want to delete this user?");
    if (!confirmed) return;

    const promptText = window.prompt(
      "⚠️ This action cannot be undone.\nPlease type DELETE to confirm:"
    );

    if (promptText !== "DELETE") {
      alert("❌ Deletion cancelled. You must type DELETE exactly.");
      return;
    }

    const token = localStorage.getItem("yashtoken");

    if (!token) {
      setError("⚠️ Authentication failed. Please log in again.");
      return;
    }

    try {
      await axios.delete(`http://localhost:6500/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the user from the list after deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("✅ User deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to delete user.");
    }
  };

  const softDeleteUser = async (userId) => {
    const confirmed = window.confirm("❗ Are you sure you want to soft delete this user?");
    if (!confirmed) return;

    const token = localStorage.getItem("yashtoken");

    if (!token) {
      setError("⚠️ Authentication failed. Please log in again.");
      return;
    }

    try {
      await axios.put(`http://localhost:6500/users/soft-delete/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the users list by excluding the soft-deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("✅ User soft deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to soft delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const userData = users.map((user) => ({
    name: user.name,
    count: 1,
  }));

  const pieData = [
    { name: "Users", value: users.length },
    { name: "Remaining Slots", value: 100 - users.length },
  ];

  const COLORS = ["#0088FE", "#FFBB28"];

  return (
    <div className="dashboard-container">
      <div className="users-container">
        <h2>👤 Registered Users</h2>

        {loading && <p>⏳ Loading users...</p>}

        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={fetchUsers} className="retry-button">
              🔄 Retry
            </button>
          </div>
        )}

        {!loading && !error && users.length > 0 ? (
          <ul className="user-list">
            {users.map((user) => (
              <li key={user._id} className="user-item">
                <div className="user-info">
                  <strong>{user.name}</strong> - <span>{user.email}</span>
                </div>
                <button
                  className="soft-delete-button"
                  onClick={() => softDeleteUser(user._id)}
                  style={{ backgroundColor: 'green', color: 'white' }}
                >
                  🗑️ Soft Delete
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteUser(user._id)}
                >
                  🗑️ Hard Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>No users found.</p>
        )}
      </div>

      <div className="charts-grid">
        <h2>📊 User Statistics</h2>
        <div className="charts-container">
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={180}
              fill="#0088FE"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>

          <BarChart width={600} height={300} data={userData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
