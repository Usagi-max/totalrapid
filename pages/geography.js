  import Head from "next/head";
  import Layout from "../components/LayoutGeo";
  import styles from "../src/styles/geography.module.css";
  import Image from "next/image";
  import FadeInImage from "../components/FadeInImage";
  import Spacer from '../components/Spacer';
  import BreakOnSmallScreen from "../components/BreakOnSmallScreen";
  import HoverButton from "../components/HoverButton";
  import dynamic from 'next/dynamic';
  import Marker from "../components/Marker";
  import DownArrow from "../components/DownArrow";
  // ===========================
  // Dynamic Imports（SSR OFF）
  // ===========================
  const ReviewSlider = dynamic(() => import('../components/ReviewSlider'), {
    ssr: false,
    loading: () => <div>Loading...</div>,
  });
  const FlexibleTable = dynamic(() => import('../components/FlexibleTable'), {
    ssr: false,
  });
  const QASection = dynamic(() => import('../components/QASection'), {
    ssr: false,
  });
  const StepFlow = dynamic(() => import('../components/StepFlow'), {
    ssr: false,
  });
  const SurveyWidget = dynamic(() => import('../components/SurveyWidget'), {
    ssr: false,
  });
  const TabSwitcher = dynamic(() => import('../components/TabSwitcher'), {
    ssr: false,
  });
  const GradientStripeBox = dynamic(() => import('../components/GradientStripeBox'), {
    ssr: false,
  });

  const reviews = [
      {
      grade: '既卒生',
      gender: '男',
      nickname: 'Nさん',
      icon: '/images/parent_icon_dog.png',
      comment: '夏から始めたんですが、わずか３か月で模試の地理が60点台→80点台に！先生が「得点に直結する考え方」だけを選んで教えてくださるので、効率が抜群でした。他の科目に時間を回せたのもありがたかったです。',
    },
    {
      grade: '高3',
      gender: '女',
      nickname: 'Hさん',
      icon: '/images/parent_icon_flower.png',
      comment: '理系科目中心の学習スケジュールの中で、地理を最小限の時間で仕上げたいと思って受講しました。結果、共通テスト本番では85点を取ることができ、合否にも大きく影響しました。先生のカリキュラムに出会えて本当によかったです。',
    },
    {
      grade: '高3',
      gender: '男',
      nickname: 'Tさん',
      icon: '/images/parent_icon_brother.png',
      comment: 'ただの塾講師ではなく、実際に学校で地理を教えている先生という点に惹かれました。授業内容が「テストでどう出るか」を踏まえていて、学校の先生よりも分かりやすいと本人が言っています。保護者としても安心して任せられます。',
    },
    {
      grade: '高2',
      gender: '女',
      nickname: 'Sさん',
      icon: '/images/parent_icon_user.jpg',
      comment: 'オンライン授業に不安がありましたが、ライブ形式でも講師の方が生徒一人ひとりの理解度を見ながら進めてくれるので安心でした。質問しやすい雰囲気で、初めてでもすぐに馴染めたようです。映像授業のフォローも万全でした。',
    },
    {
      grade: '高2',
      gender: '男',
      nickname: 'Aさん',
      icon: '/images/parent_icon_user.jpg',
      comment: '共通テスト向けの塾かと思っていましたが、学校の定期試験前には個別に質問対応してくださりました。苦手分野をしっかりフォローしてくれたので、前回の定期テストでは学年平均＋20点を取ることができました。「評定も上げながら受験対策もできる塾」はなかなかないと思います。',
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
  const tabsData = [
    {
      label: "基礎問題",
      image: "/images/koukou_chiri_vs_kyoutsu_test_1.png"
    },
    {
      label: "応用問題",
      image: "/images/koukou_chiri_vs_kyoutsu_test_2.png"
    }
  ];
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


  export default function About() {
    return (
      <Layout>
        <Head>
          <title>学習塾RAPID</title>
          <link rel="icon" href="/images/アイコン　文字なし.png" />
        </Head>
        <div className={styles.body}>
          {/* <div className={styles.lp_head_container}>
            <picture>
              <source srcSet="/images/geo_head.png" media="(max-width: 768px)" />
              <img src="/images/geo_head.png" alt="Responsive" className={styles.lp_head_image} />
            </picture>
          </div> */}
          <div className={styles.lp_head_container}>
            {/* PC用 */}
            <div className={styles.pcImage}>
              <Image
                src="/images/geo_head.webp"
                alt="Header"
                width={2000}        // 実際の画像の横幅
                height={1200}       // 実際の画像の高さ
                priority
                placeholder="blur"
                blurDataURL="/images/geo_head_low.webp"
                style={{
                  width: '100%',      // 横幅いっぱい
                  height: 'auto',     // アスペクト比保持
                }}
              />
            </div>

            {/* SP用 */}
            <div className={styles.spImage}>
              <Image
                src="/images/geo_head.webp"
                alt="Header"
                width={2000}        // 実際の画像の横幅
                height={1200}       // 実際の画像の高さ
                priority
                placeholder="blur"
                blurDataURL="/images/geo_head_low.webp"
                style={{
                  width: '100%',      // 横幅いっぱい
                  height: 'auto',     // アスペクト比保持
                }}
              />
            </div>
          </div>
          <Spacer large={150} small={30} breakpoint={760}/>
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
            <h2 style={{textAlign: "center"}}><strong>「最低限の勉強で８割」を狙う</strong><BreakOnSmallScreen /><strong>理系受験生のためのカリキュラム</strong></h2>
            <div className={`${styles.lp_about_container}`}>
              <div>
                <p>理系を目指すお子さまにとって、地理は主要科目に比べるとどうしても優先順位が下がりがちです。</p>
                <p><Marker markers={markers} use="blueFade">英語・数学・理科にしっかりと時間を割く</Marker>ために、地理の勉強は最低限にしたいと考える受験生がほとんどだと思います。</p><br/>
                <p>それでは、地理の共通テストで効率良く８割を達成するためにはどのような勉強をすればいいのでしょうか？</p>
                <p>実は、地理の共通テストの問題はいくつかの<Marker markers={markers} use="blueFade">「法則」</Marker>を身につけることで高得点が取れるように設計されています。</p><br/>
                <p>しかし、大半の受験生はこの「法則」を知りません。</p>
                <p>教科書や参考書を読み、<Marker markers={markers} use="blueFade">専門用語を丸暗記</Marker>することで対策しようとするため、多くの時間をかけてしまっている現状があります。</p><br/>
                <p>そこで、私たちは<Marker markers={markers} use="blueFade">過去に出題された問題パターンを全て分析</Marker>することで、正解を導くために必要な「法則」を明らかにしました。</p>
                <p>当塾の講座ではこれらの「法則」を全て伝授しており、実際に数ヶ月で０から高得点を取れるようになった受講生もいます。</p>
                <p>地理は<Marker markers={markers} use="blueFade">「時間をかけて丸暗記する科目」</Marker>ではなく、<Marker markers={markers} use="blueFade">「法則を理解して効率良く学ぶ科目」</Marker>です。</p>
                <p>私たちと一緒に、無理のない学習法で８割を狙っていきましょう！</p>
              </div>
            </div>
          </GradientStripeBox>
          <Spacer large={150} small={30} breakpoint={760}/>
          <SurveyWidget
            primaryColor="#5b86e5"
            primaryDark="#25375eff"
            secondaryColor = "#36d1dc"
            secondaryDark = "#1e5f73"
            bgLight="#f0f4f8"
          />

          <GradientStripeBox
            striped={true}
            randomObject={false}
            accentColors={["#7b97d171", "#6ec9cf42"]}
            shapeType={["circle", "square", "line", "triangle"]}
            squareCount={100}
            speed={1.6}
            opacityRange={[0.15, 0.35]}
            blur={true}
            mixBlend={true}
            roundedSquares={false}
          >
            <div>
              <h1 className={styles.gradientText}>REASON01</h1>
              {/* <h3 style={{textAlign: "center"}} id="point1">REASON1</h3> */}
              <h2 style={{textAlign: "center"}}><strong>現役教員による、</strong><BreakOnSmallScreen /><strong>学校よりも分かりやすい授業</strong></h2>
              <Spacer large={30} />  
              <p style={{textAlign: "center"}}>当塾では、<Marker markers={markers} use="blueFade">教育現場</Marker>での<Marker markers={markers} use="blueFade">指導経験</Marker>を持つ講師のみを選抜しています。</p>
              <p style={{textAlign: "center"}}>特に、塾長は<Marker markers={markers} use="blueFade">現役</Marker>の地理教員であり、これまでに<Marker markers={markers} use="blueFade">偏差値40〜70</Marker>までの多様な生徒に地理総合・地理探究の指導を行ってきました。</p>
              <div className={`${styles.lp_circle_container} ${styles.contentArea}`}>
                <div className={styles.lp_circle_item1}>
                  <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <FadeInImage
                      src="/images/地理塾長.png" 
                      alt="地理塾長"
                      width={468}         // 元画像の横幅
                      height={312}         // 元画像の高さ
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
            </div>
          </GradientStripeBox>

          <GradientStripeBox
            striped={false}
            randomObject={true}
            accentColors={["#36d1dc", "#5b86e5", "#89f7fe"]}
            shapeType={["square", "line"]}
            squareCount={60}
            speed={1.6}
            opacityRange={[0.15, 0.35]}
            blur={false}
            mixBlend={true}
            roundedSquares={false}
          >
            <div>
              <h1 className={styles.gradientText}>REASON02</h1>
              {/* <h3 style={{textAlign: "center"}} id="point2">REASON2</h3> */}
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
              <Spacer large={50} />
              <h4>教科書と共通テストの比較</h4>
              <TabSwitcher
                tabs={tabsData}
                textColor="#ffffff"
                activeBg="linear-gradient(90deg, #5b86e5, #36d1dc)"
                inactiveBg="#cccccc"
              />
            </div>
          </GradientStripeBox>

          <GradientStripeBox
            striped={true}
            randomObject={false}
            accentColors={["#89f6fe42", "#5a80d371"]}
            shapeType={[ "square", "line"]}
            squareCount={70}
            speed={1.6}
            opacityRange={[0.15, 0.35]}
            blur={true}
            mixBlend={true}
            roundedSquares={false}
          >
            <div>
              <h1 className={styles.gradientText}>REASON03</h1>
              {/* <h3 style={{textAlign: "center"}} id="point2">REASON3</h3> */}
              <h2 style={{textAlign: "center"}}><strong>お子様に合わせた学びのサポート</strong></h2>
              <div className={`${styles.lp_total_container} `}>
                <div className={`${styles.lp_total_item} ${styles.item1}`} >
                  <h4>2つの形式から選べる</h4>
                  <h2>自分のペースに合わせた受講方法</h2>
                  <p>当塾ではライブ形式とオンデマンド形式の２つの学び方を選ぶことができます。</p>
                  <p>ライブ形式では、週に1回、Zoomを使ってリアルタイムで講師と一緒に勉強します。</p>
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
                  <h4>授業外での疑問も解消する</h4>
                  <h2>チャットを使った個別質問対応</h2>
                  <p>当塾に在籍する生徒は、質問チャットを<Marker markers={markers} use="blueFade">いつでも</Marker>利用することができます。</p>
                  <p><Marker markers={markers} use="blueFade">講師の解説</Marker>を聞いて分からなかった内容はもちろん、<Marker markers={markers} use="blueFade">学校の授業</Marker>や<Marker markers={markers} use="blueFade">自習中</Marker>に出てきた疑問点にも対応しています。</p>
                  <p>大学合格まで全力でサポートいたします。</p>
                </div>
              </div>
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
            <div className={` ${styles.contentArea}`}>
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
            // shadow={false}
          >
          <div className={` ${styles.contentArea}`}>
            
            <h1 className={styles.gradientText}>お申し込みの流れ</h1>
            <StepFlow
              steps={steps}
              primaryColor="#5b87e5d5"
              secondColor="#36d1dcd8"
              textColor="#ffffff"
              gradationType="diagonal" // "vertical" | "horizontal" | "diagonal" | "radial"
            />


            <div
              className={styles.container}
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "40px",
              }}
            >
              <HoverButton
                  text="LINEで問い合わせる"
                  linkTo="https://lin.ee/Nwh2C8u"
                  normalTextColor="#ffffff"
                  normalBgColor="#06c755"
                  normalBorderColor="#ffffff"
                  hoverTextColor="#06c755"
                  hoverBgColor="#ffffff"
                  hoverBorderColor="#06c755"
                  width="280px"
              />
            </div>
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
          


          <Spacer large={90} />




        </div>
      </Layout>
    );
  }
