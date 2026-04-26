-- Bucket público para avatares
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Leitura pública
create policy "Avatares são públicos para leitura"
on storage.objects for select
using (bucket_id = 'avatars');

-- Usuário envia o próprio avatar (pasta = uid)
create policy "Usuário envia o próprio avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuário atualiza o próprio avatar
create policy "Usuário atualiza o próprio avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuário remove o próprio avatar
create policy "Usuário remove o próprio avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);