create table if not exists public.app_state (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.app_state (id, state)
values (
  'main',
  '{"players":[],"games":[]}'::jsonb
)
on conflict (id) do nothing;

alter table public.app_state enable row level security;

create policy "Allow public read access to app_state"
on public.app_state
for select
to anon, authenticated
using (true);

create policy "Allow public insert access to app_state"
on public.app_state
for insert
to anon, authenticated
with check (id = 'main');

create policy "Allow public update access to app_state"
on public.app_state
for update
to anon, authenticated
using (id = 'main')
with check (id = 'main');
