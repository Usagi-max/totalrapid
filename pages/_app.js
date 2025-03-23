import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [hasVisited, setHasVisited] = useState(false);  // 訪問状態の管理
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // sessionStorage から訪問状態を取得
      const hasVisited = sessionStorage.getItem("visited");

      if (!hasVisited) {
        sessionStorage.setItem("visited", "true"); // 初回訪問時に記録をセット
        router.replace("/about"); // 初回訪問時に /about にリダイレクト
      } else {
        setHasVisited(true);  // 2回目以降は通常のページ表示
      }
    }
  }, [router]);

  // 訪問状態が設定されているか、または現在のページが `/about` であれば表示
  if (!hasVisited && router.pathname !== "/about") {
    return null; // `/about` へのリダイレクト中は何も表示しない
  }

  return <Component {...pageProps} />;
}
