-- Quiz v2 + learning stats. Run this entire file once in the Supabase SQL Editor
-- BEFORE deploying the matching app changes. It is safe to run more than once.
--  * variable number of options (no longer fixed at 4)
--  * explanation: optional per-question explanation, shown only after answering (blank = not shown)
--  * lecture release date is enforced for quiz fetch / grading / stats (can_view_course_document)
--  * question_type: 'single' (text only) / 'image' (question with an uploaded image)
--  * private `quiz-images` bucket, readable only by students who may see the lecture
--  * replace_video_quiz(): atomic CSV import (old questions survive if it fails)
--  * get_quiz_availability() / get_my_watch_summary(): data for the My Page stats

CREATE OR REPLACE FUNCTION public.is_app_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- 1. Columns / constraints -------------------------------------------------
ALTER TABLE public.video_quiz_questions
  ADD COLUMN IF NOT EXISTS question_type TEXT NOT NULL DEFAULT 'single',
  ADD COLUMN IF NOT EXISTS image_path TEXT,
  ADD COLUMN IF NOT EXISTS explanation TEXT;

DO $$
DECLARE c RECORD;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.video_quiz_questions'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%correct_option%'
  LOOP
    EXECUTE format('ALTER TABLE public.video_quiz_questions DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.video_quiz_questions
  DROP CONSTRAINT IF EXISTS video_quiz_questions_correct_option_min,
  DROP CONSTRAINT IF EXISTS video_quiz_questions_type_check;
ALTER TABLE public.video_quiz_questions
  ADD CONSTRAINT video_quiz_questions_correct_option_min CHECK (correct_option >= 1),
  ADD CONSTRAINT video_quiz_questions_type_check CHECK (question_type IN ('single', 'image'));

-- 2. Private image bucket ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.can_view_course_document(p_video_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_app_admin() OR EXISTS (
    SELECT 1
    FROM public.user_plans AS plan
    JOIN public.profiles AS profile ON profile.id = plan.user_id
    JOIN public.videos AS video ON video.id = p_video_id
    WHERE plan.user_id = auth.uid()
      AND plan.plan_type = 'video'
      AND plan.status = 'active'
      AND (now() AT TIME ZONE 'Asia/Tokyo')::date >= profile.registration_date + COALESCE(video.days_after_registration, 0)
  );
$$;
REVOKE ALL ON FUNCTION public.can_view_course_document(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_view_course_document(UUID) TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('quiz-images', 'quiz-images', false, 4194304, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 4194304,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS "Authorized students view quiz images" ON storage.objects;
CREATE POLICY "Authorized students view quiz images"
ON storage.objects FOR SELECT USING (
  bucket_id = 'quiz-images' AND (
    public.is_app_admin() OR EXISTS (
      SELECT 1 FROM public.video_quiz_questions AS question
      WHERE question.image_path = name
        AND public.can_view_course_document(question.video_id)
    )
  )
);

DROP POLICY IF EXISTS "Admins upload quiz images" ON storage.objects;
CREATE POLICY "Admins upload quiz images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quiz-images' AND public.is_app_admin());

DROP POLICY IF EXISTS "Admins delete quiz images" ON storage.objects;
CREATE POLICY "Admins delete quiz images"
ON storage.objects FOR DELETE
USING (bucket_id = 'quiz-images' AND public.is_app_admin());

-- 3. Student-facing quiz RPCs ------------------------------------------------
DROP FUNCTION IF EXISTS public.get_video_quiz(UUID);
DROP FUNCTION IF EXISTS public.submit_video_quiz_with_results(UUID, JSONB);
CREATE FUNCTION public.get_video_quiz(p_video_id UUID)
RETURNS TABLE(id UUID, question_text TEXT, options JSONB, order_index INT, question_type TEXT, image_path TEXT)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT question.id, question.question_text, question.options, question.order_index,
         question.question_type, question.image_path
  FROM public.video_quiz_questions question
  WHERE question.video_id = p_video_id
    AND public.can_view_course_document(p_video_id)
  ORDER BY question.order_index, question.created_at;
$$;
GRANT EXECUTE ON FUNCTION public.get_video_quiz(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.submit_video_quiz_with_results(
  p_video_id UUID,
  p_answers JSONB
)
RETURNS TABLE(score INT, total_questions INT, best_score INT, correct_answers JSONB, explanations JSONB)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE calculated_score INT; calculated_total INT; calculated_best INT; answers JSONB; notes JSONB;
BEGIN
  IF NOT public.can_view_course_document(p_video_id) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT COUNT(*), COUNT(*) FILTER (
    WHERE (p_answers ->> question.id::text) ~ '^[0-9]{1,3}$'
      AND (p_answers ->> question.id::text)::INT = question.correct_option
  ), COALESCE(jsonb_object_agg(question.id::text, question.correct_option), '{}'::jsonb),
  COALESCE(jsonb_object_agg(question.id::text, question.explanation)
    FILTER (WHERE NULLIF(btrim(question.explanation), '') IS NOT NULL), '{}'::jsonb)
  INTO calculated_total, calculated_score, answers, notes
  FROM public.video_quiz_questions question
  WHERE question.video_id = p_video_id;

  IF calculated_total = 0 THEN RAISE EXCEPTION 'Quiz not configured'; END IF;

  INSERT INTO public.video_quiz_attempts(user_id, video_id, score, total_questions)
  VALUES (auth.uid(), p_video_id, calculated_score, calculated_total);
  SELECT MAX(attempt.score) INTO calculated_best
  FROM public.video_quiz_attempts attempt
  WHERE attempt.user_id = auth.uid() AND attempt.video_id = p_video_id;
  RETURN QUERY SELECT calculated_score, calculated_total, calculated_best, answers, notes;
END;
$$;
GRANT EXECUTE ON FUNCTION public.submit_video_quiz_with_results(UUID, JSONB) TO authenticated;

-- 4. Admin: atomic CSV import --------------------------------------------------
-- p_questions: [{question_text, options:[...], correct_option, question_type, image_path, explanation}, ...]
-- Returns the image paths of the replaced questions so the client can delete the old files.
CREATE OR REPLACE FUNCTION public.replace_video_quiz(
  p_video_id UUID, p_file_name TEXT, p_csv TEXT, p_questions JSONB
)
RETURNS TEXT[]
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE old_paths TEXT[]; item JSONB; idx INT := 0; option_count INT; answer INT;
BEGIN
  IF NOT public.is_app_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF jsonb_typeof(p_questions) <> 'array' OR jsonb_array_length(p_questions) = 0 THEN
    RAISE EXCEPTION 'No questions';
  END IF;

  SELECT COALESCE(array_agg(image_path) FILTER (WHERE image_path IS NOT NULL), '{}')
  INTO old_paths FROM public.video_quiz_questions WHERE video_id = p_video_id;

  DELETE FROM public.video_quiz_questions WHERE video_id = p_video_id;

  FOR item IN SELECT * FROM jsonb_array_elements(p_questions) LOOP
    option_count := jsonb_array_length(item -> 'options');
    answer := (item ->> 'correct_option')::INT;
    IF option_count < 2 OR answer < 1 OR answer > option_count THEN
      RAISE EXCEPTION 'Invalid question at index %', idx + 1;
    END IF;
    INSERT INTO public.video_quiz_questions(
      video_id, question_text, options, correct_option, order_index, question_type, image_path, explanation
    ) VALUES (
      p_video_id, item ->> 'question_text', item -> 'options', answer, idx,
      COALESCE(NULLIF(item ->> 'question_type', ''), 'single'), NULLIF(item ->> 'image_path', ''),
      NULLIF(btrim(COALESCE(item ->> 'explanation', '')), '')
    );
    idx := idx + 1;
  END LOOP;

  INSERT INTO public.video_quiz_sources(video_id, csv_content, file_name, updated_at)
  VALUES (p_video_id, p_csv, p_file_name, now())
  ON CONFLICT (video_id) DO UPDATE
    SET csv_content = EXCLUDED.csv_content, file_name = EXCLUDED.file_name, updated_at = EXCLUDED.updated_at;

  RETURN old_paths;
END;
$$;
REVOKE ALL ON FUNCTION public.replace_video_quiz(UUID, TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.replace_video_quiz(UUID, TEXT, TEXT, JSONB) TO authenticated;

-- 5. My Page stats -------------------------------------------------------------
-- Per video: number of questions, the caller's best score, how many times they took the
-- quiz and when they last did. Only videos that have a quiz.
DROP FUNCTION IF EXISTS public.get_quiz_availability();
CREATE FUNCTION public.get_quiz_availability()
RETURNS TABLE(video_id UUID, question_count INT, best_score INT, attempt_count INT, last_attempt_at TIMESTAMPTZ)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT question.video_id, COUNT(*)::INT,
         (SELECT MAX(attempt.score) FROM public.video_quiz_attempts attempt
          WHERE attempt.user_id = auth.uid() AND attempt.video_id = question.video_id)::INT,
         (SELECT COUNT(*) FROM public.video_quiz_attempts attempt
          WHERE attempt.user_id = auth.uid() AND attempt.video_id = question.video_id)::INT,
         (SELECT MAX(attempt.created_at) FROM public.video_quiz_attempts attempt
          WHERE attempt.user_id = auth.uid() AND attempt.video_id = question.video_id)
  FROM public.video_quiz_questions question
  WHERE public.can_view_course_document(question.video_id)
  GROUP BY question.video_id;
$$;
GRANT EXECUTE ON FUNCTION public.get_quiz_availability() TO authenticated;

-- Per video: total seconds actually watched by the caller, the number of distinct days
-- they watched on (Tokyo time) and the last time they watched.
DROP FUNCTION IF EXISTS public.get_my_watch_summary();
CREATE FUNCTION public.get_my_watch_summary()
RETURNS TABLE(video_id UUID, watched_seconds BIGINT, watch_days INT, last_watched_at TIMESTAMPTZ)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT event.video_id, SUM(event.watched_seconds)::BIGINT,
         COUNT(DISTINCT (event.created_at AT TIME ZONE 'Asia/Tokyo')::date)::INT,
         MAX(event.created_at)
  FROM public.video_watch_events event
  WHERE event.user_id = auth.uid()
  GROUP BY event.video_id;
$$;
GRANT EXECUTE ON FUNCTION public.get_my_watch_summary() TO authenticated;
