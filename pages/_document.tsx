// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Google Search Console */}
        <meta
          name="google-site-verification"
          content="wCkf8er0uclnnIw8oBlOkUt4A8Clezs3IbkRrDw9b68"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
