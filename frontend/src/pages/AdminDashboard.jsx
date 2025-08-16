import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import styles from './AdminDashboard.module.css';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`
});

const initialFormState = {
  title: '',
  companyName: '',
  category: 'IT',
  description: '',
  skills: '',
  location: '',
  salary: '',
  jobType: 'Full-time',
  applyLink: '',
  lastDateToApply: ''
};

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingJob, setEditingJob] = useState(null); // To handle updates
  const [message, setMessage] = useState('');

  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get('/jobs');
      if (res.data && res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch jobs.');
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s=>s.trim()) };
      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, payload, { headers: getAuthHeader() });
        setMessage('Job updated successfully');
      } else {
        await api.post('/jobs', payload, { headers: getAuth-Header() });
        setMessage('Job created successfully');
      }
      setForm({ title:'', company:'', category:'IT', description:'', skills:'', location:'', salary:'', jobType:'', applyLink:'', lastDateToApply:'' });
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred';
      setMessage(errorMsg);
    }
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`, { headers: getAuthHeader() });
      fetchJobs();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {message && <p>{message}</p>}

      <h2>{editingJob ? 'Edit Job' : 'Create Job'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required /><br/>
        <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} required /><br/>
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} /><br/>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br/>
        <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} /><br/>
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} /><br/>
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} /><br/>
        <input name="jobType" placeholder="Job Type" value={form.jobType} onChange={handleChange} /><br/>
        <input name="applyLink" placeholder="Apply Link" value={form.applyLink} onChange={handleChange} /><br/>
        <input name="lastDateToApply" type="date" value={form.lastDateToApply} onChange={handleChange} /><br/>
        <button type="submit">{editingJob ? 'Update' : 'Create'}</button>
        {editingJob && <button type="button" onClick={() => { setEditingJob(null); setForm({ title:'', companyName:'', category:'IT', description:'', skills:'', location:'', salary:'', jobType:'', applyLink:'', lastDateToApply:'' }); }}>Cancel Edit</button>}
      </form>

      <h2>Existing Jobs</h2>
      {jobs.map(j => (
        <div key={j._id} style={{border:'1px solid #ddd', padding:8, marginBottom:6}}>
          <strong>{j.title}</strong> — {j.companyName}
          <div>
            <button onClick={() => {
              setEditingJob(j);
              setForm({ ...j, skills: Array.isArray(j.skills) ? j.skills.join(', ') : '' });
            }}>Edit</button>
            <button onClick={()=>deleteJob(j._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
