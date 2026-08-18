-- 1. profiles: expose only authors of published posts
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Published authors are public" ON public.profiles
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.author_id = profiles.id
      AND p.status = 'published'
      AND p.published_at IS NOT NULL
      AND p.published_at <= now()
  ));

CREATE POLICY "Users can read their own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- 2. contact_messages: server-only writes + anonymous origin hash for flood control
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS ip_hash text;
CREATE INDEX IF NOT EXISTS contact_messages_ip_hash_created_at_idx
  ON public.contact_messages (ip_hash, created_at DESC);

DROP POLICY IF EXISTS "Anyone can send a message" ON public.contact_messages;

-- 3. Defense in depth: strip unused privileges
REVOKE INSERT, UPDATE, DELETE ON public.posts FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.categories FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.contact_messages FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.user_roles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;

GRANT SELECT ON public.posts TO anon;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.posts, public.categories, public.profiles, public.contact_messages, public.user_roles TO service_role;