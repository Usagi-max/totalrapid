// pages/prices.js
import Head from "next/head";
import NoteCard from "../components/NoteCard";
import ReviewSlider from '../components/ReviewSlider';
import Spacer from '../components/Spacer';
import CourseTable from "../components/CourseTable";
import HoverButton from "../components/HoverButton";

export default function NoteListPage() {
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
    <>
      <Head>
        <title>学習塾RAPID | 料金表</title>
        <link rel="icon" href="/images/アイコン　文字なし.png" />
      </Head>
      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>指導料金とコースの特徴</h1>
        <CourseTable></CourseTable>
        
        <div style={{ textAlign: "center", marginTop: "40px" }}>
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
        </div>
        <Spacer height={20} />
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>note記事</h1>

        {/* ✅ 横並びラッパー */}
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
        </div>

        <Spacer height={50} />
        <div style={{maxWidth: "100%"}}>
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>保護者様の口コミ</h1>
          <ReviewSlider reviews={reviews} interval={4000} />
        </div>

        {/* 戻るボタン */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
        <HoverButton
            text="元のページに戻る"
            linkTo="/about"
                normalTextColor="orange"
                normalBgColor="#ffffff"
                normalBorderColor="orange"
                hoverTextColor="#ffffff"
                hoverBgColor="orange"
                hoverBorderColor="#ffffff"
        />
        </div>
      </div>
    </>
  );
}
