import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api'; // This was already correct in one version, ensuring it stays
import styles from './JobDetail.module.css';

// A skeleton component specific to the Job Detail page for a better loading experience.
const JobDetailSkeleton = () => (
  <div className={styles.skeletonContainer} aria-hidden="true">
    <div className={styles.skeletonHeader}>
      <div className={styles.skeletonLogo}></div>
      <div className={styles.skeletonTitleGroup}>
        <div className={styles.skeletonLine} style={{ width: '60%', height: '2rem' }}></div>
        <div className={styles.skeletonLine} style={{ width: '40%', height: '1.25rem' }}></div>
      </div>
    </div>
    <div className={styles.skeletonLine} style={{ height: '1rem', width: '80%', marginTop: '2rem' }}></div>
    <div className={styles.skeletonLine} style={{ height: '1rem', width: '90%' }}></div>
    <div className={styles.skeletonLine} style={{ height: '1rem', width: '85%' }}></div>
    <div className={styles.skeletonLine} style={{ height: '1rem', width: '70%', marginTop: '2rem' }}></div>
    <div className={styles.skeletonLine} style={{ height: '1rem', width: '95%' }}></div>
    <div className={styles.skeletonLine} style={{ height: '1rem', width: '80%' }}></div>
  </div>
);

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/jobs/${id}`);
        // The job data might be in `response.data.data` (like the list view)
        // or directly in `response.data`. This handles both cases.
        const jobData = response.data.data || response.data;

        // A simple check to see if we received a valid job object
        if (jobData && jobData._id) {
          setJob(jobData);
        } else {
          setError('The requested job data was not found in the API response.');
        }
      } catch (err) {
        setError('Could not fetch job details. The job may not exist or there was a network issue.');
        console.error('Error fetching job detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <JobDetailSkeleton />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Something went wrong</h2>
          <p>{error || 'The requested job could not be found.'}</p>
          <Link to="/" className={styles.backButton}>
            Go back to listings
          </Link>
        </div>
      </div>
    );
  }

  // Destructure job properties with defaults for safety
  const {
    logoUrl,
    title = 'Job Title Not Available',
    companyName = 'Company Name',
    location = 'Location',
    experience = 'N/A',
    jobType = 'Full-time',
    salary = 'Not Disclosed',
    description = 'No description provided.',
    skills = [],
    applyLink = '#',
  } = job;

  return (
    <div className={styles.container}>
      <article className={styles.jobDetailCard}>
        <header className={styles.jobHeader}>
          <div className={styles.logo}>
            {logoUrl && (
              <img
                src={logoUrl}
                alt={`${companyName} logo`}
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'inherit' }}
              />
            )}
          </div>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.companyInfo}>{companyName} - {location}</p>
          </div>
          <a href={applyLink} target="_blank" rel="noopener noreferrer" className={styles.applyButton}>
            Apply Now
          </a>
        </header>

        <div className={styles.jobBody}>
          <section className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Salary</span>
              <span className={styles.detailValue}>{salary}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Job Type</span>
              <span className={styles.detailValue}>{jobType}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Experience</span>
              <span className={styles.detailValue}>{experience}</span>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Job Description</h2>
            <p className={styles.description}>{description}</p>
          </section>

          {skills.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Required Skills</h2>
              <div className={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
