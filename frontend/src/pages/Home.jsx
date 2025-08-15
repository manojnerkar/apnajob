import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/api';
import JobCard from '../components/JobCard';
import JobCardSkeleton from '../components/JobCardSkeleton';
import styles from './Home.module.css';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/jobs');
        // The job data is nested inside a 'data' property, similar to the AdminDashboard.
        // We need to access response.data.data to get the array of jobs.
        setJobs(response.data.data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]); // Set to empty array on error to prevent crashes
      }
      finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Memoize the filtered jobs to avoid re-calculating on every render
  const filteredJobs = useMemo(() => {
    if (!searchQuery) {
      return jobs;
    }
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  const renderJobCards = () => {
    if (loading) {
      // Show 8 skeleton loaders for a good initial impression
      return Array.from({ length: 8 }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ));
    }

    if (filteredJobs.length === 0) {
      return null; // The empty message will be shown outside the grid
    }

    return filteredJobs.map((job) => <JobCard key={job._id} job={job} />);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heading}>Find Your Next Opportunity</h1>
        <p className={styles.subheading}>
          Search through thousands of open positions and find the perfect role
          for you.
        </p>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search by title, company, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.jobsGrid}>{renderJobCards()}</div>

      {!loading && filteredJobs.length === 0 && (
        <p className={styles.noJobs}>
          No jobs found matching your search. Try a different keyword.
        </p>
      )}
    </div>
  );
}
