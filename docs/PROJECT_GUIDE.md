# ACF Website & CMS: Project Guide for the AI Coding Assistant

> **Purpose of this file:** This is the single source of truth for what we are building. Read it fully before writing code, and re-read the relevant section before starting each module. Place it in the repo root (e.g. `/docs/PROJECT_GUIDE.md`) and reference it from `CLAUDE.md` / `AGENTS.md` / your tool's rules file.
>
> **Builder:** SpaceMinds Technologies (https://spaceminds.agency/)
> **Client:** Agricultural Consultative Forum (ACF), Lusaka, Zambia
> **Target delivery:** ~30 calendar days, phased (see Section 14)

---

## 1. Project in One Paragraph

We are building a modern, responsive, accessible institutional website for ACF, plus a secure, easy-to-use admin dashboard (CMS) so non-technical ACF staff can manage all content themselves: news, events, publications, opportunities (jobs/tenders), programmes, partners, staff/board profiles, membership enquiries, and more. The site is a **central digital hub** for ACF's work, research, and stakeholder engagement, not a brochure site. Routine updates must never require editing code.

---

## 2. About the Client (Context for Copy, Tone, and UX)

**ACF** is a Zambian NGO and multi-stakeholder platform for agricultural actors. It engages in policy advocacy, knowledge sharing, and promotion of sustainable agricultural development.

- **Based in:** Lusaka, Zambia
- **Brings together:** public sector, private sector, research institutions, cooperating partners (donors), other NGOs
- **Mission:** Contribute to a viable and responsive agricultural sector through evidence-based policy analysis, knowledge management, stakeholder engagement, and multi-stakeholder policy dialogue.
- **Key objectives:**
  1. Mobilise and engage stakeholders at various levels for policy advocacy, and for the formulation and implementation of agricultural policies, investment plans, and programmes.
  2. Generate credible evidence and performance data to support timely policy decisions.
  3. Provide a reliable source of information and knowledge for the agricultural sector.
  4. Advocate for secure tenure rights, strong small-scale farming systems, and equal land rights for women.
- **Constituencies / audiences:**
  - Smallholder and poor farmers
  - Policy makers and government officials
  - Agricultural commodity associations and cooperatives
  - Agri-business enterprises and research institutes
  - Donor agencies and cooperating partners
- **Activities:** Multi-stakeholder consultations, policy dialogues, evidence-based analyses, newsletters and sector news updates.
- **Existing web presence:** An existing site at `acfzambia.org` (with a "sector news" section) and a Facebook page (`facebook.com/ACFZambia`). Use these as references for existing content and branding, but this is a **new build**.

### Contact details (provisional; confirm with ACF before launch)
| Field | Value |
|---|---|
| Address | 24 Elm Rd, Lusaka, Zambia |
| Phone | 095 4755071 |
| Website | acfzambia.org |
| Facebook | facebook.com/ACFZambia |

> ⚠️ These were gathered from third-party sources. **Store them in CMS-editable settings, never hard-code them.** Treat them as placeholders until ACF confirms.

### Tone and content guidance
- Professional, credible, evidence-driven, policy-oriented. Not corporate-flashy.
- Plain, clear English. Audience includes non-technical farmers' representatives and senior policymakers.
- Do not invent organisational facts (staff names, statistics, partner names, history). Use clearly marked placeholders (e.g. `[PLACEHOLDER: ACF history]`) or seed data labelled as dummy content.
- Zambian context: dates `DD Month YYYY`; currency ZMW (Kwacha) where relevant; timezone `Africa/Lusaka` (CAT, UTC+2).

---

## 3. Goals and Success Criteria

**Business goals**
- Clear, credible institutional presence.
- Central access to research and publications.
- Better visibility of news, events, and opportunities.
- Online membership enquiries/applications.
- Staff can self-manage content with no developer involvement.
- Scalable platform that can grow (new programmes, new content types).

**Definition of success (acceptance)**
- A non-technical ACF admin can publish a news post, upload a publication, post a tender, and update a staff profile within minutes, unaided.
- Public site passes Lighthouse targets (Section 10) and basic accessibility checks.
- All forms deliver to the designated ACF inboxes and store submissions in the dashboard.
- Automated backups, HTTPS, and role-based admin access are in place.

---

## 4. Technology Stack

The proposal says the stack "may include" the following. **Use these as the default decision unless the team says otherwise.**

| Layer | Choice |
|---|---|
| Frontend framework | **Next.js (App Router) + React** |
| Language | **TypeScript** (strict mode) |
| Styling | **Tailwind CSS** (design tokens via `tailwind.config` / CSS variables) |
| Backend logic | **Node.js** via Next.js Route Handlers / Server Actions |
| Database | **PostgreSQL via Supabase** |
| Auth | **Supabase Auth** (email + password, optional MFA) for admin users |
| File storage | **Supabase Storage** (buckets for publications, images, documents) |
| Hosting | Modern cloud deployment (e.g. Vercel) with Supabase cloud; final choice depends on ACF's hosting/security needs |
| DNS / CDN / security | **Cloudflare** for DNS resolution |
| Email | Transactional email via provider TBD (e.g. Resend/SMTP), routed to ACF's **Microsoft 365** mailboxes; domain/email setup via **Spaceship** |
| Analytics | Privacy-respecting analytics (e.g. GA4 or Plausible), configured at launch |

### Recommended supporting libraries (suggestions, not mandates)
- Forms/validation: `react-hook-form` + `zod`
- Rich text editing in CMS: Tiptap (output stored as sanitised HTML or JSON)
- Data fetching/ORM: Supabase client with generated types (`supabase gen types`), or Drizzle/Prisma if the team prefers
- Spam protection: Cloudflare Turnstile (preferred) or hCaptcha + honeypot field
- Maps: Leaflet/OpenStreetMap or Google Maps embed
- Icons: `lucide-react`
- Testing: Vitest + Playwright (smoke tests for critical flows)
- Linting: ESLint + Prettier

### Architecture principles
1. **Content is data.** Everything editable by ACF lives in the database or storage, not in code.
2. **Public site is mostly server-rendered/static with revalidation** (ISR / on-demand revalidation when admin publishes) for speed and SEO.
3. **Admin is a protected area** (`/admin`) in the same Next.js app, using role-based access control enforced at the database level (Supabase **Row Level Security**) and again in server code. Never rely on UI hiding alone.
4. **Extensibility:** adding a new Programme or Publication Category must require zero code changes.
5. **Keep it simple and maintainable.** Prefer boring, well-documented patterns. The client's staff and future developers must be able to maintain it.

---

## 5. Site Map and Routes

```
/                                  Home
/about                             About ACF (history, vision, mission, objectives)
/about/board                       Board members
/about/management                  Management team
/about/staff                       Staff profiles
/our-work                          Programmes & thematic areas (listing)
/our-work/[slug]                   Individual programme/thematic area page
/publications                      Publications repository (search + filters)
/publications/[slug]               Publication detail + download
/news                              News & updates (listing)
/news/[slug]                       Article detail
/events                            Events (upcoming + past)
/events/[slug]                     Event detail (gallery, documents)
/membership                        Overview, categories, benefits, requirements
/membership/apply                  Online membership application/enquiry form
/partners                          Partners, networks, affiliations
/opportunities                     Active opportunities (jobs, consultancies, tenders, procurement, calls)
/opportunities/archive             Expired opportunities
/opportunities/[slug]              Opportunity detail
/contact                           Contact info, form, map, socials
/privacy-policy                    Privacy & consent
/terms                             (optional) Terms of use
/search                            (optional) Site-wide search
/admin/**                          CMS dashboard (auth required)
/api/**                            Route handlers (forms, newsletter, webhooks)
/sitemap.xml, /robots.txt          Generated
/not-found, /error                 Branded 404/500
```

**Global components:** header with main nav and mobile menu, footer (quick links, contact, socials, newsletter), breadcrumb, skip-to-content link, cookie/consent notice if analytics requires it.

---

## 6. Functional Requirements by Module

For each module: what the public sees, what the admin manages.

### 6.1 Home Page
Sections (each driven by CMS content where applicable):
- Hero with brief ACF introduction and primary CTAs
- Key areas of work / programmes
- Featured initiatives or thematic areas
- Latest news (auto: most recent N published)
- Upcoming events (auto: next N by date)
- Featured publications (admin flag `is_featured`)
- Key statistics / organisational highlights (admin-editable counters; hide section if none)
- Membership call-to-action
- Newsletter subscription
- Partner highlights (logo strip)
- Contact and social links
- Quick links to important sections

### 6.2 About Us
- History, Vision, Mission, Organisational objectives (rich text, admin-editable)
- Board members, Management, Staff: each profile has photo, name, position, bio, group (`board | management | staff`), display order, optional social/email, visible/hidden toggle.

### 6.3 Our Work (Programmes / Thematic Areas)
- Listing + dedicated page per programme.
- Initial themes: Policy advocacy, Research and evidence, Multi-stakeholder dialogue, Agricultural transformation, Climate resilience, plus others added later.
- Each page: description, related activities, **related publications, news, projects**, photo gallery.
- Relationships: content (news, publications, events) can be tagged to one or more programmes. Programme pages auto-list related content.
- Admin can add/reorder/archive programmes without code.

### 6.4 Publications & Knowledge Repository
- Fields: title, slug, description/summary, **category**, publication date, cover image (optional), downloadable file, featured flag, programme tags, status (draft/published/archived).
- Initial categories (admin-extensible): Policy briefs, Research reports, Technical reports, Policy advisory notes, Newsletters, Presentations, Other.
- Public: browse, **full-text search**, **filter by category/type** (also by year/programme, nice to have), featured publications, download (track download count).
- Admin: upload, edit, categorise, publish, unpublish, archive, remove, **replace file** while keeping the same record/URL.
- Allowed upload types: PDF primarily, plus approved docs (DOCX, XLSX, PPTX). Enforce MIME + extension whitelist and a max size (suggest 50 MB; make configurable).

### 6.5 News, Updates & Events
- **News/Updates:** ACF news, organisational updates, sector developments, announcements. Fields: title, slug, excerpt, body (rich text), featured image, gallery, attached documents, category/tags, programme tags, publish date, status, author.
- **Events:** title, slug, description, start/end datetime, venue/location (or virtual link), registration link (optional), featured image, **gallery (event photographs)**, supporting documents, status. Auto-classified **Upcoming** vs **Past** by date. Optional "Add to calendar" (.ics).
- Each article/event page has share buttons and Open Graph/Twitter metadata for social sharing.
- Newsletter subscription box present on the news section.

### 6.6 Membership & Partners
**Membership (public content, admin-editable):** overview, categories, benefits, requirements, application info.
**Online membership application/enquiry form:**
- Securely collects applicant info (organisation or individual name, type/category, contact person, email, phone, location/province, sector/area of interest, message, optional document upload).
- Includes **consent + privacy checkbox**, spam protection, validation.
- Stores submission in DB, emails designated ACF staff, and shows in admin dashboard with status (`new | in_review | approved | declined`) and internal notes; exportable to CSV.

**Partners:** logos + info for Partners, Collaborating institutions, Development partners, Strategic networks, Affiliations. Fields: name, logo, URL, description, type, display order, show-on-homepage flag.

### 6.7 Network & Opportunities
- Types: Job, Consultancy, Tender, Procurement, Call for proposals (admin-extensible type list).
- Fields: title, slug, type, description, **opening date, closing date**, supporting documents, application instructions, external application link or contact details, status.
- **Auto-archive:** an opportunity whose closing date has passed is shown under `/opportunities/archive` and removed from the active list. Implement via query-time filtering (`closing_date >= now()`) and/or a scheduled job; do not require manual action. Show a clear "Closed" badge on direct URLs for expired items.
- Filter by type; sort by closing date.
- Consent/privacy text on any form where personal data is collected.

### 6.8 Contact Us
- Physical address, postal address, phone numbers, email addresses, office hours, social links (all from CMS "Site Settings").
- Contact/enquiry form with validation and spam protection; submissions stored + emailed to ACF.
- Interactive location map.

### 6.9 Newsletter Subscription
- Voluntary email signup in homepage, news section, and footer.
- Consent and privacy messaging next to the form; double opt-in recommended.
- Store subscribers in DB; abstract the provider behind an interface so it can integrate with ACF's preferred platform (e.g. Mailchimp, Brevo, MailerLite) later. Admin can export subscribers.

### 6.10 Search
- Publications: dedicated search + filters (required).
- Site-wide search across news, publications, programmes, events (recommended; use Postgres full-text search with `tsvector`).

---

## 7. CMS / Admin Dashboard

**Principle:** The dashboard is designed around ACF's real tasks. Plain-language labels, helpful hints, confirmation before destructive actions, clear draft/published states, previews.

### 7.1 Manageable areas
Homepage content · About information · Programmes/thematic areas · News · Events · Publications · Documents · Opportunities · Membership information · Partners · Staff and board profiles · Images and galleries · Contact info & site settings · Navigation/website links · Form submissions (contact, membership, newsletter subscribers) · Users and roles

### 7.2 Roles and permissions (RBAC)
| Role | Capabilities |
|---|---|
| **Super Admin** | Everything, including user management and site settings |
| **Admin** | All content + form submissions; no user/role management |
| **Editor** | Create/edit content; publish where allowed |
| **Contributor** (optional) | Create drafts only; requires approval to publish |
| **Viewer** (optional) | Read-only access to submissions/reports |

- Enforce through Supabase **RLS policies** plus server-side checks.
- Secure authentication, strong password rules, optional MFA, session timeout, rate-limited login.
- **Audit fields** on all content: `created_at`, `updated_at`, `created_by`, `updated_by`. A simple activity log is a nice-to-have.

### 7.3 Dashboard UX requirements
- List views with search, filter, sort, pagination, bulk actions where sensible.
- Draft / Scheduled / Published / Archived statuses; **schedule publish date** supported.
- Image upload with automatic resizing/optimisation and required alt text.
- Rich text editor with safe output (sanitise).
- Slug auto-generation (editable), uniqueness enforced.
- SEO fields (meta title, meta description, OG image) on key content types.
- Responsive enough to use on a tablet.
- Dashboard "home" showing quick actions: *Add news, Add publication, Add event, Add opportunity* and counts of new submissions.

### 7.4 Document management
- PDF + approved document uploads, categorisation, descriptions, publication dates, **file replacement**, download management (counts), search/filtering, removal or archiving of outdated documents.
- Secure upload path: validate type and size, randomise stored filenames, never execute uploaded files, serve via signed or public URLs as appropriate (published publications are public; draft files must **not** be publicly accessible).

---

## 8. Suggested Data Model (Postgres / Supabase)

> A starting point, so refine it. Use `uuid` primary keys, `timestamptz`, snake_case, and enable **RLS on every table**.

```
profiles            (id → auth.users, full_name, role, avatar_url, is_active)
site_settings       (key, value jsonb)  -- address, phones, emails, socials, office hours, stats, SEO defaults
pages               (id, slug, title, body, seo_*, status)       -- About history/vision/mission/objectives etc.
people              (id, group[board|management|staff], name, position, bio, photo_url, order, is_visible)
programmes          (id, slug, title, summary, body, cover_image, icon, order, status)
publication_categories (id, slug, name, order)
publications        (id, slug, title, summary, category_id, published_on, cover_image, file_path, file_size, mime, is_featured, download_count, status, search_vector)
publication_programmes (publication_id, programme_id)
news_posts          (id, slug, title, excerpt, body, featured_image, category, published_at, status, author_id, is_featured, seo_*, search_vector)
news_programmes     (news_id, programme_id)
events              (id, slug, title, description, starts_at, ends_at, venue, virtual_url, registration_url, featured_image, status, seo_*)
event_programmes    (event_id, programme_id)
media_assets        (id, bucket, path, alt_text, caption, mime, size, uploaded_by)
galleries / gallery_items (polymorphic: parent_type, parent_id, media_id, order)
attachments         (id, parent_type, parent_id, file_path, label)    -- supporting docs
partners            (id, name, type, logo_url, website_url, description, order, show_on_home, is_visible)
membership_categories (id, name, description, benefits, requirements, order)
membership_applications (id, applicant_type, org_name, contact_name, email, phone, category_id, details jsonb, consent_given, consent_at, status, notes, created_at)
opportunities       (id, slug, title, type, description, opens_on, closes_on, application_instructions, apply_url, contact_info, status)
contact_messages    (id, name, email, phone, subject, message, consent_given, is_read, created_at)
newsletter_subscribers (id, email unique, consent_at, confirmed_at, status, source)
activity_log        (optional)
```

**RLS guidance**
- Public (`anon`): `SELECT` only on rows with `status = 'published'` (and, for opportunities, visible dates) from content tables. `INSERT` only on form tables (`contact_messages`, `membership_applications`, `newsletter_subscribers`) via server route with spam verification. No public read of form tables.
- Authenticated staff: permissions by role via `profiles.role`.
- Storage buckets: `public-media` (images), `publications` (published files), `private-uploads` (membership attachments and drafts).

---

## 9. Forms, Email, and Domain

### Forms (contact, membership, newsletter, others as needed)
- Client-side + **server-side** validation with the same `zod` schema.
- Spam protection: Turnstile/hCaptcha + honeypot + rate limiting per IP.
- Consent checkbox and privacy-policy link on any form collecting personal data; store `consent_given` and timestamp.
- Success/error states are accessible (ARIA live regions, focus management).
- On submit: save to DB → send notification email to designated ACF address(es) → optional auto-reply to submitter.
- Recipient addresses configurable in Site Settings / environment variables, not hard-coded.

### Email & Microsoft 365 compatibility
- Site domain config must remain fully compatible with ACF's **Microsoft 365** email: do **not** break existing MX/SPF/DKIM/DMARC records. Document all required DNS records (`MX`, `SPF`, `DKIM`, `DMARC`, autodiscover) in the handover docs.
- Website notification emails sent via a transactional provider with proper SPF/DKIM so they don't land in spam; deliver to designated ACF mailboxes.
- DNS at **Cloudflare**; domain/email configuration assistance via **Spaceship**.
- Microsoft 365 licensing costs are **out of scope**.

---

## 10. Non-Functional Requirements

### Responsive design
Desktop, laptop, tablet, smartphone. **Mobile-first**, since much of Zambia's audience is on mobile with variable connectivity. Test at 360px, 768px, 1024px, 1440px.

### Accessibility (target WCAG 2.1 AA)
Clear typography · good colour contrast · keyboard-friendly navigation and visible focus states · descriptive `alt` text (required field in CMS) · proper heading hierarchy (one `h1` per page) · accessible forms (labels, errors, ARIA) · mobile-friendly navigation · clear buttons/CTAs · skip links · semantic HTML landmarks · respect `prefers-reduced-motion`.

### Performance (targets)
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on key templates.
- Use `next/image`, responsive sizes, modern formats (WebP/AVIF), lazy loading, font subsetting with `next/font`, minimal client JS, caching/ISR.
- Be mindful of low-bandwidth users: avoid heavy hero videos or large unoptimised images.

### SEO
SEO-friendly page structure · metadata per page (title/description/canonical) · Open Graph + Twitter cards · clean URLs/slugs · `sitemap.xml` and `robots.txt` · structured data (JSON-LD: `Organization`, `Article`, `Event`, `JobPosting` where suitable, `BreadcrumbList`) · search-engine indexing setup (Search Console) · image optimisation. Admin should be `noindex`.

### Security
- HTTPS/SSL everywhere, HSTS, secure headers (CSP, X-Frame-Options, Referrer-Policy, etc.).
- Secure admin authentication, RBAC, RLS, rate limiting.
- Input validation and output sanitisation (XSS), CSRF protection on mutating routes, parameterised queries.
- Secure file uploads (see 7.4).
- Secrets only in environment variables; never commit them. Provide `.env.example`.
- Regular dependency updates (enable Dependabot/Renovate); run `npm audit` in CI.
- **Automated backups** of database and storage, with a documented restore procedure (configured per final hosting environment).
- Security monitoring and error tracking (e.g. Sentry).
- Privacy: collect minimum personal data; consent recorded; privacy policy page; align with Zambia's **Data Protection Act, 2021** principles.

### Analytics
Configure website traffic analytics at launch; document how ACF staff can view reports. Honour consent requirements.

---

## 11. Suggested Repository Structure

```
/
├─ docs/
│  ├─ PROJECT_GUIDE.md            ← this file
│  ├─ ADMIN_GUIDE.md              ← handover guide for ACF staff
│  └─ DNS_AND_EMAIL.md            ← DNS/M365/Cloudflare notes
├─ src/
│  ├─ app/
│  │  ├─ (public)/                ← public routes
│  │  ├─ admin/                   ← protected CMS
│  │  ├─ api/                     ← route handlers (forms, newsletter, revalidate)
│  │  ├─ sitemap.ts, robots.ts
│  │  └─ layout.tsx, not-found.tsx, error.tsx
│  ├─ components/
│  │  ├─ ui/                      ← buttons, inputs, cards, etc.
│  │  ├─ layout/                  ← header, footer, nav
│  │  ├─ sections/                ← home page sections
│  │  └─ admin/                   ← dashboard components
│  ├─ lib/
│  │  ├─ supabase/                ← client, server, middleware helpers
│  │  ├─ validations/             ← zod schemas
│  │  ├─ email/                   ← mailer + templates
│  │  ├─ newsletter/              ← provider-agnostic adapter
│  │  └─ utils/
│  ├─ types/                      ← generated DB types
│  └─ styles/
├─ supabase/
│  ├─ migrations/                 ← SQL migrations (version controlled)
│  ├─ seed.sql                    ← dummy content for dev
│  └─ policies/                   ← RLS policies
├─ public/
├─ tests/                         ← unit + e2e
├─ .env.example
└─ README.md
```

---

## 12. Engineering Conventions (Rules for the AI Assistant)

1. **Always read the relevant section of this guide before implementing a module.** If the guide and an instruction conflict, ask.
2. **TypeScript strict.** No `any` without justification. Use generated DB types.
3. **Small, focused commits and components.** One module/feature per branch/PR when possible.
4. **Never hard-code content** that ACF may change (contact details, nav labels where editable, statistics, partner logos, etc.).
5. **Never expose secrets or service-role keys to the client.** Service role is server-only.
6. **Every table gets RLS.** Write and test policies alongside migrations.
7. **Validate on both client and server** with shared `zod` schemas.
8. **Accessibility is not optional.** Use semantic elements, labels, alt text, focus management.
9. **Mobile-first CSS** with Tailwind; use design tokens (colours, spacing, fonts) so branding can be updated centrally.
10. **Use placeholder/seed content** clearly labelled as dummy. Never fabricate real-looking facts about ACF.
11. **Handle empty/loading/error states** for every list and form (e.g. "No upcoming events right now").
12. **Revalidate public pages** (ISR/on-demand) when admin publishes or edits.
13. **Write migrations, not manual DB edits.** Keep `supabase/migrations` as the source of truth.
14. **Add tests** for critical flows: form submissions, auth/permissions, publish → public visibility, opportunity auto-archive, file upload validation.
15. **Document as you go**: update README, `.env.example`, and the admin guide with any new setup or feature.
16. **When uncertain about a product/design decision, list the options and ask**, rather than silently choosing something that affects scope.
17. Do not add dependencies casually. Prefer a few well-maintained libraries.

### Branding / design direction
- Branding assets (logo, colours, fonts, brand guidelines) will be provided by ACF. **Until then**, use a neutral, credible theme (agriculture-appropriate natural greens/earth tones suggested), centralised in Tailwind tokens so it is swapped easily.
- Layout approach: clean, content-first, generous whitespace, strong typography, real photography when provided. Avoid stock-template look.
- Design deliverables before build: homepage, internal page layouts, mobile layouts, navigation, publication layouts, news/event layouts, forms and CTAs.

---

## 13. Environment and Configuration

Provide `.env.example` with at least:

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only
TURNSTILE_SITE_KEY= / TURNSTILE_SECRET_KEY=
EMAIL_PROVIDER_API_KEY= / SMTP_*
CONTACT_FORM_RECIPIENTS=            # comma-separated, ACF mailboxes
MEMBERSHIP_FORM_RECIPIENTS=
NEWSLETTER_PROVIDER= / NEWSLETTER_API_KEY=
REVALIDATE_SECRET=
NEXT_PUBLIC_ANALYTICS_ID=
SENTRY_DSN=
```

Environments: `local` → `staging` (client review) → `production`. Staging should be password-protected and `noindex`.

---

## 14. Delivery Plan (≈ 30 Calendar Days)

| Phase | Activity | Days |
|---|---|---|
| 1 | Discovery, requirements, site structure | 1–3 |
| 2 | UI/UX design and review | 4–8 |
| 3 | Website and CMS development | 9–20 |
| 4 | Content population and integrations | 21–24 |
| 5 | Testing, revisions, optimisation | 25–28 |
| 6 | Deployment, training, handover | 29–30 |

Timeline depends on ACF supplying content, approvals, and feedback on time.

### Suggested build order (Phase 3)
1. Project scaffold, Tailwind tokens, layout shell, Supabase setup, migrations, auth + RBAC, admin shell
2. Shared services: media/storage, rich text, site settings, SEO helpers, email, form/spam utilities
3. **Publications** (highest-value, most complex; includes search, filters, file management)
4. News and Events
5. Programmes (Our Work) and About/People
6. Opportunities (with auto-archive)
7. Membership + Partners
8. Contact + Newsletter
9. Home page assembly, site search, sitemap/robots/structured data
10. Hardening: accessibility pass, performance pass, security review, tests, backups, analytics

### Phase 5 test checklist
Desktop/mobile responsiveness · browser compatibility (latest Chrome, Safari, Firefox, Edge, plus Android Chrome) · links and navigation · all forms (incl. email delivery) · document downloads · admin functionality and permissions · performance · security · accessibility · content presentation.

---

## 15. Deliverables Checklist

- [ ] Modern responsive website interface (design)
- [ ] Fully functional public ACF website
- [ ] Dynamic programmes/thematic areas
- [ ] Searchable, downloadable publications repository
- [ ] News, updates, and event management
- [ ] Membership info + online enquiry/application
- [ ] Opportunities (jobs, tenders, procurement, consultancy) with auto-archive
- [ ] Partners and network section
- [ ] Secure admin dashboard (CMS) with roles
- [ ] Secure document upload and management
- [ ] Contact, membership, and other forms
- [ ] Newsletter subscription
- [ ] SSL, authentication, and site protections
- [ ] Automated backup configuration
- [ ] Basic technical SEO (metadata, sitemap, clean URLs, social metadata)
- [ ] Analytics configuration
- [ ] Training session for designated ACF administrators
- [ ] Admin/handover documentation (simple administrator reference guide)
- [ ] Production deployment and launch

### Training topics (inform admin UX decisions)
Logging in · creating/updating pages · publishing news · creating events · uploading publications · managing opportunities · updating staff/board profiles · updating programme info · managing partners · reviewing form submissions · managing images/documents · basic administration.

---

## 16. Out of Scope (Unless Added in Writing)

Microsoft 365 licensing · domain renewals · third-party software subscriptions · paid newsletter services · premium external APIs · major functionality added after scope approval · large-scale historical document digitisation · professional copywriting · professional photography/video · ongoing content entry after handover.

> If a request falls into this list or significantly expands scope, **flag it** instead of building it.

Post-launch support and maintenance (bug fixes, monitoring, security/dependency updates, backup monitoring, performance tuning, CMS assistance, minor layout tweaks) is a **separate arrangement**.

---

## 17. ACF Responsibilities (Dependencies and Blockers)

ACF supplies: approved organisational content (vision, mission, objectives, history) · programme information · staff/board information · publications and reports · photographs and approved media · partner logos and info · branding assets and guidelines · contact and social information · timely feedback/approvals · access to domain, hosting, and Microsoft 365 settings.

**Until real content arrives, develop against clearly labelled seed data** so work isn't blocked.

---

## 18. Open Questions / Assumptions to Confirm

Track and resolve these early, and update this document when answered.

1. Final **hosting platform** and whether ACF requires data residency or specific hosting providers.
2. **Domain** to use (acfzambia.org?) and who controls DNS, Cloudflare, and Spaceship accounts.
3. **Brand assets**: logo, colours, fonts, and guidelines available?
4. **Newsletter platform** ACF prefers (Mailchimp, Brevo, MailerLite, other)?
5. **Migration** of existing content from the current acfzambia.org (news, publications): in scope for Phase 4 content population?
6. **Languages**: English only, or also local languages?
7. **Membership application**: free enquiry only, or does it involve fees/payments (currently out of scope)?
8. **Application workflow** for jobs/tenders: external links/email only, or any in-site application upload?
9. **Roles**: how many admin users, and who approves publishing?
10. **Event registration**: simple external link, or on-site registration?
11. Confirmed **contact details** and office hours.
12. **Analytics** tool preference and consent-banner requirements.
13. Max upload size and total storage expectations for publications.

---

## 19. Definition of Done (Per Feature)

A feature is done when:
- It matches the requirements in this guide.
- Content is fully editable from the CMS (where applicable) with appropriate permissions and RLS.
- Public page is responsive, accessible, and SEO-ready (metadata, structured data if relevant).
- Validation, error, loading, and empty states are handled.
- Tests are added or updated and pass; lint and type-check pass.
- No secrets in code; `.env.example` and docs updated.
- Verified on a staging deployment.

---

*Sources of context: SpaceMinds Technologies' ACF Website Development Proposal and background information on ACF compiled from public sources (e.g. ACF's website, International Land Coalition profile, ACF Facebook page). Treat organisational facts as provisional until confirmed by ACF.*
