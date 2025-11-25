// pages/prices.js
import Head from "next/head";
import NoteCard from "../components/NoteCard";
import ReviewSlider from '../components/ReviewSlider';
import Spacer from '../components/Spacer';
import CourseTable from "../components/CourseTable";
import HoverButton from "../components/HoverButton";
import Layout, { siteTitle } from "../components/LayoutGeo";
import dynamic from "next/dynamic";


export default function NoteListPage() {
  const FlexibleTable = dynamic(() => import('../components/FlexibleTable'), {
    ssr: false,
  });
  const GradientStripeBox = dynamic(() => import('../components/GradientStripeBox'), {
    ssr: false,
  });
  const priceTable = {
    headers: [
      { label: "コース名", noWrap: true },
      { label: "指導形式", noWrap: true },
      { label: "指導内容", widthWeight: 1 },
      { label: "料金", widthWeight: 1 },
    ],
    rows: [
      {
        data: ["集団指導コース【系統地理】", "少人数指導", "主に高校２年生を対象に系統地理の内容を指導します。学校の定期試験や模試、大学受験で高得点を取ることが目標です。","入塾金5000円＋2500円(月4コマ・月額10000円)"],
        recommend: true,
      },
      {
        data: ["集団指導コース【地誌】", "少人数指導", "主に高校３年生を対象に地誌の内容を指導します。学校の定期試験や模試、大学受験で高得点を取ることが目標です。","入塾金5000円＋2500円(月4コマ・月額10000円)"],
        recommend: true,
      },
      {
        data: ["個別指導コース【定期受講】", "１対１個別指導", "高校１年生から既卒生までを対象に、高校地理の範囲から単元を１つお選びいただき指導します。定期試験対策や補習、受験直前指導などご要望にお答えします。","入塾金5000円＋5000円(１コマ)〜（お子様の実態により変動します。詳しくはお問い合わせください。）"],
      },
      {
        data: ["個別指導コース【スポット受講】", "１対１個別指導", "高校１年生から既卒生までを対象に、高校地理の範囲から単元を１つお選びいただき指導します。定期試験対策や補習、受験直前指導などご要望にお答えします。","7000円(１コマ)〜（お子様の実態により変動します。詳しくはお問い合わせください。）"],
      },
    ],
  };
  const notes = [
    {
        title:"勉強しながら〇〇せよ！学習の質を10倍に高める学習の進め方",
        description:"勉強が得意な人が無意識に行なっている「自己調整学習」では、次の５つのステップで学習を進めることが重要です。",
        imageUrl:"https://assets.st-note.com/production/uploads/images/186680668/rectangle_large_type_2_3bb33ac6f3050851c65032fdefbaedc2.png?width=1200",
        link:"https://note.com/tatal_rapid/n/n3404706618da",
    },
    {
        title:"「勉強しない」が「勝手にやる」に変わる！子どものやる気が爆発する魔法のアプローチ",
        description:"子どもが「勉強しない」姿を見て、ついイライラしたり、将来を心配したりしていませんか？ 多くの親が抱えるこの悩みに対し...",
        imageUrl:"https://assets.st-note.com/production/uploads/images/200561939/rectangle_large_type_2_7fbc1e697ad585901f2a9435f11e6dba.png?width=1200",
        link:"https://note.com/tatal_rapid/n/nb9cb698ef281",
    },
    {
        title:"【保存版】塾は必要？不要？わが子の成績を劇的に伸ばす『タイプ別見極めガイド』",
        description:"子どもを塾に通わせるべきか、それとも自宅学習で十分なのか、多くの保護者の方が悩むことでしょう。近年は塾に通うことが主流になりつつありますが...",
        imageUrl:"https://assets.st-note.com/production/uploads/images/200581161/rectangle_large_type_2_043bcf4ed47b676dfaa7ac7ea1e9542c.png?width=1200",
        link:"https://note.com/tatal_rapid/n/n17035f0e17a3",
    },
  ];
  const reviews = [
  {
    grade: '中1',
    gender: '男',
    nickname: 'Tさん',
    icon: '/images/parent_icon_brother.png',
    comment: 'とても分かりやすい授業です！国語がかなり苦手なのですが、どんなに間違っても先生は優しく丁寧に教えてくださいます。社会・国語・英語は、先生にお願いしています。',
  },
  {
    grade: '中2',
    gender: '女',
    nickname: 'Sさん',
    icon: '/images/parent_icon_user.jpg',
    comment: '先生独自で作ってくださったプリントと先生の解説がとてもわかりやすくて良かったです！',
  },
  {
    grade: '中1',
    gender: '女',
    nickname: 'Nさん',
    icon: '/images/parent_icon_dog.png',
    comment: '分かりやすくて、教え方がうまくて、一気にちゃんと頭にはいってきました。とてもよかったです！テスト頑張ります！',
  },
  {
    grade: '中3',
    gender: '女',
    nickname: 'Hさん',
    icon: '/images/parent_icon_flower.png',
    comment: '先生から提案いただいた試験問題を解いてみて、意外とよく解けたこと、褒めてもらったことなど、とても励みになったようです。',
  },
  {
    grade: '中1',
    gender: '男',
    nickname: 'Aさん',
    icon: '/images/parent_icon_user.jpg',
    comment: 'いつもありがとうございます。学校のプリントに合わせた問題を作ってくれたのがとても助かっています。',
  },
];

  return (
    <Layout>
      <Head>
        <title>学習塾RAPID | 料金表</title>
        <link rel="icon" href="/images/アイコン　文字なし.png" />
      </Head>
      <div style={{  maxWidth: "1200px", margin: "0 auto" }}>
        
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>指導料金とコースの特徴</h1>
        {/* <CourseTable></CourseTable> */}
        <p>当塾では、集団指導コースと個別指導コースの２つをご用意しております。</p>
        <p>集団指導コースでは少人数の生徒に対し共通のカリキュラムに基づいた指導を１コマ2500円で行なっております。</p>
        <p>科目は系統地理(主に高校２年生対象)と地誌(主に高校３年生対象)の２つから選択することができます。</p>
        <h2>系統地理(主に高校２年生対象)</h2>
        <p>こちらのコースでは、一般的な学校の進度に合わせつつ、模試や共通テスト対策を意識した内容を取り扱っています。</p>
        <p>定期試験はもちろん受験対策を少しずつ進めたい方におすすめです。
        個別指導コースでは講師と生徒が１対１で、オリジナルのカリキュラムに基づいた指導を行なっております。</p>
        <p>「この単元から試験に出やすい内容を教えて欲しい」「定期試験の復習をして欲しい」など、様々なご要望にご対応しています。</p>
        <h2>地誌(主に高校３年生対象)</h2>
        <p>こちらのコースでは、１コマ7000円から指導を承っております。定期受講をご希望のお客様は割引価格でご提供しておりますので、詳しくは下の料金表をご確認ください。</p>
        <p>
        当塾では、入塾金5000円と毎月のコース別指導料金以外に料金は一切かかりません。</p>
        <p>また、現在、新規のお客様限定で「①入塾金無料」「②全額返金対応※」のキャンペーンを行なっております。キャンペーンは予告なく終了することがございますので、お申し込みはお早めにお願いいたします。</p>
        <p>※集団指導コースにおいて指導にご満足いただけなかった場合、お申し込み後1ヶ月以内のお客様を対象に全額返金対応をいたします。
        </p>
          <GradientStripeBox
            striped={false}
            randomObject={false}
            backgroundColor="#fff"
            accentColors={["#ffffff42", "#5a80d371"]}
            shapeType={[ "line"]}
            squareCount={70}
            speed={1.6}
            opacityRange={[0.15, 0.35]}
            blur={false}
            mixBlend={false}
            roundedSquares={false}
            shadow
          >
            <FlexibleTable
              title="サービス内容一覧"
              tableData={priceTable}
              textColor="#222"
              accentColor="#36d1dcd8"
              bgColor="#ffffff"
              highlightBgColor="#36d1dc23"
              hasShadow={true}
              minTableWidth="900px"
            />
          </GradientStripeBox>
        
        {/* <div style={{ textAlign: "center", marginTop: "40px" }}>
            <HoverButton
                text="公式LINEから問い合わせる"
                linkTo="https://lin.ee/Nwh2C8u"
                normalTextColor="#00B900"
                normalBgColor="#ffffff"
                normalBorderColor="#00B900"
                hoverTextColor="#ffffff"
                hoverBgColor="#00B900"
                hoverBorderColor="#ffffff"
            />
        <Spacer height={5} />

            <HoverButton
                text="問い合わせフォームから問い合わせる"
                linkTo="https://docs.google.com/forms/d/e/1FAIpQLSdWso9jwFRnCI2cgCP7X3-p52cqlmcJIjWwRYZsD3RScqhiVg/viewform?usp=header"
                normalTextColor="black"
                normalBgColor="#ffffff"
                normalBorderColor="black"
                hoverTextColor="#ffffff"
                hoverBgColor="black"
                hoverBorderColor="#ffffff"
            />
        </div> */}
        <Spacer height={20} />
        {/* <h1 style={{ textAlign: "center", marginBottom: "40px" }}>note記事</h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {notes.map((note, index) => (
            <div key={index} style={{ flex: "1 1 300px", maxWidth: "350px" }}>
              <NoteCard {...note} />
            </div>
          ))}
        </div> */}

        <Spacer height={50} />
        <div style={{maxWidth: "100%"}}>
          <h1 style={{ textAlign: "center", marginBottom: "40px" }}>保護者様の口コミ</h1>
          <ReviewSlider reviews={reviews} interval={4000} />
        </div>

        {/* 戻るボタン */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
        {/* <HoverButton
            text="元のページに戻る"
            linkTo="/about"
                normalTextColor="orange"
                normalBgColor="#ffffff"
                normalBorderColor="orange"
                hoverTextColor="#ffffff"
                hoverBgColor="orange"
                hoverBorderColor="#ffffff"
        /> */}
        </div>
      </div>
    </Layout>
  );
}
