import Image from 'next/image';
import styles from './index.module.scss';
// import Logo from '../../public/icons/logo.svg';
import Logo from '../../public/icons/logo.svg';
import { useRouter } from 'next/router';

export default function Navbar(props) {
  const router = useRouter();
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Logo />
        <h1
          style={{ color: `${props.type == 'light' ? '#ffffff' : ''}` }}
          className={styles.logo__name}
        >
          datburnttt
        </h1>
      </div>
      <div className={styles.links}>
        {router.pathname === '/home' ? (
          <div></div>
        ) : (
          <button className={styles.start}>Start a fire!</button>
        )}
      </div>
    </div>
  );
}
