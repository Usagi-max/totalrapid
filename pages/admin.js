// pages/admin.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/LayoutGeo';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  getStoredStudents,
  saveStoredStudents,
  getStoredVideos,
  saveStoredVideos,
  getStoredSchedules,
  saveStoredSchedules,
} from '../lib/storageManager';

const DEFAULT_ADMIN_EMAIL = 'admin@total-rapid.com';
const DEFAULT_ADMIN_PASS = 'rapid-admin-2026!';

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPassInput, setAdminPassInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Active Tab
  const [adminTab, setAdminTab] = useState('students'); // 'students' | 'schedules' | 'videos' | 'documents'

  // Data state
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [documentVideoId, setDocumentVideoId] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [documentBusy, setDocumentBusy] = useState(false);
  const [replacingDocument, setReplacingDocument] = useState(null);

  // Modals / Forms
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    email: '',
    password: '',
    full_name: '',
    address: '',
    phone_number: '',
    registration_date: new Date().toISOString().split('T')[0],
    notes: '',
    hasTutoring: true,
    hasVideo: true,
  });

  // Schedule Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    user_id: '',
    scheduled_at: '',
    title: '地理個別指導',
    meeting_url: '',
    notes: '',
  });

  // Video Modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    youtube_video_id: '',
    playback_rate: 1,
    captions_enabled: true,
    days_after_registration: 0,
    category: '系統地理',
    order_index: 1,
  });

  const [notification, setNotification] = useState('');

  // Initial load
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.app_metadata?.role === 'admin') {
          setIsAdminLoggedIn(true);
          loadInitialAdminData();
        }
      });
      return;
    }
    const savedAdmin = typeof window !== 'undefined' ? localStorage.getItem('rapid_admin_auth') : null;
    if (savedAdmin === 'true') {
      setIsAdminLoggedIn(true);
    }
    loadInitialAdminData();
  }, []);

  const loadInitialAdminData = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: profs } = await supabase.from('profiles').select('*, user_plans(*)');
        const { data: scheds } = await supabase.from('tutoring_schedules').select('*, profiles(full_name)');
        const { data: vids } = await supabase.from('videos').select('*').order('order_index', { ascending: true });
        const { data: docs } = await supabase.from('video_documents').select('*').order('created_at', { ascending: false });

        if (profs && profs.length > 0) setStudents(profs);
        else setStudents(getStoredStudents());

        if (scheds && scheds.length > 0) setSchedules(scheds);
        else setSchedules(getStoredSchedules());

        if (vids && vids.length > 0) setVideosList(vids);
        else setVideosList(getStoredVideos());
        setDocuments(docs || []);
      } catch (e) {
        setStudents(getStoredStudents());
        setSchedules(getStoredSchedules());
        setVideosList(getStoredVideos());
      }
    } else {
      setStudents(getStoredStudents());
      setSchedules(getStoredSchedules());
      setVideosList(getStoredVideos());
    }
  };

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmailInput,
        password: adminPassInput,
      });
      if (error || data.user?.app_metadata?.role !== 'admin') {
        if (data.session) await supabase.auth.signOut();
        setLoginError('管理者権限を持つSupabaseアカウントでログインしてください。');
        return;
      }
      setIsAdminLoggedIn(true);
      await loadInitialAdminData();
      showNotice('管理者としてログインしました');
      return;
    }

    if (
      (adminEmailInput === DEFAULT_ADMIN_EMAIL && adminPassInput === DEFAULT_ADMIN_PASS) ||
      (adminEmailInput === 'admin' && adminPassInput === 'admin')
    ) {
      setIsAdminLoggedIn(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rapid_admin_auth', 'true');
      }
      showNotice('管理者としてログインしました');
    } else {
      setLoginError('IDまたはパスワードが正しくありません。');
    }
  };

  const handleAdminLogout = async () => {
    setIsAdminLoggedIn(false);
    if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rapid_admin_auth');
    }
  };

  // ==========================================
  // 生徒アカウント作成・編集
  // ==========================================
  const openNewStudentModal = () => {
    setEditingStudent(null);
    setStudentForm({
      email: '',
      password: '',
      full_name: '',
      address: '',
      phone_number: '',
      registration_date: new Date().toISOString().split('T')[0],
      notes: '',
      hasTutoring: true,
      hasVideo: true,
    });
    setShowStudentModal(true);
  };

  const openEditStudentModal = (student) => {
    setEditingStudent(student);
    const plans = student.plans || student.user_plans || [];
    setStudentForm({
      email: student.email || '',
      password: student.password || '',
      full_name: student.full_name || '',
      address: student.address || '',
      phone_number: student.phone_number || '',
      registration_date: student.registration_date || new Date().toISOString().split('T')[0],
      notes: student.notes || '',
      hasTutoring: plans.some((p) => (p.plan_type || p) === 'tutoring'),
      hasVideo: plans.some((p) => (p.plan_type || p) === 'video'),
    });
    setShowStudentModal(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();

    const planList = [];
    if (studentForm.hasTutoring) planList.push({ plan_type: 'tutoring', contract_start_date: studentForm.registration_date, status: 'active' });
    if (studentForm.hasVideo) planList.push({ plan_type: 'video', contract_start_date: studentForm.registration_date, status: 'active' });

    let nextStudents = [];
    if (editingStudent) {
      nextStudents = students.map((s) =>
        s.id === editingStudent.id
          ? { ...s, ...studentForm, plans: planList, user_plans: planList }
          : s
      );
      setStudents(nextStudents);
      saveStoredStudents(nextStudents);

      if (isSupabaseConfigured && supabase) {
        await supabase
          .from('profiles')
          .update({
            full_name: studentForm.full_name,
            address: studentForm.address,
            phone_number: studentForm.phone_number,
            registration_date: studentForm.registration_date,
            notes: studentForm.notes,
          })
          .eq('id', editingStudent.id);
      }
      showNotice('生徒情報を更新しました');
    } else {
      const newId = `user-gen-${Date.now()}`;
      const newStudentObj = {
        id: newId,
        email: studentForm.email,
        password: studentForm.password || 'rapid2026',
        full_name: studentForm.full_name,
        address: studentForm.address,
        phone_number: studentForm.phone_number,
        registration_date: studentForm.registration_date,
        notes: studentForm.notes,
        plans: planList,
        user_plans: planList,
      };

      nextStudents = [newStudentObj, ...students];
      setStudents(nextStudents);
      saveStoredStudents(nextStudents);

      if (isSupabaseConfigured && supabase) {
        const { data: authData } = await supabase.auth.signUp({
          email: studentForm.email,
          password: studentForm.password || 'rapid2026',
          options: {
            data: { full_name: studentForm.full_name },
          },
        });

        if (authData?.user) {
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: studentForm.email,
            full_name: studentForm.full_name,
            address: studentForm.address,
            phone_number: studentForm.phone_number,
            registration_date: studentForm.registration_date,
            notes: studentForm.notes,
          });

          for (const p of planList) {
            await supabase.from('user_plans').upsert({
              user_id: authData.user.id,
              plan_type: p.plan_type,
              contract_start_date: p.contract_start_date,
              status: 'active',
            });
          }
        }
      }

      showNotice('新規生徒アカウントを発行・追加しました');
    }

    setShowStudentModal(false);
  };

  const handleDeleteStudent = (studentId) => {
    if (confirm('この生徒アカウントを削除しますか？')) {
      const nextStudents = students.filter((s) => s.id !== studentId);
      setStudents(nextStudents);
      saveStoredStudents(nextStudents);

      if (isSupabaseConfigured && supabase) {
        supabase.from('profiles').delete().eq('id', studentId).then(() => {});
      }
      showNotice('生徒アカウントを削除しました');
    }
  };

  // ==========================================
  // 指導日程登録
  // ==========================================
  const openNewScheduleModal = () => {
    setScheduleForm({
      user_id: students[0]?.id || '',
      scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      title: '共通テスト地理B 特訓個別指導',
      meeting_url: 'https://meet.google.com/abc-defg-hij',
      notes: '',
    });
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    const targetStudent = students.find((s) => s.id === scheduleForm.user_id);
    const newSched = {
      id: `sched-${Date.now()}`,
      user_id: scheduleForm.user_id,
      scheduled_at: new Date(scheduleForm.scheduled_at).toISOString(),
      title: scheduleForm.title,
      meeting_url: scheduleForm.meeting_url,
      notes: scheduleForm.notes,
      status: 'scheduled',
      profiles: { full_name: targetStudent?.full_name || '生徒' },
    };

    const nextScheds = [newSched, ...schedules];
    setSchedules(nextScheds);
    saveStoredSchedules(nextScheds);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('tutoring_schedules').insert({
        user_id: scheduleForm.user_id,
        scheduled_at: new Date(scheduleForm.scheduled_at).toISOString(),
        title: scheduleForm.title,
        meeting_url: scheduleForm.meeting_url,
        notes: scheduleForm.notes,
        status: 'scheduled',
      });
    }

    setShowScheduleModal(false);
    showNotice('個別指導日程を追加しました');
  };

  // ==========================================
  // 動画＆ドリップ設定管理
  // ==========================================
  const openNewVideoModal = () => {
    setEditingVideo(null);
    setDocumentFile(null);
    setReplacingDocument(null);
    setVideoForm({
      title: '',
      description: '',
      youtube_video_id: '',
      playback_rate: 1,
      captions_enabled: true,
      days_after_registration: 0,
      category: '系統地理',
      order_index: videosList.length + 1,
    });
    setShowVideoModal(true);
  };

  const openEditVideoModal = (vid) => {
    setEditingVideo(vid);
    setDocumentVideoId(vid.id);
    setDocumentFile(null);
    setReplacingDocument(null);
    setVideoForm({
      title: vid.title || '',
      description: vid.description || '',
      youtube_video_id: vid.youtube_video_id || '',
      playback_rate: Number(vid.playback_rate) || 1,
      captions_enabled: vid.captions_enabled !== false,
      days_after_registration: vid.days_after_registration || 0,
      category: vid.category || '系統地理',
      order_index: vid.order_index || 1,
    });
    setShowVideoModal(true);
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    let nextVideos = [];
    if (editingVideo) {
      nextVideos = videosList.map((v) => (v.id === editingVideo.id ? { ...v, ...videoForm } : v));
      setVideosList(nextVideos);
      saveStoredVideos(nextVideos);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('videos').update(videoForm).eq('id', editingVideo.id);
      }
      showNotice('動画マスター情報を更新しました');
    } else {
      const newVid = {
        id: `vid-${Date.now()}`,
        ...videoForm,
        duration_seconds: 1200,
      };
      nextVideos = [...videosList, newVid];
      setVideosList(nextVideos);
      saveStoredVideos(nextVideos);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('videos').insert(videoForm);
      }
      showNotice('新規動画・ドリップ設定を追加しました');
    }
    setShowVideoModal(false);
  };

  const handleDeleteVideo = (vidId) => {
    if (confirm('この動画マスターを削除しますか？')) {
      const nextVideos = videosList.filter((v) => v.id !== vidId);
      setVideosList(nextVideos);
      saveStoredVideos(nextVideos);

      if (isSupabaseConfigured && supabase) {
        supabase.from('videos').delete().eq('id', vidId).then(() => {});
      }
      showNotice('動画マスターを削除しました');
    }
  };

  const handleUploadDocument = async (event) => {
    event?.preventDefault();
    const targetVideoId = editingVideo?.id || documentVideoId;
    if (!targetVideoId || !documentFile) return;
    if (documentFile.type !== 'application/pdf') {
      showNotice('PDFファイルを選択してください。');
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      showNotice('PDF資料の登録にはSupabase Storageの設定が必要です。');
      return;
    }

    setDocumentBusy(true);
    const safeName = documentFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${targetVideoId}/${Date.now()}-${safeName}`;
    try {
      const { error: uploadError } = await supabase.storage
        .from('course-documents')
        .upload(storagePath, documentFile, { contentType: 'application/pdf', upsert: false });
      if (uploadError) throw uploadError;

      const { data, error: rowError } = await supabase.from('video_documents').insert({
        video_id: targetVideoId,
        file_name: documentFile.name,
        storage_path: storagePath,
      }).select().single();
      if (rowError) {
        await supabase.storage.from('course-documents').remove([storagePath]);
        throw rowError;
      }
      if (replacingDocument) {
        const { error: deleteError } = await supabase.from('video_documents').delete().eq('id', replacingDocument.id);
        if (deleteError) throw deleteError;
        await supabase.storage.from('course-documents').remove([replacingDocument.storage_path]);
        setDocuments((current) => [data, ...current.filter((item) => item.id !== replacingDocument.id)]);
      } else {
        setDocuments((current) => [data, ...current]);
      }
      setDocumentFile(null);
      setReplacingDocument(null);
      if (event?.target?.reset) event.target.reset();
      showNotice(replacingDocument ? '講義資料を差し替えました。' : '講義資料を登録しました。');
    } catch (error) {
      console.error('Document upload error:', error);
      showNotice('資料を登録できませんでした。管理者権限とStorage設定を確認してください。');
    } finally {
      setDocumentBusy(false);
    }
  };

  const handleDeleteDocument = async (document) => {
    if (!confirm(`「${document.file_name}」を削除しますか？`)) return;
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { error } = await supabase.from('video_documents').delete().eq('id', document.id);
      if (error) throw error;
      await supabase.storage.from('course-documents').remove([document.storage_path]);
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      showNotice('講義資料を削除しました。');
    } catch (error) {
      console.error('Document delete error:', error);
      showNotice('資料を削除できませんでした。');
    }
  };

  return (
    <Layout hideSurveyWidget={true} hideSecondNav={true}>
      <Head>
        <title>管理者コンソール | 高校地理専門塾 RAPID+</title>
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 通知トースト */}
          {notification && (
            <div className="fixed top-6 right-6 z-50 bg-cyan-500 text-slate-950 font-bold text-xs px-5 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center gap-2">
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>{notification}</span>
            </div>
          )}

          {/* ========================================================
              1. 未ログイン時：管理者ログイン画面
          ======================================================== */}
          {!isAdminLoggedIn ? (
            <div className="max-w-md mx-auto py-12 animate-fadeIn space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 mx-auto shadow-xl">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                    <svg className="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 9V7a2 2 0 012-2h0a2 2 0 012 2v2" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-2xl font-extrabold text-white">RAPID+ 管理者専用ポータル</h1>
                <p className="text-xs text-slate-400">生徒アカウント登録・個別指導日程・ドリップ動画管理</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  {loginError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <svg className="w-4 h-4 text-rose-400 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">管理者ログインID / メール</label>
                    <input
                      type="text"
                      required
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      placeholder="admin@total-rapid.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">管理者パスワード</label>
                    <input
                      type="password"
                      required
                      value={adminPassInput}
                      onChange={(e) => setAdminPassInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-bold text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>管理者管理画面へログイン</span>
                  </button>
                </form>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>初期管理者ログイン認証情報 (アイパス)</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 space-y-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div><span className="text-slate-500">ID/Email:</span> {DEFAULT_ADMIN_EMAIL}</div>
                    <div><span className="text-slate-500">Password:</span> {DEFAULT_ADMIN_PASS}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================
                2. ログイン済み：管理者ダッシュボード
            ======================================================== */
            <div className="space-y-8 animate-fadeIn">
              {/* 管理者ヘッダーバー */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
                    RAPID+ 管理者専用コンソール
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">受講生・授業・動画管理ダッシュボード</h1>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="/login"
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>生徒画面（/login）を確認</span>
                  </a>
                  <button
                    onClick={handleAdminLogout}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition cursor-pointer"
                  >
                    管理者ログアウト
                  </button>
                </div>
              </div>

              {/* 管理ナビゲーションタブ */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setAdminTab('students')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
                    adminTab === 'students'
                      ? 'bg-cyan-400 text-slate-950 font-extrabold shadow-lg'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>登録生一覧・新規発行 ({students.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('schedules')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
                    adminTab === 'schedules'
                      ? 'bg-cyan-400 text-slate-950 font-extrabold shadow-lg'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>個別指導日程登録 ({schedules.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('videos')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
                    adminTab === 'videos'
                      ? 'bg-cyan-400 text-slate-950 font-extrabold shadow-lg'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>動画・ドリップ公開設定 ({videosList.length})</span>
                </button>
                <button
                  onClick={() => setAdminTab('documents')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
                    adminTab === 'documents'
                      ? 'bg-cyan-400 text-slate-950 font-extrabold shadow-lg'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>講義資料PDF ({documents.length})</span>
                </button>
              </div>

              {/* ========================================================
                  TAB 1: 生徒・登録者管理
              ======================================================== */}
              {adminTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-white">受講生アカウント管理一覧</h3>
                    <button
                      onClick={openNewStudentModal}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>新規生徒アカウント発行</span>
                    </button>
                  </div>

                  {/* テーブル */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
                          <tr>
                            <th className="p-4">生徒氏名</th>
                            <th className="p-4">メールアドレス</th>
                            <th className="p-4">初期パスワード</th>
                            <th className="p-4">契約受講プラン</th>
                            <th className="p-4">登録日 (ドリップ基準日)</th>
                            <th className="p-4 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 font-medium">
                          {students.map((st) => {
                            const plans = st.plans || st.user_plans || [];
                            const hasTutoring = plans.some((p) => (p.plan_type || p) === 'tutoring');
                            const hasVideo = plans.some((p) => (p.plan_type || p) === 'video');

                            return (
                              <tr key={st.id} className="hover:bg-slate-850/60 transition">
                                <td className="p-4 font-bold text-white">{st.full_name}</td>
                                <td className="p-4 font-mono text-cyan-300">{st.email}</td>
                                <td className="p-4 font-mono text-amber-300">{st.password || '設定あり'}</td>
                                <td className="p-4">
                                  <div className="flex flex-wrap gap-1.5">
                                    {hasTutoring && (
                                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 text-[10px] font-bold">
                                        地理個別指導
                                      </span>
                                    )}
                                    {hasVideo && (
                                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                                        地理動画視聴
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 font-mono text-slate-300">{st.registration_date}</td>
                                <td className="p-4 text-right space-x-2">
                                  <button
                                    onClick={() => openEditStudentModal(st)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
                                  >
                                    編集
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(st.id)}
                                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition"
                                  >
                                    削除
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 2: 個別指導日程管理
              ======================================================== */}
              {adminTab === 'schedules' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-white">個別指導スケジュール登録</h3>
                    <button
                      onClick={openNewScheduleModal}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>指導日程を新規登録</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schedules.map((sc) => (
                      <div key={sc.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                        <div className="flex justify-between items-start">
                          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 text-xs font-bold">
                            対象: {sc.profiles?.full_name || '受講生'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{sc.status}</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{sc.title}</h4>
                        <div className="text-sm font-bold text-cyan-300 font-mono">
                          {new Date(sc.scheduled_at).toLocaleString('ja-JP')}
                        </div>
                        {sc.meeting_url && (
                          <div className="text-xs text-slate-400 truncate bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                            URL: <a href={sc.meeting_url} target="_blank" className="text-cyan-400 hover:underline">{sc.meeting_url}</a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 3: 動画＆ドリップ設定管理
              ======================================================== */}
              {adminTab === 'videos' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-white">動画マスター & ステップ公開設定</h3>
                    <button
                      onClick={openNewVideoModal}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>新規動画・ドリップ設定追加</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videosList.map((vd) => (
                      <div key={vd.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            STEP {vd.order_index} | {vd.category}
                          </span>
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                            登録から {vd.days_after_registration} 日後に公開
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{vd.title}</h4>
                        <div className="text-xs font-mono text-slate-400">
                          YouTube ID: <span className="text-cyan-300 font-bold">{vd.youtube_video_id}</span>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => openEditVideoModal(vd)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs transition"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(vd.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === 'documents' && (
                <div className="space-y-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4">講座ごとの講義資料 PDF</h3>
                    <form onSubmit={handleUploadDocument} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end text-xs">
                      <label className="space-y-1"><span className="font-bold text-slate-300">対象講座</span><select required value={documentVideoId} onChange={(event) => setDocumentVideoId(event.target.value)} className="block w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"><option value="">選択してください</option>{videosList.map((video) => <option key={video.id} value={video.id}>{video.title}</option>)}</select></label>
                      <label className="space-y-1"><span className="font-bold text-slate-300">PDFファイル</span><input required type="file" accept="application/pdf,.pdf" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} className="block w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300" /></label>
                      <button disabled={documentBusy} type="submit" className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 disabled:opacity-50 text-white font-bold">{documentBusy ? '登録中…' : replacingDocument ? 'PDFを差し替え' : 'PDFを登録'}</button>
                    </form>
                    {replacingDocument && <div className="mt-3 flex items-center justify-between gap-3 text-xs text-amber-200"><span>差し替え対象: {replacingDocument.file_name}</span><button type="button" onClick={() => setReplacingDocument(null)} className="underline">解除</button></div>}
                  </div>
                  <div className="space-y-3">
                    {documents.length === 0 ? <p className="text-sm text-slate-400">登録済みの講義資料はありません。</p> : documents.map((document) => {
                      const video = videosList.find((item) => item.id === document.video_id);
                      return <div key={document.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4"><div><p className="font-bold text-white break-all">{document.file_name}</p><p className="text-xs text-slate-400 mt-1">講座: {video?.title || document.video_id}</p></div><div className="flex gap-2"><button onClick={() => { setReplacingDocument(document); setDocumentVideoId(document.video_id); }} className="px-3 py-2 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 text-xs">差し替え</button><button onClick={() => handleDeleteDocument(document)} className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs">削除</button></div></div>;
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================
                  新規生徒発行・編集モーダル
              ======================================================== */}
              {showStudentModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-6">
                  <div className="mx-auto flex min-h-full items-center justify-center">
                    <div role="dialog" aria-modal="true" className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] p-5 sm:p-6 md:p-8 space-y-6 shadow-2xl relative overflow-y-auto">
                    <button
                      onClick={() => setShowStudentModal(false)}
                      className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
                    >
                      ✕
                    </button>

                    <h3 className="text-xl font-bold text-white">
                      {editingStudent ? '生徒アカウント編集' : '新規生徒アカウント発行'}
                    </h3>

                    <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">生徒氏名</label>
                        <input
                          type="text"
                          required
                          value={studentForm.full_name}
                          onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
                          placeholder="山田 太郎"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">メールアドレス</label>
                        <input
                          type="email"
                          required
                          value={studentForm.email}
                          onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                          placeholder="student@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">ログインパスワード</label>
                        <input
                          type="text"
                          required
                          value={studentForm.password}
                          onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                          placeholder="rapid2026"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">電話番号</label>
                          <input
                            type="text"
                            value={studentForm.phone_number}
                            onChange={(e) => setStudentForm({ ...studentForm, phone_number: e.target.value })}
                            placeholder="090-1234-5678"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">登録日 (ドリップ基準日)</label>
                          <input
                            type="date"
                            required
                            value={studentForm.registration_date}
                            onChange={(e) => setStudentForm({ ...studentForm, registration_date: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">住所</label>
                        <input
                          type="text"
                          value={studentForm.address}
                          onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                          placeholder="東京都千代田区1-2-3"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        />
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="font-bold text-cyan-300 block">契約受講プラン（複数選択可）</label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={studentForm.hasTutoring}
                              onChange={(e) => setStudentForm({ ...studentForm, hasTutoring: e.target.checked })}
                              className="w-4 h-4 accent-cyan-400"
                            />
                            <span>地理個別指導</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={studentForm.hasVideo}
                              onChange={(e) => setStudentForm({ ...studentForm, hasVideo: e.target.checked })}
                              className="w-4 h-4 accent-cyan-400"
                            />
                            <span>地理動画視聴</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">管理者備考</label>
                        <textarea
                          value={studentForm.notes}
                          onChange={(e) => setStudentForm({ ...studentForm, notes: e.target.value })}
                          rows="2"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg hover:brightness-110 transition cursor-pointer"
                      >
                        保存・登録する
                      </button>
                    </form>
                    </div>
                  </div>
                </div>
              )}

              {/* 指導日程登録 モーダル */}
              {showScheduleModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-6">
                  <div className="mx-auto flex min-h-full items-center justify-center">
                    <div role="dialog" aria-modal="true" className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] p-5 sm:p-6 md:p-8 space-y-6 shadow-2xl relative overflow-y-auto">
                    <button
                      onClick={() => setShowScheduleModal(false)}
                      className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
                    >
                      ✕
                    </button>

                    <h3 className="text-xl font-bold text-white">個別指導日程の新規登録</h3>

                    <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">対象生徒</label>
                        <select
                          value={scheduleForm.user_id}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, user_id: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        >
                          {students.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.full_name} ({st.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">指導日時</label>
                        <input
                          type="datetime-local"
                          required
                          value={scheduleForm.scheduled_at}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, scheduled_at: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">講義タイトル</label>
                        <input
                          type="text"
                          required
                          value={scheduleForm.title}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                          placeholder="共通テスト地理B 特訓個別指導"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">オンライン指導URL (Zoom / Google Meet)</label>
                        <input
                          type="text"
                          value={scheduleForm.meeting_url}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, meeting_url: e.target.value })}
                          placeholder="https://meet.google.com/..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">事前課題 / 講師メモ</label>
                        <textarea
                          value={scheduleForm.notes}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                          rows="3"
                          placeholder="事前課題：テキストP.40〜P.50の演習を完了させておいてください"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg hover:brightness-110 transition cursor-pointer"
                      >
                        指導日程を登録する
                      </button>
                    </form>
                    </div>
                  </div>
                </div>
              )}

              {/* 動画・ドリップ設定 モーダル */}
              {showVideoModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-6">
                  <div className="mx-auto flex min-h-full items-center justify-center">
                    <div role="dialog" aria-modal="true" className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] p-5 sm:p-6 md:p-8 space-y-6 shadow-2xl relative overflow-y-auto">
                    <button
                      onClick={() => setShowVideoModal(false)}
                      className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
                    >
                      ✕
                    </button>

                    <h3 className="text-xl font-bold text-white">
                      {editingVideo ? '動画・ドリップ設定の編集' : '新規動画・ドリップ設定の追加'}
                    </h3>

                    <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">動画タイトル</label>
                        <input
                          type="text"
                          required
                          value={videoForm.title}
                          onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                          placeholder="第1講：共通テスト地理の全体像"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">YouTube 動画ID (限定公開)</label>
                        <input
                          type="text"
                          required
                          value={videoForm.youtube_video_id}
                          onChange={(e) => setVideoForm({ ...videoForm, youtube_video_id: e.target.value })}
                          placeholder="dQw4w9WgXcQ"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">再生速度</label>
                          <select value={videoForm.playback_rate} onChange={(e) => setVideoForm({ ...videoForm, playback_rate: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white">
                            {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => <option key={rate} value={rate}>{rate}x</option>)}
                          </select>
                        </div>
                        <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 cursor-pointer">
                          <input type="checkbox" checked={videoForm.captions_enabled} onChange={(e) => setVideoForm({ ...videoForm, captions_enabled: e.target.checked })} className="h-4 w-4 accent-cyan-400" />
                          <span className="font-bold">字幕を表示する</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-cyan-300">登録から何日後に公開 (ドリップ)</label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={videoForm.days_after_registration}
                            onChange={(e) => setVideoForm({ ...videoForm, days_after_registration: parseInt(e.target.value, 10) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">並び順 (STEP)</label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={videoForm.order_index}
                            onChange={(e) => setVideoForm({ ...videoForm, order_index: parseInt(e.target.value, 10) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">カテゴリ</label>
                        <select
                          value={videoForm.category}
                          onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        >
                          <option value="ガイダンス">ガイダンス</option>
                          <option value="系統地理">系統地理</option>
                          <option value="地誌">地誌</option>
                          <option value="共通テスト対策">共通テスト対策</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">講義概要・解説</label>
                        <textarea
                          value={videoForm.description}
                          onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                          rows="3"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                        />
                      </div>

                      {editingVideo && (
                        <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                          <div>
                            <p className="font-bold text-cyan-300">講義資料 PDF</p>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">この講座を受講でき、公開済みの受講者だけがダウンロードできます。</p>
                          </div>
                          {documents.filter((document) => document.video_id === editingVideo.id).map((document) => (
                            <div key={document.id} className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3 sm:flex-row sm:items-center sm:justify-between">
                              <span className="break-all text-slate-200">{document.file_name}</span>
                              <div className="flex gap-2 shrink-0">
                                <button type="button" onClick={() => { setReplacingDocument(document); setDocumentFile(null); }} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-cyan-300 transition hover:bg-slate-700">差し替え</button>
                                <button type="button" onClick={() => handleDeleteDocument(document)} className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-rose-300 transition hover:bg-rose-500/20">削除</button>
                              </div>
                            </div>
                          ))}
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input type="file" accept="application/pdf,.pdf" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} className="block min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300" />
                            <button type="button" disabled={!documentFile || documentBusy} onClick={handleUploadDocument} className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{documentBusy ? '登録中…' : replacingDocument ? 'PDFを差し替え' : 'PDFを追加'}</button>
                          </div>
                          {replacingDocument && <button type="button" onClick={() => setReplacingDocument(null)} className="text-left text-[11px] text-amber-200 underline">差し替えを取り消す</button>}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg hover:brightness-110 transition cursor-pointer"
                      >
                        保存・追加する
                      </button>
                    </form>
                    </div>
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
