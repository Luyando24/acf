# ACF Website: Task Checklist

> Companion to `docs/PROJECT_GUIDE.md`. Work top to bottom. Tick items off as they are completed and verified. Each task should end with the guide's Definition of Done (Section 19).
>
> Days refer to the ~30-day plan. Phase 3 is the main build.

---

## Phase 1: Discovery & Planning (Days 1–3)

- [x] Confirm final sitemap and information architecture against guide Section 5
- [x] Resolve open questions in guide Section 18 (hosting, domain, brand assets, newsletter platform, content migration, roles)
- [x] Collect existing digital assets (logo, brand guidelines, photos, content from acfzambia.org)
- [x] Confirm domain, Cloudflare, Spaceship and Microsoft 365 access
- [x] Agree user journeys and admin requirements
- [x] Sign off the final structure with ACF

## Phase 2: UI/UX Design (Days 4–8)

- [x] Define design tokens (colours, type scale, spacing) in Tailwind config
- [x] Design homepage (desktop + mobile)
- [x] Design internal page layouts (About, Our Work, Membership, Partners, Contact)
- [x] Design publication list and detail layouts (search + filters)
- [x] Design news and event list/detail layouts
- [x] Design opportunities list, detail and archive layouts
- [x] Design forms and calls-to-action
- [x] Design navigation and mobile menu
- [x] Review with ACF and incorporate feedback

## Phase 3: Website & CMS Development (Days 9–20)

### 3.1 Foundation
- [x] Scaffold Next.js (App Router) + TypeScript strict + Tailwind + ESLint/Prettier
- [x] Create folder structure per guide Section 11
- [x] Set up Supabase project, local dev, and `supabase/migrations`
- [x] Create `.env.example` and environment handling (guide Section 13)
- [x] Core migrations: `profiles`, `site_settings`, `media_assets`, `attachments`
- [x] Auth (Supabase) with admin login, logout, session handling, rate limiting
- [x] RBAC: roles (Super Admin, Admin, Editor, optional Contributor/Viewer) with RLS policies
- [x] Middleware protecting `/admin/**`
- [x] Admin shell: layout, sidebar nav, dashboard home with quick actions
- [x] Public layout: header, mobile nav, footer, skip link, 404/error pages
- [x] Generated DB types wired in

### 3.2 Shared services
- [x] Media upload with image resizing/optimisation and mandatory alt text
- [x] Rich text editor (sanitised output)
- [x] Slug generation and uniqueness helper
- [x] SEO helper (metadata, Open Graph, Twitter, canonical, JSON-LD builders)
- [x] Email service (transactional) with templates
- [x] Form utilities: zod schemas, Turnstile verification, honeypot, rate limiting
- [x] On-demand revalidation endpoint/helper
- [x] Status workflow helper (draft / scheduled / published / archived)

### 3.3 Publications & Knowledge Repository
- [x] Migrations: `publication_categories`, `publications`, `publication_programmes`, search vector
- [x] RLS: public reads published only; staff write by role
- [x] Storage bucket + secure upload validation (type, size, randomised names)
- [x] Admin: list, create, edit, categorise, feature, publish, archive, delete, **replace file**
- [x] Admin: manage categories
- [x] Public: listing with full-text search, category filter, featured section, pagination
- [x] Public: detail page with download and download count
- [x] Tests: upload validation, draft files not public, search and filter

### 3.4 News & Events
- [x] Migrations: `news_posts`, `events`, programme relations, galleries
- [x] Admin CRUD for news (featured image, gallery, attachments, tags, schedule publish)
- [x] Admin CRUD for events (dates, venue, registration link, gallery, documents)
- [x] Public: news listing + article page with share buttons and OG metadata
- [x] Public: events listing split Upcoming / Past + event page
- [x] Optional: "Add to calendar" (.ics)
- [x] Newsletter box on news section

### 3.5 Programmes (Our Work) & About
- [x] Migrations: `programmes`, `pages`, `people`
- [x] Admin CRUD for programmes (add/reorder/archive, no code changes needed)
- [x] Programme page auto-lists related publications, news, events, gallery
- [x] Admin editing for About content (history, vision, mission, objectives)
- [x] Admin CRUD for board, management, staff profiles (photo, bio, order, visibility)
- [x] Public About, Board, Management, Staff pages

### 3.6 Opportunities
- [x] Migration: `opportunities` with types, open/close dates
- [x] Admin CRUD with supporting documents, instructions, external link/contact
- [x] Public active list with type filter, sorted by closing date
- [x] **Auto-archive** by closing date + `/opportunities/archive` + "Closed" badge on detail
- [x] JobPosting structured data where suitable
- [x] Tests: expiry boundary (closing day inclusive, `Africa/Lusaka` timezone)

