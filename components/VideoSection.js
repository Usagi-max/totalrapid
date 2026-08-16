// components/VideoSection.js
import { useState, useEffect } from 'react';
import StealthPlayer from './StealthPlayer';
import VideoQuiz from './VideoQuiz';
import { renderTextWithLinks } from '../lib/textLinks';
import { formatTokyoDate, getTokyoDateString, getTokyoMidnight } from '../lib/tokyoDate';

export default function VideoSection({ videos = [], documentsByVideo = {}, userProgress = {}, userMemos = {}, quizScores = {}, registrationDate, onSaveProgress, onSaveMemo, onWatchTime, onDownloadDocument }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [memoText, setMemoText] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', ''
  const [memoTimeout, setMemoTimeout] = useState(null);
  const [progressState, setProgressState] = useState(userProgress);
  const [memosState, setMemosState] = useState(userMemos);
  const [actualDurations, setActualDurations] = useState({});
  const [quizScoresState, setQuizScoresState] = useState(quizScores);

  useEffect(() => {
    setProgressState(userProgress);
  }, [userProgress]);

  useEffect(() => {
    setMemosState(userMemos);
  }, [userMemos]);

  useEffect(() => {
    setQuizScoresState(quizScores);
  }, [quizScores]);

  // Calculate unlocked status and dates for all videos
  const processedVideos = videos.map((vid) => {
    const registrationDay = registrationDate || getTokyoDateString();
    const unlockDate = getTokyoMidnight(registrationDay, vid.days_after_registration);

    const now = new Date();
    const isUnlocked = now >= unlockDate;

    const diffDays = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const prog = progressState[vid.id] || { last_position_seconds: 0, max_position_seconds: 0, is_completed: false };

    return {
      ...vid,
      unlockDate,
      isUnlocked,
      daysLeft: Math.max(0, diffDays),
      progress: prog,
    };
  });

  // Select first unlocked video by default
  useEffect(() => {
    if (!selectedVideo && processedVideos.length > 0) {
      const firstUnlocked = processedVideos.find((v) => v.isUnlocked) || processedVideos[0];
      setSelectedVideo(firstUnlocked);
    }
  }, [videos, registrationDate]);

  // Update memo text when selected video changes
  useEffect(() => {
    if (selectedVideo) {
      setMemoText(memosState[selectedVideo.id] || '');
      setSaveStatus('');
    }
  }, [selectedVideo]);

  // Handle Memo Change with Debounce Save
  const handleMemoChange = (e) => {
    const val = e.target.value;
    setMemoText(val);
    setSaveStatus('saving');

    if (memoTimeout) clearTimeout(memoTimeout);

    const timeout = setTimeout(() => {
      if (selectedVideo) {
        setMemosState((prev) => ({ ...prev, [selectedVideo.id]: val }));
        if (onSaveMemo) onSaveMemo(selectedVideo.id, val);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    }, 1000);

    setMemoTimeout(timeout);
  };

  // Categories
  const categories = ['すべて', ...Array.from(new Set(videos.map((v) => v.category || 'その他')))];

  const filteredVideos = processedVideos.filter(
    (v) => activeCategory === 'すべて' || v.category === activeCategory
  );

  // Overall Stats
  const totalCount = processedVideos.length;
  const completedCount = processedVideos.filter((v) => v.progress.is_completed).length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Handle Progress Update from StealthPlayer
  const handleProgressUpdate = (vidId, seconds, duration) => {
    setProgressState((prev) => ({
      ...prev,
      [vidId]: {
        ...(prev[vidId] || {}),
        last_position_seconds: seconds,
        max_position_seconds: Math.max(seconds, prev[vidId]?.max_position_seconds || 0),
      },
    }));

    if (onSaveProgress) {
      onSaveProgress(vidId, seconds, duration, progressState[vidId]?.is_completed || false);
    }
  };

  // Handle Completion Change
  const handleCompletedChange = (vidId, isCompleted) => {
    setProgressState((prev) => ({
      ...prev,
      [vidId]: {
        ...(prev[vidId] || {}),
        is_completed: isCompleted,
      },
    }));

    if (onSaveProgress) {
      const currentPos = progressState[vidId]?.last_position_seconds || 0;
      onSaveProgress(vidId, currentPos, 0, isCompleted);
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return formatTokyoDate(d);
  };

  const formatDuration = (seconds) => {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    if (!total) return '時間を読み込み中';
    const minutes = Math.floor(total / 60);
    const remainder = total % 60;
    return `${minutes}分${remainder ? `${remainder}秒` : ''}`;
  };

  const handleDurationChange = (videoId, seconds) => {
    setActualDurations((previous) => previous[videoId] === seconds ? previous : { ...previous, [videoId]: seconds });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 視聴進捗率サマリーバー */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div className="space-y-1">
          <h3 className="text-lg font-bold flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span>【地理動画視聴】全ステップ学習進捗</span>
          </h3>
          <p className="text-xs text-slate-400">
            全{totalCount}講座中 <span className="font-bold text-cyan-300">{completedCount}</span> 講座完了
          </p>
        </div>

        <div className="w-full md:w-72 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">総合達成度</span>
            <span className="text-cyan-400 font-mono">{completionPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* メイン動画プレイヤー & 右側リスト レイアウト */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側 (8カラム): ステルス動画プレイヤー & メモ */}
        <div className="lg:col-span-8 space-y-6">
          {selectedVideo ? (
            selectedVideo.isUnlocked ? (
              <div className="space-y-6">
                {/* ステルスプレイヤー */}
                <StealthPlayer
                  key={selectedVideo.id}
                  videoId={selectedVideo.id}
                  youtubeVideoId={selectedVideo.youtube_video_id}
                  title={selectedVideo.title}
                  playbackRate={selectedVideo.playback_rate}
                  initialPosition={selectedVideo.progress.last_position_seconds}
                  isCompleted={selectedVideo.progress.is_completed}
                  onProgressUpdate={handleProgressUpdate}
                  onWatchTime={onWatchTime}
                  onCompletedChange={handleCompletedChange}
                  onDurationChange={handleDurationChange}
                  captionsEnabled={selectedVideo.captions_enabled !== false}
                />

                {/* 動画タイトル・説明 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                      {selectedVideo.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-500 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      公開日: {formatDate(selectedVideo.unlockDate)}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {selectedVideo.title}
                  </h2>
                  {selectedVideo.description && (
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {renderTextWithLinks(selectedVideo.description)}
                    </p>
                  )}
                  {(documentsByVideo[selectedVideo.id] || []).length > 0 && (
                    <div className="border-t border-slate-800/80 pt-3 space-y-2">
                      <p className="text-xs font-bold text-cyan-300">講義資料</p>
                      <div className="flex flex-wrap gap-2">
                        {documentsByVideo[selectedVideo.id].map((document) => (
                          <button key={document.id} type="button" onClick={() => onDownloadDocument?.(document)} className="text-xs px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 transition break-all">
                            {document.file_name} をダウンロード
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 自分専用メモ入力エリア */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-400 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>この講義のマイメモ（自分専用メモ帳）</span>
                    </h4>
                    <span className="text-[11px] font-mono text-cyan-400/90 transition flex items-center gap-1">
                      {saveStatus === 'saving' && '保存中...'}
                      {saveStatus === 'saved' && (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-400 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          保存完了
                        </>
                      )}
                    </span>
                  </div>
                  <textarea
                    value={memoText}
                    onChange={handleMemoChange}
                    placeholder="授業のポイント、質問したいこと、重要キーワードなどを入力してください（自動保存されます）"
                    rows="4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <VideoQuiz
                  videoId={selectedVideo.id}
                  onResult={(quizResult) => setQuizScoresState((previous) => ({
                    ...previous,
                    [selectedVideo.id]: quizResult.best_score,
                  }))}
                />
              </div>
            ) : (
              /* 未公開（ロック中）カード */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-slate-950 text-amber-400 mx-auto flex items-center justify-center shadow-inner border border-slate-800">
                  <svg className="w-9 h-9 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 9V7a2 2 0 012-2h0a2 2 0 012 2v2" />
                  </svg>
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    登録日ステップ配信・順次公開中
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    この講座はご登録から <span className="font-bold text-amber-300">{selectedVideo.days_after_registration}日後</span> に自動公開されます。
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-sm mx-auto space-y-2">
                  <div className="text-xs text-slate-400">あなたへの公開予定日</div>
                  <div className="text-2xl font-extrabold text-cyan-300 font-mono">
                    {formatDate(selectedVideo.unlockDate)}
                  </div>
                  <div className="text-xs font-semibold text-amber-400 flex items-center justify-center gap-1">
                    <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    あと {selectedVideo.daysLeft} 日後に自動解除されます
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="p-8 text-center text-slate-500">動画がありません</div>
          )}
        </div>

        {/* 右側 (4カラム): 動画一覧・フィルターリスト */}
        <div className="lg:col-span-4 space-y-4">
          {/* カテゴリフィルター */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 講座リスト */}
          <div className="space-y-3">
            {filteredVideos.map((vid, idx) => {
              const isSelected = selectedVideo?.id === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className={`relative p-4 rounded-2xl border transition cursor-pointer select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-900 to-blue-950/80 border-cyan-400/80 shadow-lg ring-1 ring-cyan-400/50'
                      : vid.isUnlocked
                      ? 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
                      : 'bg-slate-950/60 border-slate-900 opacity-75 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* アイコン/状態マーク */}
                    <div className="mt-0.5 shrink-0">
                      {vid.isUnlocked ? (
                        vid.progress.is_completed ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-cyan-400 border border-blue-400/30 flex items-center justify-center">
                            <svg className="w-3 h-3 fill-current translate-x-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 border border-slate-800 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 9V7a2 2 0 012-2h0a2 2 0 012 2v2" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <span className="text-slate-400 font-mono">STEP {idx + 1}</span>
                        {vid.isUnlocked ? (
                          <span className="text-cyan-400/80 font-mono">
                            {formatDuration(actualDurations[vid.id] || vid.duration_seconds)}
                          </span>
                        ) : (
                          <span className="text-amber-400/90 font-semibold">
                            {formatDate(vid.unlockDate)} 公開
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                        {vid.title}
                      </h4>

                      {/* 進捗プログレスバー (開放済み動画) */}
                      {vid.isUnlocked && (
                        <div className="pt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full ${
                                vid.progress.is_completed
                                  ? 'bg-emerald-400'
                                  : 'bg-cyan-400'
                              }`}
                              style={{
                                width: vid.progress.is_completed
                                  ? '100%'
                                  : `${Math.min(
                                      100,
                                      Math.round(
                                        (vid.progress.last_position_seconds / (actualDurations[vid.id] || vid.duration_seconds || 1)) * 100
                                      )
                                    )}%`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {vid.progress.is_completed
                              ? '完了'
                              : `${Math.min(
                                  100,
                                  Math.round(
                                    (vid.progress.last_position_seconds / (actualDurations[vid.id] || vid.duration_seconds || 1)) * 100
                                  )
                                )}%`}
                          </span>
                        </div>
                      )}
                      {vid.isUnlocked && Number.isFinite(quizScoresState[vid.id]) && (
                        <p className="pt-1 text-[10px] font-semibold text-emerald-300">
                          理解度テスト最高点: {quizScoresState[vid.id]}点
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
