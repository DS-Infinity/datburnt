import styles from './index.module.scss';

const Loader = ({ center }) => {
  if (center) {
    return (
      <div className={styles.container}>
        <div className={styles.loader} />
      </div>
    );
  }

  return <div className={styles.loader} />;
};

export default Loader;
