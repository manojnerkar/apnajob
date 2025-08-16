import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* About Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>JobPortal</h3>
            <p className={styles.aboutText}>
              Your one-stop platform for finding the best talent and the right career opportunities.
            </p>
          </div>

          {/* Job Seekers Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>For Job Seekers</h3>
            <ul className={styles.linkList}>
              <li><Link to="#">Find a Job</Link></li>
              <li><Link to="#">Upload Resume</Link></li>
              <li><Link to="#">Career Advice</Link></li>
              <li><Link to="#">Company Reviews</Link></li>
            </ul>
          </div>

          {/* Employers Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>For Employers</h3>
            <ul className={styles.linkList}>
              <li><Link to="#">Post a Job</Link></li>
              <li><Link to="#">Search Resumes</Link></li>
              <li><Link to="#">Employer Login</Link></li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Connect With Us</h3>
            <ul className={styles.linkList}>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} JobPortal. All Rights Reserved.</p>
          <div className={styles.bottomLinks}>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;