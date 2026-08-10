-- Convert the legacy daily auto-publisher into an evidence-backed editorial queue.
-- Existing machine-published rows are archived because they have no documented review.

alter table public.trending_articles
  alter column status set default 'draft',
  alter column published_at drop not null,
  alter column published_at drop default;

alter table public.trending_articles
  drop constraint if exists trending_articles_status_check;

alter table public.trending_articles
  add constraint trending_articles_status_check
  check (status in ('draft', 'in_review', 'published', 'archived'));

alter table public.trending_articles
  add column if not exists content_cluster text,
  add column if not exists search_intent text,
  add column if not exists primary_query text,
  add column if not exists intent_key text,
  add column if not exists canonical_parent text,
  add column if not exists editorial_summary text,
  add column if not exists citations jsonb not null default '[]'::jsonb,
  add column if not exists local_evidence jsonb not null default '[]'::jsonb,
  add column if not exists editorial_notes text,
  add column if not exists reviewed_by text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists last_verified_at timestamptz,
  add column if not exists next_review_at date,
  add column if not exists review_version integer not null default 0;

alter table public.trending_articles
  drop constraint if exists trending_articles_generation_date_key;

create index if not exists trending_articles_generation_date_idx
  on public.trending_articles (generation_date desc);

create unique index if not exists trending_articles_intent_key_uidx
  on public.trending_articles (intent_key)
  where intent_key is not null;

create index if not exists trending_articles_next_review_idx
  on public.trending_articles (next_review_at)
  where status = 'published';

