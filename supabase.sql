-- Run this in Supabase > SQL Editor. Replace YOUR_EMAIL_HERE with your own admin email first.
create table settings(id int primary key default 1, fee int, deadline date, test_date date, status text, announcement text);
insert into settings values (1, 500, '2026-11-15', '2026-12-06', 'Open', 'Registration for the 2026-2027 tests is now open.');
create table posts(id bigserial primary key, kind text, title text, body text, created_at timestamptz default now());
create table registrations(id bigserial primary key, student text, school text, class_group text, country text, phone text, created_at timestamptz default now());
create function is_admin() returns boolean language sql stable as $$ select (auth.jwt()->>'email') = 'YOUR_EMAIL_HERE' $$;
alter table settings enable row level security; alter table posts enable row level security; alter table registrations enable row level security;
create policy "read settings" on settings for select using (true);
create policy "admin edits settings" on settings for update using (is_admin());
create policy "read posts" on posts for select using (true);
create policy "admin writes posts" on posts for all using (is_admin()) with check (is_admin());
create policy "anyone registers" on registrations for insert with check (true);
create policy "admin reads registrations" on registrations for select using (is_admin());
