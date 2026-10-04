import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import styles from '../src/styles/miyazaki-online.module.css';
import SectionTitle from '../components/SectionTitle';

const LINE_URL = 'https://lin.ee/Nwh2C8u';
const experienceVideoId = '3JZ_D3ELwOQ';
function IconLine() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4C6.9 4 3 7.3 3 11.4c0 3.6 3.1 6.6 7.4 7.2-.3 1-.2 1.9-.1 2.5.1.4.4.5.7.3.5-.3 2.4-1.6 3.6-2.6 5-.4 8.4-3.5 8.4-7.4C23 7.3 17.1 4 12 4z" fill="currentColor" /></svg>; }
function CheckIcon() { return <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="m8 12 2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function StepIcon({ step }) { const paths = { '01': <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M8 8h8M8 12h5M8 16h8" /></>, '02': <><circle cx="10" cy="10" r="5" /><path d="m14 14 5 5M8 10h4M10 8v4" /></>, '03': <><path d="M5 5h14v10H5z" /><path d="M9 20h6M12 15v5" /></>, '04': <><path d="M6 5h12v14H6z" /><path d="m9 12 2 2 4-5" /></> }; return <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">{paths[step]}</svg>; }
// One CTA across the page: a free first consultation on LINE keeps the first step low-commitment.
// PROBLEM illustrations: two-tone line art (stroke = accent, fill = pale). Paths use pathLength=1 so CSS can draw them.
function ProblemIllust({ type }) {
  const line = { className: styles.drawPath, pathLength: 1 };
  const art = {
    test: <>
      <rect x="9" y="17" width="42" height="42" rx="7" className={styles.illustFill} />
      <rect x="9" y="17" width="42" height="42" rx="7" {...line} />
      <path d="M9 29h42M21 11v11M39 11v11" {...line} />
      <path d="M18 38h4M28 38h4M38 38h4M18 48h4M38 48h4" {...line} />
      <circle cx="30" cy="48" r="6.5" {...line} />
      <path d="M47 7h15a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6h-8l-5 5v-5h-2a6 6 0 0 1-6-6v-6a6 6 0 0 1 6-6Z" className={styles.illustFill} />
      <path d="M47 7h15a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6h-8l-5 5v-5h-2a6 6 0 0 1-6-6v-6a6 6 0 0 1 6-6Z" {...line} />
      <path d="M51.5 13.5a3.5 3.5 0 1 1 5 3.2c-1.2.6-1.5 1.3-1.5 2.3" {...line} />
      <circle cx="55" cy="22.5" r=".9" className={styles.illustDot} />
    </>,
    unit: <>
      <rect x="10" y="44" width="52" height="16" rx="3" className={styles.illustFill} />
      <rect x="10" y="44" width="52" height="16" rx="3" {...line} />
      <rect x="10" y="26" width="24" height="16" rx="3" className={styles.illustFill} />
      <rect x="10" y="26" width="24" height="16" rx="3" {...line} />
      <rect x="38" y="26" width="24" height="16" rx="3" className={styles.illustGap} />
      <rect x="22" y="8" width="28" height="16" rx="3" className={styles.illustFill} />
      <rect x="22" y="8" width="28" height="16" rx="3" {...line} />
      <g transform="rotate(-24 50 34)">
        <rect x="39" y="29.5" width="22" height="9" rx="4.5" className={styles.illustPatch} />
        <rect x="39" y="29.5" width="22" height="9" rx="4.5" {...line} />
        <path d="M47 32.5v3M50 32.5v3M53 32.5v3" {...line} />
      </g>
    </>,
    work: <>
      <path d="M36 18c-7-5-17-6-26-4v40c9-2 19-1 26 4 7-5 17-6 26-4V14c-9-2-19-1-26 4Z" className={styles.illustFill} />
      <path d="M36 18c-7-5-17-6-26-4v40c9-2 19-1 26 4 7-5 17-6 26-4V14c-9-2-19-1-26 4Z" {...line} />
      <path d="M36 18v40M16 24h13M16 31h13M16 38h10" {...line} />
      <path d="M44 30a5 5 0 1 1 7 4.6c-1.6.8-2 1.8-2 3.2" {...line} />
      <circle cx="49" cy="43" r="1.1" className={styles.illustDot} />
      <rect x="52" y="5" width="15" height="15" rx="2" transform="rotate(10 59.5 12.5)" className={styles.illustNote} />
      <path d="M41 52l1.5 1M46 54l1 1.5M43.5 56.5l.5 1" {...line} />
    </>,
  };
  return <svg className={styles.problemIllust} viewBox="0 0 72 72" fill="none" aria-hidden="true">{art[type]}</svg>;
}
// YouTube loads only after a tap: the thumbnail is a light static image instead of ~1MB of player JS.
function LiteYouTube({ id, title }) {
  const [playing, setPlaying] = useState(false);
  if (playing) return <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />;
  return <button type="button" className={styles.videoFacade} onClick={() => setPlaying(true)} aria-label={`動画を再生：${title}`}><img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" /><span className={styles.videoPlay} aria-hidden="true" /></button>;
}
function LineCta({ children = 'LINEで初回無料相談をする', note = '相談のみでもOK・初回指導は50分2,500円' }) { return <div className={styles.ctaBlock}><a className={styles.cta} href={LINE_URL} target="_blank" rel="noopener noreferrer"><IconLine />{children}</a>{note && <small className={styles.ctaNote}>{note}</small>}</div>; }

