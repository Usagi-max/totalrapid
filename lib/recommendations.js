// lib/recommendations.js
// Simple "what to study next" suggestions for the My Page, one for videos and one for quizzes.
//   1. Unfinished content first, earliest lecture first (unwatched videos / never-taken quizzes)
//   2. Then quizzes: aim for full marks
//   3. When everything is done: review at spaced intervals (Ebbinghaus-style forgetting curve)
import { getTokyoDateString, getTokyoMidnight } from './tokyoDate';
import { isVideoDone, readWatch, STAT_CATEGORIES, OTHER_CATEGORY } from './learningStats';

// Days after the last study before the next review is suggested. Each extra study day /
// quiz attempt moves a lecture one step along, so the gaps widen as memory consolidates.
export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30, 60];
const DAY_MS = 24 * 60 * 60 * 1000;

// Generic sentence parts: 「{reason}。{category}「{title}」を{action}{ending}」
// Phrased as a reason plus an invitation (the student keeps the choice), not an order.
// Several variants per phase; one is picked per day so the wording changes without flickering.
const ENDINGS = ['してみませんか。', 'するのもおすすめです。'];
const PHRASES = {
  'video:todo': {
    reasons: [({ remaining }) => `まだ見ていない講座があと${remaining}つ残っています`, () => '順番に進めると、理解が積み上がります', () => '今のペースを保てると、力がつきやすい時期です', () => 'まずは基礎を固めておくと安心です'],
    actions: ['視聴', '受講', '学習'],
  },
  'video:review': {
    reasons: [({ days }) => `前回から${days}日、思い出しやすい頃です`, () => '復習にちょうどいいタイミングです', () => '覚えたことを定着させる好機です', ({ days }) => `${days}日ぶりに見直すと、理解が深まります`],
    actions: ['復習', '視聴'],
  },
  'quiz:todo': {
    reasons: [({ remaining }) => `まだ受けていないテストがあと${remaining}つあります`, () => '今の理解度を点数で確かめられます', () => '動画で学んだ内容を、テストで定着させられます', () => '苦手なところを早めに見つけられます'],
    actions: ['受験'],
  },
  'quiz:perfect': {
    reasons: [({ best, total }) => `最高${best}/${total}点で、満点まであと${total - best}点です`, () => '間違えた問題を見直すと、満点に届きそうです', ({ best, total }) => `あと${total - best}点で満点です`],
    actions: ['再受験', '復習'],
  },
  'quiz:review': {
    reasons: [({ days }) => `前回の受験から${days}日、記憶を確かめるのにちょうどいい頃です`, () => '満点の実力を保てているか確かめられます', () => '忘れないうちに復習しておくと安心です'],
    actions: ['再受験', '復習'],
  },
};

const BUTTON_LABEL = { 'video:todo': '視聴する', 'video:review': '復習する', 'quiz:todo': 'チャレンジ', 'quiz:perfect': '再挑戦', 'quiz:review': '再挑戦' };

const hash = (text) => [...String(text)].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);

function compose(key, item, context, now, alt = null) {
  const phrases = PHRASES[key];
  const dayNumber = Math.floor(now.getTime() / DAY_MS);
  const seed = dayNumber + hash(item.id);
  const reason = `${phrases.reasons[seed % phrases.reasons.length](context)}。`;
  const action = phrases.actions[(seed >> 1) % phrases.actions.length];
  const ending = ENDINGS[(seed >> 2) % ENDINGS.length];
  const category = STAT_CATEGORIES.includes(item.category) ? item.category : OTHER_CATEGORY;
  return {
    key,
    videoId: item.id,
    target: key.startsWith('quiz') ? 'quiz' : 'video',
    category,
    title: item.title,
    // The UI colors category and title, so the sentence is also returned in parts.
    parts: { reason, category, title: item.title, tail: `を${action}${ending}` },
    message: `${reason}${category}「${item.title}」を${action}${ending}`,
    buttonLabel: BUTTON_LABEL[key],
    // A second option, so the student can choose.
    alt: alt ? { videoId: alt.id, title: alt.title, category: STAT_CATEGORIES.includes(alt.category) ? alt.category : OTHER_CATEGORY } : null,
  };
}

