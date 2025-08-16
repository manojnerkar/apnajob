import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@gmail.com'); // ✅ use email instead of username
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      // ✅ send email to backend, not username
      const res = await api.post('/admin/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('adminToken', token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>Sign in to manage jobs</p>

        <form onSubmit={submit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={`${styles.input} ${styles.fullWidth}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={`${styles.input} ${styles.fullWidth}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={`${styles.button} ${styles.fullWidth}`}>Login</button>
        </form>
      </div>
    </div>
  );
}
