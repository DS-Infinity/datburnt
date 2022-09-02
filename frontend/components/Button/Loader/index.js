import styles from './index.module.scss';

export default function Loader() {
  return (
    <div className={styles.loader}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
