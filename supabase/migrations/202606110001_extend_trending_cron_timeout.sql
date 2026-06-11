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
    ),
    timeout_milliseconds := 120000
  ) as request_id;
  $$
);
