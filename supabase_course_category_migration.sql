-- Run once in the Supabase SQL Editor for an existing project.
-- This updates the default used when a course category is not specified.
ALTER TABLE public.videos
  ALTER COLUMN category SET DEFAULT '演習';