// Hero cards mirror the three pillars below (same numbering and labels).
const heroPillarCards = [
  { num: '01', label: '誰が', title: '塾長が毎回直接指導', text: '宮崎出身・広島大学大学院（教育学）修了の現役教師が担当します。', image: '/images/principal.webp', alt: '学習塾RAPID 塾長', position: 'center 18%', href: '#person' },
  { num: '02', label: '何を', title: '宮崎県の入試に特化', text: '学校のワークを使いながら、過去問10年分の分析から学ぶ順番を決めます。', image: '/images/strategy-analysis.webp', alt: '宮崎県高校入試の過去問を分析しているノート', href: '#strategy' },
  { num: '03', label: 'どう定着', title: '授業後も見返せる', text: '自分の講義を受講後1か月、何度でも視聴できます。', image: '/images/archive-review.webp', alt: '授業動画を見ながらノートにまとめる生徒の手元', href: '#archive' },
];
const pillars = [
  { num: '01', label: '誰が', title: '塾長が直接指導', copy: '誰に教わるかが、最初から決まっています。', points: ['担当講師が変わらない', '理解度を継続して把握'], href: '#person' },
  { num: '02', label: '何を', title: '宮崎県特化の戦略', copy: '宮崎県を知るから、遠回りさせない。', points: ['過去問10年分の出題傾向を分析', '理解度から学ぶ優先順位を決定'], href: '#strategy' },
  { num: '03', label: 'どう定着させるか', title: '個別最適化 × アーカイブ', copy: '単発なのに、学びが残る。', points: ['受講後1か月、講義を何度でも見返せる', '受講月は他の講義も視聴できる'], href: '#archive' },
];
const singleSessionTags = ['最低受講回数なし', '月額定期受講なし', '入会金0円'];
const priceIncludes = ['入会金0円', '月額固定費0円', '1コマから受講', '中学生5教科対応'];
const singleSessionSteps = [['1', 'LINEで依頼', '指導3日前までに、教えてほしい内容を送るだけ。'], ['2', '50分の個別指導', '料金は1コマ単位。月額の固定費はかかりません。'], ['3', 'また必要な時に', '最低受講回数なし。次に受けるかは毎回自由です。']];
const learningCycle = [['01', '授業', '50分の個別指導', '前半は講義、後半は理解度に合わせて確認・演習。'], ['02', '復習', 'アーカイブで復習', '自分の講義を、受講後1か月何度でも。'], ['03', '応用', 'ほかの講義で応用', '頻出・難関・つまずき問題の講義も視聴できる。']];
// Learning cycle ring: each segment is one arrow (bar + head) cut out with clip-path.
// The ring is drawn already projected onto a tilted floor: coordinates are % of the
// (squashed) plane, the band is thicker at the front, and the back is slightly narrower.
// Angles start at 12 o'clock (the back) and run clockwise.
const CYCLE_BAND_BACK = 0.1;
const CYCLE_BAND_FRONT = 0.19;
const CYCLE_PERSPECTIVE = 0.06;
const CYCLE_HEAD = 6;
const CYCLE_GAP = 6;
const cycleSegmentColors = ['#fdba74', '#fb8a4c', '#ea580c'];
const cycleBand = (rad) => CYCLE_BAND_BACK + ((CYCLE_BAND_FRONT - CYCLE_BAND_BACK) * (1 - Math.cos(rad))) / 2;
// position: 0 = outer edge, .5 = band centre, 1 = inner edge.
function cyclePosition(angle, position) {
  const rad = (angle * Math.PI) / 180;
  const radius = 1 - cycleBand(rad) * position;
  const narrow = 1 - CYCLE_PERSPECTIVE * Math.cos(rad);
  return [50 + 50 * radius * narrow * Math.sin(rad), 50 - 50 * radius * Math.cos(rad)];
}
const cyclePoint = (angle, position) => cyclePosition(angle, position).map((value) => `${value.toFixed(2)}%`).join(' ');
function cycleSegmentPath(index, count) {
  const span = 360 / count;
  const start = index * span - span / 2 + CYCLE_GAP / 2;
  const end = start + span - CYCLE_GAP;
  const arc = (from, to, position) => {
    const steps = Math.ceil(Math.abs(to - from) / 3);
    return Array.from({ length: steps + 1 }, (_, i) => cyclePoint(from + ((to - from) * i) / steps, position));
  };
  return `polygon(${[...arc(start, end, 0), cyclePoint(end + CYCLE_HEAD, .5), ...arc(end, start, 1), cyclePoint(start + CYCLE_HEAD, .5)].join(', ')})`;
}
function cycleNodeStyle(index, count) {
  const [left, top] = cyclePosition((360 / count) * index, .5);
  return { left: `${left.toFixed(2)}%`, top: `${top.toFixed(2)}%` };
}
const strategySteps = [['01', '過去問10年分を分析', '宮崎県高校入試の出題傾向・頻出分野を把握。'], ['02', '理解度・特性を確認', 'どこでつまずいているかを見つける。'], ['03', '優先順位を決定', '何から、どこに時間を使うかを整理。'], ['04', '指導方法を個別最適化', '無駄な遠回りを減らし、伸びる学び方へ。']];
const scenes = ['テスト前だけ相談したい', '苦手単元だけ克服したい', '学校のワークが分からない', '高校受験前に対策したい', '普段は自分で勉強したい', '単発の問題を解決したい'];
const worries = [
  ['test', '定期テスト前だけ、集中して質問できる先生がほしい'],
  ['unit', '苦手な単元だけを短期間で克服したい'],
  ['work', '学校のワークで分からない問題が、そのままになっている'],
];
const faqs = [
  ['対象は誰ですか？', '宮崎県の中学生を対象としたオンライン個別指導です。'],
  ['どの教科に対応していますか？', '中学生の5教科に対応しています。'],
  ['学校のワークやプリントを使えますか？', 'はい、学校の教材をそのまま使えます。指導日の3日前までに、教えてほしい問題や苦手な内容をLINEでお送りください。'],
  ['毎週受講しないといけませんか？', 'いいえ。50分1コマから、必要な時だけ受講できます。入会金・月額固定費・最低受講回数はありません。'],
  ['料金はいくらですか？', '初回は50分2,500円、継続受講は50分3,500円です（いずれも税込）。'],
  ['授業はあとから見返せますか？', '受講後1か月間、ご自身の講義部分を何度でも視聴できます。受講月は、宮崎県の頻出問題・難関問題・つまずきやすい問題など、ほかの講義部分も視聴できます。'],
  ['テストの前日など、急ぎでも受けられますか？', '一人ひとりの教材を読み込んで授業を準備するため、指導日の3日前までのご依頼をお願いしています。'],
  ['オンラインの環境・お支払い方法・日程の決め方は？', '公式LINEの初回無料相談でご案内します。受講前の質問だけでもお気軽にどうぞ。'],
];
const flowSteps = [['01', '教えてほしい内容を送る', '学校のワーク・プリントの写真と苦手な内容を、指導3日前までにLINEで送るだけ。'], ['02', '塾長が内容を確認', '教材と質問内容を読み込み、必要な授業を準備。'], ['03', '50分の個別指導', '前半は講義、後半は理解度に合わせて進めます。'], ['04', 'アーカイブで復習', '授業後も講義部分を繰り返し視聴できます。']];
const ReviewSlider = dynamic(() => import('../components/ReviewSlider'), { ssr: false, loading: () => <div>口コミを読み込み中…</div> });
const reviews = [
  { grade: '既卒生', gender: '男', nickname: 'Nさん', icon: '/images/parent_icon_dog.webp', comment: '夏から始めたんですが、わずか３か月で模試の地理が60点台→80点台に！先生が「得点に直結する考え方」だけを選んで教えてくださるので、効率が抜群でした。他の科目に時間を回せたのもありがたかったです。' },
  { grade: '高3', gender: '女', nickname: 'Hさん', icon: '/images/parent_icon_flower.webp', comment: '理系科目中心の学習スケジュールの中で、地理を最小限の時間で仕上げたいと思って受講しました。結果、共通テスト本番では85点を取ることができ、合否にも大きく影響しました。' },
  { grade: '高3', gender: '男', nickname: 'Tさん', icon: '/images/parent_icon_brother.webp', comment: '実際に学校で地理を教えている先生という点に惹かれました。授業内容が「テストでどう出るか」を踏まえていて、保護者としても安心して任せられます。' },
  { grade: '高2', gender: '女', nickname: 'Sさん', icon: '/images/parent_icon_user.jpg', comment: 'オンライン授業に不安がありましたが、生徒一人ひとりの理解度を見ながら進めてくれるので安心でした。質問しやすい雰囲気です。' },
  { grade: '高2', gender: '男', nickname: 'Aさん', icon: '/images/parent_icon_user.jpg', comment: '定期試験前には個別に質問対応してくださり、苦手分野をしっかりフォローしてくれました。' },
];

