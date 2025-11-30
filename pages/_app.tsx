// /pages/_app.tsx
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import "../src/styles/globals.css";
import * as gtag from "../lib/gtag";
import useGlobalClickTracker from "../src/hooks/useGlobalClickTracker";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // ★ 全ページにクリックトラッカーを適用
  useGlobalClickTracker();

  // -------------------------------------------------------
  // ★ URL パラメータの永続化（方式②：sessionStorage）
  // -------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentParams = window.location.search;

    // URL にパラメータが付いている時だけ保存
    if (currentParams && currentParams !== "") {
      sessionStorage.setItem("saved_params", currentParams);
    }

    // （※ パラメータが消えた後も sessionStorage 側は残る）
  }, [router.asPath]);
  // -------------------------------------------------------

  // ★ 初回訪問時のみ /geography にリダイレクト
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("visited");
      if (!hasVisited) {
        sessionStorage.setItem("visited", "true");
        router.replace("/geography");
      }
    }
  }, [router]);

  // ★ ルート変更時に GA4 PV を送信
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* GA4 読み込み */}
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
