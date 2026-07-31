-- Public article images, with write access restricted to administrators.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Blog images readable by authenticated" ON storage.objects;
DROP POLICY IF EXISTS "Blog images are public" ON storage.objects;

CREATE POLICY "Blog images are public" ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Prevent more than one featured published article.
CREATE OR REPLACE FUNCTION public.keep_single_featured_post()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.is_featured = true AND NEW.status = 'published' THEN
    UPDATE public.posts
    SET is_featured = false
    WHERE id <> NEW.id
      AND is_featured = true
      AND status = 'published';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.keep_single_featured_post() FROM PUBLIC;

DROP TRIGGER IF EXISTS posts_single_featured ON public.posts;
CREATE TRIGGER posts_single_featured
BEFORE INSERT OR UPDATE OF is_featured, status ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.keep_single_featured_post();

-- Normalize any pre-existing duplicates before enforcing the invariant at the
-- database level. The trigger keeps the editorial workflow convenient, while
-- the partial unique index also protects against concurrent writes.
WITH featured_posts AS (
  SELECT
    id,
    row_number() OVER (
      ORDER BY published_at DESC NULLS LAST, updated_at DESC, id
    ) AS position
  FROM public.posts
  WHERE is_featured = true AND status = 'published'
)
UPDATE public.posts
SET is_featured = false
WHERE id IN (
  SELECT id
  FROM featured_posts
  WHERE position > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS posts_single_featured_published_idx
ON public.posts ((1))
WHERE is_featured = true AND status = 'published';
