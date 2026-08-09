-- Safe, repeatable production migration. Run this file in Supabase SQL Editor.
CREATE OR REPLACE FUNCTION public.is_app_admin() RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS playback_rate NUMERIC DEFAULT 1 NOT NULL;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS captions_enabled BOOLEAN DEFAULT true NOT NULL;

DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
DROP POLICY IF EXISTS "Admins manage plans" ON public.user_plans;
CREATE POLICY "Admins manage plans" ON public.user_plans FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
DROP POLICY IF EXISTS "Admins manage schedules" ON public.tutoring_schedules;
CREATE POLICY "Admins manage schedules" ON public.tutoring_schedules FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
DROP POLICY IF EXISTS "Admins manage videos" ON public.videos;
CREATE POLICY "Admins manage videos" ON public.videos FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE TABLE IF NOT EXISTS public.video_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL, options JSONB NOT NULL, correct_option SMALLINT NOT NULL CHECK (correct_option BETWEEN 1 AND 4), order_index INT DEFAULT 0 NOT NULL, created_at TIMESTAMPTZ DEFAULT now() NOT NULL);
CREATE TABLE IF NOT EXISTS public.video_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE, score INT NOT NULL CHECK (score >= 0), total_questions INT NOT NULL CHECK (total_questions > 0), created_at TIMESTAMPTZ DEFAULT now() NOT NULL);
ALTER TABLE public.video_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS public.video_quiz_sources (
  video_id UUID PRIMARY KEY REFERENCES public.videos(id) ON DELETE CASCADE,
  csv_content TEXT NOT NULL, file_name TEXT NOT NULL, updated_at TIMESTAMPTZ DEFAULT now() NOT NULL);
ALTER TABLE public.video_quiz_sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage quiz questions" ON public.video_quiz_questions;
CREATE POLICY "Admins manage quiz questions" ON public.video_quiz_questions FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
DROP POLICY IF EXISTS "Users view own quiz attempts" ON public.video_quiz_attempts;
CREATE POLICY "Users view own quiz attempts" ON public.video_quiz_attempts FOR SELECT USING (auth.uid() = user_id OR public.is_app_admin());
DROP POLICY IF EXISTS "Admins manage quiz sources" ON public.video_quiz_sources;
CREATE POLICY "Admins manage quiz sources" ON public.video_quiz_sources FOR ALL USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

CREATE OR REPLACE FUNCTION public.get_video_quiz(p_video_id UUID) RETURNS TABLE(id UUID, question_text TEXT, options JSONB, order_index INT) LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
 SELECT q.id,q.question_text,q.options,q.order_index FROM public.video_quiz_questions q JOIN public.videos v ON v.id=q.video_id JOIN public.profiles p ON p.id=auth.uid()
 WHERE q.video_id=p_video_id AND EXISTS (SELECT 1 FROM public.user_plans plan WHERE plan.user_id=auth.uid() AND plan.plan_type='video' AND plan.status='active') AND CURRENT_DATE >= p.registration_date + v.days_after_registration ORDER BY q.order_index,q.created_at;
$$;
CREATE OR REPLACE FUNCTION public.submit_video_quiz(p_video_id UUID,p_answers JSONB) RETURNS TABLE(score INT,total_questions INT,best_score INT) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s INT; t INT; b INT; BEGIN
 IF NOT EXISTS (SELECT 1 FROM public.user_plans WHERE user_id=auth.uid() AND plan_type='video' AND status='active') THEN RAISE EXCEPTION 'Not authorized'; END IF;
 SELECT COUNT(*),COUNT(*) FILTER (WHERE (p_answers->>q.id::text) ~ '^[1-4]$' AND (p_answers->>q.id::text)::INT=q.correct_option) INTO t,s FROM public.video_quiz_questions q WHERE q.video_id=p_video_id;
 IF t=0 THEN RAISE EXCEPTION 'Quiz not configured'; END IF;
 INSERT INTO public.video_quiz_attempts(user_id,video_id,score,total_questions) VALUES(auth.uid(),p_video_id,s,t);
 SELECT MAX(score) INTO b FROM public.video_quiz_attempts WHERE user_id=auth.uid() AND video_id=p_video_id; RETURN QUERY SELECT s,t,b; END;
$$;
GRANT EXECUTE ON FUNCTION public.get_video_quiz(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_video_quiz(UUID,JSONB) TO authenticated;

-- Returns correct options only after a valid submission, so answers are not exposed before the test.
CREATE OR REPLACE FUNCTION public.submit_video_quiz_with_results(
  p_video_id UUID,
  p_answers JSONB
) RETURNS TABLE(score INT, total_questions INT, best_score INT, correct_answers JSONB)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s INT; t INT; b INT; a JSONB;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.user_plans plan
    JOIN public.videos v ON v.id = p_video_id
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE plan.user_id = auth.uid()
      AND plan.plan_type = 'video'
      AND plan.status = 'active'
      AND CURRENT_DATE >= p.registration_date + v.days_after_registration
  ) THEN
    RAISE EXCEPTION 'Not authorized or the course is not yet available';
  END IF;

  SELECT COUNT(*), COUNT(*) FILTER (
    WHERE (p_answers ->> q.id::text) ~ '^[1-4]$'
      AND (p_answers ->> q.id::text)::INT = q.correct_option
  ), COALESCE(jsonb_object_agg(q.id::text, q.correct_option), '{}'::jsonb)
  INTO t, s, a
  FROM public.video_quiz_questions q
  WHERE q.video_id = p_video_id;
  IF t = 0 THEN RAISE EXCEPTION 'Quiz not configured'; END IF;

  INSERT INTO public.video_quiz_attempts(user_id, video_id, score, total_questions)
  VALUES (auth.uid(), p_video_id, s, t);
  SELECT MAX(qa.score) INTO b
  FROM public.video_quiz_attempts qa
  WHERE qa.user_id = auth.uid() AND qa.video_id = p_video_id;
  RETURN QUERY SELECT s, t, b, a;
END;
$$;
GRANT EXECUTE ON FUNCTION public.submit_video_quiz_with_results(UUID,JSONB) TO authenticated;
