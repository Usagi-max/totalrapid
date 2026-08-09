// components/TutoringSection.js
import { useState, useEffect } from 'react';

export default function TutoringSection({ schedule, profile }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  useEffect(() => {
    if (!schedule || !schedule.scheduled_at) return;

    const target = new Date(schedule.scheduled_at).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [schedule]);

  const formatDateString = (isoStr) => {
    if (!isoStr) return '未設定';
    const d = new Date(isoStr);
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${dayOfWeek}) ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}〜`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 次回指導日メインハイライトカード */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 p-6 md:p-8 shadow-2xl text-white">
        {/* 背景装飾 */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              【地理個別指導】次回指導スケジュール
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {schedule ? schedule.title : '個別指導講義'}
            </h3>

            <div className="text-xl md:text-2xl font-bold text-cyan-300 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span>{formatDateString(schedule?.scheduled_at)}</span>
            </div>

            {schedule?.notes && (
              <div className="text-xs md:text-sm text-slate-300 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-start gap-3 max-w-xl">
                <div className="p-1 rounded-lg bg-blue-500/20 text-cyan-400 shrink-0 mt-0.5">
                  <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-cyan-300 block mb-0.5">講師メモ / 事前課題:</span>
                  <span className="leading-relaxed text-slate-300">{schedule.notes}</span>
                </div>
              </div>
            )}
          </div>

          {/* カウントダウン表示タイマー */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center min-w-[250px] shadow-inner">
            <span className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-400 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              指導開始まで あと
            </span>
            <div className="grid grid-cols-4 gap-2 text-center w-full">
              <div className="bg-slate-900 rounded-xl p-2 border border-slate-800">
                <div className="text-xl font-extrabold text-cyan-300 font-mono">{timeLeft.days}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">日</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-2 border border-slate-800">
                <div className="text-xl font-extrabold text-cyan-300 font-mono">{timeLeft.hours}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">時間</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-2 border border-slate-800">
                <div className="text-xl font-extrabold text-cyan-300 font-mono">{timeLeft.minutes}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">分</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-2 border border-slate-800">
                <div className="text-xl font-extrabold text-cyan-300 font-mono">{timeLeft.seconds}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">秒</div>
              </div>
            </div>
          </div>
        </div>

        {/* オンライン指導入室 ＆ 日程調整ボタン */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 relative z-10">
          {schedule?.meeting_url ? (
            <a
              href={schedule.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold text-sm shadow-lg hover:shadow-cyan-500/25 hover:brightness-110 transition active:scale-95 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
              オンライン指導ルームに入室する
            </a>
          ) : (
            <button
              disabled
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-500 text-sm font-semibold cursor-not-allowed"
            >
              オンラインURL準備中
            </button>
          )}

          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 font-semibold text-sm transition cursor-pointer"
          >
            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            日程調整・振替依頼をする
          </button>
        </div>
      </div>

      {/* 日程調整依頼ダイアログモーダル */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowAdjustmentModal(false)}
              aria-label="Close"
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
                  <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">指導日程の変更・振替申請</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                次回の指導日時の変更をご希望の場合は、以下のフォームよりご希望日時をご連絡いただくか、公式LINEよりご相談ください。
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">受講生名</span>
                <span className="font-bold text-white">{profile?.full_name || '受講生'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">現在の次回指導予定</span>
                <span className="font-semibold text-cyan-300">{formatDateString(schedule?.scheduled_at)}</span>
              </div>
              <p className="text-[11px] text-amber-400/90 pt-1 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                原則として指導前日18:00までのご連絡に限り振替を承っております。
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSc-sample/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm text-center shadow-lg hover:brightness-110 transition cursor-pointer"
              >
                Googleフォームで振替を申請する
              </a>
              <a
                href="https://lin.ee/Nwh2C8u"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center transition flex items-center justify-center gap-2 cursor-pointer"
              >
                公式LINEで直接講師にメッセージを送る
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
