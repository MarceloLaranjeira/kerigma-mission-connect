
-- 1) Restrict profiles SELECT
DROP POLICY IF EXISTS "Profiles selecionáveis por autenticados" ON public.profiles;

CREATE POLICY "Usuário lê o próprio perfil"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins e coordenadores leem todos os perfis"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'coordenador'));

-- 2) Restrict user_roles SELECT
DROP POLICY IF EXISTS "Roles visíveis para autenticados" ON public.user_roles;

CREATE POLICY "Usuário lê seus próprios papéis"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins leem todos os papéis"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3) Make avatars bucket private (we will use signed URLs)
UPDATE storage.buckets SET public = false WHERE id = 'avatars';

-- Drop any existing broad SELECT on avatar objects to prevent listing
DROP POLICY IF EXISTS "Avatars publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Allow authenticated users to read avatar files (no anonymous listing)
CREATE POLICY "Autenticados leem avatares"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');
