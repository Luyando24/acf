-- ACF initial schema and row level security.
-- Public clients can read published content only. Form tables accept inserts and do not allow public reads.

create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('super_admin', 'admin', 'editor', 'contributor', 'viewer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.content_status as enum ('draft', 'scheduled', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.opportunity_type as enum ('Job', 'Consultancy', 'Tender', 'Procurement', 'Call for Proposals');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.people_group as enum ('board', 'management', 'staff');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.partner_type as enum ('Partner', 'Development Partner', 'Collaborating Institution', 'Network & Affiliation');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.application_status as enum ('new', 'in_review', 'approved', 'declined');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.subscriber_status as enum ('subscribed', 'unsubscribed', 'pending');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  role public.user_role not null default 'viewer',
  avatar_url text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  seo_title text,
  seo_description text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  group_type public.people_group not null,
  name text not null,
  position text not null,
  bio text,
  photo_url text,
  order_index integer not null default 0,
  email text,
  linkedin_url text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  body text not null default '',
  cover_image text,
  icon text,
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.publication_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  category_id uuid references public.publication_categories (id) on delete set null,
  published_on date not null default current_date,
  cover_image text,
  file_path text not null,
  file_size bigint,
  mime text,
  is_featured boolean not null default false,
  download_count integer not null default 0,
  status public.content_status not null default 'draft',
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  featured_image text,
  category text,
  published_at timestamptz not null default now(),
  status public.content_status not null default 'draft',
  author_id uuid references public.profiles (id) on delete set null,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  virtual_url text,
  registration_url text,
  featured_image text,
  status public.content_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  type public.opportunity_type not null,
  description text not null default '',
  opens_on date not null default current_date,
  closes_on date not null,
  application_instructions text,
  apply_url text,
  contact_info text,
  attachment_url text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.partner_type not null default 'Partner',
  logo_url text,
  website_url text,
  description text,
  order_index integer not null default 0,
  show_on_home boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.membership_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '[]'::jsonb,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_type text not null default 'organisation' check (applicant_type in ('organisation', 'individual')),
  org_name text,
  contact_name text not null,
  email text not null,
  phone text not null,
  category_id uuid references public.membership_categories (id) on delete set null,
  location_province text,
  sector_interest text,
  details jsonb not null default '{}'::jsonb,
  consent_given boolean not null,
  consent_at timestamptz not null default now(),
  status public.application_status not null default 'new',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  consent_given boolean not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status public.subscriber_status not null default 'pending',
  source text not null default 'website',
  consent_at timestamptz not null default now(),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.opportunities add column if not exists attachment_url text;

create index if not exists publications_search_idx on public.publications using gin (search_vector);
create index if not exists news_posts_search_idx on public.news_posts using gin (search_vector);
create index if not exists publications_status_idx on public.publications (status);
create index if not exists news_posts_status_idx on public.news_posts (status);
create index if not exists events_status_idx on public.events (status);
create index if not exists programmes_status_idx on public.programmes (status);
create index if not exists opportunities_status_idx on public.opportunities (status);

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text
  from public.profiles
  where id = auth.uid()
    and is_active = true
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('super_admin', 'admin', 'editor', 'contributor', 'viewer')
$$;

create or replace function public.can_edit_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('super_admin', 'admin', 'editor', 'contributor')
$$;

create or replace function public.can_delete_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('super_admin', 'admin', 'editor')
$$;

create or replace function public.can_read_submissions()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('super_admin', 'admin', 'viewer')
$$;

create or replace function public.can_manage_submissions()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('super_admin', 'admin')
$$;

revoke all on function public.current_staff_role() from public;
revoke all on function public.is_staff() from public;
revoke all on function public.can_edit_content() from public;
revoke all on function public.can_delete_content() from public;
revoke all on function public.can_read_submissions() from public;
revoke all on function public.can_manage_submissions() from public;
grant execute on function public.current_staff_role() to anon, authenticated;
grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.can_edit_content() to anon, authenticated;
grant execute on function public.can_delete_content() to anon, authenticated;
grant execute on function public.can_read_submissions() to anon, authenticated;
grant execute on function public.can_manage_submissions() to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, is_active)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.email, 'Staff member'),
    'viewer',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.people enable row level security;
