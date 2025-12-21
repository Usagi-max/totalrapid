// pages/_app.tsx
import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import "../src/styles/globals.css";
import * as gtag from "../lib/gtag";
import useGlobalClickTracker from "../src/hooks/useGlobalClickTracker";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const redirectedRef = useRef(false);

  // 全ページ共通トラッカー
  useGlobalClickTracker();

  // URL パラメータ保持
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = window.location.search;
    if (params) {
      sessionStorage.setItem("saved_params", params);
    }
  }, [router.asPath]);

  // 初回のみ geography へ
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (redirectedRef.current) return;

    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      redirectedRef.current = true;
      sessionStorage.setItem("visited", "true");
      router.replace("/geography");
    }
  }, [router]);

  // GA4 pageview
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

      {/* GA4 */}
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

      {/* UserHeat：本番のみ・一度だけ・遅延 */}
      {process.env.NODE_ENV === "production" && (
        <Script
          id="userheat"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
if (!window.__USERHEAT__) {
  window.__USERHEAT__ = true;
  (function(add, cla){
    window['UserHeatTag']=cla;
    window[cla]=window[cla]||function(){
      (window[cla].q=window[cla].q||[]).push(arguments)
    };
    var ul=document.createElement('script');
    ul.async=1;
    ul.src=add;
    document.head.appendChild(ul);
  })('//uh.nakanohito.jp/uhj2/uh.js', '_uhtracker');

  requestIdleCallback(function(){
    _uhtracker({id:'uhyjRmYgQA'});
  });
}
            `,
          }}
        />
      )}

      <Component {...pageProps} />
    </>
  );
}
