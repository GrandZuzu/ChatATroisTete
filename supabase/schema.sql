-- =============================================================
-- Schéma Supabase pour Le Chat à 3 Têtes
--
-- À exécuter UNE FOIS depuis l'éditeur SQL de ton projet Supabase
-- (Dashboard → SQL Editor → New query → coller → Run).
-- =============================================================

create extension if not exists "uuid-ossp";

-- ---------- Articles ----------

create table if not exists public.articles (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text not null unique,
  content         text not null default '',
  excerpt         text,
  cover_image_url text,
  tags            text[] not null default '{}',
  status          text not null default 'draft' check (status in ('draft','published')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  author_id       uuid references auth.users(id) on delete set null
);

create index if not exists articles_status_idx       on public.articles (status);
create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_tags_idx         on public.articles using gin (tags);

-- updated_at automatique
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ---------- RLS ----------

alter table public.articles enable row level security;

drop policy if exists "anyone can read published" on public.articles;
create policy "anyone can read published"
  on public.articles for select
  using (status = 'published');

drop policy if exists "auth can read all" on public.articles;
create policy "auth can read all"
  on public.articles for select
  to authenticated using (true);

drop policy if exists "auth can insert" on public.articles;
create policy "auth can insert"
  on public.articles for insert
  to authenticated with check (true);

drop policy if exists "auth can update" on public.articles;
create policy "auth can update"
  on public.articles for update
  to authenticated using (true) with check (true);

drop policy if exists "auth can delete" on public.articles;
create policy "auth can delete"
  on public.articles for delete
  to authenticated using (true);

-- ---------- Storage : bucket public pour les couvertures ----------

insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

-- Lecture publique
drop policy if exists "public read article images" on storage.objects;
create policy "public read article images"
  on storage.objects for select
  using (bucket_id = 'article-images');

-- Upload réservé aux utilisateurs authentifiés
drop policy if exists "auth upload article images" on storage.objects;
create policy "auth upload article images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'article-images');

drop policy if exists "auth update article images" on storage.objects;
create policy "auth update article images"
  on storage.objects for update to authenticated
  using (bucket_id = 'article-images');

drop policy if exists "auth delete article images" on storage.objects;
create policy "auth delete article images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'article-images');
