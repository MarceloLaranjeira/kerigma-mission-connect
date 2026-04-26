-- Remove leftover public-readable policy on avatar objects (bucket is private; signed URLs only).
DROP POLICY IF EXISTS "Avatares são públicos para leitura" ON storage.objects;
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;