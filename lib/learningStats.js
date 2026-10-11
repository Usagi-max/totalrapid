// lib/learningStats.js
// Aggregates the My Page learning stats (total study time, completion by category).
import { getTokyoDateString, getTokyoMidnight } from './tokyoDate';

export const STAT_CATEGORIES = ['ガイダンス', '系統地理', '地誌', '演習'];
export const OTHER_CATEGORY = 'その他';
// A video counts as watched when the actually-played time reaches this share of its length.
export const VIDEO_COMPLETE_RATIO = 0.9;

// `watchedByVideo[id]` is { seconds, days, lastAt } (a bare number of seconds is also accepted).
export const readWatch = (entry) => (entry && typeof entry === 'object'
  ? { seconds: Number(entry.seconds) || 0, days: Number(entry.days) || 0, lastAt: entry.lastAt || null }
  : { seconds: Number(entry) || 0, days: 0, lastAt: null });

// Done = the lecture is marked 完了 (the same flag the lecture list shows), or the learner actually
// watched 90%+ of it. The flag covers lectures watched before watch time was recorded.
export const isVideoDone = (video, watchEntry, progress) => {
  if (progress?.is_completed) return true;
  const duration = Number(video.duration_seconds) || 0;
  return duration > 0 && readWatch(watchEntry).seconds >= duration * VIDEO_COMPLETE_RATIO;
};

export function formatStudyTime(totalSeconds) {
  const minutes = Math.floor(Math.max(0, Number(totalSeconds) || 0) / 60);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}時間${minutes % 60}分` : `${minutes}分`;
}

/**
 * @param videos      rows of `videos`
 * @param watchedByVideo   { [videoId]: actually watched seconds }
 * @param quizByVideo      { [videoId]: { question_count, best_score } } (only videos with a quiz)
 * @param progressByVideo  { [videoId]: { is_completed } }  used only when a video has no known length
 */
export function buildLearningStats({ videos = [], registrationDate, watchedByVideo = {}, quizByVideo = {}, progressByVideo = {}, now = new Date() }) {
  const registrationDay = registrationDate || getTokyoDateString();
  const totalSeconds = Object.values(watchedByVideo).reduce((sum, value) => sum + readWatch(value).seconds, 0);

  const knownCategories = new Set(STAT_CATEGORIES);
  const rows = new Map(STAT_CATEGORIES.map((name) => [name, { category: name, videos: [], quizzes: [] }]));

  videos.forEach((video) => {
    const unlockDate = getTokyoMidnight(registrationDay, video.days_after_registration);
    if (now < unlockDate) return; // Unreleased lectures are not part of the denominator.

    const category = knownCategories.has(video.category) ? video.category : OTHER_CATEGORY;
    if (!rows.has(category)) rows.set(category, { category, videos: [], quizzes: [] });
    const row = rows.get(category);

    const duration = Number(video.duration_seconds) || 0;
    const watched = readWatch(watchedByVideo[video.id]).seconds;
    const videoDone = isVideoDone(video, watchedByVideo[video.id], progressByVideo[video.id]);
    row.videos.push({
      id: video.id,
      title: video.title,
      done: videoDone,
      detail: duration > 0 ? `視聴 ${Math.min(100, Math.floor((watched / duration) * 100))}%` : '',
    });

    const quiz = quizByVideo[video.id];
    if (quiz && Number(quiz.question_count) > 0) {
      // best_score is null until the first attempt (Number(null) would be 0).
      const best = quiz.best_score == null ? NaN : Number(quiz.best_score);
      row.quizzes.push({
        id: video.id,
        title: video.title,
        done: Number.isFinite(best) && best >= Number(quiz.question_count),
        attempted: Number.isFinite(best),
        detail: Number.isFinite(best) ? `最高 ${best}/${quiz.question_count}点` : `未受験(${quiz.question_count}問)`,
      });
    }
  });

  // Only categories that have a released lecture are listed.
  const categories = [...rows.values()].filter((row) => row.videos.length);
  return { totalSeconds, categories };
}
