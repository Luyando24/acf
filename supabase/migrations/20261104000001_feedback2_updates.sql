-- ====================================================================
-- ACF Migration: Feedback 2 Website Content & Schema Alignment
-- File: supabase/migrations/20261104000001_feedback2_updates.sql
-- Defensive and self-healing DDL & Seeding
-- ====================================================================

-- 1. Prerequisites (Extensions & Enums)
create extension if not exists pgcrypto;

do $$ begin
  create type public.content_status as enum ('draft', 'scheduled', 'published', 'archived');
exception when duplicate_object then null;
end $$;

-- 2. Contact Messages: Ensure table exists and add organization and constituency columns
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  organization text,
  constituency text,
  consent_given boolean not null default true,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages 
  add column if not exists organization text,
  add column if not exists constituency text;

alter table public.contact_messages enable row level security;

do $$ begin
  drop policy if exists contact_insert on public.contact_messages;
  create policy contact_insert on public.contact_messages
    for insert to anon, authenticated with check (true);
exception when others then null;
end $$;

-- 3. Publication Categories: Ensure table exists and seed Knowledge Hub categories
create table if not exists public.publication_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.publication_categories enable row level security;

do $$ begin
  drop policy if exists categories_read on public.publication_categories;
  create policy categories_read on public.publication_categories
    for select to anon, authenticated using (true);
exception when others then null;
end $$;

insert into public.publication_categories (slug, name, order_index) values
  ('policy-briefs', 'Policy Briefs & Advocacy Papers', 1),
  ('institutional-templates', 'Institutional Templates', 2),
  ('technical-studies', 'Technical Studies', 3)
on conflict (slug) do update set 
  name = excluded.name, 
  order_index = excluded.order_index;

-- 4. Publications: Ensure table exists, RLS configured, and seed featured documents
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  category_id uuid references public.publication_categories (id) on delete set null,
  published_on date not null default current_date,
  cover_image text,
  file_path text not null default '',
  file_size bigint,
  mime text,
  is_featured boolean not null default false,
  download_count integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.publications enable row level security;

do $$ begin
  drop policy if exists publications_read on public.publications;
  create policy publications_read on public.publications
    for select to anon, authenticated using (status = 'published');
exception when others then null;
end $$;

insert into public.publications (slug, title, summary, category_id, published_on, is_featured, status, file_path) values
  ('joint-ministerial-policy-brief-el-nino', 'Joint Ministerial Policy Brief on El Niño Adaptation Actions', 'Evidence-based ministerial advisory addressing drought mitigation, water management, and smallholder resilience across Zambia.', (select id from public.publication_categories where slug = 'policy-briefs' limit 1), '2026-10-15', true, 'published', '/documents/acf-policy-review-2026.pdf'),
  ('parliamentary-committee-briefing-budget', 'Parliamentary Committee Briefing on Agricultural Budget Performance', 'Rigorous empirical analysis of national agricultural budgetary allocations, spending efficiency, and input program impacts.', (select id from public.publication_categories where slug = 'policy-briefs' limit 1), '2026-10-22', true, 'published', '/documents/acf-policy-review-2026.pdf'),
  ('district-early-warning-template', 'District Early Warning Template for Disaster Management Committees', 'Standardized monitoring protocol and data-gathering template for decentralized disaster response and drought alerts.', (select id from public.publication_categories where slug = 'institutional-templates' limit 1), '2026-09-05', true, 'published', '/documents/acf-policy-review-2026.pdf'),
  ('zambia-competitiveness-animal-health-assessment', 'Zambia Competitiveness and Animal Health Institutional Assessment', 'Technical study mapping livestock export corridors into DRC and Angola, disease surveillance, and biosecurity protocols.', (select id from public.publication_categories where slug = 'technical-studies' limit 1), '2026-08-18', true, 'published', '/documents/acf-policy-review-2026.pdf')
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  category_id = excluded.category_id,
  published_on = excluded.published_on,
  is_featured = excluded.is_featured,
  status = excluded.status;

-- 5. Programmes: Ensure table exists, RLS configured, and seed Pillars & Featured Projects
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

alter table public.programmes enable row level security;

do $$ begin
  drop policy if exists programmes_read on public.programmes;
  create policy programmes_read on public.programmes
    for select to anon, authenticated using (status = 'published');
exception when others then null;
end $$;

