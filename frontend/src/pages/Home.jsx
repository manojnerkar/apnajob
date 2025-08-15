import React, { useEffect, useState } from 'react';
import api from '../api/api';
import JobCard from '../components/JobCard';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs')
      .then(res => setJobs(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>All Jobs</h1>
      {loading ? <p>Loading...</p> :
        jobs.length === 0 ? <p>No jobs found.</p> :
        jobs.map(j => <JobCard key={j._id} job={j} />)
      }
    </div>
  );
}
