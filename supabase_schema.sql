-- ============================================================
-- 学習塾 RAPID+ マイページ用 Supabase データベース構築 SQL
-- Supabase Dashboard > SQL Editor にて実行してください
-- ============================================================

-- 1. profiles テーブル（会員基本情報）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  address TEXT,
  phone_number TEXT,
  registration_date DATE DEFAULT CURRENT_DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. user_plans テーブル（契約プラン管理）
CREATE TABLE IF NOT EXISTS public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('tutoring', 'video')),
  contract_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, plan_type)
);

-- 3. tutoring_schedules テーブル（地理個別指導スケジュール）
CREATE TABLE IF NOT EXISTS public.tutoring_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  title TEXT DEFAULT '地理個別指導',
  meeting_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. videos テーブル（動画マスター & ドリップ公開設定）
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_video_id TEXT NOT NULL,
  playback_rate NUMERIC DEFAULT 1 NOT NULL CHECK (playback_rate IN (0.5, 0.75, 1, 1.25, 1.5, 1.75, 2)),
  captions_enabled BOOLEAN DEFAULT true NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INT DEFAULT 0 NOT NULL,
  days_after_registration INT DEFAULT 0 NOT NULL, -- 登録から公開までの日数
  category TEXT DEFAULT '共通テスト対策',
  order_index INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Existing projects can run this safely in the Supabase SQL Editor.
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS playback_rate NUMERIC DEFAULT 1 NOT NULL;
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS captions_enabled BOOLEAN DEFAULT true NOT NULL;

-- Per-student, private PDF metadata. Files live in the private
-- `student-documents` Storage bucket under `<user_id>/<timestamp>-<file>`.
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

CREATE TABLE IF NOT EXISTS public.student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Course material PDFs are shared by a video lecture, not by an individual
-- student. Keep the bucket private: downloads are always authorized by RLS.
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-documents', 'course-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

CREATE TABLE IF NOT EXISTS public.video_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. video_progress テーブル（動画視聴進捗・再生秒数記録）
CREATE TABLE IF NOT EXISTS public.video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  last_position_seconds NUMERIC DEFAULT 0 NOT NULL,
  max_position_seconds NUMERIC DEFAULT 0 NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, video_id)
);

-- 6. video_memos テーブル（生徒用動画メモ）
CREATE TABLE IF NOT EXISTS public.video_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  content TEXT DEFAULT '' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, video_id)
);

-- Per-video understanding checks. Correct answers stay server-side and are
-- never selected directly by student browsers.
CREATE TABLE IF NOT EXISTS public.video_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option SMALLINT NOT NULL CHECK (correct_option BETWEEN 1 AND 4),
  order_index INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.video_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 0),
  total_questions INT NOT NULL CHECK (total_questions > 0),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Row Level Security (RLS) 有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutoring_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_documents ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー作成
-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- user_plans
CREATE POLICY "Users can view own plans" ON public.user_plans
  FOR SELECT USING (auth.uid() = user_id);

-- tutoring_schedules
CREATE POLICY "Users can view own tutoring schedules" ON public.tutoring_schedules
  FOR SELECT USING (auth.uid() = user_id);

-- videos (認証ユーザー全般に閲覧権限)
CREATE POLICY "Authenticated users can view videos" ON public.videos
  FOR SELECT USING (auth.role() = 'authenticated');

-- video_progress
CREATE POLICY "Users can view own video progress" ON public.video_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert/update own video progress" ON public.video_progress
  FOR ALL USING (auth.uid() = user_id);

-- video_memos
CREATE POLICY "Users can view own video memos" ON public.video_memos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert/update own video memos" ON public.video_memos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins manage quiz questions" ON public.video_quiz_questions
  FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
CREATE POLICY "Users view own quiz attempts" ON public.video_quiz_attempts
  FOR SELECT USING (auth.uid() = user_id OR public.is_app_admin());

CREATE OR REPLACE FUNCTION public.get_video_quiz(p_video_id UUID)
RETURNS TABLE(id UUID, question_text TEXT, options JSONB, order_index INT)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT question.id, question.question_text, question.options, question.order_index
  FROM public.video_quiz_questions question
  JOIN public.videos video ON video.id = question.video_id
  JOIN public.profiles profile ON profile.id = auth.uid()
  WHERE question.video_id = p_video_id
    AND EXISTS (SELECT 1 FROM public.user_plans plan WHERE plan.user_id = auth.uid() AND plan.plan_type = 'video' AND plan.status = 'active')
    AND CURRENT_DATE >= profile.registration_date + video.days_after_registration
  ORDER BY question.order_index, question.created_at;
$$;

