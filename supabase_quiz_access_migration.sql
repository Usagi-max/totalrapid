-- Run once in the Supabase SQL Editor for existing environments.
-- The UI already prevents opening an unreleased lecture. Do not repeat the
-- release-date check here: doing so can hide a quiz from eligible students.

CREATE OR REPLACE FUNCTION public.get_video_quiz(p_video_id UUID)
RETURNS TABLE(id UUID, question_text TEXT, options JSONB, order_index INT)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT question.id, question.question_text, question.options, question.order_index
  FROM public.video_quiz_questions question
  WHERE question.video_id = p_video_id
    AND (
      public.is_app_admin()
      OR EXISTS (
        SELECT 1 FROM public.user_plans plan
        WHERE plan.user_id = auth.uid()
          AND plan.plan_type = 'video'
          AND plan.status = 'active'
      )
    )
  ORDER BY question.order_index, question.created_at;
$$;

CREATE OR REPLACE FUNCTION public.submit_video_quiz_with_results(
  p_video_id UUID,
  p_answers JSONB
)
RETURNS TABLE(score INT, total_questions INT, best_score INT, correct_answers JSONB)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE calculated_score INT; calculated_total INT; calculated_best INT; answers JSONB;
BEGIN
  IF NOT public.is_app_admin() AND NOT EXISTS (
    SELECT 1 FROM public.user_plans
    WHERE user_id = auth.uid() AND plan_type = 'video' AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT COUNT(*), COUNT(*) FILTER (
    WHERE (p_answers ->> question.id::text) ~ '^[1-4]$'
      AND (p_answers ->> question.id::text)::INT = question.correct_option
  ), COALESCE(jsonb_object_agg(question.id::text, question.correct_option), '{}'::jsonb)
  INTO calculated_total, calculated_score, answers
  FROM public.video_quiz_questions question
  WHERE question.video_id = p_video_id;

  IF calculated_total = 0 THEN RAISE EXCEPTION 'Quiz not configured'; END IF;

  INSERT INTO public.video_quiz_attempts(user_id, video_id, score, total_questions)
  VALUES (auth.uid(), p_video_id, calculated_score, calculated_total);
  SELECT MAX(attempt.score) INTO calculated_best
  FROM public.video_quiz_attempts attempt
  WHERE attempt.user_id = auth.uid() AND attempt.video_id = p_video_id;
  RETURN QUERY SELECT calculated_score, calculated_total, calculated_best, answers;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_video_quiz(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_video_quiz_with_results(UUID, JSONB) TO authenticated;
