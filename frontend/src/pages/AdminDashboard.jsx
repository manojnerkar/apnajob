import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api/api";
import styles from "./AdminDashboard.module.css";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

const initialFormState = {
  title: "",
  companyName: "",
  category: "IT",
  description: "",
  skills: "",
  location: "",
  salary: "",
  jobType: "Full-time",
  applyLink: "",
  lastDateToApply: "",
};

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingJob, setEditingJob] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch jobs
  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get("/jobs");
      if (res.data && res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch jobs.");
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // ✅ Handle submit (create/update job)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      };

      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, payload, {
          headers: getAuthHeader(),
        });
        setMessage("✅ Job updated successfully");
      } else {
        await api.post("/jobs", payload, { headers: getAuthHeader() });
        setMessage("✅ Job created successfully");
      }

      setForm(initialFormState);
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "❌ An error occurred";
      setMessage(errorMsg);
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // ✅ Delete job
  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`, { headers: getAuthHeader() });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>⚙️ Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </header>

      {message && (
        <p className={`${styles.message} ${message.includes('❌') ? styles.error : styles.success}`}>
          {message}
        </p>
      )}

      {/* Job Form */}
      <div className={styles.formCard}>
        <h2>{editingJob ? "✏️ Edit Job" : "➕ Create Job"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input className={styles.fullWidth} name="title" placeholder="Job Title" value={form.title} onChange={handleChange} required />
          <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} required />
          <input name="category" placeholder="Category (e.g., IT, Marketing)" value={form.category} onChange={handleChange} />
          <textarea className={styles.fullWidth} name="description" placeholder="Job Description" value={form.description} onChange={handleChange} />
          <input className={styles.fullWidth} name="skills" placeholder="Required Skills (comma-separated)" value={form.skills} onChange={handleChange} />
          <input name="location" placeholder="Location (e.g., Remote, New York)" value={form.location} onChange={handleChange} />
          <input name="salary" placeholder="Salary (e.g., $100k - $120k)" value={form.salary} onChange={handleChange} />
          <select name="jobType" value={form.jobType} onChange={handleChange} className={styles.select}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
          <input name="applyLink" placeholder="Application Link or Email" value={form.applyLink} onChange={handleChange} />
          <input type="date" name="lastDateToApply" value={form.lastDateToApply.split('T')[0]} onChange={handleChange} />

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>
              {editingJob ? "Update Job" : "Create Job"}
            </button>
            {editingJob && (
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setEditingJob(null);
                  setForm(initialFormState);
                  setMessage('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Job List */}
      <div className={styles.jobsList}>
        <h2>📋 Existing Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs available.</p>
        ) : (
          jobs.map((j) => (
            <div key={j._id} className={styles.jobCard}>
              <div>
                <p>
                  <strong>{j.companyName}</strong> — {j.location}  
                </p>
                <p>{j.jobType} | 💰 {j.salary}</p>
                <p>🛠 {Array.isArray(j.skills) ? j.skills.join(", ") : ""}</p>
              </div>
              <div className={styles.jobActions}>
                <button onClick={() => {
                  setEditingJob(j);
                  setForm({
                    ...j,
                    skills: Array.isArray(j.skills) ? j.skills.join(", ") : "",
                  });
                }}>✏️ Edit</button>
                <button onClick={() => deleteJob(j._id)}>🗑 Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