create or replace function public.invalidate_trending_review_after_material_edit()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.status = 'published'
    and new.status = 'published'
    and (
      new.title is distinct from old.title
      or new.excerpt is distinct from old.excerpt
      or new.sections is distinct from old.sections
      or new.faqs is distinct from old.faqs
      or new.keywords is distinct from old.keywords
      or new.trend_topic is distinct from old.trend_topic
      or new.content_cluster is distinct from old.content_cluster
      or new.search_intent is distinct from old.search_intent
      or new.primary_query is distinct from old.primary_query
      or new.intent_key is distinct from old.intent_key
      or new.canonical_parent is distinct from old.canonical_parent
      or new.editorial_summary is distinct from old.editorial_summary
      or new.citations is distinct from old.citations
      or new.local_evidence is distinct from old.local_evidence
    ) then
    new.status := 'in_review';
    new.reviewed_by := null;
    new.reviewed_at := null;
    new.last_verified_at := null;
    new.next_review_at := null;
    new.editorial_notes := concat_ws(
      E'\n',
      nullif(new.editorial_notes, ''),
      'Approval invalidated automatically after a material content or evidence change.'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists invalidate_trending_review_after_material_edit
  on public.trending_articles;

create trigger invalidate_trending_review_after_material_edit
before update on public.trending_articles
for each row
execute function public.invalidate_trending_review_after_material_edit();

revoke all on function public.invalidate_trending_review_after_material_edit() from public;

update public.trending_articles
set
  status = 'archived',
  editorial_notes = concat_ws(
    E'\n',
    nullif(editorial_notes, ''),
    'Archived during the 2026-08 editorial migration: no named reviewer, source citations, or local evidence was recorded.'
  )
where status = 'published'
  and (reviewed_at is null or reviewed_by is null);

alter table public.trending_articles
  drop constraint if exists trending_articles_published_review_check;

alter table public.trending_articles
  add constraint trending_articles_published_review_check
  check (
    status <> 'published'
    or (
      published_at is not null
      and reviewed_at is not null
      and last_verified_at is not null
      and next_review_at is not null
      and nullif(btrim(reviewed_by), '') is not null
      and nullif(btrim(editorial_notes), '') is not null
      and nullif(btrim(intent_key), '') is not null
      and nullif(btrim(primary_query), '') is not null
      and nullif(btrim(content_cluster), '') is not null
      and nullif(btrim(search_intent), '') is not null
      and nullif(btrim(canonical_parent), '') is not null
      and case when jsonb_typeof(citations) = 'array' then jsonb_array_length(citations) >= 1 else false end
      and case when jsonb_typeof(local_evidence) = 'array' then jsonb_array_length(local_evidence) >= 1 else false end
      and case when jsonb_typeof(sections) = 'array' then jsonb_array_length(sections) >= 4 else false end
    )
  );

create or replace function public.approve_trending_article(
  p_article_id uuid,
  p_reviewed_by text,
  p_editorial_notes text,
  p_next_review_at date default (current_date + 30)
)
returns public.trending_articles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_article public.trending_articles%rowtype;
  v_section_word_count integer;
begin
  select *
  into v_article
  from public.trending_articles
  where id = p_article_id
  for update;

  if not found then
    raise exception 'Trending draft % was not found.', p_article_id;
  end if;

  if v_article.status not in ('draft', 'in_review', 'published') then
    raise exception 'Only a draft, in-review, or previously published canonical article can be approved.';
  end if;

  if length(btrim(coalesce(p_reviewed_by, ''))) < 3 then
    raise exception 'A named human reviewer is required.';
  end if;

  if length(btrim(coalesce(p_editorial_notes, ''))) < 40 then
    raise exception 'Editorial notes must document the factual, safety, intent, and overlap review (minimum 40 characters).';
  end if;

  if p_next_review_at is null or p_next_review_at < current_date then
    raise exception 'A next review date of today or later is required.';
  end if;

  if length(btrim(coalesce(v_article.title, ''))) < 35
    or length(btrim(coalesce(v_article.title, ''))) > 75
    or length(btrim(coalesce(v_article.excerpt, ''))) < 100
    or length(btrim(coalesce(v_article.excerpt, ''))) > 240
    or length(btrim(coalesce(v_article.editorial_summary, ''))) < 80 then
    raise exception 'Title, excerpt, and editorial summary do not meet the editorial completeness gate.';
  end if;

  if nullif(btrim(coalesce(v_article.intent_key, '')), '') is null
    or nullif(btrim(coalesce(v_article.primary_query, '')), '') is null
    or nullif(btrim(coalesce(v_article.content_cluster, '')), '') is null
    or nullif(btrim(coalesce(v_article.search_intent, '')), '') is null
    or coalesce(v_article.canonical_parent, '') !~ '^/' then
    raise exception 'SEO intent, cluster, query, and canonical-parent fields must be completed.';
  end if;

  if jsonb_typeof(v_article.sections) is distinct from 'array' then
    raise exception 'Article sections must be a JSON array.';
  end if;

  if jsonb_array_length(v_article.sections) < 4
    or exists (
      select 1
      from jsonb_array_elements(v_article.sections) as section(value)
      where length(btrim(coalesce(section.value ->> 'heading', ''))) < 8
        or length(btrim(coalesce(section.value ->> 'body', ''))) < 300
    ) then
    raise exception 'At least four substantive sections with headings are required.';
  end if;

  select coalesce(
    sum(cardinality(regexp_split_to_array(btrim(coalesce(section.value ->> 'body', '')), '[[:space:]]+'))),
    0
  )
  into v_section_word_count
  from jsonb_array_elements(v_article.sections) as section(value);

  if v_section_word_count < 600 then
    raise exception 'Article sections are too thin (% words; minimum 600).', v_section_word_count;
  end if;

  if jsonb_typeof(v_article.citations) is distinct from 'array' then
    raise exception 'Citations must be a JSON array.';
  end if;

  if jsonb_array_length(v_article.citations) < 1
    or exists (
      select 1
      from jsonb_array_elements(v_article.citations) as source(value)
      where coalesce(source.value ->> 'url', '') !~ '^https://'
        or length(btrim(coalesce(source.value ->> 'title', ''))) < 4
        or length(btrim(coalesce(source.value ->> 'publisher', ''))) < 2
        or coalesce(source.value ->> 'accessed_at', '') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
    ) then
    raise exception 'At least one complete HTTPS citation with publisher and access date is required.';
  end if;

  if jsonb_typeof(v_article.local_evidence) is distinct from 'array' then
    raise exception 'Local evidence must be a JSON array.';
  end if;

  if jsonb_array_length(v_article.local_evidence) < 1
    or exists (
      select 1
      from jsonb_array_elements(v_article.local_evidence) as evidence(value)
      where length(btrim(coalesce(evidence.value ->> 'description', ''))) < 30
        or length(btrim(coalesce(evidence.value ->> 'location', ''))) < 2
        or length(btrim(coalesce(evidence.value ->> 'verified_by', ''))) < 3
        or coalesce(evidence.value ->> 'observed_at', '') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        or coalesce(evidence.value ->> 'type', '') not in ('field-check', 'guide-note', 'operator-record', 'traveler-question')
    ) then
    raise exception 'At least one complete, named, dated local evidence record is required.';
  end if;

  if not exists (
    select 1
    from jsonb_array_elements(v_article.local_evidence) as evidence(value)
    where coalesce(evidence.value ->> 'type', '') in ('field-check', 'guide-note', 'operator-record')
  ) then
    raise exception 'A traveler question can document demand, but publication also requires a field check, guide note, or operator record.';
  end if;

  if exists (
    select 1
    from public.trending_articles other
    where other.id <> v_article.id
      and other.status = 'published'
      and other.intent_key = v_article.intent_key
  ) then
    raise exception 'Another published article already owns intent key %.', v_article.intent_key;
  end if;

  update public.trending_articles
  set
    status = 'published',
    reviewed_by = btrim(p_reviewed_by),
    editorial_notes = btrim(p_editorial_notes),
    reviewed_at = now(),
    last_verified_at = now(),
    next_review_at = p_next_review_at,
    published_at = coalesce(published_at, now()),
    review_version = review_version + 1
  where id = p_article_id
  returning * into v_article;

  return v_article;
end;
$$;

revoke all on function public.approve_trending_article(uuid, text, text, date) from public;
revoke all on function public.approve_trending_article(uuid, text, text, date) from anon;
revoke all on function public.approve_trending_article(uuid, text, text, date) from authenticated;
grant execute on function public.approve_trending_article(uuid, text, text, date) to service_role;

comment on function public.approve_trending_article(uuid, text, text, date) is
  'Human editorial gate for SEO travel updates. Validates intent ownership, substantive copy, HTTPS citations, and dated local evidence before publication.';

comment on function public.invalidate_trending_review_after_material_edit() is
  'Returns a published article to in_review and clears its approval stamp whenever substantive copy, SEO intent, citations, or local evidence changes.';

comment on column public.trending_articles.intent_key is
  'Stable unique search intent. Refresh the existing canonical row rather than creating date-stamped duplicates.';

comment on column public.trending_articles.citations is
  'Editor-supplied published sources; the generator is not allowed to invent these.';

comment on column public.trending_articles.local_evidence is
  'Named, dated observations or operator records supplied and verified by the editorial team.';
