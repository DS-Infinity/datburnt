import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PrimaryButton from '../../components/Button/Primary';
import TextButton from '../../components/Button/Text';
import styles from './index.module.scss';
import Barbeque from '../../public/icons/barbeque.png';
// import Navbar from '../../components/Navbar';

export default function Content() {
  const router = useRouter();

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  return (
    <div className={styles.container}>
      {/* <Navbar /> */}
      <div className={styles.landing}>
        <div className={styles.landing__left}>
          <h1 className={styles.landing__title}>
            You might need some <span className={styles.ice}>Ice</span> because
            <span className={styles.burnt}> datburnttt</span>
          </h1>
          <p className={styles.landing__description}>
            You just might be a barbeque..... who knows
          </p>
          <button className={styles.landing__button}>
            <span className={styles.landing__button__left}>Learn More</span> →
          </button>
        </div>
        <div className={styles.landing__image}>
          <Image src={Barbeque} height={500} width={500} />
        </div>
      </div>
    </div>
  );
}
