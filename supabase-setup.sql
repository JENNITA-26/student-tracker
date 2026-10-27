-- ============================================================
-- Student Task Manager — Supabase SQL Setup Script
-- Paste this ENTIRE script into the Supabase SQL Editor and run it.
-- ============================================================

-- 1. Create the tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL CHECK (char_length(title) > 0),
  description TEXT,
  subject     TEXT,
  due_date    DATE NOT NULL,
  priority    TEXT NOT NULL DEFAULT 'Medium'
                CHECK (priority IN ('Low', 'Medium', 'High')),
  status      TEXT NOT NULL DEFAULT 'Pending'
                CHECK (status IN ('Pending', 'Completed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Index for fast user-scoped queries
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks (user_id);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks (due_date);

-- 3. Trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.tasks;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 5. RLS policies — users can only access THEIR OWN tasks
DROP POLICY IF EXISTS "Users can read own tasks"   ON public.tasks;
DROP POLICY IF EXISTS "Users can insert own tasks"  ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks"  ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks"  ON public.tasks;

CREATE POLICY "Users can read own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Done! ✅
