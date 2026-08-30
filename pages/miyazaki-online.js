import Head from 'next/head';
import Image from 'next/image';
import styles from '../src/styles/miyazaki-online.module.css';

const LINE_URL = 'https://lin.ee/Nwh2C8u';

/* ---------- icons ---------- */
function Maru({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12.4 3.2c4.6.1 8 3.5 7.9 8-.1 5-3.8 8.4-8.6 8.1-4.4-.3-7.5-3.9-7.4-8.3.1-4.4 3.8-7.9 8.1-7.8z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20l1-4.6L15.4 5 19 8.6 8.6 19 4 20z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13 7l4 4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconBooks() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="3.4" rx="0.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="10.3" width="16" height="3.4" rx="0.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="15.6" width="11" height="3.4" rx="0.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconNotebook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5.5" y="3.5" width="14" height="17" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 8h6M9 12h6M9 16h3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="5.5" cy="7" r="1" fill="currentColor" />
      <circle cx="5.5" cy="12" r="1" fill="currentColor" />
      <circle cx="5.5" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function IconTeacher() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20c0-4 3-6.4 7-6.4s7 2.4 7 6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconLine() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4C6.9 4 3 7.3 3 11.4c0 3.6 3.1 6.6 7.4 7.2-.3 1-.2 1.9-.1 2.5.1.4.4.5.7.3.5-.3 2.4-1.6 3.6-2.6 5-.4 8.4-3.5 8.4-7.4C23 7.3 17.1 4 12 4z" fill="currentColor" />
    </svg>
  );
}

const benefits = [
  [IconPencil, '必要なときだけ1コマ〜', '毎週通う固定契約は不要。テスト前や苦手克服時など、必要な時だけ頼れます。'],
  [IconBooks, '中学生5教科をフルサポート', '数学・英語はもちろん、理科・社会・国語のわからない部分もピンポイント解決。'],
  [IconNotebook, 'いつもの学校教材でOK', '高額な専用テキストの購入義務はありません。学校のワークやプリントをそのまま使用。'],
  [IconTeacher, '教育を修めた塾長が直接指導', 'アルバイト講師に任せず、大学院で教育学を修めた塾長本人が毎回責任をもって指導。'],
];

const worries = [
  '学校のワークでどうしても解けない問題がある',
  '定期テスト前だけ、集中して質問できる先生がほしい',
  '苦手な単元だけを短期間でピンポイント克服したい',
  '塾に毎週通うほどではないけれど、独学だけでは不安',
  '高校受験直前に追加で難問対策や相談をしたい',
  '毎回担当が変わる一般的な個別指導塾に馴染めない',
];

const useCases = [
  '定期テスト1週間前の駆け込み質問対応',
  '苦手な数学・理科の単元ピンポイント解説',
  '学校のワーク提出前のアドバイス＆点検',
  '高校入試前の実践過去問レクチャー',
];

const materials = [
  '学校で使っているワーク・教科書',
  '学校配布の授業プリント・小テスト',
  '市販の問題集・過去問集',
  '高校受験対策テキスト',
];

const flowSteps = [
  ['01', '教えてほしい教材を提出', '指導の前日までに、教えてほしいワークのページや問題をスマホで撮ってLINEで送信します。'],
  ['02', '塾長が事前に読み込み分析', 'お送りいただいた教材を塾長が事前に分析し、一人ひとりに合わせた解法アプローチを準備。'],
  ['03', '50分間のマンツーマン指導', 'オンラインで対話しながら「なぜそうなるのか」の根本理解と解き方のコツを伝授します。'],
  ['04', '必要なときに次回予約', '月額固定の縛りはゼロ。テスト前や疑問が生じたタイミングでいつでも頼っていただけます。'],
];

const recommendations = [
  '普段は自分のペースで自習を進めたい方',
  '困ったときだけ気軽に質問できるプロの相談相手がほしい方',
  '入会金や無駄な月額固定費を払いたくない方',
  '普段使っている学校の教材で教えてほしい方',
  '教育のプロに毎回同じ担当として見てもらいたい方',
  '高校入試に向けた安心の駆け込み先がほしい方',
];

function LineCta({ children = '初回体験指導をLINEで申し込む', compact = false }) {
  return (
    <a className={`${styles.cta} ${compact ? styles.ctaCompact : ''}`} href={LINE_URL} target="_blank" rel="noopener noreferrer">
      <IconLine />{children}
    </a>
  );
}

