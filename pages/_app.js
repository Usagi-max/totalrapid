// _app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script"; // GAスクリプト読み込みに必要
import "../src/styles/globals.css";
import * as gtag from "../lib/gtag"; // 追加

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // 初回訪問時に /about へリダイレクト
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("visited");

      if (!hasVisited) {
        sessionStorage.setItem("visited", "true");
        router.replace("/about");
      }
    }
  }, [router]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Google Analytics スクリプト */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
