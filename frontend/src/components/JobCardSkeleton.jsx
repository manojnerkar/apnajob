import styles from './JobCardSkeleton.module.css';

export default function JobCardSkeleton() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonLogo}></div>
        <div className={styles.skeletonCompanyInfo}>
          <div className={`${styles.skeletonText} ${styles.skeletonCompany}`}></div>
          <div className={`${styles.skeletonText} ${styles.skeletonLocation}`}></div>
        </div>
      </div>
      <div className={`${styles.skeletonText} ${styles.skeletonTitle}`}></div>
      <div className={`${styles.skeletonText} ${styles.skeletonSalary}`}></div>
      <div className={`${styles.skeletonText} ${styles.skeletonTag}`}></div>
    </div>
  );
}