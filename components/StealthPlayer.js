// components/StealthPlayer.js
import { useEffect, useRef, useState } from 'react';

export default function StealthPlayer({
  videoId,
  youtubeVideoId,
  title,
  playbackRate = 1,
  initialPosition = 0,
  isCompleted = false,
  onProgressUpdate,
  onWatchTime,
  onCompletedChange,
  onDurationChange,
  captionsEnabled = true,
}) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const trackingRef = useRef(false);
  const lastTrackedTimeRef = useRef(null);
  const resumeChoiceRequiredRef = useRef(initialPosition > 10);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialPosition);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const [selectedPlaybackRate, setSelectedPlaybackRate] = useState(Number(playbackRate) || 1);

  // Resume modal state
  const [showResumeModal, setShowResumeModal] = useState(initialPosition > 10);
  const [playerReady, setPlayerReady] = useState(false);

  const decodedYtId = useRef(youtubeVideoId).current;

  // Load YouTube IFrame API
  useEffect(() => {
    let isMounted = true;

    const loadYT = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        if (!document.getElementById('yt-api-script')) {
          const tag = document.createElement('script');
          tag.id = 'yt-api-script';
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        const prevCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (prevCallback) prevCallback();
          if (isMounted) initPlayer();
        };
      }
    };

    const initPlayer = () => {
      if (!isMounted || playerRef.current) return;

      playerRef.current = new window.YT.Player(`yt-stealth-player-${videoId}`, {
        videoId: decodedYtId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          playsinline: 1,
          cc_load_policy: captionsEnabled ? 1 : 0,
          cc_lang_pref: 'ja',
          origin: typeof window !== 'undefined' ? window.location.origin : '',
        },
        events: {
          onReady: (event) => {
            if (!isMounted) return;
            setPlayerReady(true);
            const dur = Math.floor(event.target.getDuration() || 0);
            setDuration(dur);
            if (dur > 0) onDurationChange?.(videoId, dur);
            const initialRate = Number(playbackRate) || 1;
            if (event.target.setPlaybackRate) event.target.setPlaybackRate(initialRate);
            setSelectedPlaybackRate(initialRate);

            // Do not restore or play a saved position until the learner makes a choice.
            if (resumeChoiceRequiredRef.current) {
              event.target.pauseVideo();
              event.target.seekTo(0, true);
              setCurrentTime(0);
            } else if (initialPosition > 0) {
              event.target.seekTo(initialPosition, true);
              setCurrentTime(initialPosition);
            }
          },
          onStateChange: (event) => {
            if (!isMounted) return;
            if (event.data === window.YT.PlayerState.PLAYING) {
              if (resumeChoiceRequiredRef.current) {
                event.target.pauseVideo();
                return;
              }
              setIsPlaying(true);
              startTracking();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopTracking();
              syncCurrentTime();
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              stopTracking();
              markCompleted();
            }
          },
        },
      });
    };

    loadYT();

    return () => {
      isMounted = false;
      stopTracking();
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [videoId, decodedYtId, playbackRate, captionsEnabled]);

  const handlePlaybackRateChange = (e) => {
    const nextRate = Number(e.target.value);
    setSelectedPlaybackRate(nextRate);
    if (playerRef.current?.setPlaybackRate) playerRef.current.setPlaybackRate(nextRate);
  };

  const startTracking = () => {
    stopTracking();
    trackingRef.current = true;
    lastTrackedTimeRef.current = Math.floor(playerRef.current?.getCurrentTime?.() || 0);
    intervalRef.current = setInterval(() => {
      syncCurrentTime();
    }, 3000);
  };

  const stopTracking = () => {
    trackingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const syncCurrentTime = () => {
    if (playerRef.current && playerRef.current.getCurrentTime) {
      const time = Math.floor(playerRef.current.getCurrentTime() || 0);
      const dur = Math.floor(playerRef.current.getDuration() || duration);
      const previousTime = lastTrackedTimeRef.current;
      if (trackingRef.current && previousTime !== null) {
        const watchedSeconds = time - previousTime;
        if (watchedSeconds > 0 && watchedSeconds <= 8) onWatchTime?.(videoId, watchedSeconds);
      }
      lastTrackedTimeRef.current = time;
      setCurrentTime(time);
      if (dur > 0 && dur !== duration) {
        setDuration(dur);
        onDurationChange?.(videoId, dur);
      }

      if (onProgressUpdate) {
        onProgressUpdate(videoId, time, dur);
      }

      if (dur > 0 && time >= dur * 0.9 && !completed) {
        markCompleted();
      }
    }
  };

  const markCompleted = () => {
    setCompleted(true);
    if (onCompletedChange) {
      onCompletedChange(videoId, true);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current || !playerReady) return;
    if (showResumeModal) {
      handleResumeChoice(true);
      return;
    }
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleResumeChoice = (resume) => {
    resumeChoiceRequiredRef.current = false;
    setShowResumeModal(false);
    if (!playerRef.current) return;

    if (resume && initialPosition > 0) {
      playerRef.current.seekTo(initialPosition, true);
    } else {
      playerRef.current.seekTo(0, true);
    }
    playerRef.current.playVideo();
  };

  const handleSeek = (e) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(targetTime, true);
    }
    if (onProgressUpdate) {
      onProgressUpdate(videoId, targetTime, duration);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(val);
      if (val === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/50 group select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 動画プレイヤー本体エリア */}
      <div className="relative w-full aspect-video bg-black">

        {/* YouTube IFrame DOM Element（フルサイズ表示） */}
        <div
          id={`yt-stealth-player-${videoId}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* カスタムヘッダー: 講義タイトルバー（上部グラデーション） */}
        <div className="absolute top-0 left-0 right-0 z-10 h-12 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex items-center justify-between px-5 pointer-events-auto">
          <div className="flex items-center gap-2.5 text-white font-bold tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
            <span className="truncate max-w-[260px] md:max-w-md text-xs md:text-sm">{title}</span>
          </div>
          {completed && (
            <span className="bg-emerald-500/90 text-white text-[11px] px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow flex-shrink-0">
              <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>視聴完了</span>
            </span>
          )}
        </div>

        {/* 中央タップ・クリック保護幕（再生/停止） */}
        <div
          className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center"
          onClick={togglePlay}
        >
          {!isPlaying && !showResumeModal && (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500/90 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 md:w-10 md:h-10 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* 前回の続きから再生 再開確認ポップアップ */}
        {showResumeModal && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-bold text-base">前回の続きから再生しますか？</h4>
                <p className="text-xs text-slate-400 mt-1">
                  前回 {formatTime(initialPosition)} まで視聴しています。
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => handleResumeChoice(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold shadow-lg hover:brightness-110 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>前回の続き（{formatTime(initialPosition)}）から再生</span>
                </button>
                <button
                  onClick={() => handleResumeChoice(false)}
                  className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                >
                  最初から再生する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* オリジナル HTML5 カスタム操作バー */}
      <div className="relative z-20 bg-slate-950/95 border-t border-slate-800/80 px-4 py-3 flex flex-col gap-2">
        {/* プログレスバー (シークバー) */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-cyan-400 font-mono w-11 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
          />
          <span className="text-xs text-slate-400 font-mono w-11">{formatTime(duration)}</span>
        </div>

        {/* コントロールボタン群 */}
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-3">
            {/* 再生/一時停止 */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="p-2 rounded-lg hover:bg-slate-800 text-cyan-400 transition cursor-pointer"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* 音量 */}
            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                {isMuted || volume === 0 ? (
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M17.586 6.414a8 8 0 010 11.314M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer opacity-70 group-hover/vol:opacity-100 transition"
              />
            </div>
            <label className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="sr-only">再生速度</span>
              <select
                value={selectedPlaybackRate}
                onChange={handlePlaybackRateChange}
                aria-label="再生速度"
                className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white cursor-pointer"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                  <option key={rate} value={rate}>{rate}x</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {/* 視聴完了チェックマークスイッチ */}
            <button
              onClick={() => {
                const nextState = !completed;
                setCompleted(nextState);
                if (onCompletedChange) onCompletedChange(videoId, nextState);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                completed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                {completed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                ) : (
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                )}
              </svg>
              <span>{completed ? '視聴済み' : '未完了'}</span>
            </button>

            {/* フルスクリーン */}
            <button onClick={toggleFullscreen} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
