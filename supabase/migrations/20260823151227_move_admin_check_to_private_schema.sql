create schema if not exists private;

alter function public.is_admin() set schema private;

revoke execute on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

alter policy "Admins can view administrators" on public.admins using (private.is_admin());
alter policy "Admins can add administrators" on public.admins with check (private.is_admin());
alter policy "Admins can remove other administrators" on public.admins using (private.is_admin() and lower(email) <> lower(coalesce(auth.jwt() ->> 'email', '')));
alter policy "Admins can manage profile" on public.profile using (private.is_admin()) with check (private.is_admin());
alter policy "Admins can manage news" on public.news using (private.is_admin()) with check (private.is_admin());
alter policy "Admins can manage education work" on public.education_work using (private.is_admin()) with check (private.is_admin());
alter policy "Admins can manage research" on public.research using (private.is_admin()) with check (private.is_admin());
alter policy "Admins can manage projects" on public.projects using (private.is_admin()) with check (private.is_admin());
alter policy "Admins can manage qualifications" on public.qualifications using (private.is_admin()) with check (private.is_admin());
alter policy "Admins can manage portfolio assets" on storage.objects using (bucket_id = 'portfolio-assets' and private.is_admin()) with check (bucket_id = 'portfolio-assets' and private.is_admin());
