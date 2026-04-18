create extension if not exists pgcrypto;

create table if not exists public.attendees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  normalized_name text not null unique,
  avatar_seed text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists attendees_created_at_idx
  on public.attendees (created_at asc);
