// LayoutGeo.js
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
    { href: "/geography", label: "TOP" },
    { href: "/geography-prices", label: "料金" },
    { href: "https://note.com/tatal_rapid/n/n666a567697d7?app_launch=false", label: "参考書" },
    { href: "https://note.com/tatal_rapid/n/n666a567697d7?app_launch=false", label: "勉強法" },
    { href: "/geography-notes", label: "note記事" },
    { href: "https://lin.ee/Nwh2C8u", label: "公式LINE" },
  ];

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/images/アイコン　文字なし.png" />
        <title>{siteTitle}</title>
      </Head>

      {/* ===== 1行目：メインナビ（固定） ===== */}
      <header className={styles.navbar}>
        <div className={styles.logoArea}>
          <img src="/images/アイコン　文字なし.png" width={30} height={30} alt="Logo" />
          <span className={styles.siteTitle}>{name}</span>
        </div>

        {/* PC only ナビ */}
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

        {/* ハンバーガー（SP） */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerFixed : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span
            className={`${styles.hamburgerLine} ${styles.lineTop}`}
            style={menuOpen ? { transform: "rotate(45deg) translateY(8px)" } : {}}
          />
          <span
            className={`${styles.hamburgerLine} ${styles.lineMiddle}`}
            style={menuOpen ? { opacity: 0 } : {}}
          />
          <span
            className={`${styles.hamburgerLine} ${styles.lineBottom}`}
            style={menuOpen ? { transform: "rotate(-45deg) translateY(-8px)" } : {}}
          />
        </button>
      </header>

      {/* ===== モバイルメニュー（右スライド） ===== */}
      {menuOpen && (
        <>
          <div
            className={styles.mobileMenu}
            role="dialog"
            {...(!menuOpen && { inert: "true" })}
          >
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

          {/* Overlay */}
          <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
        </>
      )}

      {/* 1行目ナビのすぐ下に設置（PCのみ表示） */}
      <SecondNav links={navLinks} topN={5} />

      <main>{children}</main>

      <Spacer large={90} />
      <SurveyWidget
        primaryColor="#5b86e5"
        primaryDark="#25375eff"
        secondaryColor="#36d1dc"
        secondaryDark="#1e5f73"
        bgLight="#f0f4f8"
      />

      <footer className={styles.footer}>
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
