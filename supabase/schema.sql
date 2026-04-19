create extension if not exists pgcrypto;

create table public.attendees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null,
  identity text not null,
  normalized_name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create index attendees_created_at_idx
  on public.attendees (created_at asc);

create unique index attendees_user_id_unique_idx
  on public.attendees (user_id);

create unique index attendees_normalized_name_unique_idx
  on public.attendees (normalized_name);
