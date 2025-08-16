import React, { useState, useEffect } from 'react';
import api from '../api/api';
import JobCard from '../components/JobCard';
import JobCardSkeleton from '../components/JobCardSkeleton';
import styles from './Home.module.css';
import CategoryFilter from '../components/CategoryFilter';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null); // Reset error on each new fetch
      try {
        // Construct query parameters, only including them if they have a value.
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;

        const response = await api.get('/jobs', { params });
        if (response.data && response.data.data) {
          setJobs(response.data.data);
        } else {
          // Handle cases where the API returns success: false
          setError(response.data.message || 'Failed to load jobs.');
          setJobs([]);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        // Provide a more user-friendly error message based on the error type
        if (error.code === 'ERR_NETWORK') {
          setError('Network Error: Could not connect to the server. Please ensure the backend is running and accessible.');
        } else {
          setError(`An error occurred while fetching jobs: ${error.message}`);
        }
        setJobs([]); // Clear jobs on error
      } finally {
        setLoading(false);
      }
    };

    // Debounce search/filter to avoid excessive API calls
    const timerId = setTimeout(() => {
      fetchJobs();
    }, 500); // 500ms delay

    // Cleanup function to clear the timeout
    return () => clearTimeout(timerId);
  }, [searchTerm, selectedCategory]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.heading}>Find Your Next Opportunity</h1>
        <p className={styles.subheading}>
          Search through thousands of open positions in our job portal. Your dream job is waiting for you.
        </p>
        <input
          type="text"
          placeholder="Search by title, company, or skill..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      <div className={styles.mainContent}>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        <section className={styles.jobListings}>
          {loading ? (
            <div className={styles.jobsGrid}>
              {Array.from({ length: 8 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className={styles.noJobs}>
              <p style={{ color: 'var(--clr-error-500)' }}>{error}</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className={styles.jobsGrid}>
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className={styles.noJobs}>
              <p>No jobs found. Try adjusting your search or category.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}