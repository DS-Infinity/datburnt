import styles from './shared/index.module.scss';
import Image from 'next/image';

import Logo from '../../public/icons/logo.svg';
import PrimaryButton from '../Button/Primary';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Header(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Image src={Logo} />
        <h1
          style={{ color: `${props.type == 'light' ? '#ffffff' : ''}` }}
          className={styles.logo__name}
        >
          datburnttt
        </h1>
      </div>
      <div className={styles.links}>
        {router.pathname === '/home' ? (
          <>Play</>
        ) : (
          <PrimaryButton
            onClick={() => {
              setLoading(true);
              if (router.pathname === '/register') {
                return setLoading(false);
              }
              router.push('/register');
            }}
            className={styles.start}
            loading={loading}
          >
            Start a fire!
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
