import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import styles from "../src/styles/About.module.css";
import ChatMessage from "../components/ChatMessage";
import ArrowButton from "../components/ArrowButton";
import GradientHeading from '../components/GradientHeading';
import Image from "next/image";
import FadeInImage from "../components/FadeInImage";
import PointItem from '../components/PointItem';
import Spacer from '../components/Spacer';
import BreakOnSmallScreen from "../components/BreakOnSmallScreen";
import BreakOnBigScreen from "../components/BreakOnBigScreen";
import HoverButton from "../components/HoverButton";
import ReviewSlider from '../components/ReviewSlider';
import NoteCard from "../components/NoteCard";
import dynamic from 'next/dynamic';
import SurveyWidget from '../components/SurveyWidget';
import StepFlow from "../components/StepFlow"
import Marker from "../components/Marker";
import DownArrow from "../components/DownArrow";

// TypeScriptのTSXコンポーネントを動的に読み込む（SSRを回避）
const CourseTable = dynamic(() => import('../components/CourseTable'), { ssr: false });

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
const steps = [
  {
    image: "/images/study__.png",
    title: "体験フォームの⼊⼒",
    description: "こちらよりお名前とメールアドレスを⼊⼒してください。体験授業についてメールでご案内します。",
  },
  {
    image: "/images/study_with.png",
    title: "体験授業への参加",
    description: "実際の授業を受講していただけます。希望があれば、授業後に保護者様も含めた個別⾯談を⾏うことも可能です。",
  },
  {
    image: "/images/study_self.png",
    title: "受講開始",
    description: "内容に納得していただければすぐに受講を開始していただけます。また、過去の授業のアーカイブを全て視聴できるようになります。",
  },
];
const markers = [
  {
    name: "blueFade",
    primaryColor: "#5b86e5",
    secondColor: "#36d1dc",
    textColor: "#000000",
    gradationType: "diagonal",
    fadeInType: "float-fade", // or "fade" or "none"
    opacity: 0.4,
  },
  {
    name: "pinkSoft",
    primaryColor: "#ff9a9e",
    secondColor: "#fad0c4",
    textColor: "#222",
    gradationType: "horizontal",
    opacity: 0.3,
  },
];

