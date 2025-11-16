// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* スマホ幅を正しく認識させるための必須設定 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

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