export default function MiyazakiOnlinePage() {
  return (
    <>
      <Head>
        <title>宮崎県の中学生のための学習駆け込み寺 | オンライン個別指導 学習塾RAPID</title>
        <meta name="description" content="宮崎県の中学生のための、困ったときにいつでも頼れる学習の駆け込み寺。1コマからプロ塾長が直接指導。学校教材をそのまま使えます。" />
        <link rel="icon" href="/images/アイコン　文字なし.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&family=Zen+Kaku+Gothic+New:wght@500;700;900&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.page}>
        {/* ヘッダー */}
        <header className={styles.header}>
          <a href="#top" className={styles.brand} aria-label="学習塾RAPID オンライン個別指導 トップ">
            <Image src="/images/アイコン　文字あり.webp" alt="学習塾RAPID" width={140} height={36} className={styles.brandLogoImg} />
            <span className={styles.brandNameText}>学習塾RAPID</span>
          </a>
          <nav className={styles.nav} aria-label="ページ内ナビゲーション">
            <a href="#concept">コンセプト</a>
            <a href="#features">特長</a>
            <a href="#flow">受講の流れ</a>
            <a href="#price">料金体系</a>
            <a href="#profile">講師紹介</a>
          </nav>
          <a className={styles.headerLine} href={LINE_URL} target="_blank" rel="noopener noreferrer">
            <IconLine />
            <span>公式LINEで相談</span>
          </a>
        </header>

        <main id="top">
          {/* Heroセクション：全幅 center.jpeg 背景 */}
          <section className={styles.heroSection}>
            <div className={styles.heroBgWrapper}>
              <Image
                src="/images/center.jpeg"
                alt="集中して勉強に取り組む中学生の姿"
                fill
                priority
                className={styles.heroBgImage}
                sizes="100vw"
              />
              <div className={styles.heroOverlay} />
            </div>

            <div className={styles.heroContainer}>
              <div className={styles.heroContent}>
                <div className={styles.eyebrowBadge}>
                  <Image src="/images/アイコン　文字なし.png" alt="" width={20} height={20} />
                  <span>宮崎県の中学生限定 ・ 毎月10名様枠</span>
                </div>
                
                <h1 className={styles.heroTitle}>
                  塾に毎週通うほどではない。<br />
                  でも、独学だけでは不安。<br className={styles.spOnly} /><br />
                  <span className={styles.heroHighlight}>そんなときの「駆け込み寺」</span>
                </h1>

                <p className={styles.heroLead}>
                  普段は自習でがんばるあなたを支えるオンライン指導。<br />
                  <strong>「わからない！」と思ったその時に、必要な分だけ。</strong><br />
                  教育のプロ（塾長）にマンツーマンで相談できる安心のサポート体制です。
                </p>

                <div className={styles.heroPriceCard}>
                  <div className={styles.priceTag}>初回限定</div>
                  <div className={styles.priceBody}>
                    <span className={styles.priceDuration}>50分プロ個別指導</span>
                    <strong className={styles.priceAmount}>2,500<small>円(税込)</small></strong>
                  </div>
                </div>

                <div className={styles.heroMetaBadges}>
                  <span>入会金 0円</span>
                  <span>月額固定費 0円</span>
                  <span>1コマ〜都度受講</span>
                  <span>5教科対応</span>
                </div>

                <div className={styles.heroCtaArea}>
                  <LineCta>初回体験指導をLINEで申し込む</LineCta>
                  <p className={styles.heroSubText}>※一人ひとりの教材を分析・事前準備するため、毎月10名様限定です</p>
                </div>
              </div>

              <div className={styles.heroVisualCardsWrap}>
                <div className={styles.heroVisualCardGrid}>
                  {/* 特長モーダル 1 */}
                  <div className={styles.glassCardItem}>
                    <div className={styles.cardImageHeader}>
                      <Image
                        src="/images/student teacher.jpeg"
                        alt="プロ講師による完全マンツーマン指導"
                        width={240}
                        height={160}
                        className={styles.cardPhoto}
                      />
                      <span className={styles.photoCaption}>完全対話指導</span>
                    </div>
                    <div className={styles.cardTextContent}>
                      <h3>プロのマンツーマン</h3>
                      <p>教育を修めた塾長が質問に直接回答。「解き方のコツ」がわかる！</p>
                    </div>
                  </div>

                  {/* 特長モーダル 2 */}
                  <div className={styles.glassCardItem}>
                    <div className={styles.cardImageHeader}>
                      <Image
                        src="/images/classroom.webp"
                        alt="学校の教材そのままで指導OK"
                        width={240}
                        height={160}
                        className={styles.cardPhoto}
                      />
                      <span className={styles.photoCaption}>教材そのままOK</span>
                    </div>
                    <div className={styles.cardTextContent}>
                      <h3>いつものワークでOK</h3>
                      <p>高額テキスト購入ゼロ。学校のワークをLINEで送るだけで準備完了！</p>
                    </div>
                  </div>

                  {/* 特長モーダル 3 */}
                  <div className={styles.glassCardItem}>
                    <div className={styles.cardImageHeader}>
                      <Image
                        src="/images/宮崎県.png"
                        alt="宮崎県の中学生に寄り添う地域密着型のオンライン指導"
                        width={240}
                        height={160}
                        className={styles.cardPhoto}
                      />
                      <span className={styles.photoCaption}>地域密着型</span>
                    </div>
                    <div className={styles.cardTextContent}>
                      <h3>宮崎県の中学生限定</h3>
                      <p>地域の学校事情に寄り添い、宮崎県の中学生を丁寧にサポートします。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* サービス特長 Grid */}
          <section className={styles.benefitsSection} aria-label="サービスの特徴">
            <div className={styles.benefitsContainer}>
              {benefits.map(([Icon, title, text]) => (
                <article className={styles.benefitCard} key={title}>
                  <div className={styles.iconCircle}><Icon /></div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* コンセプト（駆け込み寺ポジション） */}
          <section id="concept" className={styles.worrySection}>
            <div className={styles.sectionInner}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionSubTitle}>LEARNING REFUGE</span>
                <h2>こんなとき、一人で悩んでいませんか？</h2>
              </div>

              <div className={styles.worryGrid}>
                {worries.map((worry) => (
                  <div className={styles.worryCard} key={worry}>
                    <Maru className={styles.maruIcon} />
                    <span>{worry}</span>
                  </div>
                ))}
              </div>

              <div className={styles.templeBanner}>
                <div className={styles.templeInner}>
                  <Image src="/images/アイコン　文字なし.png" alt="" width={48} height={48} />
                  <div>
                    <p className={styles.templeKicker}>学習塾RAPIDの新しい提案</p>
                    <h3 className={styles.templeTitle}>
                      毎週通わせる塾ではなく、<br />
                      <strong>宮崎県の中学生のための「学習の駆け込み寺」</strong>です。
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 特長1: 必要なときだけ1コマ〜 */}
          <section id="features" className={styles.darkSection}>
            <div className={styles.sectionInner}>
              <div className={styles.splitGrid}>
                <div className={styles.splitText}>
                  <span className={styles.badgeLabel}>FLEXIBLE & REASONABLE</span>
                  <h2>毎週通う必要はありません。<br />「困ったときだけ」頼ってください。</h2>
                  <p className={styles.darkCopy}>
                    一般的な学習塾のように「毎週●曜日に通い、毎月高額な固定月謝がかかる」スタイルではありません。
                  </p>
                  <p className={styles.darkCopy}>
                    普段は自習を中心に進め、<strong>「テスト前の数日間だけ」「どうしてもわからない問題が出たときだけ」</strong>活用できる、都度利用スタイルの個別指導です。
                  </p>
                </div>

                <div className={styles.useCaseCardGrid}>
                  {useCases.map((item, idx) => (
                    <div key={item} className={styles.useCaseCard}>
                      <span className={styles.useCaseNumber}>SCENE 0{idx + 1}</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 特長2: 学校の教材そのまま */}
          <section className={styles.classroomSection}>
            <div className={styles.sectionInner}>
              <div className={styles.classroomGrid}>
                <div className={styles.classroomImageWrap}>
                  <div className={styles.imageFrame}>
                    <Image
                      src="/images/classroom.webp"
                      alt="オンライン指導のイラスト"
                      width={500}
                      height={500}
                      className={styles.classroomImg}
                    />
                  </div>
                  <div className={styles.imageBadge}>
                    <Image src="/images/アイコン　文字なし.png" alt="" width={24} height={24} />
                    <span>オンライン完全個別指導</span>
                  </div>
                </div>

                <div className={styles.classroomContent}>
                  <span className={styles.sectionSubTitle}>NO EXTRA TEXTBOOKS</span>
                  <h2>高額な指定教材の購入は不要。<br />学校のワークやプリントをそのまま使用。</h2>
                  <p className={styles.sectionDesc}>
                    塾指定のテキストを買う必要は一切ありません。学校で配られているワークや教科書、プリントを撮影して送っていただければ、その教材を使って直接レクチャーします。
                  </p>

                  <ul className={styles.materialList}>
                    {materials.map((m) => (
                      <li key={m}>
                        <Maru className={styles.maruIconSmall} />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.materialCallout}>
                    <strong>いつものワーク・プリントをそのままLINEで送るだけで準備完了！</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 受講までの流れ */}
          <section id="flow" className={styles.flowSection}>
            <div className={styles.sectionInner}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionSubTitle}>SIMPLE 4 STEPS</span>
                <h2>受講までの簡単な流れ</h2>
                <p>事前準備はLINEで写真を送るだけ。いつでも気軽に活用できます。</p>
              </div>

              <div className={styles.flowGrid}>
                {flowSteps.map(([num, title, text]) => (
                  <article className={styles.flowCard} key={title}>
                    <span className={styles.flowStepBadge}>STEP {num}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 塾長直接指導のこだわり */}
          <section className={styles.directSection}>
            <div className={styles.sectionInner}>
              <div className={styles.directGrid}>
                <div className={styles.directMainCard}>
                  <span className={styles.directBadge}>HIGH QUALITY GUIDANCE</span>
                  <h2>すべての生徒を、<br />塾長が責任をもって直接指導します。</h2>
                  <p className={styles.directCopy}>
                    アルバイト学生講師に授業を任せるのではなく、大学院まで教育を修めた塾長自身がすべての生徒を担当します。生徒の理解度やつまずきの癖を継続して把握し、信頼できるプロの目でサポートします。
                  </p>

                  <div className={styles.reasonPills}>
                    <span>理解度の深まりを正確に把握</span>
                    <span>指導クオリティに一切のブレがない</span>
                    <span>毎回信頼できる同じプロ講師</span>
                    <span>高校受験・進路まで継続アドバイス</span>
                  </div>
                </div>

                <div className={styles.limitBox}>
                  <div className={styles.limitHeader}>
                    <small>毎月の新規受付枠</small>
                    <div className={styles.limitNumber}>10<small>名様限定</small></div>
                  </div>
                  <p className={styles.limitDesc}>
                    一人ひとりの提出教材をあらかじめ分析・準備し、マンツーマンで最高品質の指導を提供するため、毎月の新規受講人数を限定しております。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 講師プロフィール */}
          <section id="profile" className={styles.profileSection}>
            <div className={styles.sectionInner}>
              <div className={styles.profileGrid}>
                <div className={styles.profileImageContainer}>
                  <div className={styles.profilePhotoWrap}>
                    <Image
                      src="/images/principal.png"
                      alt="学習塾RAPID 塾長"
                      width={380}
                      height={480}
                      className={styles.profileImg}
                    />
                  </div>
                </div>

                <div className={styles.profileContent}>
                  <span className={styles.sectionSubTitle}>INSTRUCTOR PROFILE</span>
                  <h2>教育を大学院まで学んだプロが<br />最初から最後まで直接担当します</h2>
                  <p className={styles.profileIntro}>
                    「どこでつまずいているかわからない」「どう勉強すればいいか迷う」そんな中学生の悩みを、確かな教育理論と教員経験に基づき徹底サポートします。
                  </p>

                  <div className={styles.careerBox}>
                    <h3>略歴・資格</h3>
                    <ul>
                      <li>五ヶ瀬中等教育学校 卒業</li>
                      <li>広島大学 教育学部 卒業</li>
                      <li>広島大学大学院 教育学研究科 修了（教育学修士）</li>
                      <li>中学校・高等学校 教員免許所持</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 宮崎市先行案内 */}
          <section className={styles.startupSection}>
            <div className={styles.sectionInner}>
              <div className={styles.startupCard}>
                <h2>宮崎市での教室開校に向けた<br />先行特別受講枠</h2>
                <p>
                  学習塾RAPIDは、宮崎市での実店舗教室開校を準備しております。<br />
                  開校に先立ち、一人でも多くの宮崎県の中学生にRAPIDの指導のわかりやすさを知っていただくため、オンライン指導を特別体系でご案内しています。
                </p>
                <p className={styles.startupNotice}>
                  ※指導内容が簡易的になることはありません。すべての授業を塾長本人が担当します。
                </p>
              </div>
            </div>
          </section>

          {/* 料金体系 */}
          <section id="price" className={styles.priceSection}>
            <div className={styles.sectionInner}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionSubTitle}>TRANSPARENT PRICING</span>
                <h2>無駄な固定費ゼロ。安心の料金体系</h2>
                <p>入会金や教材費、月額維持費などの不透明な費用は一切ありません。</p>
              </div>

              <div className={styles.priceGrid}>
                <div className={`${styles.priceCard} ${styles.priceTrial}`}>
                  <span className={styles.priceBadge}>初回限定</span>
                  <h3>体験プロ個別指導</h3>
                  <div className={styles.priceVal}>
                    <strong>2,500</strong><span>円 / 50分</span>
                  </div>
                  <p>まずは実際にプロ指導の分かりやすさや相性をご確認ください。</p>
                </div>

                <div className={`${styles.priceCard} ${styles.priceRegular}`}>
                  <span className={`${styles.priceBadge} ${styles.priceBadgeMain}`}>2回目以降</span>
                  <h3>通常プロ個別指導</h3>
                  <div className={styles.priceVal}>
                    <strong>3,500</strong><span>円 / 50分</span>
                  </div>
                  <p>必要なときに、必要なコマ数だけ気軽にご予約いただけます。</p>
                </div>
              </div>

              <div className={styles.priceFeatureRow}>
                <span>入会金 0円</span>
                <span>月額固定費 0円</span>
                <span>1コマから受講OK</span>
                <span>中学生5教科全対応</span>
              </div>
            </div>
          </section>

          {/* こんな方におすすめ */}
          <section className={styles.recommendSection}>
            <div className={styles.sectionInner}>
              <div className={styles.recommendGrid}>
                <div className={styles.recommendTitleBox}>
                  <span className={styles.sectionSubTitle}>RECOMMENDED FOR</span>
                  <h2>このような中学生・ご家庭に<br />ぴったりです</h2>
                </div>

                <div className={styles.recommendList}>
                  {recommendations.map((item) => (
                    <div className={styles.recommendItem} key={item}>
                      <Maru className={styles.maruIcon} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA セクション */}
          <section className={styles.finalCtaSection}>
            <div className={styles.finalCtaBg}>
              <Image
                src="/images/using pc.jpg"
                alt="オンライン学習風景"
                fill
                className={styles.finalCtaImg}
              />
              <div className={styles.finalCtaOverlay} />
            </div>

            <div className={styles.finalCtaContent}>
              <h2>困ったときに、すぐに頼れる<br />マイ学習相談先を。</h2>
              <p>
                毎週決まった時間に塾へ通う必要はありません。<br />
                「テスト前で解けない問題がある」「苦手な単元をプロに見てもらいたい」<br />
                そんな時はいつでも、<strong>学習塾RAPIDのオンライン個別指導</strong>を頼ってください。
              </p>

              <div className={styles.finalPriceTag}>
                初回限定 50分プロ指導 <strong>2,500円</strong>(税込)
              </div>

              <div className={styles.finalCtaButtonWrap}>
                <LineCta>初回体験指導をLINEで申し込む</LineCta>
              </div>

              <small className={styles.finalLimitNotice}>※事前準備・クオリティ維持のため、毎月の新規受付は10名様までとなっております</small>
            </div>
          </section>
        </main>

        {/* フッター */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <Image src="/images/アイコン　文字あり.webp" alt="学習塾RAPID" width={130} height={34} />
            </div>
            <div className={styles.footerLinks}>
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer">公式LINEで質問・相談</a>
            </div>
            <small className={styles.copyright}>© {new Date().getFullYear()} 学習塾 RAPID All rights reserved.</small>
          </div>
        </footer>
      </div>
    </>
  );
}
