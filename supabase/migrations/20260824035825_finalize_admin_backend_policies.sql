create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
  );
$$;

revoke execute on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'admins_email_lowercase'
      and conrelid = 'public.admins'::regclass
  ) then
    alter table public.admins
      add constraint admins_email_lowercase check (email = lower(email));
  end if;
end $$;

drop policy if exists "Public read profile" on public.profile;
drop policy if exists "Public read published news" on public.news;
drop policy if exists "Public read published education_work" on public.education_work;
drop policy if exists "Public read published research" on public.research;
drop policy if exists "Public read published projects" on public.projects;
drop policy if exists "Public read published qualifications" on public.qualifications;

drop policy if exists "Admins can manage profile" on public.profile;
drop policy if exists "Admins can manage news" on public.news;
drop policy if exists "Admins can manage education work" on public.education_work;
drop policy if exists "Admins can manage research" on public.research;
drop policy if exists "Admins can manage projects" on public.projects;
drop policy if exists "Admins can manage qualifications" on public.qualifications;

create policy "Public read profile" on public.profile
for select to anon using (true);

create policy "Authenticated read profile" on public.profile
for select to authenticated using (true);

create policy "Admins can update profile" on public.profile
for update to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Public read published news" on public.news
for select to anon using (is_published = true);

create policy "Authenticated read news" on public.news
for select to authenticated using (is_published = true or private.is_admin());

create policy "Admins can insert news" on public.news
for insert to authenticated with check (private.is_admin());

create policy "Admins can update news" on public.news
for update to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Admins can delete news" on public.news
for delete to authenticated using (private.is_admin());

create policy "Public read published education_work" on public.education_work
for select to anon using (is_published = true);

create policy "Authenticated read education_work" on public.education_work
for select to authenticated using (is_published = true or private.is_admin());

create policy "Admins can insert education_work" on public.education_work
for insert to authenticated with check (private.is_admin());

create policy "Admins can update education_work" on public.education_work
for update to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Admins can delete education_work" on public.education_work
for delete to authenticated using (private.is_admin());

create policy "Public read published research" on public.research
for select to anon using (is_published = true);

create policy "Authenticated read research" on public.research
for select to authenticated using (is_published = true or private.is_admin());

create policy "Admins can insert research" on public.research
for insert to authenticated with check (private.is_admin());

create policy "Admins can update research" on public.research
for update to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Admins can delete research" on public.research
for delete to authenticated using (private.is_admin());

create policy "Public read published projects" on public.projects
for select to anon using (is_published = true);

create policy "Authenticated read projects" on public.projects
for select to authenticated using (is_published = true or private.is_admin());

create policy "Admins can insert projects" on public.projects
for insert to authenticated with check (private.is_admin());

create policy "Admins can update projects" on public.projects
for update to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Admins can delete projects" on public.projects
for delete to authenticated using (private.is_admin());

create policy "Public read published qualifications" on public.qualifications
for select to anon using (is_published = true);

create policy "Authenticated read qualifications" on public.qualifications
for select to authenticated using (is_published = true or private.is_admin());

create policy "Admins can insert qualifications" on public.qualifications
for insert to authenticated with check (private.is_admin());

create policy "Admins can update qualifications" on public.qualifications
for update to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Admins can delete qualifications" on public.qualifications
for delete to authenticated using (private.is_admin());

drop policy if exists "Admins can view administrators" on public.admins;
drop policy if exists "Admins can add administrators" on public.admins;
drop policy if exists "Admins can remove other administrators" on public.admins;

create policy "Admins can view administrators" on public.admins
for select to authenticated using (private.is_admin());

create policy "Admins can add administrators" on public.admins
for insert to authenticated
with check (private.is_admin() and email = lower(email));

create policy "Admins can remove other administrators" on public.admins
for delete to authenticated
using (
  private.is_admin()
  and lower(email) <> lower(coalesce((select auth.jwt()) ->> 'email', ''))
);

drop policy if exists "Public read portfolio assets" on storage.objects;
drop policy if exists "Admins can manage portfolio assets" on storage.objects;

create policy "Public read portfolio assets" on storage.objects
for select to anon
using (bucket_id = 'portfolio-assets');

create policy "Authenticated read portfolio assets" on storage.objects
for select to authenticated
using (bucket_id = 'portfolio-assets');

create policy "Admins can insert portfolio assets" on storage.objects
for insert to authenticated
with check (bucket_id = 'portfolio-assets' and private.is_admin());

create policy "Admins can update portfolio assets" on storage.objects
for update to authenticated
using (bucket_id = 'portfolio-assets' and private.is_admin())
with check (bucket_id = 'portfolio-assets' and private.is_admin());

create policy "Admins can delete portfolio assets" on storage.objects
for delete to authenticated
using (bucket_id = 'portfolio-assets' and private.is_admin());
