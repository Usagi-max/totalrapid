import Head from "next/head";
import Layout from "../components/Layout";
import styles from "../src/styles/About.module.css";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>学習塾RAPID | 私たちについて</title>
      </Head>
      <section className={styles.hero}>
        <h1>3ヶ月で手に入れる!!本物の学習力</h1>
        <p>RAPIDメソッドで自己調整学習を身につけ、目標達成を実現！</p>
      </section>
      
      <section className={styles.intro}>
        <h2>学習塾RAPIDとは？</h2>
        <p>自己調整学習など最新の学習科学に基づいたカリキュラムを提供する、全く新しい学習塾です。生涯を通じて学びを楽しむことができる人を増やすことを目指しています。</p>
      </section>
      <div className={styles.container}>
        <div className={styles.item}><img src="/images/rapidmethod_cercle.png" alt="rapidmethod_cercle" /></div>
        <div className={styles.item}><img src="/images/rabbit_carrying _turtle.png" alt="rabbit_carrying _turtle" /></div>
        <div className={styles.item}><img src="/images/rabbit_and_turtle_happy.png" alt="rabbit_and_turtle_happy" /></div>
        <div className={styles.item}><img src="/images/rabbit_running.png" alt="rabbit_running" /></div>
        <div className={styles.item}><img src="/images/3month_power.png" alt="3month_power" /></div>
        <div className={styles.item}><img src="/images/girl_studying.png" alt="girl_studying" /></div>
        <div className={styles.item}><img src="/images/accepting applications.png" alt="accepting applications" /></div>
        <div className={styles.item}><img src="/images/cherryblossom_and_sky.png" alt="cherryblossom_and_sky" /></div>
      </div>
      <section className={styles.method}>
        <h2>RAPIDメソッドとは？</h2>
        <p>RAPIDメソッドは、学習を自己調整できるようになるための「戦略支援」と「継続支援」に基づいています。</p>
        <div className={styles.strategySupport}>
          <h3>🐇 学習の戦略支援</h3>
          <ul>
            <li>入塾時に学習タイプ診断を実施し、最適な学習計画を作成</li>
            <li>学習環境のチェックと最適化</li>
            <li>3ヶ月ごとに学習計画の見直し</li>
          </ul>
        </div>
        <div className={styles.continuousSupport}>
          <h3>🐢 学習の継続支援</h3>
          <ul>
            <li>モチベーションタイプ診断で学習意欲を高める</li>
            <li>毎週の学習成果チェックと計画調整</li>
            <li>学習管理ツール「RAPI-LA」で進捗を可視化</li>
          </ul>
        </div>
      </section>
      
      <section className={styles.courses}>
        <h2>オススメコース</h2>
        <div className={styles.course}>
          <h3>英検対策コース（3〜4ヶ月）</h3>
          <p>目標級の合格に向けて、戦略的に学習を進めます。</p>
        </div>
        <div className={styles.course}>
          <h3>入試対策コース（4ヶ月〜）</h3>
          <p>志望校合格に向けた長期計画を立て、効率的に学習を進めます。</p>
        </div>
      </section>
      
      <section className={styles.signup}>
        <h2>お申し込みと指導の流れ</h2>
        <ol>
          <li>公式Webサイトや公式LINEからお申し込み</li>
          <li>保護者面談で最適なコースをご提案</li>
          <li>家庭訪問・学習環境コンサル</li>
        </ol>
        <p>3ヶ月で本物の学習力を手に入れましょう！</p>
      </section>
    </Layout>
  );
}
