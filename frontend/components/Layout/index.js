import Head from "next/head";
import Header from "../Header";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

export default function Layout({
  children,
  page,
  showNav = true,
  isGame = false,
}) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{page.title + ` • datburnttt`}</title>
        <link rel="shortcut icon" href="/icons/logo.png" />
        <meta name="title" content="datburnt - keep some ice handy" />
        <meta
          name="description"
          content="A classic roast battle. Have fun with your friends and roast famous personalities!"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://datburnt.hop.sh/" />
        <meta property="og:title" content="datburnt - keep some ice handy" />
        <meta
          property="og:description"
          content="A classic roast battle. Have fun with your friends and roast famous personalities!"
        />
        <meta
          property="og:image"
          content="https://datburnt.hop.sh/banner.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://datburnt.hop.sh/" />
        <meta
          property="twitter:title"
          content="datburnt - keep some ice handy"
        />
        <meta
          property="twitter:description"
          content="A classic roast battle. Have fun with your friends and roast famous personalities!"
        />
        <meta
          property="twitter:image"
          content="https://datburnt.hop.sh/banner.png"
        />
      </Head>
      <>
        {/* <img src='background.svg' className={styles.bg} /> */}
        <div
          className={styles.main}
          style={{
            background: `${
              router.pathname === "/"
                ? "linear-gradient(#e93131 0%, #680e0e 100%)"
                : ""
            }`,
          }}
        >
          {!page.hideHeader && showNav && (
            <Header
              type={`${router.pathname === "/" ? "light" : "dark"}`}
              code={isGame ? router.query.code : null}
            />
          )}
          <div className={styles.content}>{children}</div>
        </div>
      </>
      <div id="popupContainer"></div>
    </>
  );
}
