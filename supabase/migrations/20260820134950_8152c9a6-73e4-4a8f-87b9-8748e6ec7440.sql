REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON public.categories, public.posts, public.profiles, public.user_roles, public.contact_messages FROM anon, authenticated;
REVOKE DELETE ON public.profiles FROM authenticated;
GRANT SELECT ON public.categories, public.posts, public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories, public.posts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;