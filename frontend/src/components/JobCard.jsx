import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10 }}>
      <h3><Link to={`/job/${job._id}`}>{job.title}</Link></h3>
      <p>{job.company} — {job.location}</p>
      <p>{job.salary || 'Salary: not specified'} • {job.jobType}</p>
      <p>Last date: {new Date(job.lastDateToApply).toLocaleDateString()}</p>
      <a href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply</a>
    </div>
  );
}
