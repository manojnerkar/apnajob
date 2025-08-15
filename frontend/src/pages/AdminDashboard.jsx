import React, { useEffect, useState } from 'react';
import api from '../api/api';

function getAuthHeader() {
  const token = localStorage.getItem('adminToken');
  return { Authorization: `Bearer ${token}` };
}

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: '', company: '', category: 'IT', description: '', skills: '', location: '', salary: '', jobType: '', applyLink: '', lastDateToApply: ''
  });
  const [message, setMessage] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const createJob = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s=>s.trim()) };
      await api.post('/jobs', payload, { headers: getAuthHeader() });
      setMessage('Job created');
      setForm({ title:'', company:'', category:'IT', description:'', skills:'', location:'', salary:'', jobType:'', applyLink:'', lastDateToApply:'' });
      fetchJobs();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating job');
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
      <p>{message}</p>

      <h2>Create Job</h2>
      <form onSubmit={createJob}>
        <input placeholder="title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /><br/>
        <input placeholder="company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} /><br/>
        <input placeholder="category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} /><br/>
        <textarea placeholder="description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /><br/>
        <input placeholder="skills (comma separated)" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} /><br/>
        <input placeholder="location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /><br/>
        <input placeholder="salary" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} /><br/>
        <input placeholder="jobType" value={form.jobType} onChange={e=>setForm({...form,jobType:e.target.value})} /><br/>
        <input placeholder="applyLink" value={form.applyLink} onChange={e=>setForm({...form,applyLink:e.target.value})} /><br/>
        <input type="date" value={form.lastDateToApply} onChange={e=>setForm({...form,lastDateToApply:e.target.value})} /><br/>
        <button type="submit">Create</button>
      </form>

      <h2>Existing Jobs</h2>
      {jobs.map(j => (
        <div key={j._id} style={{border:'1px solid #ddd', padding:8, marginBottom:6}}>
          <strong>{j.title}</strong> — {j.company}
          <div>
            <button onClick={()=>deleteJob(j._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
