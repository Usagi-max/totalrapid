import { useEffect } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("visited");
      if (!hasVisited) {
        sessionStorage.setItem("visited", "true"); // 記録をセット
        router.replace("/about"); // LP にリダイレクト
      }
    }
  }, []);

  return <Component {...pageProps} />;
}
