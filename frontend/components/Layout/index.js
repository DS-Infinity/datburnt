import Head from 'next/head';
import Header from '../Header';
import styles from './index.module.scss';
import { useRouter } from 'next/router';

export default function Layout({ children, page, showNav = true, isGame = false }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{page.title + ` • datburnttt`}</title>
      </Head>
      <>
        {/* <img src='background.svg' className={styles.bg} /> */}
        <div
          className={styles.main}
          style={{
            background: `${
              router.pathname === '/'
                ? 'linear-gradient(#e93131 0%, #680e0e 100%)'
                : ''
            }`,
          }}
        >
          {!page.hideHeader && showNav && (
            <Header
              type={`${router.pathname === '/' ? 'light' : 'dark'}`}
              code={isGame ? router.query.code : null}
            />
          )}
          <div className={styles.content}>{children}</div>
        </div>
      </>
      <div id='popupContainer'></div>
    </>
  );
}