export default function MiyazakiOnlinePage() {
  // Mobile sticky CTA appears once the hero CTA has scrolled out of view.
  const heroCtaRef = useRef(null);
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const target = heroCtaRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setShowStickyCta(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  // Scroll reveals: one shared observer marks [data-reveal] elements as seen (once); [data-countup] numbers count up.
  const pageRef = useRef(null);
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    const root = pageRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const countUp = (el) => {
      const target = Number(el.dataset.countup);
      if (reduceMotion || !target) return;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 1200, 1);
        el.textContent = String(Math.round(target * (1 - (1 - progress) ** 4)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.inview = 'true';
        entry.target.querySelectorAll('[data-countup]').forEach(countUp);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    root.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    // With reduced motion nothing is ever hidden, so content simply stays visible.
    if (!reduceMotion) setMotionReady(true);
    return () => observer.disconnect();
  }, []);
  return <>
    <Head><title>宮崎県の中学生に、遠回りしない勉強を｜学習塾RAPID</title><meta name="description" content="宮崎県の中学生のために、教育のプロが学習を個別最適化。塾長が直接指導し、必要な時だけ1コマから受講できるオンライン個別指導です。" /><link rel="icon" href="/images/アイコン　文字なし.png" /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" /><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&family=Zen+Kaku+Gothic+New:wght@500;700;900&display=swap" rel="stylesheet" /></Head>
    <div className={`${styles.page} ${motionReady ? styles.motionReady : ''}`} ref={pageRef}>
      <header className={styles.header}><a href="#top" className={styles.brand} aria-label="学習塾RAPID トップ"><Image src="/images/アイコン　文字あり.webp" alt="学習塾RAPID" width={140} height={36} className={styles.brandLogoImg} /><span className={styles.brandNameText}>学習塾RAPID</span></a><nav className={styles.nav} aria-label="ページ内ナビゲーション"><a href="#pillars">3つの柱</a><a href="#lesson">授業の仕組み</a><a href="#flow">受講の流れ</a><a href="#price">料金</a><a href="#faq">よくある質問</a><a href="#person">塾長紹介</a></nav><a className={styles.headerLine} href={LINE_URL} target="_blank" rel="noopener noreferrer"><IconLine /><span>初回無料相談</span></a></header>
      <main id="top">
        <section className={styles.heroRestore}><div className={styles.heroBgWrapper}><Image src="/images/center-hero.webp" alt="集中して勉強に取り組む中学生" fill priority className={styles.heroBgImage} sizes="100vw" /><div className={styles.heroOverlay} /></div><div className={styles.heroContainer}><div className={styles.heroContent}><div className={styles.eyebrowBadge}><Image src="/images/アイコン　文字なし.png" alt="" width={20} height={20} /><span>宮崎県の中学生対象・毎月10名限定</span></div><h1 className={styles.heroTitle}>塾に毎週通うほどではない。<br />でも、独学だけでは不安。<br /><span className={styles.heroHighlight}>必要な時だけ、1コマから。</span></h1><p className={styles.heroLead}>普段は自習でがんばるお子さまのための、オンライン個別指導。<br /><strong>「ここがわからない」をLINEで送るだけ。</strong><br />必要な分だけ、塾長が授業を準備してマンツーマンで教えます。</p><div className={styles.heroPriceCard}><div className={styles.priceTag}>初回限定</div><div className={styles.priceBody}><span className={styles.priceDuration}>50分プロ個別指導</span><strong className={styles.priceAmount}>2,500<small>円(税込)</small></strong></div></div><div className={styles.heroMetaBadges}><span>入会金 0円</span><span>月額固定費 0円</span><span>1コマ〜都度受講</span><span>5教科対応</span></div><div className={styles.heroCtaArea} ref={heroCtaRef}><LineCta /><p className={styles.heroSubText}>※事前に教材を読み込むため、指導日の3日前までにご依頼ください。毎月10名様限定です。</p></div></div><div className={styles.heroVisualCardsWrap}><div className={styles.heroVisualCardGrid}>{heroPillarCards.map(({ num, label, title, text, image, alt, position, href }) => <a className={styles.glassCardItem} href={href} key={num}><div className={styles.cardImageHeader}><Image src={image} alt={alt} width={240} height={160} className={styles.cardPhoto} style={position ? { objectPosition: position } : undefined} /><span className={styles.photoCaption}>{num} {label}</span></div><div className={styles.cardTextContent}><h3>{title}</h3><p>{text}</p></div></a>)}</div></div></div></section>
        <section className={styles.worrySection}><div className={styles.sectionInner}><SectionTitle className={styles.sectionHeader} kicker="PROBLEM" title="こんなとき、一人で悩んでいませんか？" description="毎週の通塾までは必要ない。でも、頼れる先生がいてほしい。" backdrop="PROBLEM" colors={{ description: 'var(--text-muted)' }} data-reveal="" /><div className={styles.problemLead} data-reveal=""><Image src="/images/student-trouble.webp" alt="" width={88} height={88} className={styles.problemAvatar} /><p className={styles.problemBubble}>どこから手をつければいいんだろう…</p></div><ul className={styles.problemList}>{worries.map(([type, worry], index) => <li className={styles.problemCard} key={type} data-reveal="" style={{ '--i': index }}><ProblemIllust type={type} /><p>{worry}</p></li>)}</ul></div><div className={styles.problemResolve}><div className={styles.problemChevrons} aria-hidden="true"><span className={styles.problemChevron} /><span className={styles.problemChevron} /></div><div className={styles.problemBanner} data-reveal=""><Image src="/images/student-teacher.webp" alt="" fill sizes="(max-width: 820px) 100vw, 960px" className={styles.problemBannerBg} /><div className={styles.problemBannerInner}><Image src="/images/student-fight.webp" alt="" width={84} height={84} className={styles.problemBannerAvatar} /><div><p className={styles.problemBannerKicker}>必要な時だけ、1コマから頼れる</p><h3 className={styles.templeTitle}>そんな時の駆け込み寺、<strong>学習塾RAPID</strong>へ。</h3></div></div></div></div></section>
        <section id="pillars" className={styles.pillarSection}><div className={styles.sectionInner}><SectionTitle className={styles.sectionHeader} kicker="必要な時だけ頼れる、宮崎の中学生のための個別指導" title="最短距離の学びをつくる、3つの柱。" description="「誰が」「何を」「どう定着させるか」を、一人ひとりに合わせて設計します。" backdrop="PILLARS" backdropOpacity={0.05} colors={{ description: 'var(--text-muted)' }} /><div className={styles.pillarGrid}>{pillars.map(({ num, label, title, copy, points, href }, index) => <article className={styles.pillarCard} key={num} data-reveal="" style={{ '--i': index }}><div className={styles.pillarCardMeta}><span className={styles.pillarNum}>{num}</span><span className={styles.pillarType}>{label}</span></div><h3>{title}</h3><p>{copy}</p><ul className={styles.pillarPoints}>{points.map((point) => <li key={point}><CheckIcon />{point}</li>)}</ul><a className={styles.pillarLink} href={href}>詳しく見る<span aria-hidden="true">→</span></a></article>)}</div><div className={styles.pillarNote} data-reveal=""><span className={styles.pillarNoteBadge}>単発受講OK</span><p className={styles.pillarNoteLead}>さらにこれらを、<strong>1コマからの単発受講</strong>でご提供します。</p><ul className={styles.pillarNoteTags}>{singleSessionTags.map((tag) => <li key={tag}><CheckIcon />{tag}</li>)}</ul><a className={styles.pillarNoteLink} href="#price">料金と受講方法を見る<span aria-hidden="true">→</span></a></div></div></section>
        <section className={styles.personMerged} id="person"><div className={styles.sectionInner}><SectionTitle className={styles.personMergedHeading} kicker="01 · PERSON" title="すべての生徒を、塾長が直接指導します。" description="誰に教わるかが最初から明確だから、理解の深まりまで一貫して見届けます。" backdrop="01 · PERSON" /><div className={styles.personMergedGrid}><div className={styles.personMergedPhoto}><Image src="/images/principal.webp" alt="学習塾RAPID 塾長" width={380} height={480} className={styles.profileImg} /></div><div className={styles.personMergedBody}><p>塾長の安藤です。この度、自分が育った宮崎に恩返しをしたい！という気持ちでこの塾を立ち上げました！大学院と学校現場で学んだ「自分から勉強する子どもの指導法」を取り入れた授業をしていきます。</p><div className={styles.careerBox}><h3>塾長安藤の略歴</h3><ul><li>五ヶ瀬中等教育学校 卒業</li><li>広島大学 教育学部 卒業</li><li>広島大学大学院 教育学研究科 修了</li><li>現役教師</li></ul></div></div></div><div className={styles.inlineCta}><LineCta /></div></div></section>
        <section id="strategy" className={styles.strategySection}><div className={styles.sectionInner}><SectionTitle className={styles.sectionHeader} kicker="02 · STRATEGY" title="宮崎県高校入試の出題傾向を踏まえた指導" description="教育理論を研究してきた塾長が、宮崎県の高校入試の傾向と生徒の理解度から学び方を設計します。" backdrop="02 · STRATEGY" colors={{ description: 'var(--text-muted)' }} /><div className={styles.strategyLayout}><figure className={styles.strategyVisual} data-reveal=""><div className={styles.strategyVisualImage}><Image src="/images/strategy-analysis.webp" alt="宮崎県高校入試の過去問を分析している机の上" fill sizes="(max-width: 820px) 100vw, 460px" /></div><figcaption className={styles.strategyStat}><span>宮崎県公立高校入試</span><strong><span data-countup="10">10</span><small>年分</small></strong><span>の過去問から、出題傾向を分析</span></figcaption></figure><ol className={styles.strategySteps} data-reveal="">{strategySteps.map(([num, title, text], index) => <li key={num} style={{ '--i': index }}><span className={styles.strategyStepNum}>{num}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></div><div className={styles.strategyStatement} data-reveal=""><p className={styles.strategyStatementLead}>何を勉強するかだけではありません。</p><p>何から始めるか。どの方法なら理解できるか。<br /><strong>そこまで含めて考えます。</strong></p></div></div></section>
        <section id="lesson" className={styles.lessonSection}><div className={styles.sectionInner}><SectionTitle className={styles.sectionHeader} kicker="03 · EXPERIENCE" title="50分間、一方的に教えて終わりではありません。" description="前半終了後、理解度に応じて後半の指導方法が変わります。" backdrop="03 · EXPERIENCE" /><div className={styles.lessonTimeline} data-reveal=""><div className={styles.lessonStart}><strong>個別カスタマイズされたオリジナル解説授業</strong><div className={styles.lessonVideo}><LiteYouTube id={experienceVideoId} title="個別指導の講義イメージ" /></div></div><div className={styles.lessonBranches}><div className={styles.lessonBranchHeading}>理解度に応じた指導方法</div><article><span>A</span><div><h3>自分で解説してみる</h3><p>自分の言葉で説明し、本当に理解できているか確認。</p></div></article><article><span>B</span><div><h3>追加質問</h3><p>分からない部分を残さず、さらに質問。</p></div></article><article><span>C</span><div><h3>類題チャレンジ</h3><p>「分かった」を「自分で解ける」に変える。</p></div></article></div></div><div id="archive" className={styles.learningCycle}><SectionTitle className={styles.learningCycleHeading} titleAs="h3" kicker="LEARNING LIBRARY" title="授業は50分。学びは、その後も続きます。" description="単発なのに、受講した1コマがその月の学習資産になります。" colors={{ description: 'var(--text-muted)' }} /><div className={styles.cycleRing} data-reveal=""><div className={styles.cyclePlane}><div className={styles.cycleRingStage} aria-hidden="true">{learningCycle.map(([num], index) => <span className={styles.cycleSegmentDepth} style={{ clipPath: cycleSegmentPath(index, learningCycle.length) }} key={`depth-${num}`} />)}{learningCycle.map(([num], index) => <span className={styles.cycleSegment} style={{ clipPath: cycleSegmentPath(index, learningCycle.length), background: cycleSegmentColors[index], '--i': index }} key={num} />)}</div><div className={styles.cycleCenter}><Image src="/images/アイコン　文字なし.png" alt="" width={36} height={36} /><p>学びが、<br />回り続ける。</p></div><ol className={styles.cycleNodes}>{learningCycle.map(([num, tag, title, text], index) => <li className={styles.cycleNode} style={{ ...cycleNodeStyle(index, learningCycle.length), '--i': index }} key={num}><span className={styles.cycleNodeNum}>{num}<small>{tag}</small></span><h4>{title}</h4><p>{text}</p></li>)}</ol></div><ol className={styles.cycleNotes}>{learningCycle.map(([num, , title, text]) => <li key={num}><b>{num}</b><strong>{title}</strong><span>{text}</span></li>)}</ol></div></div></div></section>
        <section className={styles.reviewsSection}><div className={styles.sectionInner}><SectionTitle className={styles.sectionHeader} kicker="STUDENT VOICES" title="実際に受講した方の口コミ" description="一人ひとりに合わせた指導について、受講生・保護者の声をご紹介します。" backdrop="STUDENT VOICES" /><div className={styles.reviewSliderFrame}><ReviewSlider reviews={reviews} interval={4000} /></div></div></section>
        <section id="price" className={styles.priceSection}><div className={styles.sectionInner}><SectionTitle className={styles.sectionHeader} kicker="STARTUP PRICING" title={<>宮崎での新しい挑戦を、<br />スタートアップ価格で。</>} description="価値を知っていただくための、開校初期の料金です。" backdrop="STARTUP PRICING" /><p className={styles.priceRibbon} data-reveal=""><strong>毎月10名限定</strong><span>塾長が全員の学習内容を把握し、授業準備に時間をかけるための人数です</span></p><div className={styles.priceDeck} data-reveal=""><article className={`${styles.priceOption} ${styles.priceOptionMain}`} style={{ '--i': 0 }}><span className={styles.priceOptionBadge}>はじめての方</span><h3>初回 50分個別指導</h3><p className={styles.priceOptionValue}><strong>2,500</strong><span>円（税込）</span></p><p className={styles.priceOptionNote}>まずは初回無料相談で、学習状況をお聞かせください。</p></article><article className={styles.priceOption} style={{ '--i': 1 }}><span className={styles.priceOptionBadge}>2回目以降</span><h3>継続 50分個別指導</h3><p className={styles.priceOptionValue}><strong>3,500</strong><span>円（税込）</span></p><p className={styles.priceOptionNote}>必要な時だけ、1コマずつお申し込みいただけます。</p></article><ul className={styles.priceIncludes}>{priceIncludes.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul></div><div className={styles.singleSession} data-reveal=""><div className={styles.singleSessionHead}><span className={styles.singleSessionBadge}>単発受講</span><h3>必要な時に、1コマから依頼できます。</h3><p>毎週の通塾や月額契約はありません。「テスト前だけ」「この単元だけ」など、困った時にその都度お申し込みください。</p></div><ol className={styles.singleSessionSteps}>{singleSessionSteps.map(([num, title, text]) => <li key={num}><b>{num}</b><strong>{title}</strong><span>{text}</span></li>)}</ol></div><div className={styles.inlineCta}><LineCta /></div></div></section>
        <section id="flow" className={styles.flowSection}><div className={styles.sectionInner}><SectionTitle className={styles.sectionHeader} kicker="STEPS" title="受講までの流れ" description="LINEで送って、50分で解決。授業のあとも見返せます。" backdrop="STEPS" colors={{ description: 'var(--text-muted)' }} /><ol className={styles.stepsTrack} data-reveal="">{flowSteps.map(([num, title, text], index) => <li className={styles.stepItem} key={num} style={{ '--i': index }}><span className={styles.stepNum}><small>STEP</small>{num}</span><div className={styles.stepBody}><StepIcon step={num} /><h3>{title}</h3><p>{text}</p></div></li>)}</ol><div className={styles.stepsOutro} data-reveal=""><Image src="/images/student-happy.webp" alt="" width={64} height={64} className={styles.stepsAvatar} /><p>まずは今の学習状況を、LINEでお気軽にお聞かせください。</p><a className={styles.stepsLink} href={LINE_URL} target="_blank" rel="noopener noreferrer">LINEで初回無料相談<span aria-hidden="true">→</span></a></div></div></section>
        <section id="faq" className={styles.faqSection}><div className={styles.sectionInner}><SectionTitle className={styles.sectionHeader} kicker="FAQ" title="よくあるご質問" description="ここにないことも、公式LINEでお気軽にお尋ねください。" backdrop="FAQ" colors={{ description: 'var(--text-muted)' }} /><div className={styles.faqList} data-reveal="">{faqs.map(([question, answer]) => <details className={styles.faqItem} key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
        <section className={styles.finalCtaSection}><div className={styles.finalCtaBg}><Image src="/images/final-cta-desk.webp" alt="窓辺の机に置かれたノートパソコンと教材" fill className={styles.finalCtaImg} sizes="100vw" /><div className={styles.finalCtaOverlay} /></div><div className={styles.finalCtaContent} data-reveal=""><h2>お子さまに必要な勉強を。<br />必要なタイミングで。</h2><p>塾長が直接指導し、宮崎県特化の戦略で学び方を個別最適化。理解度に合わせた50分とアーカイブで、授業後の学びまで支えます。</p><div className={styles.finalCtaButtonWrap}><LineCta /></div></div></section>
      </main>
      <footer className={styles.footer}><div className={styles.footerInner}><div className={styles.footerBrand}><Image src="/images/アイコン　文字あり.webp" alt="学習塾RAPID" width={130} height={34} /></div><div className={styles.footerLinks}><a href={LINE_URL} target="_blank" rel="noopener noreferrer">LINEで初回無料相談をする</a></div><small className={styles.copyright}>© {new Date().getFullYear()} 学習塾 RAPID All rights reserved.</small></div></footer>
      <div className={`${styles.stickyCta} ${showStickyCta ? styles.stickyCtaVisible : ''}`} aria-hidden={!showStickyCta}><a href={LINE_URL} target="_blank" rel="noopener noreferrer" tabIndex={showStickyCta ? 0 : -1}><IconLine />LINEで初回無料相談</a></div>
    </div>
  </>;
}