export default function About() {
  return (
    <Layout>
      <Head>
        <title>学習塾RAPID</title>
        <link rel="icon" href="/images/アイコン　文字なし.png" />
      </Head>
      <div className={styles.body}>
        <div className={styles.lp_head_container}>
          <picture>
            <source srcSet="/images/sakamoto_head.png" media="(max-width: 768px)" />
            <img src="/images/geo_head.png" alt="Responsive" className={styles.lp_head_image} />
          </picture>
        </div>
        <Spacer height={50} />
        <h2><strong>「最低限の勉強で８割」を狙う</strong><BreakOnSmallScreen /><strong>理系受験生のためのカリキュラム</strong></h2>
        <div className={`${styles.lp_about_container} ${styles.contentArea}`}>
          {/* <div className={styles.lp_about_item1}>

            <Spacer height={20} />
            <div style={{ position: "relative", width: "100%", justifyContent: "center"}}>
              <FadeInImage
                src="/images/student teacher.jpeg"
                alt="Another Image"
                width={600}
                height={400}
                aspectRatio="4/3"
                delay={0.4}
              />
            </div>
          </div> */} 
          <div>
            <p>理系を目指すお子さまにとって、地理は主要科目に比べるとどうしても優先順位が下がりがちです。</p>
            <p><Marker markers={markers} use="blueFade">英語・数学・理科にしっかりと時間を割く</Marker>ために、地理の勉強は最低限にしたいと考える受験生がほとんどだと思います。</p><br/>
            <p>それでは、地理の共通テストで効率良く８割を達成するためにはどのような勉強をすればいいのでしょうか？</p>
            <p>実は、地理の共通テストの問題はいくつかの<Marker markers={markers} use="blueFade">「法則」</Marker>を身につけることで高得点が取れるように設計されています。</p><br/>
            <p>しかし、大半の受験生はこの「法則」を知りません。</p>
            <p>教科書や参考書を読み、<Marker markers={markers} use="blueFade">専門用語を丸暗記</Marker>することで対策しようとするため、多くの時間をかけてしまっている現状があります。</p><br/>
            <p>そこで、サカモト塾では<Marker markers={markers} use="blueFade">過去に出題された問題パターンを全て分析</Marker>することで、正解を導くために必要な「法則」を明らかにしました。</p>
            <p>当塾の講座ではこれらの「法則」を全て伝授しており、実際に数ヶ月で０から高得点を取れるようになった受講生もいます。</p>
            <p>地理は<Marker markers={markers} use="blueFade">「時間をかけて丸暗記する科目」</Marker>ではなく、<Marker markers={markers} use="blueFade">「法則を理解して効率良く学ぶ科目」</Marker>です。</p>
            <p>私たちと一緒に、無理のない学習法で８割を狙っていきましょう！</p>
          </div>
        </div>
        <Spacer height={80} />
        <SurveyWidget
          primaryColor="#36d1dc"
          primaryDark="#1e5f73"
          bgLight="#f0f4f8"
        />

        {/* <div style={{ backgroundColor:"#FFF0D7" ,   width:"100%", paddingBottom:"80px"}}>
          <div className={styles.contentArea}  style={{display: "flex", justifyContent: "center"}}>
            <h1>学習習慣を改善するステップ</h1>
          </div>
          <div className={styles.lp_flow_container}>
            <div className={styles.lp_flow_item} >
              <h4 >STEP1</h4>
              <p style={{padding:"10px" }}>自分一人で<BreakOnBigScreen />正しく学習できない</p>
              <Image 
                src="/images/study__.png" 
                alt="using pc" 
                width={100}
                height={100} 
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div style={{ display: "inline-block",color:"#F39700", transform: "rotate(-90deg) scaleX(2)", padding:"2%"}}>▼</div>
            <div className={styles.lp_flow_item} >
              <h4>STEP2</h4>
              <p style={{padding:"10px" }}>RAPIDと一緒に<BreakOnBigScreen />正しく学習できる</p>
              <Image 
                src="/images/study_with.png" 
                alt="using pc" 
                width={100}
                height={100} 
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div style={{ display: "inline-block",color:"#F39700", transform: "rotate(-90deg) scaleX(2)", padding:"2%"}}>▼</div>
            <div className={styles.lp_flow_item} >
              <h4>STEP3 </h4>
              <p style={{padding:"10px" }}>自分1人で<BreakOnBigScreen />正しく学習できる</p>
              <Image 
                src="/images/study_self.png" 
                alt="using pc" 
                width={100}
                height={100} 
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div> */}

        <h1>学習塾RAPIDが選ばれる理由</h1>
        <Spacer height={50} />
        <h3  id="point1">REASON1</h3>
        <h2 style={{textAlign: "center"}}><strong>現役教員による</strong><BreakOnSmallScreen /><strong>学校よりも分かりやすい授業</strong></h2>
        <Spacer height={30} />
        <p>当塾では、<Marker markers={markers} use="blueFade">教育現場</Marker>での<Marker markers={markers} use="blueFade">指導経験</Marker>を持つ講師のみを選抜しています。</p>
        <p>特に、塾長は<Marker markers={markers} use="blueFade">現役</Marker>の地理教員であり、これまでに<Marker markers={markers} use="blueFade">偏差値40〜70</Marker>までの多様な生徒に地理総合・地理探究の指導を行ってきました。</p>
        <div className={`${styles.lp_circle_container} ${styles.contentArea}`}>
          <div className={styles.lp_circle_item1}>
            <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
              <FadeInImage
                src="/images/地理塾長.png" 
                alt="rapidmethod_cercle"
                width={400}
                height={400}
                aspectRatio="1/1"
                delay={0.4}
              />
            </div>
          </div>
          <div className={styles.lp_circle_item1}>
            <h2>塾長の経歴</h2><br/>
            <p>①<Marker markers={markers} use="blueFade">私立高校の現役教員</Marker>で、１〜３年生の地理総合・地理探究の授業とテスト作成を担当。</p>
            <p>生徒の<Marker markers={markers} use="blueFade">日常生活</Marker>と関連付けた興味を引く切り口と<Marker markers={markers} use="blueFade">直感的</Marker>に分かりやすい解説で<Marker markers={markers} use="blueFade">校内授業満足度１位</Marker>を獲得。</p><br/>
            <p>②国立大学・大学院で<Marker markers={markers} use="blueFade">社会科教育学</Marker>を専攻し、特に地理教育を専門としている</p><br/>
            <p>③学校外ではココナラにて<Marker markers={markers} use="blueFade">累計150人</Marker>の生徒に指導し、<Marker markers={markers} use="blueFade">平均評価4.9</Marker>を獲得</p>
            <p>（現在はココナラでの募集を停止しております）</p>
          </div>

        </div>
        <Spacer height={70} />
        <h3  id="point2">REASON2</h3>
        <h2 style={{textAlign: "center"}}><strong>テストに出やすい内容に特化した</strong><BreakOnSmallScreen /><strong>オリジナル教材</strong></h2>
        <div className={`${styles.lp_total_container} ${styles.contentArea}`}>
          <div className={`${styles.lp_total_item} ${styles.item1}`} >
            <h4>学校で指導する中で見つけた</h4>
            <h2>教科書と共通テストのギャップ</h2>
            {/* <GradientHeading gradientStart="#36d1dc" gradientEnd="#5b86e5" delay={0.0}>教科書と共通テストのギャップ</GradientHeading> */}
            <p>これまでたくさんの受験生を指導する中で最も多かったのは、教科書や参考書を使って勉強しても、<Marker markers={markers} use="blueFade">共通テストの問題が解けない</Marker>」という声でした。</p>
            <p>実は、学校で配布される<Marker markers={markers} use="blueFade">地理の教科書や参考書</Marker>は、難しい専門用語を理解して<Marker markers={markers} use="blueFade">暗記</Marker>するために書かれたものです。</p>
            <p>しかし、新課程の共通テストに出題されるのは、初めて見るグラフや地図の読解問題です。</p>
            <p>これでは普段の学習スタイルとテスト問題の<Marker markers={markers} use="blueFade">形式が異なる</Marker>ため、攻略するまでに<Marker markers={markers} use="blueFade">たくさんの時間</Marker>がかかってしまいます。</p>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item2}`}>
            <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Image
                src="/images/地理塾長イラスト悩む.PNG"
                alt="week pc"
                width={468}         // 元画像の横幅
                height={312}         // 元画像の高さ
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <DownArrow
            size={80}
            primaryColor="#5b86e5"
            secondColor="#36d1dc"
            strokeColor="#ffffff"
            gradationType="vertical"
          />
        </div>
        <div className={`${styles.lp_total_container} ${styles.contentArea}`}>
          <div className={`${styles.lp_total_item} ${styles.item4}`}>
            <h4>市販教材の弱点を補う</h4>
            <h2>オリジナル教材の開発</h2>
            <p><Marker markers={markers} use="blueFade">市販の問題集</Marker>は過去問を中心とした難易度の高いものばかりで、地理が苦手な生徒は<Marker markers={markers} use="blueFade">挫折</Marker>しやすいです。</p>
            <p>私自身も最初は基礎知識を学びながら問題演習ができる市販教材を探しましたが、見つけることはできませんでした。</p>
            <p><Marker markers={markers} use="blueFade">こうなったら、自分で作るしかない！</Marker></p>
            <p>このような思いからオリジナル教材を作成し、基礎知識の習得と読解問題の演習を両立した受験指導を実施しました。</p>
            <p>この教材は多くの生徒に好評で、他のクラスの生徒から<Marker markers={markers} use="blueFade">「出版して欲しい」</Marker>と言われたこともあります。</p>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item3}`}>
            <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Image
                src="/images/地理塾長イラスト決意.PNG"
                alt="week pc"
                width={468}         // 元画像の横幅
                height={312}         // 元画像の高さ
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <DownArrow
            size={80}
            primaryColor="#5b86e5"
            secondColor="#36d1dc"
            strokeColor="#ffffff"
            gradationType="vertical"
          />
        </div>
        <div className={`${styles.lp_total_container} ${styles.contentArea}`}>
          <div className={`${styles.lp_total_item} ${styles.item5}`}>
            <h4>ゼロから最短で実力をつけられる</h4>
            <h2>基礎知識と演習のバランス</h2>
            <p>当塾ではこのオリジナル教材をさらに<Marker markers={markers} use="blueFade">ブラッシュアップ</Marker>して指導に使っています。</p>
            <p>教材は①問題を解くために必要な最低限の解説パート、②問題演習パート、③問題解説パートで構成されており、<Marker markers={markers} use="blueFade">どんなに地理が苦手な生徒でも</Marker>共通テストレベルの問題を解くことができるようになっています。</p>
            <p>学校の授業や自宅での学習で問題が解けなくて自信がなくなってしまった生徒にもおすすめです！</p>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item6}`}>
            <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Image
                src="/images/地理塾長イラスト基礎と演習.png"
                alt="week pc"
                width={468}         // 元画像の横幅
                height={312}         // 元画像の高さ
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
        
        <Spacer height={70} />
        <h3  id="point2">REASON3</h3>
        <h2 style={{textAlign: "center"}}><strong>選べる２つの学び方と</strong><BreakOnSmallScreen /><strong>24時間対応の質問チャット</strong></h2>
        <div className={`${styles.lp_total_container} ${styles.contentArea}`}>
          <div className={`${styles.lp_total_item} ${styles.item1}`} >
            <h4>学校で指導する中で見つけた</h4>
            <h2>教科書と共通テストのギャップ</h2>
            <p>サカモト塾ではライブ形式とオンデマンド形式の２つの学び方を選ぶことができます。</p>
            <p>ライブ形式では、週に１回、Zoomを使ってリアルタイムで講師と一緒に勉強します。</p>
            <p>授業内では質問し放題なので、疑問に思ったことはその場ですぐに解消できます。</p>
            <p>オンデマンド形式では、<Marker markers={markers} use="blueFade">見逃した授業</Marker>や<Marker markers={markers} use="blueFade">参加できなかった授業</Marker>の映像授業を見て勉強します。</p>
            <p>自分の好きなペースで、内容を理解するまで何回でも見直すことができます。</p>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item2}`}>
            <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Image
                src="/images/using pc.jpg"
                alt="week pc"
                width={468}         // 元画像の横幅
                height={312}         // 元画像の高さ
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item3}`}>
            <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Image
                src="/images/using phone.jpg"
                alt="week pc"
                width={468}         // 元画像の横幅
                height={312}         // 元画像の高さ
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item4}`}>
            <h4>市販教材の弱点を補う</h4>
            <h2>オリジナル教材の開発</h2>
            <p>また、当塾に在籍する生徒は、質問チャットをいつでも利用することができます。</p>
            <p>講師の解説を聞いて分からなかった内容はもちろん、学校の授業を受けたり自習したりする中で出てきた疑問点にも対応しています。</p>
            <p>大学合格まで全力でサポートいたします。</p>
          </div>
        </div>

        <Spacer height={30} />
        <div className={` ${styles.contentArea}`}>
        <h1 style={{textAlign: "center"}}>保護者様の口コミ</h1>
          <ReviewSlider reviews={reviews} interval={4000} />
        </div>

        <Spacer height={50} />
        <GradientHeading gradientStart="#36d1dcd8" gradientEnd="#5b87e5d5" delay={0.0}>お申し込みの流れ</GradientHeading>
        <div className={` ${styles.contentArea}`}>
          {/* <StepFlow
            steps={steps}
            primaryColor="#5b86e5"
            secondColor="#36d1dc"
            textColor="#ffffff"
            gradationType="diagonal" // "vertical" | "horizontal" | "diagonal" | "radial"
          /> */}
          <StepFlow
            steps={steps}
            primaryColor="#5b87e5d5"
            secondColor="#36d1dcd8"
            textColor="#ffffff"
            gradationType="diagonal" // "vertical" | "horizontal" | "diagonal" | "radial"
          />
        </div>

        <div className={styles.container} style={{ textAlign: "center", marginTop: "40px" }}>
            <HoverButton
                text="公式LINEから問い合わせる"
                linkTo="https://lin.ee/Nwh2C8u"
                normalTextColor="#ffffff"
                normalBgColor="#00B900"
                normalBorderColor="#ffffff"
                hoverTextColor="#00B900"
                hoverBgColor="#ffffff"
                hoverBorderColor="#00B900"
                width="350px"
            />
            <Spacer height={5} />

            <HoverButton
                text="問い合わせフォームから問い合わせる"
                linkTo="https://docs.google.com/forms/d/e/1FAIpQLSdWso9jwFRnCI2cgCP7X3-p52cqlmcJIjWwRYZsD3RScqhiVg/viewform?usp=header"
                normalTextColor="#ffffff"
                normalBgColor="#494949ff"
                normalBorderColor="#ffffff"
                hoverTextColor="#494949ff"
                hoverBgColor="#ffffff"
                hoverBorderColor="#494949ff"
                width="350px"
            />
            <Spacer height={5} />

            <HoverButton
            text="料金・コース詳細はコチラ！"
            linkTo="/prices"
                normalTextColor="#ffffff"
                normalBgColor="#5b86e5"
                normalBorderColor="#ffffff"
                hoverTextColor="#5b86e5"
                hoverBgColor="#ffffff"
                hoverBorderColor="#5b86e5"
                width="350px"
        />
        </div>

        <div style={{width:"100%",display: "flex", justifyContent: "center", alignItems: "center", flexDirection:"column",padding:"20px"}}>
          <h1 style={{textAlign: "center"}}>英検準2級合格を目指す<BreakOnSmallScreen/>Aさんの事例</h1>
          <Spacer height={30} />
          <h2 style={{textAlign:"center"}}>1週間のスケジュール</h2>
          <p style={{textAlign:"center"}}>Aさんは週1回のレッスンと家庭学習を組み合わせることで、習い事と勉強を両立しています。</p>
            <div className={styles.container}>
              <div className={styles.item}>
                <Spacer height={30} />
                <picture>
                  <source srcSet="/images/week-phone.png" media="(max-width: 768px)" />
                  <img src="/images/week-pc.png" alt="Responsive" width="100%"/>
                </picture>
                <p style={{textAlign:"right"}}>※学習時間はあくまでも目安です。</p>
                <Spacer height={30} />
                <div style={{justifyContent:"center", display:"flex", width: "100%"}}>
                  <div style={{width:"500px",maxWidth:"100%"}}>

                    <HoverButton
                        text="より詳細なカリキュラムはコチラ！"
                        linkTo="https://drive.google.com/file/d/1w22PvlFzD894mqTUFkZGNG3wY9vtpAVR/view?usp=drive_link"
                        normalTextColor="#ffffff"
                        normalBgColor="#494949ff"
                        normalBorderColor="#ffffff"
                        hoverTextColor="#494949ff"
                        hoverBgColor="#ffffff"
                        hoverBorderColor="#494949ff"
                        width="350px"
                    />
                  </div>
                </div>
                <Spacer height={30} />
                <PointItem label="POINT1" text="週1回・90分間の講師とのレッスン" content="学習塾RAPIDでは講師とのレッスンで1週間の学習計画を立てます。Aさんは月曜日をレッスン日、それ以外の曜日を家庭学習日としています。"/>
                <PointItem label="POINT2" text="RAPI-LAを通じて出題される復習課題" content="家庭学習の成果を確認するために、復習課題が出題されます。Aさんは英検合格の基礎となる単語学習を2日に1回復習することにしています。"/>
                <PointItem label="POINT3" text="オンライン自習室を利用した学習" content="家庭学習日にはオンライン自習室を利用することができます。Aさんは苦手な速読トレーニングに集中するために、火曜日と木曜日にオンライン自習室を利用するようです。"/>
                <Spacer height={70} />
                <h2 style={{textAlign:"center"}}>レッスンと家庭学習の様子</h2>
                <Spacer height={20} />
                <p style={{textAlign:"center"}}>Aさんはこの学習計画をどのように立てていったのでしょうか？<BreakOnBigScreen/>講師との具体的なやりとりを見ていきましょう！</p>
                <Spacer height={20} />
              </div>
            </div>

            <div className={`${styles.lp_cycle_container} ${styles.contentArea}`} style={{ backgroundColor:"#FFF0D7"}}>
              <h4>レッスン日（月曜日）</h4>
              <h3 style={{ backgroundColor: "#F39700"}}>　STEP1　Reflect 課題を振り返る</h3>
              <h5>レッスンの最初の時間に、先週の学習成果を中テストで確認し、自分の苦手分野を振り返ります。</h5>
              <ChatMessage
                message="Aさんはリーディングが苦手なようですね。何か困っていることはありますか？"
                icon="/images/teacher naname.jpg"
                isUser={false}
              />
              <ChatMessage
                message="リーディングはいつも文章を読んでいる途中で時間が来ちゃうんですよね。"
                icon="/images/student trouble.jpg"
                isUser={true}
              />
              <ChatMessage
                message="なるほど、それでは読むスピードが遅いことが苦手な原因かもしれないですね。"
                icon="/images/teacher yoko.jpg"
                isUser={false}
              />
              <ChatMessage
                message="確かに読むスピードをもう少し早くすれば問題をしっかり解けるかもしれません。"
                icon="/images/student fight.jpg"
                isUser={true}
              />
            </div>


            <div className={`${styles.lp_cycle_container} ${styles.contentArea}`} style={{ backgroundColor:"rgba(236, 105, 72, 0.15)"}}>
              <h3 style={{ backgroundColor: "#EC6848"}}>　STEP2　Aim 目標を設定する</h3>
              <h5>自分の苦手分野を振り返ったら、それを元に講師と今週の学習目標を設定します。</h5>
              <ChatMessage
                message="今週の学習目標はどうしますか？"
                icon="/images/teacher mae.jpg"
                isUser={false}
              />
              <ChatMessage
                message="「英文を速く読むことができるようにする」という目標にします！"
                icon="/images/student fight.jpg"
                isUser={true}
              />
              <ChatMessage
                message="もう少し具体的に設定してみましょう。中テスト結果によれば、Aさんは現在1分間に読める単語数が100くらいだそうです。  "
                icon="/images/teacher naname.jpg"
                isUser={false}
              />
              <ChatMessage
                message="「1分間に120単語を読むことができるようになる」を目標にします！"
                icon="/images/student happy.jpg"
                isUser={true}
              />
            </div>

            <div className={`${styles.lp_cycle_container} ${styles.contentArea}`}  style={{ backgroundColor:"rgba(196, 15, 36, 0.15)"}}>
              <h3 style={{ backgroundColor:"#C40F24"}}>　STEP3　Plan 計画と戦略を立てる</h3>
              <h5>今週の目標を達成するための具体的な計画と戦略を立てます。</h5>
              <ChatMessage
                message="1分間に120単語を読めるようになるためにはどのような対策が必要でしょうか？"
                icon="/images/teacher yoko.jpg"
                isUser={false}
              />
              <ChatMessage
                message="教材の中にある「速読トレーニング」で集中的して練習したいです。"
                icon="/images/student trouble.jpg"
                isUser={true}
              />
              <ChatMessage
                message="良い戦略だと思います！他の４技能の対策も同時に進めていきたいので、どのように学習計画を立てますか？"
                icon="/images/teacher mae.jpg"
                isUser={false}
              />
              <ChatMessage
                message="火曜日と木曜日に速読、それ以外の曜日に４技能のトレーニングをします！"
                icon="/images/student happy.jpg"
                isUser={true}
              />
            </div>

            <div className={`${styles.lp_cycle_container} ${styles.contentArea}`}  style={{ backgroundColor:"rgba(29, 33, 136, 0.15)"}}>
              <h3 style={{ backgroundColor: "#1D2088"}}>　STEP4　Install 環境を整える</h3>
              <h5>集中できる環境と継続できる仕組みをつくります。</h5>
              <ChatMessage
                message="Aさんは苦手な速読トレーニングをどのように乗り越えますか？"
                icon="/images/teacher naname.jpg"
                isUser={false}
              />
              <ChatMessage
                message="速読の日はオンライン自習室に入って集中できるような環境をつくりたいです。"
                icon="/images/student trouble.jpg"
                isUser={true}
              />
              <ChatMessage
                message="それだとしっかりと集中できそうですね。苦手な分野なので、やり遂げることができたら自分にご褒美を用意してみませんか？"
                icon="/images/teacher yoko.jpg"
                isUser={false}
              />
              <ChatMessage
                message="良いですね！じゃあちゃんとできたらアイスを買うことにします。よし、頑張ろう！！"
                icon="/images/student fight.jpg"
                isUser={true}
              />
            </div>

            <div className={`${styles.lp_cycle_container} ${styles.contentArea}`} style={{ backgroundColor:"rgba(0, 159, 233, 0.15)"}}>
              <h4>家庭学習日（火曜日〜日曜日）</h4>
              <h3 style={{ backgroundColor: "#00A1E9"}}>　STEP5　Do 学習を実行する</h3>
              <h5>レッスン日に講師と一緒に決めた計画に沿って学習を進めます。</h5>

              <ChatMessage
                message="今日は火曜日だから、先生と約束した通り、オンライン自習室を利用して速読トレーニングをしよう！"
                icon="/images/student fight.jpg"
                isUser={true}
              />
              <ChatMessage
                message="勉強の成果が出ているかなぁ。RAPI-LAでチェックした方が良いかも。"
                icon="/images/student trouble.jpg"
                isUser={true}
              />
              <ChatMessage
                message="あ、リーディングの点数が上がってる！！読むスピードも速くなってきているし、次はもっと問題が解けるように頑張りたいな。"
                icon="/images/student happy.jpg"
                isUser={true}
              />
          </div>
        </div>
        {/* <h1>コースの特徴</h1>
        <h4>学習塾RAPIDでは、目的に合わせた<BreakOnSmallScreen/>2つのコースを選ぶことができます。</h4>
        <div className={`${styles.feature_container} ${styles.contentArea}`} >
          <div className={styles.feature_item}>
          <h4>1. 英検対策コース</h4>
          <p>最短3ヶ月で英検合格と本物の学習力を手にいれる短期間のコース。RAPIDメソッドの効果を試したいあなたにおすすめ。  </p>
          </div>
          <div className={styles.feature_item} >
          <Spacer height={20} />
          <img src="/images/rabbit.png" alt="rabbit" style={{ width: "10%", height: "auto" }}/>
          <ArrowButton text="英検対策コース　3〜4ヶ月" width="85%" />
          </div>
        </div>
        <Spacer height={40} />
        <div className={`${styles.feature_container} ${styles.contentArea}`}>
          <div className={styles.feature_item}>
          <h4>2. 入試対策コース</h4>
          <p>学習習慣を着実に改善しつつ高校入試・大学入試合格を目指す長期間のコース。部活や習い事と両立しながら学力を伸ばしたいあなたにおすすめ。  </p>
          </div>
          <div className={styles.feature_item}>
          <img src="/images/turtle.png" alt="turtle" style={{ width: "10%", height: "auto" }}/>
          <ArrowButton text="入試対策コース　4ヶ月〜" width="100%"/>
          </div>
        </div>
        <NoteCard
          title="勉強しながら〇〇せよ！学習の質を10倍に高める学習の進め方"
          description="勉強が得意な人が無意識に行なっている「自己調整学習」では、次の５つのステップで学習を進めることが重要です。"
          imageUrl="https://assets.st-note.com/production/uploads/images/186680668/rectangle_large_type_2_3bb33ac6f3050851c65032fdefbaedc2.png?width=1200"
          link="https://note.com/tatal_rapid/n/n3404706618da"
        /> */}

        


        <Spacer height={90} />

        <div style={{ backgroundColor:"#FFF0D7", width:"100%" ,display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center"}}>
          <h1 style={{textAlign: "center"}}>申し込み方法</h1>
          <div style={{ backgroundColor:"#FFF0D7"}}>
            <div className={`${styles.consultation_container} ${styles.contentArea}`}>
              <div>
                <div>
                  <h2>まずは無料のオンライン相談</h2>
                  <p>次の3点について、代表講師が丁寧にご対応させていただきます。</p>
                  <ul>
                    <li>1. お子様の学習状況と今後目指したい目標についてのヒアリング</li>
                    <li>2. お子様に合わせた最適なカリキュラムと学習プランのご提案</li>
                    <li>3. コースのご案内と料金のお見積もり</li>
                  </ul>
                </div>
                <img src="/images/kobetu soudan.jpeg" alt="相談の様子" />
              </div>

              <div style={{ backgroundColor:"#FFF0D7"}}>
                <div style={{ display: "inline-block",color:"#F39700", transform: "scaleX(2) scaleY(0.7)"}}>▼<br></br>▼<br></br>▼</div>
              </div>

              <div>
                <p>さらに、オンライン相談をお申し込みいただいた方には、「毎日の勉強がかわる！3大無料特典」をお届けしています。</p>

                <div>
                  <div>
                    <span>特典1</span>
                    <p>ベストな学習法がわかる！</p>
                    <p>学習タイプ診断</p>
                  </div>
                  <div>
                    <span>特典2</span>
                    <p>集中できる環境がわかる！</p>
                    <p>学習環境コンサル</p>
                  </div>
                  <div>
                    <span>特典3</span>
                    <p>習慣化のコツがわかる！</p>
                    <p>体験授業</p>
                  </div>
                </div>
                <Spacer height={20} />
                <h3 style={{textAlign: "center"}}>無料カウンセリングに申し込んで<BreakOnSmallScreen/>特典を受け取る</h3>
                <Spacer height={10} />
                <div className={`${styles.button_link}`}>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSdWso9jwFRnCI2cgCP7X3-p52cqlmcJIjWwRYZsD3RScqhiVg/viewform?usp=header" target="_blank" rel="noopener noreferrer">フォームで問い合わせる</a>
                </div>
                {/* <HoverButton
                        text="フォームで問い合わせる"
                        linkTo="https://drive.google.com/file/d/1w22PvlFzD894mqTUFkZGNG3wY9vtpAVR/view?usp=drive_link"
                        normalTextColor="#ffffff"
                        hoverTextColor="green"
                        normalBgColor="#000000"
                        hoverBgColor="orange" 
                    /> */}
                <Spacer height={20} />

                <div className={`${styles.button_link}`}>
                  <a href="https://lin.ee/Nwh2C8u" target="_blank" rel="noopener noreferrer">LINEで問い合わせる</a>
                </div>
                <Spacer height={20} />
                <div className={`${styles.button_link}`}>
                  <a href="/prices" rel="noopener noreferrer">料金表・コース詳細はこちら</a>
                </div>

              </div>
            </div>  
          </div>
        </div>


        {/* <div style={{ backgroundColor:"white"}}>
          <div className={styles.lp_flow_container} style={{flexDirection: "column",textAlign:"center"}} >
            <h1>ご利用の流れ</h1>
            <div className={styles.lp_flow_item}>
                <h4 ><b>STEP1</b>　無料保護者面談</h4>
                <p>フォームにてお申し込み後、お子様の学習状況や合格目標に基づき、カリキュラムや見積もりをご提案させていただきます。面談はオンラインで行いますが、都内在住の場合はスタッフが直接お伺いいたします。</p>
              </div>
              <div style={{ display: "inline-block",color:"#F39700", transform: "scaleX(2)"}}>▼</div>
              <div className={styles.lp_flow_item}>
                <h4><b>STEP2</b>　家庭訪問学習環境コンサル</h4>
                <p>スタッフがご自宅を訪問し、３者面談を行います。お子様の学習タイプやモチベーションタイプを診断し、最も効果的な学習方法についてご提案させていただきます。また、ご希望の場合は学習環境をチェックし、集中できる環境を整えるためのアドバイスも行います。オンライン指導に必要な機材の設定についてもサポートいたします。</p>
              </div>
              <div style={{ display: "inline-block",color:"#F39700", transform: "scaleX(2)"}}>▼</div>
              <div className={styles.lp_flow_item}>
                <h4><b>STEP3 </b>　オンライン指導</h4>
                <p>日程調整や講師の選定が完了した後、オンライン指導がスタートします。</p>
            </div>
          </div>
        </div> */}
      </div>
    </Layout>
  );
}
