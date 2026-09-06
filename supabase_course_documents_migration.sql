-- Per-lecture PDF materials. Run this entire file in Supabase SQL Editor.
-- The bucket remains private; students can only access released lectures
-- while their video plan is active.

CREATE OR REPLACE FUNCTION public.is_app_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

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

ALTER TABLE public.video_documents ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_documents TO authenticated;

DROP POLICY IF EXISTS "Video students can view released course documents" ON public.video_documents;
CREATE POLICY "Video students can view released course documents"
ON public.video_documents FOR SELECT USING (
  public.can_view_course_document(video_id)
);

DROP POLICY IF EXISTS "Admins manage course documents" ON public.video_documents;
CREATE POLICY "Admins manage course documents"
ON public.video_documents FOR ALL
USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

DROP POLICY IF EXISTS "Authorized students download released course documents" ON storage.objects;
CREATE POLICY "Authorized students download released course documents"
ON storage.objects FOR SELECT USING (
  bucket_id = 'course-documents' AND EXISTS (
    SELECT 1 FROM public.video_documents AS document
    WHERE document.storage_path = name
      AND public.can_view_course_document(document.video_id)
  )
);

DROP POLICY IF EXISTS "Admins upload course documents" ON storage.objects;
CREATE POLICY "Admins upload course documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-documents' AND public.is_app_admin());

DROP POLICY IF EXISTS "Admins delete course documents" ON storage.objects;
CREATE POLICY "Admins delete course documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-documents' AND public.is_app_admin());
