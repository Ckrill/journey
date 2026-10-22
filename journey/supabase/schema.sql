-- Run in the Supabase SQL editor. Users come from Supabase Auth (email + password).

create type weekday as enum ('mon','tue','wed','thu','fri','sat','sun');

create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  weekly_target smallint not null check (weekly_target between 1 and 7),
  -- optional: which days the habit is planned for (empty = any day)
  planned_days weekday[] not null default '{}' check (cardinality(planned_days) <= 7),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create table events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  habit_id uuid not null,
  date date not null,
  unique (habit_id, date),
  -- an event can only point at a habit with the same owner
  foreign key (habit_id, user_id) references habits (id, user_id) on delete cascade
);

-- Latest weekly retrospective answers; saving a new one overwrites the old.
create table reflections (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  went_well text not null default '' check (char_length(went_well) <= 2000),
  blockers text not null default '' check (char_length(blockers) <= 2000),
  next_steps text not null default '' check (char_length(next_steps) <= 2000),
  plan text not null default '' check (char_length(plan) <= 2000),
  updated_at timestamptz not null default now()
);

create index habits_user_id_idx on habits (user_id);
create index events_user_id_idx on events (user_id);

alter table habits enable row level security;
alter table events enable row level security;
alter table reflections enable row level security;

create policy "own habits" on habits for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own events" on events for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own reflections" on reflections for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Lets a signed-in user delete their own auth user; habits and events cascade.
create function public.delete_account() returns void
  language sql
  security definer
  set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke execute on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;
