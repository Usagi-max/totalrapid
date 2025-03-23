import Head from "next/head";
import Image from "next/image";
import styles from "../src/styles/Home.module.css";
import Link from "next/link"; 
import Layout, { siteTitle } from "../components/Layout";
import UtilStyles from "../src/styles/utils.module.css";
import { getPostsData } from "../lib/post";

export async function getStaticProps() {
  const allPostsData = getPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={UtilStyles.headingMd}>
        <p>自己調整学習をもとにした自分で学べる人材を育てる塾です</p>
        
        {/* ナビゲーションバー */}
        <nav className={styles.navbar}>
          <ul>
            <li><Link href="/">ホーム</Link></li>
            <li><Link href="/about">塾について</Link></li>
            <li><Link href="/program">プログラム</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
          </ul>
        </nav>
      </section>

      <div className={styles.grid}>
        {allPostsData.map(({ id, title, date, thumbnail }) => (
          <article key={id}>
            <Link href={`/posts/${id}`}>
              <img src={`${thumbnail}`} className={styles.thumbnailImage} />
            </Link>
            <Link href={`/posts/${id}`}>
              <div className={UtilStyles.boldText}>{title}</div>
            </Link>
            <br />
            <small className={UtilStyles.lightText}>{date}</small>
          </article>
        ))}
      </div>

      <section className={styles.hero}>
        <h1>自己調整学習で、未来を切り開く</h1>
        <p>自分の学習スタイルを確立し、主体的に学び続ける力を育てる塾</p>
        <a href="/about" className={styles.button}>詳しく見る</a>
      </section>
    </Layout>
  );
}
