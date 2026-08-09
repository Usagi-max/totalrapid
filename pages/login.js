// pages/login.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/LayoutGeo';
import TutoringSection from '../components/TutoringSection';
import VideoSection from '../components/VideoSection';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_USERS, MOCK_TUTORING_SCHEDULES, MOCK_VIDEOS, MOCK_PROGRESS, MOCK_MEMOS } from '../lib/mockData';
import { getStoredStudents, getStoredVideos, getStoredSchedules, getDemoSessionUserId, saveDemoSessionUserId } from '../lib/storageManager';
import { renderTextWithLinks } from '../lib/textLinks';

export default function LoginPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('tutoring'); // 'tutoring' | 'video'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Portal Data state
  const [profile, setProfile] = useState(null);
  const [userPlans, setUserPlans] = useState([]);
  const [tutoringSchedule, setTutoringSchedule] = useState(null);
  const [videos, setVideos] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [userMemos, setUserMemos] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [documentsByVideo, setDocumentsByVideo] = useState({});

  // Check existing session
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchSupabaseUserData(session.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchSupabaseUserData(session.user);
        } else {
          setCurrentUser(null);
          setProfile(null);
        }
      });

      return () => subscription.unsubscribe();
    }

    const storedUserId = getDemoSessionUserId();
    if (storedUserId) {
      const storedUser = getStoredStudents().find((student) => student.id === storedUserId);
      if (storedUser) restoreDemoUser(storedUser);
    }
  }, []);

  // Fetch Supabase User Data
  const fetchSupabaseUserData = async (authUser) => {
    setLoading(true);
    try {
      // 1. Profile
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // 2. Plans
      const { data: plansData } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', authUser.id);

      // 3. Schedule
      const { data: schedData } = await supabase
        .from('tutoring_schedules')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      // 4. Videos
      const { data: vidsData } = await supabase
        .from('videos')
        .select('*')
        .order('order_index', { ascending: true });

      // 5. Video Progress
      const { data: progData } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', authUser.id);

      // 6. Video Memos
      const { data: memoData } = await supabase
        .from('video_memos')
        .select('*')
        .eq('user_id', authUser.id);

      const { data: docsData } = await supabase
        .from('video_documents')
        .select('*')
        .order('created_at', { ascending: false });

      const progMap = {};
      (progData || []).forEach((p) => {
        progMap[p.video_id] = p;
      });

      const memoMap = {};
      (memoData || []).forEach((m) => {
        memoMap[m.video_id] = m.content;
      });

      const activeUserProfile = profData || {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || '生徒',
        registration_date: new Date().toISOString().split('T')[0],
      };

      const activePlans = (plansData && plansData.length > 0)
        ? plansData
        : [
            { plan_type: 'video', contract_start_date: new Date().toISOString().split('T')[0], status: 'active' },
            { plan_type: 'tutoring', contract_start_date: new Date().toISOString().split('T')[0], status: 'active' }
          ];

      setCurrentUser(authUser);
      setProfile(activeUserProfile);
      setUserPlans(activePlans);
      setTutoringSchedule(schedData || getStoredSchedules()[0] || MOCK_TUTORING_SCHEDULES[0]);
      setVideos(vidsData && vidsData.length > 0 ? vidsData : getStoredVideos());
      setUserProgress(progMap);
      setUserMemos(memoMap);
      const docsMap = {};
      (docsData || []).forEach((document) => {
        (docsMap[document.video_id] ||= []).push(document);
      });
      setDocumentsByVideo(docsMap);

      // Default active tab
      const hasTutoring = activePlans.some((p) => p.plan_type === 'tutoring');
      const hasVideo = activePlans.some((p) => p.plan_type === 'video');

      if (hasTutoring) setActiveTab('tutoring');
      else if (hasVideo) setActiveTab('video');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Real Supabase Login Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('メールアドレスとパスワードを入力してください。');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);

      if (error) {
        setErrorMessage('ログインに失敗しました。メールアドレスまたはパスワードをご確認ください。');
      } else if (data.user) {
        fetchSupabaseUserData(data.user);
      }
    } else {
      // ローカルストレージに管理者が作成したユーザーを検索してログイン
      const storedStudents = getStoredStudents();
      const matchedStudent = storedStudents.find(
        (s) => s.email === email && s.password === password
      );

      if (matchedStudent) {
        // 管理者が作成した実ユーザーとしてログイン
        const plans = matchedStudent.plans || matchedStudent.user_plans || [];
        const storedSchedules = getStoredSchedules();
        const userSchedule = storedSchedules.find((sc) => sc.user_id === matchedStudent.id);

        setCurrentUser({ id: matchedStudent.id, email: matchedStudent.email });
        setProfile(matchedStudent);
        setUserPlans(plans);
        setTutoringSchedule(userSchedule || null);
        setVideos(getStoredVideos());
        setUserProgress({});
        setUserMemos({});
        setDocumentsByVideo({});
        saveDemoSessionUserId(matchedStudent.id);

        const hasTutoring = plans.some((p) => (p.plan_type || p) === 'tutoring');
        const hasVideo = plans.some((p) => (p.plan_type || p) === 'video');
        if (hasTutoring) setActiveTab('tutoring');
        else if (hasVideo) setActiveTab('video');
      } else {
        // メールアドレスがMOCK_USERSにあるか確認（デモ用）
        const demoUser = Object.values(MOCK_USERS).find(
          (u) => u.email === email
        );
        if (demoUser) {
          const demoKey = Object.keys(MOCK_USERS).find((k) => MOCK_USERS[k].email === email);
          loginAsDemoUser(demoKey || 'both');
        } else {
          setErrorMessage('メールアドレスまたはパスワードが正しくありません。');
        }
      }
    }
  };

  // Demo Account Selector Handler
  const loginAsDemoUser = (type) => {
    const mockUser = MOCK_USERS[type];
    setCurrentUser({ id: mockUser.id, email: mockUser.email });
    setProfile(mockUser);
    setUserPlans(mockUser.plans);

    if (type === 'tutoring') {
      setTutoringSchedule(MOCK_TUTORING_SCHEDULES[0]);
      setActiveTab('tutoring');
    } else if (type === 'video') {
      setActiveTab('video');
    } else {
      setTutoringSchedule(MOCK_TUTORING_SCHEDULES[1] || MOCK_TUTORING_SCHEDULES[0]);
      setActiveTab('tutoring');
    }

    setVideos(getStoredVideos());
    setUserProgress(MOCK_PROGRESS);
    setUserMemos(MOCK_MEMOS);
    setDocumentsByVideo({});
    saveDemoSessionUserId(mockUser.id);
  };

  const restoreDemoUser = (student) => {
    const plans = student.plans || student.user_plans || [];
    setCurrentUser({ id: student.id, email: student.email });
    setProfile(student);
    setUserPlans(plans);
    setTutoringSchedule(getStoredSchedules().find((schedule) => schedule.user_id === student.id) || null);
    setVideos(getStoredVideos());
    setUserProgress({});
    setUserMemos({});
    setDocumentsByVideo({});
    if (plans.some((plan) => (plan.plan_type || plan) === 'tutoring')) setActiveTab('tutoring');
    else setActiveTab('video');
  };

  // Logout Handler
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setProfile(null);
    setUserPlans([]);
    setDocumentsByVideo({});
    saveDemoSessionUserId(null);
  };

  const handleDownloadDocument = async (document) => {
    if (!isSupabaseConfigured || !supabase) return;
    // RLS verifies the active video plan before a signed URL can be issued.
    const { data, error } = await supabase.storage.from('course-documents').createSignedUrl(document.storage_path, 60, { download: document.file_name });
    if (!error && data?.signedUrl) window.location.assign(data.signedUrl);
    else setErrorMessage('資料をダウンロードできませんでした。時間をおいてもう一度お試しください。');
  };

  // Progress Save Callback (Supabase + Local)
  const handleSaveProgress = async (videoId, seconds, duration, isCompleted) => {
    setUserProgress((prev) => ({
      ...prev,
      [videoId]: {
        last_position_seconds: seconds,
        max_position_seconds: Math.max(seconds, prev[videoId]?.max_position_seconds || 0),
        is_completed: isCompleted,
      },
    }));

    if (isSupabaseConfigured && supabase && currentUser) {
      try {
        await supabase.from('video_progress').upsert(
          {
            user_id: currentUser.id,
            video_id: videoId,
            last_position_seconds: seconds,
            max_position_seconds: Math.max(seconds, userProgress[videoId]?.max_position_seconds || 0),
            is_completed: isCompleted,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,video_id' }
        );
      } catch (e) {
        console.error('Progress sync error:', e);
      }
    }
  };

  // Memo Save Callback (Supabase + Local)
  const handleSaveMemo = async (videoId, content) => {
    setUserMemos((prev) => ({
      ...prev,
      [videoId]: content,
    }));

    if (isSupabaseConfigured && supabase && currentUser) {
      try {
        await supabase.from('video_memos').upsert(
          {
            user_id: currentUser.id,
            video_id: videoId,
            content: content,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,video_id' }
        );
      } catch (e) {
        console.error('Memo sync error:', e);
      }
    }
  };

  const hasTutoringPlan = userPlans.some((p) => p.plan_type === 'tutoring');
  const hasVideoPlan = userPlans.some((p) => p.plan_type === 'video');

  return (
    <Layout hideSurveyWidget={true} hideSecondNav={true}>
      <Head>
        <title>生徒専用マイページ＆ログイン | 高校地理専門塾 RAPID+</title>
        <meta name="description" content="高校地理専門塾 RAPID+ 生徒専用受講マイページ" />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* ========================================================
              1. 未ログイン時：ログインカード表示画面
          ======================================================== */}
          {!currentUser ? (
            <div className="max-w-md mx-auto animate-fadeIn py-8 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 mx-auto shadow-xl">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <span className="text-2xl font-black text-cyan-300">R+</span>
                  </div>
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">高校地理専門塾 RAPID+</h1>
                <p className="text-xs text-slate-400">受講生専用 マイページログイン</p>
              </div>

              {/* ログインカード */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <svg className="w-4 h-4 text-rose-400 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">メールアドレス</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">パスワード</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      'ログイン処理中...'
                    ) : (
                      <>
                        <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>マイページへログイン</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="border-t border-slate-800 pt-4 text-center space-y-2">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    アカウントは入塾時に当塾より発行された初期パスワードをご使用ください。不明な場合は
                    <a href="https://lin.ee/Nwh2C8u" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-semibold ml-1">
                      公式LINE
                    </a>
                    へご連絡ください。
                  </p>
                  <div className="pt-1">
                    <a href="/admin" className="text-[11px] text-slate-500 hover:text-cyan-400 font-semibold underline transition">
                      管理者用ログイン画面（管理コンソール）はこちら
                    </a>
                  </div>
                </div>

                {/* ワンタップ デモアカウント試用切替バー */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 font-semibold block text-center flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-cyan-400 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    デモアカウントで試す
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => loginAsDemoUser('tutoring')}
                      className="px-2 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 text-[11px] font-bold border border-slate-800 transition cursor-pointer"
                    >
                      個別指導のみ
                    </button>
                    <button
                      type="button"
                      onClick={() => loginAsDemoUser('video')}
                      className="px-2 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-300 text-[11px] font-bold border border-slate-800 transition cursor-pointer"
                    >
                      動画視聴のみ
                    </button>
                    <button
                      type="button"
                      onClick={() => loginAsDemoUser('both')}
                      className="px-2 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 text-[11px] font-bold border border-slate-800 transition cursor-pointer"
                    >
                      両方受講
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================
                2. ログイン済み：会員専用マイページダッシュボード
            ======================================================== */
            <div className="space-y-8 animate-fadeIn">
              {/* ヘッダー・会員プロファイルエリア */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {hasTutoringPlan && (
                      <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 text-xs font-bold">
                        【地理個別指導】受講生
                      </span>
                    )}
                    {hasVideoPlan && (
                      <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                        【地理動画視聴】受講生
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {profile?.full_name || '受講生'} <span className="text-sm font-normal text-slate-400">様</span>
                  </h1>

                  <p className="text-xs text-slate-400 font-mono">
                    登録日: {profile?.registration_date || '2026/08/01'} | 会員ID: {profile?.id?.slice(0, 8)}...
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-cyan-400 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    会員登録情報
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    ログアウト
                  </button>
                </div>
              </div>

              {/* プラン切り替えタブ (両方受講生のみ) */}
              {hasTutoringPlan && hasVideoPlan && (
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <button
                    onClick={() => setActiveTab('tutoring')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
                      activeTab === 'tutoring'
                        ? 'bg-cyan-400 text-slate-950 shadow-lg font-extrabold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    個別指導スケジュール
                  </button>
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
                      activeTab === 'video'
                        ? 'bg-cyan-400 text-slate-950 shadow-lg font-extrabold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    講座動画ライブラリ
                  </button>
                </div>
              )}

              {/* 動的コンテンツ表示エリア */}
              {((activeTab === 'tutoring' && hasTutoringPlan) || (!hasVideoPlan && hasTutoringPlan)) && (
                <TutoringSection schedule={tutoringSchedule} profile={profile} />
              )}

              {((activeTab === 'video' && hasVideoPlan) || (!hasTutoringPlan && hasVideoPlan)) && (
                <VideoSection
                  videos={videos}
                  documentsByVideo={documentsByVideo}
                  userProgress={userProgress}
                  userMemos={userMemos}
                  registrationDate={profile?.registration_date}
                  onSaveProgress={handleSaveProgress}
                  onSaveMemo={handleSaveMemo}
                  onDownloadDocument={handleDownloadDocument}
                />
              )}

              {/* 会員基本情報確認 モーダル */}
              {showProfileModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
                    <button
                      onClick={() => setShowProfileModal(false)}
                      aria-label="Close"
                      className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition"
                    >
                      <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
                        <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white">受講生会員登録情報</h3>
                    </div>

                    <div className="space-y-3 text-xs md:text-sm">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-400">氏名</span>
                          <span className="font-bold text-white">{profile?.full_name}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-400">メール</span>
                          <span className="font-mono text-cyan-300">{profile?.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-400">電話番号</span>
                          <span className="font-mono text-slate-200">{profile?.phone_number || '未登録'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-400">住所</span>
                          <span className="text-slate-200">{profile?.address || '未登録'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-400">会員登録日</span>
                          <span className="font-mono text-slate-200">{profile?.registration_date}</span>
                        </div>
                      </div>

                      {profile?.notes && (
                        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                          <span className="text-cyan-400 font-semibold block">備考 (管理メモ):</span>
                          <span>{renderTextWithLinks(profile.notes)}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
                    >
                      閉じる
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
