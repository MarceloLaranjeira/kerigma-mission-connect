
-- Audit log table for access events / RLS denials
CREATE TABLE IF NOT EXISTS public.access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text,
  event text NOT NULL, -- e.g. 'rls_denied', 'login', 'role_change', 'profile_update'
  resource text,        -- e.g. 'profiles', 'user_roles'
  action text,          -- e.g. 'select', 'update', 'delete'
  role_at_event text,
  details jsonb,
  ip text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_access_logs_user ON public.access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_created ON public.access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_event ON public.access_logs(event);

-- Only admins can read logs
CREATE POLICY "Admins leem access_logs"
ON public.access_logs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Authenticated users can insert their own events (or anonymous denial events with null user_id)
CREATE POLICY "Usuários gravam seus próprios logs"
ON public.access_logs FOR INSERT TO authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- No update/delete policies => locked down. Admin can delete via service role if needed.
