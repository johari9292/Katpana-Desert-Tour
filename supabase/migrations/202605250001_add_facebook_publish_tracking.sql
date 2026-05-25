alter table public.trending_articles
  add column if not exists facebook_posted_at timestamptz,
  add column if not exists facebook_webhook_status text,
  add column if not exists facebook_webhook_response jsonb,
  add column if not exists facebook_webhook_error text;

create index if not exists trending_articles_facebook_posted_at_idx
  on public.trending_articles (facebook_posted_at desc);
