import styles from '../styles/loadingOverlay.module.css';

export default function LoadingOverlay() {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.clockLoad}></div>
    </div>
  );
}