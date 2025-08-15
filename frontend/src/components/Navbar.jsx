import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Effect to handle body scroll lock and window resize
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Prevent scrolling on the body when the menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Close mobile menu on window resize to desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener and reset body overflow
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close the menu when a link is clicked
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={handleLinkClick}>
          JobPortal
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className={`${styles.hamburgerMenu} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={styles.hamburgerIcon}></span>
        </button>

        {/* Navigation Links */}
        <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileActive : ''}`} onClick={handleLinkClick}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.active : undefined)}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/jobs"
              className={({ isActive }) => (isActive ? styles.active : undefined)}
            >
              Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/login"
              className={({ isActive }) => (isActive ? styles.active : undefined)}
            >
              Admin
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
