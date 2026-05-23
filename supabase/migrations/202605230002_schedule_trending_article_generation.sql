create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Set these database settings after replacing the placeholders:
-- alter database postgres set app.settings.edge_function_base_url = 'https://<project-ref>.functions.supabase.co';
-- alter database postgres set app.settings.cron_secret = '<same CRON_SECRET used by the Edge Function>';

do $$
begin
  if exists (select 1 from cron.job where jobname = 'generate-trending-article-daily') then
    perform cron.unschedule('generate-trending-article-daily');
  end if;
end;
$$;

select cron.schedule(
  'generate-trending-article-daily',
  '0 4 * * *',
  $$
  select net.http_post(
    url := current_setting('app.settings.edge_function_base_url', true) || '/generate-trending-article',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', current_setting('app.settings.cron_secret', true)
    ),
    body := jsonb_build_object(
      'source', 'supabase-cron',
      'scheduled_at', now()
    )
  ) as request_id;
  $$
);
