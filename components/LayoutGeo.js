// layoutGeo.js
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./layout.module.css";
import Spacer from '../components/Spacer';
import dynamic from 'next/dynamic';

const SurveyWidget = dynamic(() => import('../components/SurveyWidgetGeo'), {
  ssr: false,
});
const QASection = dynamic(() => import('../components/QASection'), {
  ssr: false,
});
const GradientStripeBox = dynamic(() => import('../components/GradientStripeBox'), {
  ssr: false,
});

const qaData = [
    {
      q: "授業料以外に必要な費用はありますか？",
      a: "Webサイトに掲載している入塾金および指導料金以外に、追加の費用はかかりません。\n1対1の個別指導で市販の問題集を使用される場合は、各ご家庭でご用意をお願いいたします。",
    },
    {
      q: "授業料はどのように支払えばいいですか？",
      a: "毎月月末に請求書をメールにてお送りしております。\n記載された期日までに、指定の銀行口座へお振り込みをお願いいたします。",
    },
    {
      q: "入塾が月の途中になった場合、授業料はどうなりますか？",
      a: "当塾では、1コマ単位でお申し込みを受け付けております。\nそのため、実際に受講された回数分のみを計算してご請求いたします。\n月の途中からでも、無駄な費用が発生しない仕組みになっています。",
    },
    {
      q: "受講するためにはどのような機材が必要ですか？",
      a: "オンラインで授業に参加される場合は、カメラとマイクを備えたパソコンまたはタブレットをご用意ください。\nスマートフォンでも受講可能ですが、資料や地図を見やすい大きめの画面での受講をおすすめしております。",
    },
    {
      q: "授業をお休みした場合はどうなりますか？",
      a: "欠席された場合も、授業の録画を視聴いただけます。\nそのため、振替授業などのお手続きは不要です。",
    },
    {
      q: "他教科の勉強と両立できますか？",
      a: "はい、両立可能です。\n地理塾のカリキュラムは、他教科の学習時間を確保しやすいよう、週1回・効率重視の構成となっています。\n他教科とのバランスを意識した学習計画の立て方についてもアドバイスいたします。",
    },
    {
      q: "授業中にカメラを使用する必要はありますか？",
      a: "基本的にはカメラをオンにしてのご参加をおすすめしております。\nただし、必須ではございませんので、カメラをオフにして受講していただくことも可能です。",
    },
    {
      q: "通信環境や設定がわかりません。どうすればいいですか？",
      a: "授業に支障がないかをご確認いただくため、まずは体験授業（定期受講コースのみ）へのご参加をおすすめしております。\nZoomの接続や設定などでお困りの際は、メールにて個別にサポートいたしますのでご安心ください。",
    },
    {
      q: "オンライン授業ですが、集中して取り組めますか？",
      a: "定期受講コースでは、講師の解説と質疑応答を組み合わせ、受講生が主体的に取り組める構成になっています。\nまた、集団指導で集中しにくい場合は、個別指導コースの受講も可能です。\nまずは体験授業で、授業の雰囲気をご確認ください。",
    },
    {
      q: "学校で地理の授業がなくても受講できますか？",
      a: "定期受講コースでは、学校の授業内容に沿って基礎から丁寧に進めております。\nそのため、学校の授業がない方、学校の進度が遅い方におすすめです。\n当塾の指導のみで、基礎知識の習得から共通テストの対策まで完結できます。",
    },
    {
      q: "入試直前の時期でも入塾できますか？",
      a: "はい、年間を通して入塾が可能です。\n入試直前の時期に総復習をご希望の場合は、個別指導の形式で柔軟に対応いたします。",
    },
    {
      q: "途中で退塾する場合の手続きはどうなりますか？",
      a: "退塾をご希望の場合は、当月の月末までにご連絡ください。\n翌月分以降の授業料は発生いたしません。",
    },
  ];

const name = "学習塾RAPID";
export const siteTitle = "Total Rapid Blog";

export default function Layout({ children, home }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/geography", label: "TOP" },
    { href: "/geography-prices", label: "料金" },
    // { href: "/about", label: "RAPID" },
    { href: "https://lin.ee/Nwh2C8u", label: "公式LINE" },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/images/アイコン　文字なし.png" />
        <title>{siteTitle}</title>
      </Head>

      {/* ===== ナビゲーションバー ===== */}
      <header className={styles.navbar}>
        <div className={styles.logoArea}>
          <img src="/images/アイコン　文字なし.png" width={30} height={30} alt="Logo" />
          <span className={styles.siteTitle}>{name}</span>
        </div>

        <nav className={styles.navLinks}>
          {navLinks.map(({ href, label }) =>
            href.startsWith("http") ? (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              <Link key={href} href={href} legacyBehavior>
                <a className={router.pathname === href ? styles.activeLink : ""}>{label}</a>
              </Link>
            )
          )}
        </nav>

        {/* ハンバーガー：メニューが閉じているときのみ表示 */}
        {!menuOpen && (
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="6" width="16" height="2" fill="black" />
              <rect x="4" y="11" width="16" height="2" fill="black" />
              <rect x="4" y="16" width="16" height="2" fill="black" />
            </svg>
          </button>
        )}
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* ✖ ボタン（固定表示） */}
            <button
              className={styles.closeButton}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
                <line x1="4" y1="4" x2="20" y2="20" stroke="black" strokeWidth="2" />
                <line x1="20" y1="4" x2="4" y2="20" stroke="black" strokeWidth="2" />
              </svg>
            </button>

            {/* モバイルメニュー本体 */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={styles.mobileMenu}
              ref={menuRef}
            >
              {navLinks.map(({ href, label }) =>
                href.startsWith("http") ? (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                ) : (
                  <Link key={href} href={href} legacyBehavior>
                    <a
                      className={router.pathname === href ? styles.activeLink : ""}
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </a>
                  </Link>
                )
              )}
            </motion.div>

            {/* 背景の暗いオーバーレイ */}
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      <main>{children}</main>

      {/* <div className={styles.body}>
        <GradientStripeBox
          striped={false}
          randomObject={false}
          backgroundColor="#fff"
          accentColors={["#ffffff42", "#5a80d371"]}
          shapeType={[ "line"]}
          squareCount={70}
          speed={1.6}
          opacityRange={[0.15, 0.35]}
          blur={false}
          mixBlend={false}
          roundedSquares={false}
          shadow={false}
        >
          <QASection
            title="よくある質問"
            qaData={qaData}
            accentColors={["#36d1dc", "#5b86e5"]} // 2色指定 → グラデーション
            textColor="#222"
            bgColor="#ffffffff"
          />
        </GradientStripeBox>
      </div> */}
      <Spacer large={90} />
      <SurveyWidget
        primaryColor="#5b86e5"
        primaryDark="#25375eff"
        secondaryColor = "#36d1dc"
        secondaryDark = "#1e5f73"
        bgLight="#f0f4f8"
      />
      {/* ===== フッター ===== */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/geography">TOP</Link>
          <Link href="/geography-prices">料金</Link>
          <a href="https://lin.ee/Nwh2C8u" target="_blank" rel="noopener noreferrer">公式LINE</a>
          {/* <a href="https://docs.google.com/forms/d/e/1FAIpQLSdWso9jwFRnCI2cgCP7X3-p52cqlmcJIjWwRYZsD3RScqhiVg/viewform" target="_blank" rel="noopener noreferrer">
            お問い合わせフォーム
          </a> */}
        </div>
        <div>© {new Date().getFullYear()} 学習塾 RAPID All rights reserved.</div>
      </footer>
    </div>
  );
}
