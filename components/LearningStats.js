// components/LearningStats.js
// My Page: total study time + completion by category (video / quiz).
import { useEffect, useMemo, useRef, useState } from 'react';
import { buildLearningStats } from '../lib/learningStats';
import { buildRecommendations } from '../lib/recommendations';

// Category names share one color (no per-category color coding).
const CATEGORY_TEXT_CLASS = 'text-emerald-300';
const CATEGORY_BADGE_CLASS = 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30';

const percent = (done, total) => (total > 0 ? Math.round((done / total) * 100) : null);

function StatCell({ id, label, items, openId, setOpenId, onOpen, target, challengeOnly = false }) {
  const total = items.length;
  const done = items.filter((item) => item.done).length;
  const rate = percent(done, total);
  const open = openId === id;
  // Quiz popup: tests that are not at full marks yet, never-taken ones first.
  const listed = challengeOnly ? items.filter((item) => !item.done).sort((a, b) => Number(a.attempted) - Number(b.attempted)) : items;
  const closeTimer = useRef(null);

  const show = () => { clearTimeout(closeTimer.current); setOpenId(id); };
  const hideSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpenId((current) => (current === id ? null : current)), 150); };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  if (!total) {
    return <div className="px-2 py-1 text-[11px] text-slate-600">{label} —</div>;
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? setOpenId(null) : show())}
        onFocus={show}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-[11px] transition hover:bg-slate-800/70 focus:bg-slate-800/70 focus:outline-none"
      >
        <span className="w-12 shrink-0 font-bold text-slate-400">{label}</span>
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-valuenow={rate} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}の完了率`}>
          <span className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${rate}%` }} />
        </span>
        <span className="w-16 shrink-0 text-right font-mono text-slate-300">{done}/{total} <b className="text-cyan-300">{rate}%</b></span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${label}の一覧`}
          className="absolute left-0 top-full z-30 max-h-72 w-72 max-w-[85vw] overflow-auto rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
        >
          {challengeOnly ? (
            listed.length ? (
              <>
                <p className="px-2 pb-1 text-[10px] font-bold text-slate-500">未受験・満点未達のテスト</p>
                <ul className="space-y-1">
                  {listed.map((item) => (
                    <li key={item.id} className="flex items-center gap-2 rounded-lg px-2 py-1">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs text-slate-200">{item.title}</span>
                        {item.detail && <span className="block text-[10px] text-slate-500">{item.detail}</span>}
                      </span>
                      <a
                        href={`?video=${item.id}&target=${target}`}
                        onClick={(event) => { event.preventDefault(); setOpenId(null); onOpen(item.id, target); }}
                        className="shrink-0 rounded-lg bg-cyan-500 px-3 py-1 text-[11px] font-bold text-slate-950 transition hover:bg-cyan-400"
                      >
                        {item.attempted ? '再挑戦' : 'チャレンジ'}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="px-2 py-1 text-xs text-slate-400">すべてのテストが満点です</p>
            )
          ) : (
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`?video=${item.id}&target=${target}`}
                  onClick={(event) => { event.preventDefault(); setOpenId(null); onOpen(item.id, target); }}
                  className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-200 transition hover:bg-slate-800"
                >
                  <span className={item.done ? 'text-emerald-400' : 'text-slate-600'} aria-label={item.done ? '完了' : '未完了'}>{item.done ? '✔' : '○'}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{item.title}</span>
                    {item.detail && <span className="block text-[10px] text-slate-500">{item.detail}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function LearningStats({ videos, registrationDate, watchedByVideo, quizByVideo, progressByVideo, statsAvailable, onOpenVideo, embedded = false }) {
  const [openId, setOpenId] = useState(null);
  const rootRef = useRef(null);

  const stats = useMemo(
    () => buildLearningStats({ videos, registrationDate, watchedByVideo, quizByVideo, progressByVideo }),
    [videos, registrationDate, watchedByVideo, quizByVideo, progressByVideo],
  );

  const recommendations = useMemo(
    () => (statsAvailable ? buildRecommendations({ videos, registrationDate, watchedByVideo, quizByVideo, progressByVideo }) : { video: null, quiz: null }),
    [statsAvailable, videos, registrationDate, watchedByVideo, quizByVideo, progressByVideo],
  );

  useEffect(() => {
    if (!openId) return undefined;
    const onPointerDown = (event) => { if (rootRef.current && !rootRef.current.contains(event.target)) setOpenId(null); };
    const onKeyDown = (event) => { if (event.key === 'Escape') setOpenId(null); };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, [openId]);

  return (
    <section ref={rootRef} className={embedded ? 'border-t border-slate-800 px-6 py-3 text-white' : 'rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white shadow-xl'}>
      {(recommendations.video || recommendations.quiz) && (
        <div className="mb-3 space-y-2 rounded-xl border border-cyan-400/25 bg-cyan-500/5 p-3">
          <p className="text-xs font-bold text-cyan-200">次のおすすめ</p>
          {[['動画', recommendations.video], ['テスト', recommendations.quiz]].map(([label, rec]) => rec && (
            <div key={label} className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="w-14 shrink-0 rounded-md bg-cyan-500/20 px-2 py-1 text-center text-xs font-bold text-cyan-100">{label}</span>
              {rec.parts ? (
                <p className="min-w-0 flex-1 text-sm font-semibold leading-relaxed text-slate-100 md:text-base">
                  {rec.parts.reason}
                  <span className={`mx-1 inline-block rounded border px-1.5 py-0.5 align-middle text-xs font-bold ${CATEGORY_BADGE_CLASS}`}>{rec.parts.category}</span>
                  <span className="font-extrabold text-cyan-300">「{rec.parts.title}」</span>
                  {rec.parts.tail}
                </p>
              ) : (
                <p className="min-w-0 flex-1 text-sm leading-relaxed text-slate-300 md:text-base">{rec.message}</p>
              )}
              {rec.videoId && (
                <button type="button" onClick={() => onOpenVideo(rec.videoId, rec.target)} className="shrink-0 rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400">{rec.buttonLabel}</button>
              )}
              {rec.alt && (
                <p className="w-full pl-0 text-[11px] text-slate-400 md:pl-[68px]">
                  ほかの候補:{' '}
                  <button type="button" onClick={() => onOpenVideo(rec.alt.videoId, rec.target)} className="font-semibold text-cyan-200 underline underline-offset-2 hover:text-cyan-100">{rec.alt.category}「{rec.alt.title}」</button>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <h3 className="text-sm font-bold" title="公開済みの講義が対象。動画は「完了」表示、または実際に再生した時間が動画の長さの90%以上で完了、テストは満点で完了です。">学習状況</h3>

      {!statsAvailable && <p className="mt-1 text-[11px] text-amber-300">学習状況を取得できませんでした。しばらくしてから再読み込みしてください。</p>}

      <div className="mt-1 divide-y divide-slate-800/70">
        {stats.categories.map((row) => (
          <div key={row.category} className="grid grid-cols-1 items-center gap-x-3 py-0.5 sm:grid-cols-[5.5rem_1fr_1fr]">
            <p className={`px-2 text-xs font-bold ${CATEGORY_TEXT_CLASS}`}>{row.category}</p>
            <StatCell id={`${row.category}:video`} label="動画" items={row.videos} openId={openId} setOpenId={setOpenId} onOpen={onOpenVideo} target="video" />
            <StatCell id={`${row.category}:quiz`} label="テスト" items={row.quizzes} openId={openId} setOpenId={setOpenId} onOpen={onOpenVideo} target="quiz" challengeOnly />
          </div>
        ))}
      </div>
    </section>
  );
}
