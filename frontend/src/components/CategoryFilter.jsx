import React, { useState, useEffect } from 'react';
import api from '../api/api';
import styles from './CategoryFilter.module.css';

const CategoryFilter = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/jobs/categories');
        if (response.data && response.data.categories) {
          setCategories(['All Categories', ...response.data.categories]);
        } else {
          setError('Failed to load categories.');
        }

      } catch (err) {
        setError('An error occurred while fetching categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading categories...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <aside className={styles.categorySidebar}>
      <h3 className={styles.title}>Job Categories</h3>
      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li key={category}>
            <button
              className={`${styles.categoryButton} ${(selectedCategory === category || (category === 'All Categories' && !selectedCategory))
                  ? styles.active
                  : ''
                }`}
              onClick={() => onSelectCategory(category === 'All Categories' ? '' : category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategoryFilter;