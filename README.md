# Agricultural Consultative Forum (ACF) - Web Platform & CMS

Official institutional website and Content Management System (CMS) for the **Agricultural Consultative Forum (ACF)**, a leading multi-stakeholder agricultural policy NGO based in Lusaka, Zambia.

Built by **SpaceMinds Technologies**.

---

## 🌾 Overview

The platform serves as Zambia's agricultural knowledge and policy advocacy hub, connecting:
- Government ministries and statutory bodies (e.g. Ministry of Agriculture, Ministry of Fisheries & Livestock)
- Research institutes and academia (IAPRI, UNZA, Golden Valley Agricultural Research Trust)
- Commercial & smallholder farmer federations (ZNFU, smallholder cooperatives)
- Agribusiness, financial institutions, civil society, and cooperating partners

### Key Features
- **Public Institutional Portal:** High-performance, accessible (WCAG 2.1 AA), mobile-responsive site featuring ACF's Mandate, History, Governance (Board & Secretariat), Programmes, and Partner ecosystem.
- **Publications & Policy Knowledge Hub:** Full-text searchable database with category filters, download metrics, and metadata for policy briefs, research reports, and parliamentary submissions.
- **News, Events & Multi-Stakeholder Dialogues:** Timely press releases and event calendars split into upcoming and past gatherings with ICS calendar export support.
- **Opportunities with Auto-Archiving:** Tenders, consultancies, and job vacancies that automatically archive based on the closing date in `Africa/Lusaka` (CAT) timezone.
- **Membership & Partner Management:** Online membership registration with statutory consent verification, spam honeypot filtering, and administrative CSV export.
- **Full Admin CMS:** Secure, role-based staff dashboard protected by Supabase Auth and Row Level Security (RLS) for managing all editable content without hardcoding.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router) + React 19
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4 with ACF institutional brand tokens:
  - Deep Forest Green: `#0f1d14`, `#175432`
  - Agricultural Lime / Growth Green: `#2da44e`, `#a3e635`
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Storage, and Row Level Security)
- **Validation & Security:** Zod schemas, spam honeypot fields, and statutory data consent compliance
- **Icons & Typography:** Lucide React, Plus Jakarta Sans, and Inter

---

## 🛠️ Project Structure

```
acf/
├── docs/                   # Specifications, project guide, admin guide, and tasks
│   ├── PROJECT_GUIDE.md    # Master architecture and functional specifications
│   ├── ADMIN_GUIDE.md      # Staff manual for CMS operations
│   └── TASKS.md            # Implementation roadmap & checklist
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/       # Public pages (Home, About, Our Work, Publications, News, Events, etc.)
│   │   ├── admin/          # Admin CMS dashboard and management modules
│   │   ├── api/            # Server API endpoints (Contact, Membership, Newsletter, Revalidation)
│   │   ├── layout.tsx      # Root HTML layout with typography & metadata
│   │   ├── sitemap.ts      # Automated XML sitemap generator
│   │   └── robots.ts       # Robots.txt configuration
│   ├── components/         # Reusable UI & Layout components
│   │   ├── admin/          # Admin sidebar, headers, and form widgets
│   │   ├── layout/         # TopBar, Header with mobile nav, and Footer
│   │   └── ui/             # Person cards, social icons, and stat blocks
│   ├── lib/
│   │   ├── supabase/       # SSR, admin, and client Supabase connections
│   │   ├── validations/    # Zod schemas with honeypots & consent
│   │   ├── utils/          # Lusaka date formatters, currency, and SEO builders
│   │   ├── email/          # Transactional email service
│   │   └── newsletter/     # Newsletter subscription adapter
│   └── types/              # Generated TypeScript database types
├── supabase/
│   ├── migrations/         # PostgreSQL DDL migrations & RLS policies
│   └── seed.sql            # Seed dataset reflecting ACF's mandate and Lusaka office
├── tests/                  # Unit tests for formatters and validation schemas
└── package.json
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js 20+ (Node 26 LTS tested)
- npm or pnpm
- Supabase project (cloud or local Supabase CLI)

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials and optional SMTP/M365 settings:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Migration & Seed
Run migrations and apply seed data via Supabase CLI or SQL editor:
```bash
# In Supabase SQL editor:
# 1. Execute supabase/migrations/20261012000001_core_schema.sql
# 2. Execute supabase/migrations/20261012000002_rls_policies.sql
# 3. Execute supabase/seed.sql
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

Run the test suite:
```bash
npm test
```
Tests cover:
- Lusaka timezone date and datetime formatting (`DD Month YYYY`)
- Zambian Kwacha (ZMW) currency formatting
- Opportunity auto-archiving date logic
- Form validation schemas (spam honeypot detection & statutory consent enforcement)

Run production build validation:
```bash
npm run build
```

---

## 🔒 Security & Data Privacy

- **Row Level Security (RLS):** Enforced on all database tables. Public visitors can only read published records.
- **Service Role Isolation:** `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to server-side API routes and never exposed to the client.
- **Spam Protection:** All public submission forms include an invisible honeypot field (`website_url_hp`) that immediately rejects automated bots.
- **Zambian Data Privacy:** Form submissions require affirmative consent under relevant data protection frameworks.

---

## 📄 License

Proprietary © Agricultural Consultative Forum (ACF) & SpaceMinds Technologies. All rights reserved.
