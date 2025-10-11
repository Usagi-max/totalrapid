import Marker from "../components/Marker";

const markers = [
  {
    name: "blueFade",
    primaryColor: "#5b86e5",
    secondColor: "#36d1dc",
    textColor: "#000000",
    gradationType: "diagonal",
    fadeInType: "float-up",
    opacity: 0.9,
  },
];

export default function Page() {
  return (
    <main style={{ padding: "80px", lineHeight: 2 }}>
      <p style={{ marginBottom: "500px" }}>👇 スクロールして確認してください</p>

      <p>
        これは <Marker markers={markers} use="blueFade">開発フェーズ</Marker> に関する説明です。
      </p>

      <p>
        <Marker markers={markers} use="blueFade">この部分</Marker> は表示から0.5秒後にフェードインします。
      </p>
    </main>
  );
}
