// greeting.js
import Head from "next/head";
import Layout, { siteTitle } from "../components/Layout";
import styles from "../src/styles/greeting.module.css"; // 新規作成想定のCSSモジュール
import utilStyles from "../src/styles/utils.module.css";

export default function Greeting() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle} - 塾長挨拶</title>
      </Head>

      <section className={styles.container}>
        <div className={styles.greetingSection}>
          <div className={styles.greetingText}>
            <h1>塾長挨拶</h1> 
            <div className={styles.greetingImage}>
              <img
                src="/images/teacher naname.jpg"
                alt="塾長の写真"
                width={300}
                height={400}
                loading="lazy"
              />
            </div>
            <p>
              ホームページをご覧いただき、ありがとうございます。<br />
              学習塾RAPIDは、「本物の学習力」を育てることを目指した学習塾です。<br />
              ただ勉強を「教える」のではなく、生徒一人ひとりが生涯にわたって自分の力で学び続けられるように、「学び方そのもの」をサポートしています。<br /><br />

              この塾は、企業における採用・教育に携わってきた私と、学校現場で学習法について指導してきた友人が共同で立ち上げたものです。<br />
              同じ大学の教育学部で学んできた私たちは、「もっと深くて、本質的な学びを若い世代に届けたい」という思いを胸に、これまで多くの生徒たちを支援してきました。<br /><br />

              カリキュラムのベースとしているのは「自己調整学習」という考え方です。<br />
              「自己調整学習」では目標を立て、自分で振り返り、学び方を調整していくことを重視しています。<br /><br />

              実は私自身、昔からライバルに勝ちたいという気持ちがなければ勉強ができないタイプでした。<br />
              高校時代はテストの点数でギリギリ勝てなさそうな同級生に声をかけ、あえてライバルにしていました。<br />
              彼は勉強熱心だったので、点数勝負をするといつも僅差で負けてしまいます。<br />
              その度に、「次こそは勝つぞ！」という強い気持ちが勉強のモチベーションになっていたんです。<br /><br />

              この時の私は、無意識のうちにどうすれば勉強のスイッチが入るのかを考えて自己調整をしていたと言えるでしょう。<br /><br />

              学習塾RAPIDでは、このような「自分を知り、調整し、導く力」を育むことを何よりも大切にしています。<br /><br />

              勉強が得意でも、苦手でも関係ありません。<br />
              毎日が忙しくても、自分に合ったやり方を見つけさえすれば、必ず前に進んでいけるようになります。<br /><br />

              私たちは今、社会が大きく変わろうとしている時代にいます。<br />
              社会の変化に追いつくためには、学校を卒業しても勉強しなければいけないことはたくさんあります。<br />
              そう考えると、受験はゴールではなく、むしろスタートであると言えるかもしれません。<br />
              私たちは、そんな現代社会を生き抜くために必要不可欠な「本物の学習力」を一緒に育てていきたいと思っています。<br /><br />

              まずはぜひ、お気軽にご相談ください。<br />
              お会いできる日を、心からお待ちしています。<br />

            </p>
          </div>

        </div>

        <div className={styles.profileSection}>
          <h2>塾長プロフィール</h2>
          <p>
            〇〇大学卒業後、〇〇教育機関で10年以上の指導経験を持つ。熱意ある指導と一人ひとりに寄り添うスタイルで、多くの生徒の成績アップに貢献してきました。
          </p>
        </div>
      </section>
    </Layout>
  );
}
