create extension if not exists pgcrypto;

create table if not exists public.trending_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  sections jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  keywords text[] not null default '{}'::text[],
  trend_topic text not null,
  trend_rank integer,
  trend_source_url text,
  trend_geo text not null default 'PK',
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz not null default now(),
  generation_date date not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trending_articles_status_published_at_idx
  on public.trending_articles (status, published_at desc);

create index if not exists trending_articles_generation_date_idx
  on public.trending_articles (generation_date desc);

create or replace function public.set_trending_articles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_trending_articles_updated_at on public.trending_articles;

create trigger set_trending_articles_updated_at
before update on public.trending_articles
for each row
execute function public.set_trending_articles_updated_at();

alter table public.trending_articles enable row level security;

drop policy if exists "Published trending articles are publicly readable" on public.trending_articles;

create policy "Published trending articles are publicly readable"
on public.trending_articles
for select
to anon, authenticated
using (status = 'published');