### 3.7 Membership & Partners
- [x] Migrations: `membership_categories`, `membership_applications`, `partners`
- [x] Admin: manage membership overview, categories, benefits, requirements
- [x] Public membership pages
- [x] Membership application form (validation, consent, spam protection, optional upload)
- [x] Admin: submissions list with status, internal notes, CSV export
- [x] Email notification to designated ACF recipients
- [x] Admin CRUD for partners (logo, type, order, show on homepage)
- [x] Public partners page + homepage logo strip

### 3.8 Contact & Newsletter
- [x] Contact page driven by Site Settings (address, phones, emails, hours, socials)
- [x] Interactive map
- [x] Contact form with validation, spam protection, consent, DB storage, email routing
- [x] Admin: contact message inbox (read/unread)
- [x] Newsletter signup (homepage, news, footer) with consent and double opt-in
- [x] Provider-agnostic newsletter adapter + admin subscriber export

### 3.9 Home page, search and site-wide SEO
- [x] Assemble homepage sections from CMS data (hero, work areas, news, events, publications, stats, membership CTA, partners)
- [x] Hide empty sections gracefully
- [x] Site-wide search (Postgres full-text) across news, publications, programmes, events
- [x] `sitemap.xml`, `robots.txt`, canonical URLs, JSON-LD (Organization, Article, Event, BreadcrumbList)
- [x] Admin set to `noindex`
- [x] Privacy policy page (and terms if required)

## Phase 4: Content & Integrations (Days 21–24)

- [ ] Load ACF-supplied content (about, programmes, people, partners)
- [ ] Upload and categorise publications
- [ ] Migrate selected news from existing site (if in scope)
- [ ] Configure form email routing to ACF Microsoft 365 mailboxes
- [ ] Configure transactional email domain records (SPF/DKIM/DMARC) without breaking existing M365 records
- [ ] Configure maps, social links, analytics
- [ ] Connect newsletter platform if chosen
- [ ] Document DNS/email setup in `docs/DNS_AND_EMAIL.md`

## Phase 5: Testing, Revisions & Optimisation (Days 25–28)

- [ ] Responsive checks at 360 / 768 / 1024 / 1440
- [ ] Browser compatibility (Chrome, Safari, Firefox, Edge, Android Chrome)
- [ ] Links and navigation audit
- [ ] All forms end-to-end including email delivery
- [ ] Document download and file replacement checks
- [ ] Admin functionality and role-permission tests
- [ ] Accessibility audit (axe + keyboard + screen reader spot-check)
- [ ] Performance pass (Lighthouse mobile ≥ 90; image and font optimisation)
- [ ] Security review (headers, CSP, RLS tests, upload handling, dependency audit)
- [ ] Content presentation review with ACF
- [ ] Fix issues and apply agreed revisions

## Phase 6: Deployment, Training & Handover (Days 29–30)

- [ ] Production deployment with SSL/HTTPS, HSTS, secure headers
- [ ] DNS cutover via Cloudflare
- [ ] Confirm automated backups for database and storage; document restore procedure
- [ ] Error monitoring and uptime monitoring enabled
- [ ] Analytics verified
- [ ] Search Console and sitemap submitted
- [x] Write `docs/ADMIN_GUIDE.md` (login, pages, news, events, publications, opportunities, profiles, programmes, partners, submissions, media)
- [ ] Run admin training session for designated ACF staff
- [ ] Final sign-off and handover
- [ ] Agree optional support and maintenance arrangement (separate)

---

## Running log of decisions

| Date | Decision | Reason |
|---|---|---|
| 2026-10-12 | Scaffold Next.js 16 + React 19 + TypeScript strict + Tailwind 4 | Project Guide spec; modern, high performance stack with SSR and Turbopack |
| 2026-10-12 | Core DDL & RLS in `supabase/migrations/` | RLS on every table; staff roles helper (`is_staff`, `is_admin`); tsvector full text search |
| 2026-10-12 | Zod form schemas with spam honeypot + statutory consent | Prevents bot submissions without captchas; complies with Zambian data privacy protection |
| 2026-10-12 | `Africa/Lusaka` timezone formatting & opportunity auto-archive | Ensures dates and deadlines strictly follow Zambian local business day boundaries |
| 2026-10-12 | Admin CMS with Suspense boundaries for `useSearchParams` | Satisfies Next.js App Router client prerender constraints while retaining query parameter redirects |
| 2026-10-12 | Unit testing suite via `tsx --test` | High-speed native TypeScript unit tests for formatters and validation schemas under ESM |

