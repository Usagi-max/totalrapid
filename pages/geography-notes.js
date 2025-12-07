// pages/prices.js
import Head from "next/head";
import NoteCard from "../components/NoteCard";
import ReviewSlider from '../components/ReviewSlider';
import Spacer from '../components/Spacer';
import CourseTable from "../components/CourseTable";
import NoteSlider from "../components/NoteSlider";  
import useGlobalClickTracker from "../src/hooks/useGlobalClickTracker";
import styles from "../src/styles/geography.module.css";
import Layout, { siteTitle } from "../components/LayoutGeo";
import dynamic from "next/dynamic";

  const FlexibleTable = dynamic(() => import('../components/FlexibleTable'), {
    ssr: false,
  });
  const GradientStripeBox = dynamic(() => import('../components/GradientStripeBox'), {
    ssr: false,
  });
  const QASection = dynamic(() => import('../components/QASection'), {
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

  const qaData = [
    {
      q: "授業料以外に必要な費用はありますか？",
      a: "Webサイトに掲載している入塾金および指導料金以外に、追加の費用はかかりません。\n1対1の個別指導で市販の問題集を使用される場合は、各ご家庭でご用意をお願いいたします。",
    },
    {
      q: "授業料はどのように支払えばいいですか？",
      a: "毎月月末に請求書をメールにてお送りしております。\n記載された期日までに、指定の銀行口座へお振り込みをお願いいたします。",
    },
    {
      q: "入塾が月の途中になった場合、授業料はどうなりますか？",
      a: "当塾では、1コマ単位でお申し込みを受け付けております。\nそのため、実際に受講された回数分のみを計算してご請求いたします。\n月の途中からでも、無駄な費用が発生しない仕組みになっています。",
    },
    {
      q: "受講するためにはどのような機材が必要ですか？",
      a: "オンラインで授業に参加される場合は、カメラとマイクを備えたパソコンまたはタブレットをご用意ください。\nスマートフォンでも受講可能ですが、資料や地図を見やすい大きめの画面での受講をおすすめしております。",
    },
    {
      q: "授業をお休みした場合はどうなりますか？",
      a: "欠席された場合も、授業の録画を視聴いただけます。\nそのため、振替授業などのお手続きは不要です。",
    },
    {
      q: "他教科の勉強と両立できますか？",
      a: "はい、両立可能です。\n地理塾のカリキュラムは、他教科の学習時間を確保しやすいよう、週1回・効率重視の構成となっています。\n他教科とのバランスを意識した学習計画の立て方についてもアドバイスいたします。",
    },
    {
      q: "授業中にカメラを使用する必要はありますか？",
      a: "基本的にはカメラをオンにしてのご参加をおすすめしております。\nただし、必須ではございませんので、カメラをオフにして受講していただくことも可能です。",
    },
    {
      q: "通信環境や設定がわかりません。どうすればいいですか？",
      a: "授業に支障がないかをご確認いただくため、まずは体験授業（定期受講コースのみ）へのご参加をおすすめしております。\nZoomの接続や設定などでお困りの際は、メールにて個別にサポートいたしますのでご安心ください。",
    },
    {
      q: "オンライン授業ですが、集中して取り組めますか？",
      a: "定期受講コースでは、講師の解説と質疑応答を組み合わせ、受講生が主体的に取り組める構成になっています。\nまた、集団指導で集中しにくい場合は、個別指導コースの受講も可能です。\nまずは体験授業で、授業の雰囲気をご確認ください。",
    },
    {
      q: "学校で地理の授業がなくても受講できますか？",
      a: "定期受講コースでは、学校の授業内容に沿って基礎から丁寧に進めております。\nそのため、学校の授業がない方、学校の進度が遅い方におすすめです。\n当塾の指導のみで、基礎知識の習得から共通テストの対策まで完結できます。",
    },
    {
      q: "入試直前の時期でも入塾できますか？",
      a: "はい、年間を通して入塾が可能です。\n入試直前の時期に総復習をご希望の場合は、個別指導の形式で柔軟に対応いたします。",
    },
    {
      q: "途中で退塾する場合の手続きはどうなりますか？",
      a: "退塾をご希望の場合は、当月の月末までにご連絡ください。\n翌月分以降の授業料は発生いたしません。",
    },
  ];

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

  const notes2 = [
    {
        title:"【大学受験】1ヶ月間で共通テスト地理8割を取るためのおすすめの参考書と勉強法",
        description:"共通テスト地理総合・地理探究の受験者が1ヶ月間で8割を取るためのおすすめの参考書と勉強法について、これまでの指導経験をもとに解説しています",
        imageUrl:"https://assets.st-note.com/production/uploads/images/234722498/rectangle_large_type_2_77a15347623bbf1eb58de77005e6234b.png?width=1280",
        link:"https://note.com/tatal_rapid/n/n666a567697d7",
    },
    {
        title:"【大学受験】地理A・B、地理総合、地理探究の違いとは？",
        description:"旧課程の「地理A」「地理B」、新課程の「地理総合」と「地理探究」には勉強する内容に大きな違いがあります。",
        imageUrl:"https://assets.st-note.com/production/uploads/images/233028773/rectangle_large_type_2_89d5bbaa953a788b9886805423058e1d.png?width=1280",
        link:"https://note.com/tatal_rapid/n/n730104279c57",
    },
    {
        title:"【MBTI×勉強法】ワクワクが原動力のESFP（エンターテイナー）に合う勉強法って？",
        description:"ESFPタイプの人は、五感が鋭く、目に見えることや体で感じることに強い関心をもちます。一方で、じっと座って何かを覚える「受け身の勉強」は少し苦手かもしれません。だからこそ...",
        imageUrl:"https://assets.st-note.com/production/uploads/images/202940931/rectangle_large_type_2_ed9aa1cdde5f64a78111c038ae8a46ac.png?width=1280",
        link:"https://note.com/tatal_rapid/n/n53c96b03b2fc",
    },
  ];


  const reviews = [
  {
    grade: '中1',
    gender: '男',
    nickname: 'Tさん',
    icon: '/images/parent_icon_brother.webp',
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
    icon: '/images/parent_icon_dog.webp',
    comment: '分かりやすくて、教え方がうまくて、一気にちゃんと頭にはいってきました。とてもよかったです！テスト頑張ります！',
  },
  {
    grade: '中3',
    gender: '女',
    nickname: 'Hさん',
    icon: '/images/parent_icon_flower.webp',
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

export default function NoteListPage() {
useGlobalClickTracker(); // ← これだけで全自動クリック監視
  return (
    <Layout>
      <Head>
        <title>学習塾RAPID | 料金表</title>
        <link rel="icon" href="/images/アイコン　文字なし.webp" />
      </Head>
      <div className={styles.body}>
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
            shadow={false}
          >
            <div>
              <NoteSlider notes={notes} />
              <NoteSlider notes={notes2} />
            </div>
          </GradientStripeBox>

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
            shadow={false}
          >
            <div>
              <div className={styles.gradientText}>キャンペーン</div>
              {/* <CourseTable></CourseTable> */}
              <p>現在、新規のお客様限定で「①入塾金無料」「②全額返金対応※」のキャンペーンを行なっております。<br/>
                キャンペーンは予告なく終了することがございますので、お申し込みはお早めにお願いいたします。<br/>
                ※集団指導コースにおいて指導にご満足いただけなかった場合、お申し込み後1ヶ月以内のお客様を対象に全額返金対応をいたします。
              </p>
            </div>
          </GradientStripeBox>

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
            <div>
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
              ※右にスクロールしてください
            </div>
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
            <div>
              <h1 className={styles.gradientText}>集団指導コース</h1>
              <p>集団指導コースでは少人数の生徒に対し共通のカリキュラムに基づいた指導を１コマ2500円で行なっております。</p>
              <p>科目は系統地理(主に高校２年生対象)と地誌(主に高校３年生対象)の２つから選択することができます。</p>
              <p>こちらのコースでは、一般的な学校の進度に合わせつつ、模試や共通テスト対策を意識した内容を取り扱っています。</p>
              <p>定期試験はもちろん受験対策を少しずつ進めたい方におすすめです。</p>
            </div>
          </GradientStripeBox>

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
            <div>
              <h1 className={styles.gradientText}>個別指導コース</h1>
              <p>個別指導コースでは講師と生徒が１対１で、オリジナルのカリキュラムに基づいた指導を行なっております。</p>
              <p>「この単元から試験に出やすい内容を教えて欲しい」「定期試験の復習をして欲しい」など、様々なご要望にご対応しています。</p>
              <p>こちらのコースでは、１コマ7000円から指導を承っております。</p>
              <p>定期受講をご希望のお客様は割引価格でご提供しておりますので、詳しくは下の料金表をご確認ください。</p>
            </div>
          </GradientStripeBox>

        <Spacer height={50} />
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
            shadow={false}
          >
            <div style={{maxWidth: "100%"}}>
              <h1 className={styles.gradientText}>保護者様の口コミ</h1>
              <ReviewSlider reviews={reviews} interval={4000} />
            </div>
          </GradientStripeBox>

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
            shadow={false}
          >
            <QASection
              title="よくある質問"
              qaData={qaData}
              accentColors={["#36d1dc", "#5b86e5"]} // 2色指定 → グラデーション
              textColor="#222"
              bgColor="#ffffffff"
            />
          </GradientStripeBox>


      </div>
    </Layout>
  );
}
