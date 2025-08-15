import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div>
      <h1>{job.title}</h1>
      <h3>{job.company} — {job.location}</h3>
      <p>{job.description}</p>
      <p><strong>Skills:</strong> {job.skills.join(', ')}</p>
      <p><strong>Salary:</strong> {job.salary || 'Not specified'}</p>
      <p><strong>Last Date:</strong> {new Date(job.lastDateToApply).toLocaleDateString()}</p>
      <a href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply on company site</a>
    </div>
  );
}
