create or replace function public.exec_sql(sql_text text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  execute sql_text;
  return jsonb_build_object('ok', true);
exception when others then
  return jsonb_build_object('ok', false, 'error', sqlerrm);
end;
$$;

revoke all on function public.exec_sql(text) from public, anon, authenticated;
grant execute on function public.exec_sql(text) to service_role;