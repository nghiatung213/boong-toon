-- Create storage buckets (run in Supabase SQL Editor)
insert into storage.buckets (id, name, public)
values
  ('covers', 'covers', true),
  ('chapter-images', 'chapter-images', true),
  ('chapter-content', 'chapter-content', true)
on conflict (id) do nothing;

-- Public read for covers and chapter images
create policy "covers_public_read"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "chapter_images_public_read"
  on storage.objects for select
  using (bucket_id = 'chapter-images');

create policy "chapter_content_public_read"
  on storage.objects for select
  using (bucket_id = 'chapter-content');

-- Admin uploads via service role (API routes) — no client write policy needed yet
