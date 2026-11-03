# Agricultural Consultative Forum (ACF) - Admin CMS Guide

This guide is for ACF Secretariat personnel, Editors, and Administrators managing the institutional website through the ACF Admin CMS.

---

## 1. Accessing the Admin CMS

- **Portal URL:** `/admin` (or direct login at `/admin/login`)
- **Credentials:** Email and password for a Supabase Auth user that has an active row in `profiles`. There is no demo or passwordless login.
- **Roles:**
  - **Super Admin / Admin:** Complete control over site settings, users, permissions, publications, and submissions.
  - **Editor:** Can manage publications, news, events, programmes, and opportunities.
  - **Viewer:** Read-only access to submissions, analytics, and activity logs.

> [!NOTE]
> All `/admin/**` routes are protected by server-side middleware and Row Level Security (RLS). Unauthorized visitors are redirected to `/admin/login`.

---

## 2. Dashboard Overview (`/admin`)

Upon signing in, the dashboard displays:
- **Real-Time Counters:** Total publications, published articles, active opportunities, and pending membership applications.
- **Quick Actions:** Instant shortcuts to create a new publication, publish a news article, post an event, or update site settings.
- **Recent Submissions:** Immediate view of pending membership reviews and unread contact messages from Zambian stakeholders.

---

## 3. Managing Publications & Policy Knowledge Hub (`/admin/publications`)

ACF's primary asset is its policy research. Publications can be organized, featured, and searched.
- **Title & Slug:** Clean, human-readable URLs (e.g. `national-fertiliser-subsidy-review-2025`).
- **Category:** Categorized into Policy Briefs, Research Reports, Annual Reports, Parliamentary Submissions, Workshop Reports, or Strategic Plans.
- **File Upload:** PDF, Word, Excel, or PowerPoint up to 50MB, and PNG, JPG, WebP, or GIF up to 15MB. Files are stored in Supabase Storage under a random name. SVG is not accepted. Document files stay private until the record is published.
- **Featured Flag:** Highlighting top papers on the website homepage and publications header.
- **Publication Date:** Recorded in `DD Month YYYY` Zambian format.

---

## 4. Managing News & Press Releases (`/admin/news`)

- **Publishing Workflow:** Draft, Scheduled, or Published status.
- **Featured Image & Summary:** Displayed on public cards and used for Open Graph social media sharing.
- **Full Content:** Rich text with headings, blockquotes, and embedded links.

---

## 5. Managing Events & Multi-Stakeholder Dialogues (`/admin/events`)

- **Event Categorization:** Automatic segregation into **Upcoming** and **Past** events based on the date in `Africa/Lusaka` (CAT) timezone.
- **Event Metadata:** Start time, end time, physical venue (e.g., *Mulungushi International Conference Centre*), and online registration links.

---

## 6. Managing Opportunities (`/admin/opportunities`)

- **Opportunity Types:** Tenders, Consultancies, Job Openings, Calls for Proposals, and Internships.
- **Closing Date Automation:** Opportunities are automatically moved to the `/opportunities/archive` section once the closing date has passed at 23:59:59 Lusaka time.
- **Status Badges:** Active opportunities display remaining days; expired opportunities display an explicit "Closed" status.

---

## 7. Membership Applications & Caucus Categories (`/admin/membership`)

- **Applicant Review:** Review corporate, NGO, institutional, and individual farmer applicants.
- **Status Updates:** Update application status (`new`, `in_review`, `approved`, `declined`).
- **CSV Export:** Accessible at `/api/admin/export/membership` for committee meetings.
- **Categories & Requirements Management (`/admin/membership/categories`):** Add, edit, reorder (`Move Up`/`Move Down`), and configure benefits and eligibility criteria without editing code.

---

## 8. General Site Settings & Working Hours (`/admin/settings`)

Editable without code deployment:
- **Working Hours:** Editable directly; updates immediately propagate to the global footer and `/contact` page.
- **Contact Details:** Secretariat physical address, phone numbers, and official emails.
- **Social Media Links:** Official Facebook, Twitter/X, and LinkedIn URLs.
- **Impact Statistics:** Customizable counters displayed on the homepage hero section.

---

## 9. Page Content Management (`/admin/pages`)

Manage static page copy, narratives, and banners:
- **Home (`/admin/pages/home`):** Hero carousel slides, narrative snippet, section visibility toggles.
- **About (`/admin/pages/about`):** Header banner, Vision, Mission, Core Values & Guiding Principles, History (narrative and dialogue photo), Strategic Objectives, and Governance links.
- **Contact (`/admin/pages/contact`):** Header description, office directions, and enquiry copy.
- **Membership (`/admin/pages/membership`):** Why join benefits and stakeholder CTA.

---

## 10. End-User Manual
For the comprehensive, non-technical staff manual with step-by-step screenshots and FAQs, refer to:
👉 [**docs/USER_GUIDE.md**](file:///c:/Users/User/Desktop/acf/docs/USER_GUIDE.md)
