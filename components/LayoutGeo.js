// components/LayoutGeo.js
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import styles from "./layout.module.css";
import SecondNav from "./secondNav";

const SurveyWidget = dynamic(() => import("../components/SurveyWidgetGeo"), { ssr: false });
const Spacer = dynamic(() => import("../components/Spacer"), { ssr: false });

const name = "高校地理専門塾 RAPID+";
export const siteTitle = "学習塾RAPID+ HP";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: "/geography", label: "TOP", key: "top" },
    { href: "/geography-prices", label: "料金", key: "price" },
    {
      href: "https://note.com/tatal_rapid/n/n666a567697d7?app_launch=false",
      label: "参考書",
      key: "note-books",
    },
    {
      href: "https://note.com/tatal_rapid/n/n666a567697d7?app_launch=false",
      label: "勉強法",
      key: "note-study",
    },
    { href: "/geography-notes", label: "note記事", key: "notes" },
    { href: "https://lin.ee/Nwh2C8u", label: "公式LINE", key: "line" },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/images/アイコン　文字なし.png" />
        <title>{siteTitle}</title>
      </Head>

      {/* ===============================
          固定ナビ（スクロール対象から除外）
      =============================== */}
      <header className={styles.navbar} data-scroll-ignore>
        <div className={styles.logoArea}>
          <img src="/images/アイコン　文字なし.png" width={30} height={30} alt="Logo" />
          <span className={styles.siteTitle}>{name}</span>
        </div>

        <nav className={styles.navLinks}>
          {navLinks.map(({ href, label, key }) =>
            href.startsWith("http") ? (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              <Link key={key} href={href} legacyBehavior>
                <a>{label}</a>
              </Link>
            )
          )}
        </nav>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerFixed : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.hamburgerLine} ${styles.lineTop}`} />
          <span className={`${styles.hamburgerLine} ${styles.lineMiddle}`} />
          <span className={`${styles.hamburgerLine} ${styles.lineBottom}`} />
        </button>
      </header>

      {/* ===============================
          モバイルメニュー（除外）
      =============================== */}
      {menuOpen && (
        <>
          <div className={styles.mobileMenu} role="dialog" data-scroll-ignore>
            {navLinks.map(({ href, label }) =>
              href.startsWith("http") ? (
                <a key={href} href={href} target="_blank" onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ) : (
                <Link key={href} href={href} legacyBehavior>
                  <a
                    onClick={() => setMenuOpen(false)}
                    className={router.pathname === href ? styles.activeLink : ""}
                  >
                    {label}
                  </a>
                </Link>
              )
            )}
          </div>
          <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
        </>
      )}

      {/* SecondNav も UI なので除外 */}
      <div data-scroll-ignore>
        <SecondNav links={navLinks} topN={5} />
      </div>

      {/* ===============================
          ここからが「スクロール対象」
      =============================== */}
      <main>{children}</main>

      <Spacer large={90} />

      <SurveyWidget
        primaryColor="#5b86e5"
        primaryDark="#25375eff"
        secondaryColor="#36d1dc"
        secondaryDark="#1e5f73"
        bgLight="#f0f4f8"
      />

      {/* フッターも除外 */}
      <footer className={styles.footer} data-scroll-ignore>
        <div className={styles.footerLinks}>
          <Link href="/geography">TOP</Link>
          <Link href="/geography-prices">料金</Link>
          <a href="https://lin.ee/Nwh2C8u" target="_blank" rel="noopener noreferrer">
            公式LINE
          </a>
        </div>
        <div>© {new Date().getFullYear()} 学習塾 RAPID All rights reserved.</div>
      </footer>
    </div>
  );
}
