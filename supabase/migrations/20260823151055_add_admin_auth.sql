create table public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admins (email)
values ('kiyoya.takahashi1106@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admins enable row level security;

create policy "Admins can view administrators" on public.admins
for select to authenticated using (public.is_admin());

create policy "Admins can add administrators" on public.admins
for insert to authenticated with check (public.is_admin());

create policy "Admins can remove other administrators" on public.admins
for delete to authenticated using (
  public.is_admin() and lower(email) <> lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy "Admins can manage profile" on public.profile
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage news" on public.news
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage education work" on public.education_work
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage research" on public.research
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage projects" on public.projects
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage qualifications" on public.qualifications
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage portfolio assets" on storage.objects
for all to authenticated using (
  bucket_id = 'portfolio-assets' and public.is_admin()
) with check (
  bucket_id = 'portfolio-assets' and public.is_admin()
);
