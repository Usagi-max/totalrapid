import { Main } from "next/document";
import Head from "next/head";
import styles from "./layout.module.css";
import utilStyles from "../src/styles/utils.module.css";
import Link from "next/link";

const name = "個別指導塾Rapid";
export const siteTitle = "Total Rapid Blog";

function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/run.png" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <img
              src="/images/run.png"
              className={`${utilStyles.borderCircle} ${styles.headerHomeImage}`}
              width={100}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <img
              src="/images/run.png"
              className={`${utilStyles.borderCircle}`}
              width={100}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backButtonContainer}>
          <Link href="/" className={styles.backButton}>
            ←ホームへ戻る
          </Link>
        </div>
      )}
    </div>
  );
}

export default Layout;
