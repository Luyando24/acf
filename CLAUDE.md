# CLAUDE.md: ACF Website & CMS

You are helping build the website and admin CMS for the **Agricultural Consultative Forum (ACF)**, a Zambian multi-stakeholder agricultural policy NGO based in Lusaka. Builder: SpaceMinds Technologies.

**Full requirements live in `docs/PROJECT_GUIDE.md`. Task checklists live in `docs/TASKS.md`.** Read the relevant section of the guide before starting any module. If an instruction conflicts with the guide, ask before proceeding.

## What we're building
A responsive, accessible institutional website plus a secure admin dashboard (`/admin`) so non-technical ACF staff can manage all content without touching code. Modules: Home, About (history, vision, mission, board, management, staff), Our Work (programmes), Publications repository, News & Events, Membership & Partners, Opportunities (jobs, tenders, consultancies, procurement), Contact, Newsletter.

## Stack (defaults)
Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS · Node.js route handlers/server actions · Supabase (Postgres, Auth, Storage, RLS) · Cloudflare (DNS) · Microsoft 365 email compatibility · deployed to modern cloud hosting.

## Design Inspiration
Get design and system architecture inspiration from the zgf project on the desktop of this computer. Use a modern, clean design with a focus on user experience. Use the ACF branding guidelines for colors, typography, and other design elements. Please note the theme color is Dark green, light green and black in some sections.

## Non-negotiable rules
1. **No hard-coded editable content.** Contact details, stats, partners, nav labels, etc. come from the CMS/database (`site_settings`).
2. **RLS on every table.** Public can only read `published` rows; form tables are insert-only via server routes. Never rely on UI hiding for security.
3. **Service-role key is server-only.** Never expose secrets; keep `.env.example` current.
4. **Validate on client and server** with shared `zod` schemas. Forms need spam protection (Turnstile + honeypot), consent checkbox, and privacy link.
5. **Accessibility (WCAG 2.1 AA):** semantic HTML, one `h1` per page, labelled forms, visible focus, required alt text, keyboard navigation.
6. **Mobile-first and fast.** Use `next/image`, minimal client JS, ISR/on-demand revalidation when admin publishes. Target Lighthouse mobile ≥ 90.
7. **Migrations, not manual DB edits.** `supabase/migrations` is the source of truth.
8. **Never fabricate ACF facts.** Use clearly labelled placeholder/seed content. Contact details in the guide are provisional.
9. **Handle empty, loading, and error states** on every list and form.
10. **Secure uploads:** whitelist MIME/extension, size limit, randomised filenames; drafts and private files must not be publicly accessible.
11. **Opportunities auto-archive** after their closing date, with no manual step.
12. **Don't add scope.** Out of scope: M365 licensing, payments, copywriting, photography, historical digitisation, post-launch content entry. Flag these instead of building them.
13. **Don't add dependencies casually.** Prefer a few well-maintained libraries.
14. **When uncertain about a product or design decision, list options and ask.**

## Workflow
- Work one module per branch/PR, in the build order in the guide (Section 14).
- Add tests for critical flows: form submission, auth/permissions, publish → public visibility, opportunity archive, file upload validation.
- Run lint, type-check, and tests before declaring work done.
- Update README, `.env.example`, and `docs/ADMIN_GUIDE.md` as features land.

## Definition of done (per feature)
Matches the guide · fully editable from the CMS with correct permissions · responsive, accessible, SEO-ready · all states handled · tests pass · no secrets in code · docs updated · verified on staging.

## Locale
English · timezone `Africa/Lusaka` · dates as `DD Month YYYY` · currency ZMW where relevant.
