// layoutGeo.js
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./layout.module.css";


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
