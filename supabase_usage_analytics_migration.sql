-- Usage analytics for RAPID+. Run this entire file in Supabase SQL Editor.
-- Data is collected only for authenticated users and is readable by admins.

CREATE OR REPLACE FUNCTION public.is_app_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

CREATE TABLE IF NOT EXISTS public.user_activity_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.video_watch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  watched_seconds INTEGER NOT NULL CHECK (watched_seconds > 0 AND watched_seconds <= 120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_activity_sessions_user_started_idx ON public.user_activity_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS video_watch_events_user_video_idx ON public.video_watch_events(user_id, video_id);

ALTER TABLE public.user_activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_watch_events ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.user_activity_sessions TO authenticated;
GRANT SELECT, INSERT ON public.video_watch_events TO authenticated;

DROP POLICY IF EXISTS "Users manage own activity sessions" ON public.user_activity_sessions;
CREATE POLICY "Users manage own activity sessions" ON public.user_activity_sessions
FOR ALL USING (auth.uid() = user_id OR public.is_app_admin())
WITH CHECK (auth.uid() = user_id OR public.is_app_admin());

DROP POLICY IF EXISTS "Admins view activity sessions" ON public.user_activity_sessions;
CREATE POLICY "Admins view activity sessions" ON public.user_activity_sessions
FOR SELECT USING (public.is_app_admin());

DROP POLICY IF EXISTS "Users add own video watch events" ON public.video_watch_events;
CREATE POLICY "Users add own video watch events" ON public.video_watch_events
FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_app_admin());

DROP POLICY IF EXISTS "Users view own video watch events" ON public.video_watch_events;
CREATE POLICY "Users view own video watch events" ON public.video_watch_events
FOR SELECT USING (auth.uid() = user_id OR public.is_app_admin());

DROP POLICY IF EXISTS "Admins view video progress" ON public.video_progress;
CREATE POLICY "Admins view video progress" ON public.video_progress
FOR SELECT USING (public.is_app_admin());
