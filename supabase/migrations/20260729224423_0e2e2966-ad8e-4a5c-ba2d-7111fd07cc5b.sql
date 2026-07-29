CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TYPE public.post_status AS ENUM ('draft', 'published');

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  cover_image_alt TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  series TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  published_at TIMESTAMPTZ,
  updated_content_at TIMESTAMPTZ,
  status public.post_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  reading_minutes INTEGER,
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  youtube_url TEXT,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  has_affiliate_links BOOLEAN NOT NULL DEFAULT false,
  related_post_ids UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX posts_status_published_at_idx ON public.posts (status, published_at DESC);
CREATE INDEX posts_category_idx ON public.posts (category_id);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are public" ON public.posts FOR SELECT
  USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now());
CREATE POLICY "Admins read all posts" ON public.posts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert posts" ON public.posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update posts" ON public.posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete posts" ON public.posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 2 AND 100
    AND char_length(email) BETWEEN 5 AND 255
    AND char_length(subject) BETWEEN 2 AND 150
    AND char_length(message) BETWEEN 10 AND 3000
  );
CREATE POLICY "Admins read messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update messages" ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete messages" ON public.contact_messages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Casa Prática', 'casa-pratica', 'Organização, manutenção e pequenas soluções que facilitam o dia a dia em casa.', 1),
  ('Tecnologia em Casa', 'tecnologia-em-casa', 'Wi-Fi, redes, aparelhos conectados e tudo o que faz a casa funcionar melhor.', 2),
  ('Vida Digital', 'vida-digital', 'Contas, privacidade, apps e hábitos digitais mais simples e seguros.', 3);

INSERT INTO public.posts (title, slug, excerpt, content, category_id, series, status, is_featured, seo_title, seo_description, has_affiliate_links)
SELECT
  'Wi-Fi fraco em casa? 8 formas de melhorar o sinal antes de gastar',
  'wifi-fraco-como-melhorar-o-sinal',
  'Um roteiro de verificações simples para tentar melhorar o sinal da sua rede antes de comprar qualquer equipamento novo.',
  E'> Rascunho editorial. Conteudo ainda nao revisado e nao publicado.\n\n## Estrutura planeada\n\n1. O que costuma causar sinal fraco\n2. Verificacoes rapidas antes de gastar\n3. Ajustes de posicionamento do roteador\n4. Ajustes de configuracao (canal, banda, firmware)\n5. Quando o problema e do plano de internet\n6. Quando faz sentido comprar equipamento\n\n## Notas para redacao\n\n- Confirmar cada recomendacao em fonte tecnica antes de publicar.\n- Nao incluir testes, medicoes ou resultados que nao tenham sido realizados.\n- Adicionar fontes na aba de fontes do painel.',
  c.id, 'Resolva sem complicação', 'draft', true,
  'Wi-Fi fraco em casa? 8 formas de melhorar o sinal',
  'Passos práticos para tentar melhorar o sinal do Wi-Fi em casa antes de comprar um novo equipamento.',
  false
FROM public.categories c WHERE c.slug = 'tecnologia-em-casa';

INSERT INTO public.posts (title, slug, excerpt, content, category_id, series, status, seo_title, seo_description, has_affiliate_links)
SELECT
  'Repetidor, roteador ou Mesh: qual resolve melhor cada problema?',
  'repetidor-roteador-ou-mesh',
  'As diferenças entre repetidor, roteador novo e sistema Mesh, e em que situação cada um costuma fazer mais sentido.',
  E'> Rascunho editorial. Conteudo ainda nao revisado e nao publicado.\n\n## Estrutura planeada\n\n1. O que cada equipamento faz\n2. Diferencas de funcionamento\n3. Cenarios tipicos de casa\n4. Custos e limitacoes\n5. Como decidir\n\n## Notas para redacao\n\n- Explicar diferencas sem recomendar marcas ou modelos especificos nesta versao.\n- Nao inventar comparativos de desempenho.',
  c.id, 'Escolha melhor', 'draft',
  'Repetidor, roteador ou Mesh: qual escolher?',
  'Entenda as diferenças entre repetidor, roteador e Mesh e em que situações cada opção costuma fazer sentido.',
  false
FROM public.categories c WHERE c.slug = 'tecnologia-em-casa';

INSERT INTO public.posts (title, slug, excerpt, content, category_id, series, status, seo_title, seo_description, has_affiliate_links)
SELECT
  'Onde colocar o roteador: melhores e piores lugares da casa',
  'onde-colocar-o-roteador',
  'Como a posição do roteador influencia o alcance do sinal e quais lugares costumam atrapalhar a cobertura.',
  E'> Rascunho editorial. Conteudo ainda nao revisado e nao publicado.\n\n## Estrutura planeada\n\n1. Por que a posicao importa\n2. Bons lugares\n3. Lugares a evitar\n4. Obstaculos comuns\n5. Como testar mudancas de posicao\n\n## Notas para redacao\n\n- Manter explicacoes simples e verificaveis.\n- Nao apresentar medicoes que nao foram feitas.',
  c.id, 'Entenda em segundos', 'draft',
  'Onde colocar o roteador em casa',
  'Os melhores e piores lugares para instalar o roteador e como a posição afeta o alcance do Wi-Fi.',
  false
FROM public.categories c WHERE c.slug = 'tecnologia-em-casa';