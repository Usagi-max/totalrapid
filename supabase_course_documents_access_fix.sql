-- Course document access fix
--
-- Keep the authorization rule in one SECURITY DEFINER function.  The old
-- policies repeated joins to profiles/videos/user_plans directly inside RLS.
-- That made the metadata row query and the Storage query behave differently
-- for regular users, while admins continued to work through the bypass branch.

CREATE OR REPLACE FUNCTION public.can_view_course_document(p_video_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_app_admin()
    OR EXISTS (
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

DROP POLICY IF EXISTS "Video students can view released course documents" ON public.video_documents;
CREATE POLICY "Video students can view released course documents"
ON public.video_documents FOR SELECT
USING (public.can_view_course_document(video_id));

DROP POLICY IF EXISTS "Authorized students download released course documents" ON storage.objects;
CREATE POLICY "Authorized students download released course documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-documents'
  AND EXISTS (
    SELECT 1
    FROM public.video_documents AS document
    WHERE document.storage_path = name
      AND public.can_view_course_document(document.video_id)
  )
);
