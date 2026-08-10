create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Remove the legacy daily auto-publication job.
do $$
declare
  v_job_id bigint;
begin
  for v_job_id in
    select jobid
    from cron.job
    where jobname in ('generate-trending-article-daily', 'generate-trending-seo-draft-weekly')
  loop
    perform cron.unschedule(v_job_id);
  end loop;
end;
$$;

-- Generate at most one bounded SEO draft each Monday. The Edge Function always
-- writes status=draft; it cannot publish or post the article to social channels.
select cron.schedule(
  'generate-trending-seo-draft-weekly',
  '0 4 * * 1',
  $$
  select net.http_post(
    url := current_setting('app.settings.edge_function_base_url', true) || '/generate-trending-article',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', current_setting('app.settings.cron_secret', true)
    ),
    body := jsonb_build_object(
      'source', 'supabase-cron',
      'workflow', 'seo-editorial-draft',
      'scheduled_at', now()
    ),
    timeout_milliseconds := 120000
  ) as request_id;
  $$
);
