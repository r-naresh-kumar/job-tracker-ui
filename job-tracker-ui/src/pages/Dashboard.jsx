import React, { useState, useEffect } from "react";

const Dashboard = ({ user, onLogout }) => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editStatus, setEditStatus] = useState("Applied");

  useEffect(() => {
    if (!user) return;
    const savedJobs = JSON.parse(localStorage.getItem(`${user.email}_jobs`)) || [];
    setJobs(savedJobs);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`${user.email}_jobs`, JSON.stringify(jobs));
  }, [jobs, user]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleAddJob = (e) => {
    e.preventDefault();
    const newJob = { id: Date.now(), title, company, status, createdAt: new Date().toLocaleDateString() };
    setJobs([newJob, ...jobs]);
    setTitle(""); setCompany(""); setStatus("Applied");
  };

  const handleDelete = (id) => setJobs(jobs.filter((job) => job.id !== id));
  const handleStatusChange = (id, newStatus) =>
    setJobs(jobs.map((job) => (job.id === id ? { ...job, status: newStatus } : job)));
  const handleEditClick = (job) => { setEditingJob(job); setEditTitle(job.title); setEditCompany(job.company); setEditStatus(job.status); };
  const handleUpdateJob = () => { setJobs(jobs.map((job) => job.id === editingJob.id ? { ...job, title: editTitle, company: editCompany, status: editStatus } : job)); setEditingJob(null); };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied": return { backgroundColor: "#2196F3" };
      case "Interview": return { backgroundColor: "#FF9800" };
      case "Offer": return { backgroundColor: "#4CAF50" };
      case "Rejected": return { backgroundColor: "#f44336" };
      default: return { backgroundColor: "#999" };
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase())
  );

  const StatCard = ({ title, count, color }) => (
    <div style={{ background: color, color: "white", padding: "15px", borderRadius: "10px", width: "130px", textAlign: "center" }}>
      <h4>{title}</h4><h2>{count}</h2>
    </div>
  );

  const bgColor = darkMode ? "#121212" : "#e6ecf5";
  const boxColor = darkMode ? "#1e1e1e" : "#ffffff";
  const textColor = darkMode ? "white" : "black";

  return (
    <div style={{ background: bgColor, minHeight: "100vh", padding: "30px", color: textColor }}>
      <div style={{ maxWidth: "900px", margin: "auto", background: boxColor, padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}>
        <h1 style={{ color: "#6a1b9a" }}>Job Tracker Dashboard</h1>
        <p>Welcome: <b>{user.email}</b></p>
        <button onClick={() => setDarkMode(!darkMode)} style={{ marginRight: "10px", padding: "6px 12px", cursor: "pointer" }}>
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
        <button onClick={onLogout} style={{ background: "#f44336", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>
          Logout
        </button>

        <div style={{ display: "flex", gap: "15px", margin: "25px 0", flexWrap: "wrap" }}>
          <StatCard title="Total" count={jobs.length} color="#673ab7" />
          <StatCard title="Applied" count={jobs.filter(j => j.status === "Applied").length} color="#2196F3" />
          <StatCard title="Interview" count={jobs.filter(j => j.status === "Interview").length} color="#FF9800" />
          <StatCard title="Offer" count={jobs.filter(j => j.status === "Offer").length} color="#4CAF50" />
          <StatCard title="Rejected" count={jobs.filter(j => j.status === "Rejected").length} color="#f44336" />
        </div>

        <form onSubmit={handleAddJob} style={{ background: "#f3e5f5", padding: "20px", borderRadius: "10px" }}>
          <h3>Add Job</h3>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job Title" required />
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" required style={{ marginLeft: 10 }} />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginLeft: 10 }}>
            <option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option>
          </select>
          <button type="submit" style={{ marginLeft: 10 }}>Add Job</button>
        </form>

        <br />
        <input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", padding: "10px" }} />
        <br /><br />

        {filteredJobs.map(job => (
          <div key={job.id} style={{ background: "#e3f2fd", padding: "20px", borderRadius: "10px", marginBottom: "15px" }}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <span style={{ ...getStatusStyle(job.status), color: "white", padding: "5px 12px", borderRadius: "20px", marginRight: "10px" }}>
              {job.status}
            </span>
            <select value={job.status} onChange={(e) => handleStatusChange(job.id, e.target.value)} style={{ marginRight: 10 }}>
              <option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option>
            </select>
            <button onClick={() => handleEditClick(job)} style={{ marginRight: 8, background: "#2196F3", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Edit</button>
            <button onClick={() => handleDelete(job.id)} style={{ background: "#f44336", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Delete</button>
          </div>
        ))}

        {editingJob && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ background: "white", padding: "25px", borderRadius: "10px", width: "350px" }}>
              <h3>Edit Job</h3>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
              <input value={editCompany} onChange={(e) => setEditCompany(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ width: "100%", marginBottom: 15 }}>
                <option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option>
              </select>
              <button onClick={handleUpdateJob} style={{ background: "#4CAF50", color: "white", border: "none", padding: "8px 12px", marginRight: 10 }}>Save</button>
              <button onClick={() => setEditingJob(null)} style={{ background: "#f44336", color: "white", border: "none", padding: "8px 12px" }}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