insert into public.programmes (slug, title, summary, body, icon, order_index, status) values
  ('policy-advocacy-reform', 'Policy Advocacy and Reform', 'We identify policy bottlenecks, analyze legislative impacts, and advocate for regulatory reforms that improve the agricultural business environment.', '<p>We identify policy bottlenecks, analyze legislative impacts, and advocate for regulatory reforms that improve the agricultural business environment.</p>', 'Scale', 1, 'published'),
  ('multi-stakeholder-dialogue', 'Multi-Stakeholder Dialogue', 'We convene national and regional forums, workshops, and roundtables to build consensus on critical agricultural issues.', '<p>We convene national and regional forums, workshops, and roundtables to build consensus on critical agricultural issues.</p>', 'Users', 2, 'published'),
  ('evidence-based-policy-analysis', 'Evidence-Based Policy Analysis', 'We generate data-driven insights and policy briefs to guide government decision-making and private sector investments.', '<p>We generate data-driven insights and policy briefs to guide government decision-making and private sector investments.</p>', 'BookOpen', 3, 'published'),
  ('capacity-building', 'Capacity Building', 'We strengthen the analytical and advocacy capacities of farmer organizations, civil society groups, and local value-chain actors.', '<p>We strengthen the analytical and advocacy capacities of farmer organizations, civil society groups, and local value-chain actors.</p>', 'GraduationCap', 4, 'published'),
  ('gcrf-africap', 'GCRF AFRICAP', 'Agricultural and Food-system Resilience: Increasing Capacity and Advisories.', '<p>Agricultural and Food-system Resilience: Increasing Capacity and Advisories (AFRICAP) conducted comprehensive climate modeling and policy stress-testing for Zambian food systems.</p>', 'ShieldCheck', 5, 'published'),
  ('climber', 'CliMBER', 'Building Systemic Resilience against Climate Variability.', '<p>CliMBER (Building Systemic Resilience against Climate Variability) supported smallholder adaptation pathways and hydro-meteorological advisories.</p>', 'Sprout', 6, 'published'),
  ('fosta', 'FoSTA', 'Food Systems Transformation in Africa.', '<p>Food Systems Transformation in Africa (FoSTA) generated multi-stakeholder health and agricultural policy recommendations for national transformation.</p>', 'Layers', 7, 'published')
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body,
  order_index = excluded.order_index,
  status = excluded.status;

-- 6. Events: Ensure table exists, RLS configured, and seed Policy Dialogues & Consultations
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  cover_image text,
  registration_url text,
  recording_url text,
  slides_url text,
  is_featured boolean not null default false,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

do $$ begin
  drop policy if exists events_read on public.events;
  create policy events_read on public.events
    for select to anon, authenticated using (status = 'published');
exception when others then null;
end $$;

insert into public.events (slug, title, description, starts_at, ends_at, venue, registration_url, status) values
  ('el-nino-climate-risk-mitigation', 'El Niño & Climate Risk Mitigation Forums', 'Designing agricultural advisories and hydro-meteorological response strategies for farming seasons.', '2026-11-20 09:00:00+02', '2026-11-20 16:00:00+02', 'Lusaka & Virtual', 'https://acfzambia.org/contact', 'published'),
  ('beef-export-competitiveness-study-forum', 'Beef Export Competitiveness Study Forum', 'Institutional assessments and animal health frameworks for market access into Angola and the Democratic Republic of Congo (DRC).', '2026-11-24 09:30:00+02', '2026-11-24 15:30:00+02', 'Mulungushi International Conference Centre, Lusaka', 'https://acfzambia.org/contact', 'published'),
  ('naip-consultations', 'National Agriculture Investment Plan (NAIP) Consultations', 'Tracking public spending and performance metrics across agricultural programmes.', '2026-11-28 08:30:00+02', '2026-11-28 17:00:00+02', 'Taj Pamodzi Hotel, Lusaka', 'https://acfzambia.org/contact', 'published'),
  ('november-stakeholder-consultations', 'November Stakeholder Consultations', 'Agendas covering Stakeholder Engagements, Policy Research, and Finance.', '2026-11-30 09:00:00+02', '2026-11-30 17:00:00+02', 'ACF Secretariat Conference Room & Online', 'https://acfzambia.org/contact', 'published')
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  venue = excluded.venue,
  registration_url = excluded.registration_url,
  status = excluded.status;

-- 7. News Posts: Ensure table exists, RLS configured, and seed Media & Sector Updates
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  cover_image text,
  featured_image text,
  category text not null default 'General',
  published_at timestamptz not null default now(),
  is_featured boolean not null default false,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news_posts enable row level security;

do $$ begin
  drop policy if exists news_read on public.news_posts;
  create policy news_read on public.news_posts
    for select to anon, authenticated using (status = 'published');
exception when others then null;
end $$;

insert into public.news_posts (slug, title, excerpt, body, category, published_at, is_featured, status) values
  ('q3-performance-metrics-released-acf', 'Q3 Performance Metrics Released by Agricultural Consultative Forum', 'Comprehensive quarterly report tracking policy dialogue outcomes, research citations, and smallholder outreach across Zambia.', '<p>The Agricultural Consultative Forum has published its Q3 performance review, detailing significant progress in stakeholder mobilization and policy briefs submitted to parliamentary committees.</p>', 'Sector News', '2026-11-01 10:00:00+02', true, 'published'),
  ('inter-ministerial-memorandum-water-security', 'Summary of November Inter-Ministerial Memorandum on Water Security and Extension Services', 'Key policy recommendations on sustainable irrigation, dam management, and modernized agricultural extension delivery.', '<p>A summary of the high-level inter-ministerial memorandum detailing urgent water harvesting and resilient irrigation measures ahead of the planting season.</p>', 'Policy Briefing', '2026-11-02 11:30:00+02', true, 'published'),
  ('stakeholder-mobilization-climate-smart-framework', 'Stakeholder Mobilization Highlights for National Climate-Smart Agriculture Framework', 'Multi-stakeholder coalition reviews grassroots adoption of agro-ecological practices and drought-tolerant seed varieties.', '<p>Highlights from national stakeholder consultative sessions evaluating farmer uptake of climate-resilient practices and market linkages.</p>', 'Dialogue Highlight', '2026-11-03 14:00:00+02', true, 'published')
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  category = excluded.category,
  is_featured = excluded.is_featured,
  status = excluded.status;
