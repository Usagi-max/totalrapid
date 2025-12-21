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

        {/* User Heat */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(add, cla){
  window['UserHeatTag']=cla;
  window[cla]=window[cla]||function(){
    (window[cla].q=window[cla].q||[]).push(arguments)
  },
  window[cla].l=1*new Date();
  var ul=document.createElement('script');
  var tag=document.getElementsByTagName('script')[0];
  ul.async=1;
  ul.src=add;
  tag.parentNode.insertBefore(ul,tag);
})('//uh.nakanohito.jp/uhj2/uh.js', '_uhtracker');
_uhtracker({id:'uhyjRmYgQA'});
            `,
          }}
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}