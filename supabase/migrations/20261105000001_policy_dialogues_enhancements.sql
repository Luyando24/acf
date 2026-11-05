-- Migration: Policy Dialogues Enhancements
-- 1. Add PDF attachments and closed state columns to public.events
-- 2. Create public.dialogue_proposals for public-submitted dialogue proposals
-- 3. Create public.dialogue_registrations for user requests to join a specific dialogue with admin approval

alter table public.events
  add column if not exists document_url text,
  add column if not exists slides_url text,
  add column if not exists recording_url text,
  add column if not exists attachments jsonb not null default '[]'::jsonb,
  add column if not exists is_closed boolean not null default false;

create table if not exists public.dialogue_proposals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  topic_area text not null default 'Policy Advocacy & Reform',
  proposer_name text not null,
  organization text not null default '',
  email text not null,
  phone text not null default '',
  proposed_format text not null default 'Hybrid Stakeholder Forum',
  preferred_timeframe text,
  description text not null,
  document_url text,
  document_name text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  published_event_id uuid references public.events (id) on delete set null,
  admin_notes text,
  consent_given boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dialogue_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  event_slug text not null,
  event_title text not null,
  participant_name text not null,
  organization text not null default '',
  role_title text,
  email text not null,
  phone text not null default '',
  attendance_mode text not null default 'In-Person' check (attendance_mode in ('In-Person', 'Virtual / Online', 'Either')),
  contribution_note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  admin_notes text,
  consent_given boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dialogue_proposals enable row level security;
alter table public.dialogue_registrations enable row level security;

do $$ begin
  drop policy if exists dialogue_proposals_insert on public.dialogue_proposals;
  create policy dialogue_proposals_insert on public.dialogue_proposals
    for insert to anon, authenticated
    with check (consent_given = true);

  drop policy if exists dialogue_proposals_staff_read on public.dialogue_proposals;
  create policy dialogue_proposals_staff_read on public.dialogue_proposals
    for select to authenticated
    using (public.is_staff());

  drop policy if exists dialogue_proposals_staff_write on public.dialogue_proposals;
  create policy dialogue_proposals_staff_write on public.dialogue_proposals
    for all to authenticated
    using (public.can_edit_content())
    with check (public.can_edit_content());

  drop policy if exists dialogue_registrations_insert on public.dialogue_registrations;
  create policy dialogue_registrations_insert on public.dialogue_registrations
    for insert to anon, authenticated
    with check (consent_given = true);

  drop policy if exists dialogue_registrations_staff_read on public.dialogue_registrations;
  create policy dialogue_registrations_staff_read on public.dialogue_registrations
    for select to authenticated
    using (public.is_staff());

  drop policy if exists dialogue_registrations_staff_write on public.dialogue_registrations;
  create policy dialogue_registrations_staff_write on public.dialogue_registrations
    for all to authenticated
    using (public.can_edit_content())
    with check (public.can_edit_content());
exception when others then null;
end $$;