CREATE OR REPLACE FUNCTION public.submit_video_quiz(p_video_id UUID, p_answers JSONB)
RETURNS TABLE(score INT, total_questions INT, best_score INT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE calculated_score INT; calculated_total INT; calculated_best INT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_plans WHERE user_id = auth.uid() AND plan_type = 'video' AND status = 'active') THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT COUNT(*), COUNT(*) FILTER (WHERE (p_answers ->> question.id::text) ~ '^[1-4]$' AND (p_answers ->> question.id::text)::INT = question.correct_option)
  INTO calculated_total, calculated_score FROM public.video_quiz_questions question WHERE question.video_id = p_video_id;
  IF calculated_total = 0 THEN RAISE EXCEPTION 'Quiz not configured'; END IF;
  INSERT INTO public.video_quiz_attempts(user_id, video_id, score, total_questions) VALUES (auth.uid(), p_video_id, calculated_score, calculated_total);
  SELECT MAX(attempt.score) INTO calculated_best FROM public.video_quiz_attempts attempt WHERE attempt.user_id = auth.uid() AND attempt.video_id = p_video_id;
  RETURN QUERY SELECT calculated_score, calculated_total, calculated_best;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_video_quiz(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_video_quiz(UUID, JSONB) TO authenticated;

-- Admin access is deliberately tied to Supabase Auth app_metadata, not a
-- client-side flag. Set app_metadata.role = 'admin' for staff accounts.
CREATE OR REPLACE FUNCTION public.is_app_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$ LANGUAGE sql STABLE;

-- Management-console access. These policies are required in addition to each
-- student's own-row policies; otherwise a UI update appears to work locally
-- but is rejected by RLS and disappears after a reload.
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
DROP POLICY IF EXISTS "Admins manage plans" ON public.user_plans;
CREATE POLICY "Admins manage plans" ON public.user_plans FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
DROP POLICY IF EXISTS "Admins manage schedules" ON public.tutoring_schedules;
CREATE POLICY "Admins manage schedules" ON public.tutoring_schedules FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
DROP POLICY IF EXISTS "Admins manage videos" ON public.videos;
CREATE POLICY "Admins manage videos" ON public.videos FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
DROP POLICY IF EXISTS "Admins view video progress" ON public.video_progress;
CREATE POLICY "Admins view video progress" ON public.video_progress FOR SELECT USING (public.is_app_admin());
DROP POLICY IF EXISTS "Admins view video memos" ON public.video_memos;
CREATE POLICY "Admins view video memos" ON public.video_memos FOR SELECT USING (public.is_app_admin());

CREATE POLICY "Users can view own documents" ON public.student_documents
  FOR SELECT USING (auth.uid() = user_id OR public.is_app_admin());
CREATE POLICY "Admins manage student documents" ON public.student_documents
  FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

-- Students can list/download materials only while their video plan is active,
-- and only after the associated lecture has been released to them.
CREATE POLICY "Video students can view released course documents" ON public.video_documents
  FOR SELECT USING (
    public.is_app_admin() OR EXISTS (
      SELECT 1
      FROM public.user_plans plan
      JOIN public.profiles profile ON profile.id = plan.user_id
      JOIN public.videos video ON video.id = video_documents.video_id
      WHERE plan.user_id = auth.uid()
        AND plan.plan_type = 'video'
        AND plan.status = 'active'
        AND CURRENT_DATE >= profile.registration_date + video.days_after_registration
    )
  );
CREATE POLICY "Admins manage course documents" ON public.video_documents
  FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

-- Create this bucket as PRIVATE in Storage first, then run the policies below.
CREATE POLICY "Users download their own student documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'student-documents'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_app_admin())
  );
CREATE POLICY "Admins upload student documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'student-documents' AND public.is_app_admin());
CREATE POLICY "Admins delete student documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'student-documents' AND public.is_app_admin());

CREATE POLICY "Authorized students download released course documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'course-documents' AND (
      public.is_app_admin() OR EXISTS (
        SELECT 1
        FROM public.video_documents document
        JOIN public.videos video ON video.id = document.video_id
        JOIN public.user_plans plan ON plan.user_id = auth.uid()
        JOIN public.profiles profile ON profile.id = plan.user_id
        WHERE document.storage_path = name
          AND plan.plan_type = 'video'
          AND plan.status = 'active'
          AND CURRENT_DATE >= profile.registration_date + video.days_after_registration
      )
    )
  );
CREATE POLICY "Admins upload course documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'course-documents' AND public.is_app_admin());
CREATE POLICY "Admins delete course documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'course-documents' AND public.is_app_admin());

-- 自動で auth.users から profiles を作成するトリガー関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, registration_date)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '生徒'),
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 初期テストデータ（サンプルの動画マスター）
INSERT INTO public.videos (title, description, youtube_video_id, duration_seconds, days_after_registration, category, order_index)
VALUES 
  ('第1講：共通テスト地理の全体像と対策アプローチ', '共通テスト地理の傾向と効率的な学習法について解説します。', 'dQw4w9WgXcQ', 900, 0, 'ガイダンス', 1),
  ('第2講：自然環境① プレートテクトニクスと地形', '変動帯・安定陸塊の形成プロセスと重要キーワードを網羅。', 'L_LUpnjgPso', 1200, 0, '系統地理', 2),
  ('第3講：自然環境② 気候区分の判定アルゴリズム', 'ケッペンの気候区分を迷わず解くフローチャートを習得。', '3JZ_D3ELwOQ', 1500, 3, '系統地理', 3),
  ('第4講：資源と産業① 農業の分類と世界の農作物', 'ホイットルセー農牧業区分の完全マスター。', 'fJ9rUzIMcDQ', 1800, 7, '系統地理', 4),
  ('第5講：地誌① 東アジア・東南アジアの要点整理', '試験に出る地名・地形・統計データを集中網羅。', 'K4TOrB7at0Y', 1600, 14, '地誌', 5)
ON CONFLICT DO NOTHING;