alter table public.programmes enable row level security;
alter table public.publication_categories enable row level security;
alter table public.publications enable row level security;
alter table public.news_posts enable row level security;
alter table public.events enable row level security;
alter table public.opportunities enable row level security;
alter table public.partners enable row level security;
alter table public.membership_categories enable row level security;
alter table public.membership_applications enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.current_staff_role() = 'super_admin');

drop policy if exists profiles_update_super on public.profiles;
create policy profiles_update_super on public.profiles
  for update to authenticated
  using (public.current_staff_role() = 'super_admin')
  with check (public.current_staff_role() = 'super_admin');

drop policy if exists settings_public_read on public.site_settings;
create policy settings_public_read on public.site_settings
  for select to anon, authenticated
  using (true);

drop policy if exists settings_staff_write on public.site_settings;
create policy settings_staff_write on public.site_settings
  for all to authenticated
  using (public.current_staff_role() in ('super_admin', 'admin', 'editor'))
  with check (public.current_staff_role() in ('super_admin', 'admin', 'editor'));

-- Published rows are public. Active staff can also read drafts.
drop policy if exists pages_read on public.pages;
create policy pages_read on public.pages
  for select to anon, authenticated
  using (status = 'published' or public.is_staff());

drop policy if exists pages_write on public.pages;
create policy pages_write on public.pages
  for insert to authenticated
  with check (public.can_edit_content());

drop policy if exists pages_update on public.pages;
create policy pages_update on public.pages
  for update to authenticated
  using (public.can_edit_content())
  with check (public.can_edit_content());

drop policy if exists pages_delete on public.pages;
create policy pages_delete on public.pages
  for delete to authenticated
  using (public.can_delete_content());

drop policy if exists programmes_read on public.programmes;
create policy programmes_read on public.programmes
  for select to anon, authenticated
  using (status = 'published' or public.is_staff());
drop policy if exists programmes_insert on public.programmes;
create policy programmes_insert on public.programmes
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists programmes_update on public.programmes;
create policy programmes_update on public.programmes
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists programmes_delete on public.programmes;
create policy programmes_delete on public.programmes
  for delete to authenticated using (public.can_delete_content());

drop policy if exists publications_read on public.publications;
create policy publications_read on public.publications
  for select to anon, authenticated
  using (status = 'published' or public.is_staff());
drop policy if exists publications_insert on public.publications;
create policy publications_insert on public.publications
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists publications_update on public.publications;
create policy publications_update on public.publications
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists publications_delete on public.publications;
create policy publications_delete on public.publications
  for delete to authenticated using (public.can_delete_content());

drop policy if exists news_read on public.news_posts;
create policy news_read on public.news_posts
  for select to anon, authenticated
  using (status = 'published' or public.is_staff());
drop policy if exists news_insert on public.news_posts;
create policy news_insert on public.news_posts
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists news_update on public.news_posts;
create policy news_update on public.news_posts
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists news_delete on public.news_posts;
create policy news_delete on public.news_posts
  for delete to authenticated using (public.can_delete_content());

drop policy if exists events_read on public.events;
create policy events_read on public.events
  for select to anon, authenticated
  using (status = 'published' or public.is_staff());
drop policy if exists events_insert on public.events;
create policy events_insert on public.events
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists events_update on public.events;
create policy events_update on public.events
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists events_delete on public.events;
create policy events_delete on public.events
  for delete to authenticated using (public.can_delete_content());

drop policy if exists opportunities_read on public.opportunities;
create policy opportunities_read on public.opportunities
  for select to anon, authenticated
  using (status = 'published' or public.is_staff());
