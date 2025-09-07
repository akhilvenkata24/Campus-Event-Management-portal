import { useState } from "react";
import "./AdminDashboard.css"; // Import the CSS file

const AdminNavbar = ({ active, setActive }) => {
  const navItems = ["Dashboard", "Create Event"];

  return (
    <nav className="admin-navbar">
      <h2>Admin Dashboard</h2>
      <div>
        {navItems.map((item) => (
          <button key={item} onClick={() => setActive(item)}>
            {item}
          </button>
        ))}
        <button onClick={() => alert("You have been logged out!")}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

const RegistrationTable = ({ registrations }) => {
  return (
    <div className="registration-table">
      <h2>Recent Registrations</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Event</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.event}</td>
              <td>{row.department}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");

  const stats = [
    { title: "Total Events Created", value: 12 },
    { title: "Total Registrations", value: "1,482" },
    { title: "Upcoming Events", value: 4 },
    { title: "Departments Involved", value: 5 },
  ];

  const registrations = [
    { name: "Alex Johnson", event: "Tech Symposium 2025", department: "CSE", status: "Registered" },
    { name: "Maria Garcia", event: "Annual Sports Meet", department: "ECE", status: "Registered" },
    { name: "James Smith", event: "Tech Symposium 2025", department: "EEE", status: "Cancelled" },
    { name: "Patricia Brown", event: "Cultural Fest", department: "CIVIL", status: "Registered" },
  ];

  return (
    <div className="admin-container">
      <AdminNavbar active={active} setActive={setActive} />

      <h1>Welcome Back, Admin!</h1>
      <p>Here's a snapshot of the event activities.</p>

      {/* Stat Cards */}
      <div className="stats-container">
        {stats.map((stat, i) => (
          <StatCard key={i} title={stat.title} value={stat.value} />
        ))}
      </div>

      {/* Registrations Table */}
      <RegistrationTable registrations={registrations} />
    </div>
  );
}

export default AdminDashboard;
