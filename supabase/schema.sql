create type public.news_category as enum ('Internship', 'Job Hunting', 'Research');
create type public.education_work_type as enum ('Education', 'Work');

create table public.profile (
  id text primary key default 'main',
  name text not null,
  english_name text not null,
  role text not null,
  email text not null,
  university_name text not null,
  department_name text not null,
  department_url text not null,
  lab_name text not null,
  lab_url text not null,
  profile_image_path text not null,
  hero_image_path text not null,
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint profile_singleton check (id = 'main')
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  category public.news_category not null,
  date_label text,
  title text not null,
  description text not null,
  link_url text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.education_work (
  id uuid primary key default gen_random_uuid(),
  type public.education_work_type not null,
  short_work boolean not null default false,
  date_label text not null,
  title text not null,
  subtitle text not null,
  logo_path text not null,
  material_url text,
  tags text[] not null default '{}',
  is_current boolean not null default false,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.research (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_path text not null,
  tags text[] not null default '{}',
  link_url text,
  is_current boolean not null default false,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech text[] not null default '{}',
  image_path text not null,
  link_url text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.qualifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  label text not null,
  date_label text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profile_updated_at
before update on public.profile
for each row execute function public.set_updated_at();

create trigger set_news_updated_at
before update on public.news
for each row execute function public.set_updated_at();

create trigger set_education_work_updated_at
before update on public.education_work
for each row execute function public.set_updated_at();

create trigger set_research_updated_at
before update on public.research
for each row execute function public.set_updated_at();

create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger set_qualifications_updated_at
before update on public.qualifications
for each row execute function public.set_updated_at();

alter table public.profile enable row level security;
alter table public.news enable row level security;
alter table public.education_work enable row level security;
alter table public.research enable row level security;
alter table public.projects enable row level security;
alter table public.qualifications enable row level security;

create policy "Public read profile" on public.profile for select to anon using (true);
create policy "Authenticated read profile" on public.profile for select to authenticated using (true);
create policy "Public read published news" on public.news for select to anon using (is_published = true);
create policy "Public read published education_work" on public.education_work for select to anon using (is_published = true);
create policy "Public read published research" on public.research for select to anon using (is_published = true);
create policy "Public read published projects" on public.projects for select to anon using (is_published = true);
create policy "Public read published qualifications" on public.qualifications for select to anon using (is_published = true);

create index news_published_order_idx on public.news (is_published, display_order);
create index education_work_published_order_idx on public.education_work (is_published, display_order);
create index research_published_order_idx on public.research (is_published, display_order);
create index projects_published_order_idx on public.projects (is_published, display_order);
create index qualifications_published_order_idx on public.qualifications (is_published, display_order);

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = excluded.public;

update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'portfolio-assets';

create table public.admins (
  email text primary key,
  created_at timestamptz not null default now(),
  constraint admins_email_lowercase check (email = lower(email))
);

insert into public.admins (email)
values ('kiyoya.takahashi1106@gmail.com')
on conflict (email) do nothing;

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
  );
$$;

revoke execute on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.admins enable row level security;

create policy "Admins can view administrators" on public.admins for select to authenticated using (private.is_admin());
create policy "Admins can add administrators" on public.admins for insert to authenticated with check (private.is_admin() and email = lower(email));
create policy "Admins can remove other administrators" on public.admins for delete to authenticated using (private.is_admin() and lower(email) <> lower(coalesce((select auth.jwt()) ->> 'email', '')));

create policy "Admins can update profile" on public.profile for update to authenticated using (private.is_admin()) with check (private.is_admin());

create policy "Authenticated read news" on public.news for select to authenticated using (is_published = true or private.is_admin());
create policy "Admins can insert news" on public.news for insert to authenticated with check (private.is_admin());
create policy "Admins can update news" on public.news for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins can delete news" on public.news for delete to authenticated using (private.is_admin());

create policy "Authenticated read education_work" on public.education_work for select to authenticated using (is_published = true or private.is_admin());
create policy "Admins can insert education_work" on public.education_work for insert to authenticated with check (private.is_admin());
create policy "Admins can update education_work" on public.education_work for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins can delete education_work" on public.education_work for delete to authenticated using (private.is_admin());

create policy "Authenticated read research" on public.research for select to authenticated using (is_published = true or private.is_admin());
create policy "Admins can insert research" on public.research for insert to authenticated with check (private.is_admin());
create policy "Admins can update research" on public.research for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins can delete research" on public.research for delete to authenticated using (private.is_admin());

create policy "Authenticated read projects" on public.projects for select to authenticated using (is_published = true or private.is_admin());
create policy "Admins can insert projects" on public.projects for insert to authenticated with check (private.is_admin());
create policy "Admins can update projects" on public.projects for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins can delete projects" on public.projects for delete to authenticated using (private.is_admin());

create policy "Authenticated read qualifications" on public.qualifications for select to authenticated using (is_published = true or private.is_admin());
create policy "Admins can insert qualifications" on public.qualifications for insert to authenticated with check (private.is_admin());
create policy "Admins can update qualifications" on public.qualifications for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins can delete qualifications" on public.qualifications for delete to authenticated using (private.is_admin());

create policy "Public read portfolio assets" on storage.objects for select to anon using (bucket_id = 'portfolio-assets');
create policy "Authenticated read portfolio assets" on storage.objects for select to authenticated using (bucket_id = 'portfolio-assets');
create policy "Admins can insert portfolio assets" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets' and private.is_admin());
create policy "Admins can update portfolio assets" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets' and private.is_admin()) with check (bucket_id = 'portfolio-assets' and private.is_admin());
create policy "Admins can delete portfolio assets" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets' and private.is_admin());
