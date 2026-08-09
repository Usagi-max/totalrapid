// secondNav.js
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./secondNav.module.css";

export default function SecondNav({ links = [], topN = 2 }) {
  const router = useRouter();
  const displayLinks = links.slice(0, topN);
  const isPortalPage =
    router.pathname === "/login" ||
    router.pathname === "/mypage" ||
    router.pathname.startsWith("/mypage/") ||
    router.pathname === "/admin" ||
    router.pathname.startsWith("/admin/");

  return (
    <div className={`${styles.secondNav} ${isPortalPage ? styles.portalNav : ""}`}>
      <div className={styles.secondNavLinks}>
        {displayLinks.map(({ href, label }) =>
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
      </div>
    </div>
  );
}
