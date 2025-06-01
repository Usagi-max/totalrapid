// components/BreakOnBigScreen.tsx

import { useEffect, useState } from "react";

const BreakOnBigScreen = () => {
  const [isBigScreen, setIsBigScreen] = useState(false);

  useEffect(() => {
    // ウィンドウサイズが変更されたときに呼び出されるハンドラー
    const handleResize = () => {
      // ウィンドウの幅が760pxより大きいかどうかをチェック
      setIsBigScreen(window.innerWidth > 760);
    };

    // 初期ロード時に1回だけ実行
    handleResize();

    // リサイズイベントを監視し、ウィンドウのサイズ変更に対応
    window.addEventListener("resize", handleResize);

    // コンポーネントがアンマウントされるときにリスナーをクリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 依存リストが空なので、マウント時にのみ実行

  // ウィンドウの幅が760pxより大きい場合、改行を表示
  if (isBigScreen) {
    return <br />;
  }

  // ウィンドウの幅が760px以下の場合、何も表示しない
  return null;
};

export default BreakOnBigScreen;
