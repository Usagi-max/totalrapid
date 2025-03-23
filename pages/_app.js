import { useEffect } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("visited");

      if (!hasVisited) {
        sessionStorage.setItem("visited", "true");
        router.replace("/about"); // 初回訪問時に /about にリダイレクト
      }
    }
  }, [router]);

  return <Component {...pageProps} />;
}