drop policy if exists opportunities_insert on public.opportunities;
create policy opportunities_insert on public.opportunities
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists opportunities_update on public.opportunities;
create policy opportunities_update on public.opportunities
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists opportunities_delete on public.opportunities;
create policy opportunities_delete on public.opportunities
  for delete to authenticated using (public.can_delete_content());

drop policy if exists people_read on public.people;
create policy people_read on public.people
  for select to anon, authenticated
  using (is_visible = true or public.is_staff());
drop policy if exists people_insert on public.people;
create policy people_insert on public.people
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists people_update on public.people;
create policy people_update on public.people
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists people_delete on public.people;
create policy people_delete on public.people
  for delete to authenticated using (public.can_delete_content());

drop policy if exists partners_read on public.partners;
create policy partners_read on public.partners
  for select to anon, authenticated
  using (is_visible = true or public.is_staff());
drop policy if exists partners_insert on public.partners;
create policy partners_insert on public.partners
  for insert to authenticated with check (public.can_edit_content());
drop policy if exists partners_update on public.partners;
create policy partners_update on public.partners
  for update to authenticated using (public.can_edit_content()) with check (public.can_edit_content());
drop policy if exists partners_delete on public.partners;
create policy partners_delete on public.partners
  for delete to authenticated using (public.can_delete_content());

drop policy if exists categories_read on public.publication_categories;
create policy categories_read on public.publication_categories
  for select to anon, authenticated using (true);
drop policy if exists categories_write on public.publication_categories;
create policy categories_write on public.publication_categories
  for all to authenticated
  using (public.can_delete_content())
  with check (public.can_delete_content());

drop policy if exists membership_categories_read on public.membership_categories;
create policy membership_categories_read on public.membership_categories
  for select to anon, authenticated using (true);
drop policy if exists membership_categories_write on public.membership_categories;
create policy membership_categories_write on public.membership_categories
  for all to authenticated
  using (public.can_delete_content())
  with check (public.can_delete_content());

drop policy if exists contact_insert on public.contact_messages;
create policy contact_insert on public.contact_messages
  for insert to anon, authenticated
  with check (consent_given = true);
drop policy if exists contact_read on public.contact_messages;
create policy contact_read on public.contact_messages
  for select to authenticated
  using (public.can_read_submissions());
drop policy if exists contact_update on public.contact_messages;
create policy contact_update on public.contact_messages
  for update to authenticated
  using (public.can_manage_submissions())
  with check (public.can_manage_submissions());

drop policy if exists membership_insert on public.membership_applications;
create policy membership_insert on public.membership_applications
  for insert to anon, authenticated
  with check (consent_given = true);
drop policy if exists membership_read on public.membership_applications;
create policy membership_read on public.membership_applications
  for select to authenticated
  using (public.can_read_submissions());
drop policy if exists membership_update on public.membership_applications;
create policy membership_update on public.membership_applications
  for update to authenticated
  using (public.can_manage_submissions())
  with check (public.can_manage_submissions());

drop policy if exists newsletter_insert on public.newsletter_subscribers;
create policy newsletter_insert on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (consent_at is not null);
drop policy if exists newsletter_read on public.newsletter_subscribers;
create policy newsletter_read on public.newsletter_subscribers
  for select to authenticated
  using (public.can_read_submissions());
drop policy if exists newsletter_update on public.newsletter_subscribers;
create policy newsletter_update on public.newsletter_subscribers
  for update to authenticated
  using (public.can_manage_submissions())
  with check (public.can_manage_submissions());

drop policy if exists activity_read on public.activity_log;
create policy activity_read on public.activity_log
  for select to authenticated
  using (public.is_staff());
drop policy if exists activity_insert on public.activity_log;
create policy activity_insert on public.activity_log
  for insert to authenticated
  with check (public.is_staff());

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('public-media', 'public-media', true, 15728640),
  ('private-uploads', 'private-uploads', false, 52428800)
on conflict (id) do nothing;

drop policy if exists public_media_read on storage.objects;
create policy public_media_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'public-media');