const intervalFor = (level) => REVIEW_INTERVAL_DAYS[Math.min(Math.max(level, 1) - 1, REVIEW_INTERVAL_DAYS.length - 1)];

// Picks the most overdue item; when nothing is due yet, reports when the next review comes.
function pickReview(candidates, now) {
  let due = null;
  let next = null;
  candidates.forEach((candidate) => {
    const last = new Date(candidate.lastAt);
    if (Number.isNaN(last.getTime())) return;
    const interval = intervalFor(candidate.level);
    const elapsedDays = (now.getTime() - last.getTime()) / DAY_MS;
    const entry = { ...candidate, elapsedDays, interval, ratio: elapsedDays / interval };
    if (elapsedDays >= interval) {
      if (!due || entry.ratio > due.ratio) due = entry;
    } else if (!next || interval - elapsedDays < next.interval - next.elapsedDays) {
      next = entry;
    }
  });
  return { due, next };
}

/**
 * @returns {{ video: object|null, quiz: object|null }} each is { key, videoId, target, title, message, buttonLabel }
 *          or { key:'…:wait', message } when only waiting for the next review, or null when there is nothing to suggest.
 */
export function buildRecommendations({ videos = [], registrationDate, watchedByVideo = {}, quizByVideo = {}, progressByVideo = {}, now = new Date() }) {
  const registrationDay = registrationDate || getTokyoDateString();
  const released = videos.filter((video) => now >= getTokyoMidnight(registrationDay, video.days_after_registration));

  // ---- videos ----------------------------------------------------------------
  let videoRec = null;
  const unfinished = released.filter((video) => !isVideoDone(video, watchedByVideo[video.id], progressByVideo[video.id]));
  if (unfinished.length) {
    videoRec = compose('video:todo', unfinished[0], { remaining: unfinished.length }, now, unfinished[1]);
  } else if (released.length) {
    const candidates = released
      .map((video) => { const watch = readWatch(watchedByVideo[video.id]); return { id: video.id, title: video.title, category: video.category, lastAt: watch.lastAt, level: watch.days }; })
      .filter((candidate) => candidate.lastAt);
    const { due, next } = pickReview(candidates, now);
    if (due) videoRec = compose('video:review', due, { days: Math.floor(due.elapsedDays) }, now);
    else if (next) videoRec = { key: 'video:wait', message: `全講座を視聴済みです。次の復習は約${Math.max(1, Math.ceil(next.interval - next.elapsedDays))}日後、「${next.title}」がおすすめです。` };
  }

  // ---- quizzes -----------------------------------------------------------------
  let quizRec = null;
  const quizzes = released
    .map((video) => ({ video, info: quizByVideo[video.id] }))
    .filter(({ info }) => info && Number(info.question_count) > 0)
    .map(({ video, info }) => ({
      id: video.id,
      title: video.title,
      category: video.category,
      total: Number(info.question_count),
      best: info.best_score == null ? null : Number(info.best_score),
      level: Number(info.attempt_count) || 1,
      lastAt: info.last_attempt_at || null,
    }));
  const untaken = quizzes.filter((quiz) => quiz.best === null);
  const notPerfect = quizzes.filter((quiz) => quiz.best !== null && quiz.best < quiz.total);
  if (untaken.length) {
    quizRec = compose('quiz:todo', untaken[0], { remaining: untaken.length }, now, untaken[1]);
  } else if (notPerfect.length) {
    // The one closest to full marks first; ties go to the earliest lecture.
    const target = notPerfect.reduce((best, quiz) => (quiz.best / quiz.total > best.best / best.total ? quiz : best), notPerfect[0]);
    const others = notPerfect.filter((quiz) => quiz !== target);
    quizRec = compose('quiz:perfect', target, { best: target.best, total: target.total }, now, others[0]);
  } else if (quizzes.length) {
    const { due, next } = pickReview(quizzes.filter((quiz) => quiz.lastAt), now);
    if (due) quizRec = compose('quiz:review', due, { days: Math.floor(due.elapsedDays) }, now);
    else if (next) quizRec = { key: 'quiz:wait', message: `全テスト満点です。次の復習は約${Math.max(1, Math.ceil(next.interval - next.elapsedDays))}日後、「${next.title}」がおすすめです。` };
  }

  return { video: videoRec, quiz: quizRec };
}
