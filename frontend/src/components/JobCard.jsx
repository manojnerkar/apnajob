import React from 'react';
import { Link } from 'react-router-dom';
import styles from './JobCard.module.css';

export default function JobCard({ job }) {
  // Destructure with default values to prevent errors if job prop is incomplete
  const {
    _id,
    logoUrl,
    title = 'Job Title Not Available',
    companyName = 'Company Name',
    location = 'Location',
    salary = 'Not Disclosed',
    jobType = 'Full-time',
    category = 'General',
  } = job || {};

  return (
    // The entire card is a link, which is better for UX.
    // The styles for the link wrapper are in JobCard.module.css
    <Link to={`/job/${_id}`} className={styles.card}>
      <header className={styles.cardHeader}>
        <div className={styles.logo}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              // Inline styles for perfect fit within the logo container
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}
        </div>
        <div>
          {/* The CSS module handles the styling for these elements */}
          <p className={styles.company}>{companyName}</p>
          <p className={styles.location}>{location}</p>
        </div>
      </header>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.salary}>{salary}</p>
      {/* The tags section is pushed to the bottom via flexbox `margin-top: auto` */}
      <div className={styles.tags}>
        <span className={styles.tag}>{category}</span>
        <span className={styles.tag}>{jobType}</span>
      </div>
    </Link>
  );
}
