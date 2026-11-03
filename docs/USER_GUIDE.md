# Agricultural Consultative Forum (ACF)
## Website & Content Management System (CMS) User Guide

**Target Audience:** ACF Secretariat Personnel, Communications Officers, Content Editors, and Portal Administrators.  
**Portal URL:** `https://your-domain.org.zm/admin` (or `/admin` in local/staging environments)  
**Supported Browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari.

---

## Table of Contents
1. [Introduction & Role-Based Access](#1-introduction--role-based-access)
2. [Signing In & Account Security](#2-signing-in--account-security)
3. [The Admin Dashboard Overview](#3-the-admin-dashboard-overview)
4. [General Site Settings & Working Hours](#4-general-site-settings--working-hours)
5. [Page Content Management (`/admin/pages`)](#5-page-content-management-adminpages)
   - [5.1 Home Page Editor](#51-home-page-editor)
   - [5.2 About Us Page & Core Values](#52-about-us-page--core-values)
   - [5.3 Contact Page Editor](#53-contact-page-editor)
   - [5.4 Membership Overview Editor](#54-membership-overview-editor)
6. [Membership Applications & Caucus Categories](#6-membership-applications--caucus-categories)
   - [6.1 Reviewing & Processing Applications](#61-reviewing--processing-applications)
   - [6.2 Managing Membership Categories & Requirements](#62-managing-membership-categories--requirements)
   - [6.3 Exporting Submissions to CSV](#63-exporting-submissions-to-csv)
7. [Publications & Policy Knowledge Hub](#7-publications--policy-knowledge-hub)
8. [News & Press Releases](#8-news--press-releases)
9. [Events & Stakeholder Dialogues](#9-events--stakeholder-dialogues)
10. [Opportunities (Tenders, Consultancies & Vacancies)](#10-opportunities-tenders-consultancies--vacancies)
11. [Leadership & People (Board, Management, Staff)](#11-leadership--people-board-management-staff)
12. [Programmes & Collaborating Partners](#12-programmes--collaborating-partners)
13. [Media Library & File Upload Rules](#13-media-library--file-upload-rules)
14. [Staff User Management & Invitations](#14-staff-user-management--invitations)
15. [Troubleshooting & Frequently Asked Questions](#15-troubleshooting--frequently-asked-questions)

---

## 1. Introduction & Role-Based Access

The ACF Content Management System (CMS) enables staff to manage the entire public website without writing or modifying code. To ensure security and editorial integrity, user accounts operate under four distinct roles:

| Role | Permissions & Responsibilities | Typical User |
| :--- | :--- | :--- |
| **Super Admin** | Full access: invite/remove staff, manage roles, configure system settings, export database records, delete content. | Executive Director, IT Head |
| **Admin** | High-level management: approve membership applications, export submissions, manage all content modules. | Secretariat Coordinator, Operations Manager |
| **Editor** | Day-to-day authoring: create, edit, and publish news, events, publications, opportunities, and page copy. | Communications Officer, Research Fellow |
| **Viewer** | Read-only access: review submitted applications and contact messages without editing rights. | Monitoring & Evaluation Intern, Auditor |

---

## 2. Signing In & Account Security

### 2.1 Accessing the Portal
1. Open your web browser and navigate to `/admin` or `/admin/login`.
2. Enter your authorized official email address and password.
3. Click **Sign In to Dashboard**.

### 2.2 Password Security & Reset
- Initial staff passwords are generated securely upon invitation.
- **To reset your password:** If you forget your password, click **Forgot Password?** on the login screen, enter your email address, and follow the secure link delivered to your inbox.
- Super Admins can also trigger a temporary password reset from **Admin &gt; Staff Accounts** (`/admin/staff`).

---

## 3. The Admin Dashboard Overview

Upon signing in, you will arrive at the main command center (`/admin`):
- **Live Statistics Cards:** Real-time counters showing total publications, published news articles, active tenders/vacancies, and pending membership submissions.
- **Quick Shortcuts:** Direct 1-click buttons to post new content immediately (*Upload Publication*, *Add News Article*, *Schedule Event*, *Update Settings*).
- **Recent Submissions Stream:** Instant preview of pending membership caucus applications and incoming stakeholder inquiries.

---

## 4. General Site Settings & Working Hours

**Navigation:** Click **Settings** in the left sidebar (`/admin/settings`).

This screen controls global institutional metadata displayed across the entire website.

### 4.1 Updating Working Hours
1. In the **Secretariat General Information** card, locate the **Working Hours** input field.
2. Enter your current operating hours (e.g., `Monday - Friday: 08:00 - 17:00 CAT`).
3. Click **Save Settings Changes**.
4. **Where it appears:** Changes immediately update across:
   - The global website **Footer** on every page.
   - The **Contact Us** page under Secretariat office details.

### 4.2 Updating Address, Phone, Email & Social Media
- **Institutional Logo:** Enter a URL or file path (e.g., `/photos/logo.png`).
- **Official Email & Hotline:** Enter the Secretariat's primary contact numbers and email address.
- **Social Media:** Paste full URLs for Facebook, Twitter (X), and LinkedIn.

---

## 5. Page Content Management (`/admin/pages`)

**Navigation:** Click **Page Content** in the left sidebar (`/admin/pages`).

Here, authorized staff can update copy, narrative banners, and visual layouts across the main institutional pages.

### 5.1 Home Page Editor (`/admin/pages/home`)
- **Hero Carousel Slides:** Update slide titles, captions, and background photos illustrating ACF roundtables.
- **Strategic Narrative:** Refine the introductory overview text.
- **Visibility Toggles:** Control whether specific optional sections are highlighted.

### 5.2 About Us Page & Core Values (`/admin/pages/about`)
The About Page editor features organized tabs for all institutional pillars:
- **Header Banner:** Update the top hero badge, title, and intro description.
- **Vision & Mission:** Edit ACF's official Vision and Mission statements.
- **Core Values & Guiding Principles:**
  - View and manage the 7 foundational principles (*Non-partisan and independency*, *Innovation and creativity*, *Transparency, accountability & governance*, *Inclusiveness*, *Professionalism*, *Evidence-based policy advocacy*, *Membership and ownership*).
  - Modify alphabetical tags (`a` through `g`), titles, or explanatory paragraphs.
  - Click **Add Value** to introduce an additional guiding principle, or click the trash can icon to remove one.
- **Background & History:** Manage the historical narrative paragraphs and the featured dialogue photo banner.
- **Strategic Objectives:** Update the 4 core thematic objectives.
- **Saving:** Click **Save & Publish** at the top right when finished.

### 5.3 Contact Page Editor (`/admin/pages/contact`)
- Customize page intro copy and header banner text.
- Adjust specific Secretariat office location guidelines and directions.

### 5.4 Membership Overview Editor (`/admin/pages/membership`)
- Edit the introductory headline and value proposition cards (*Why Join ACF*).
- Click **Manage Categories & Requirements** to access the dynamic category configuration tool.

---

## 6. Membership Applications & Caucus Categories

**Navigation:** Click **Membership** in the left sidebar (`/admin/membership`).

### 6.1 Reviewing & Processing Applications
1. In the **Applications List** tab, review incoming stakeholder submissions.
2. Filter applications by status (**New**, **In Review**, **Approved**, **Declined**) or use the search bar to locate an organization by name, contact person, or province.
3. Click the **View / Eye** icon next to any submission to open the detail review drawer:
   - Verify PACRA/registration credentials and contact phone/email.
   - Change the application status (e.g., from `New` to `Approved`).
   - Add internal Secretariat review notes.
   - Click **Save Status Update**.

### 6.2 Managing Membership Categories & Requirements (`/admin/membership/categories`)
1. Click the **Categories & Requirements** tab.
2. **Editing an Existing Category:**
   - Click **Edit Category**.
   - Update the Caucus Name and description.
   - **Key Member Benefits:** Add, edit, or remove dynamic benefit bullet points.
   - **Eligibility Criteria & Requirements:** Add, edit, or remove qualification requirements.
   - Click **Save Changes**.
3. **Reordering Categories:**
   - Click **Move Up** or **Move Down** on any category card to change the sequence in which caucuses appear on the public `/membership` page and `/membership/apply` dropdown.
4. **Adding a New Category:**
   - Click **Add Category** at the top right, fill in the criteria, and save.

### 6.3 Exporting Submissions to CSV
- Click **Export Submissions (CSV)** at the top right to download a spreadsheet for review by the Membership Committee or Board of Directors.

---

## 7. Publications & Policy Knowledge Hub

**Navigation:** Click **Publications** in the left sidebar (`/admin/publications`).

### 7.1 Uploading a New Research Paper or Policy Brief
1. Click **New Publication**.
2. **Title & Document Category:** Select the appropriate document type:
   - *Policy Brief*
   - *Research Report*
   - *Annual Report*
   - *Parliamentary Submission*
   - *Workshop Report*
   - *Strategic Plan*
3. **Publication Date:** Select the date the document was authored/validated.
4. **Authors / Institutions:** Credit researchers or partnering entities (e.g., *ACF Secretariat in collaboration with IAPRI*).
5. **Executive Summary:** Provide a 1–2 paragraph abstract.
6. **Upload Document:** Drag and drop the official document file (PDF, Word, Excel, or PowerPoint up to 50MB).
7. **Cover Image (Optional):** Upload a cover photograph or thumbnail (JPG/PNG up to 15MB).
8. **Featured Highlight:** Toggle **Featured** if this report should be pinned to the top of the public Knowledge Hub.
9. Click **Publish Document**.

---

## 8. News & Press Releases

**Navigation:** Click **News & Articles** in the left sidebar (`/admin/news`).

### 8.1 Publishing a Press Release or Article
1. Click **Write Article**.
2. **Article Headline:** Enter a clear, informative title.
3. **Summary / Excerpt:** Write a short 2-sentence teaser displayed on cards and search results.
4. **Featured Image:** Upload a high-resolution landscape photo (16:9 aspect ratio recommended).
5. **Article Body:** Format content using headings, lists, bold text, blockquotes, and links.
6. **Publication Status:**
   - Choose **Draft** to save your progress privately.
   - Choose **Published** to make it immediately visible to the public.
7. Click **Save Article**.

---

## 9. Events & Stakeholder Dialogues

**Navigation:** Click **Events** in the left sidebar (`/admin/events`).

### 9.1 Scheduling a Policy Dialogue or Workshop
1. Click **Create Event**.
2. **Event Title:** e.g., *National Agricultural Budget Analysis and Validation Session*.
3. **Dates & Times:** Specify start date, start time, and end time.
   > **Automatic Categorization:** The system automatically categorizes events as **Upcoming** or **Past** based on the current date and time in Zambia (`Africa/Lusaka` timezone). No manual archiving is required!
4. **Venue:** Specify physical venue (e.g., *Mulungushi International Conference Centre, Lusaka*) or Virtual Link.
5. **Registration Link (Optional):** Add a link for participants to register online.
6. Click **Publish Event**.

---

## 10. Opportunities (Tenders, Consultancies & Vacancies)

**Navigation:** Click **Opportunities** in the left sidebar (`/admin/opportunities`).

### 10.1 Posting a Call for Proposals, Tender, or Job Opening
1. Click **Post Opportunity**.
2. **Opportunity Classification:** Select *Tender*, *Consultancy*, *Job Opening*, *Call for Proposals*, or *Internship*.
3. **Closing Date & Time:** Set the submission deadline.
   > **Automatic Expiration:** Once the closing deadline passes (23:59:59 Lusaka time), the website automatically tags the post as **Closed** and moves it to `/opportunities/archive`.
4. **Scope of Work / Terms of Reference:** Outline qualifications, tasks, and submission guidelines.
5. **Attachment (Optional):** Upload the full Terms of Reference (ToR) or Tender Document (PDF up to 50MB).
6. Click **Publish Opportunity**.

---

## 11. Leadership & People (Board, Management, Staff)

**Navigation:** Click **People & Team** in the left sidebar (`/admin/people`).

Manage the profiles displayed under `/about/board`, `/about/management`, and `/about/staff`.

### 11.1 Adding or Updating a Profile
1. Click **Add Person** or click **Edit** on an existing profile.
2. **Group Classification:** Select *Board of Directors*, *Management*, or *Secretariat Staff*.
3. **Full Name & Role Title:** e.g., *Dr. John Banda, Executive Director*.
4. **Bio / Narrative:** Brief summary of professional experience and qualifications.
5. **Portrait Photo:** Upload a professional portrait photo (JPG or PNG, minimum 400x400px).
6. **Display Order:** Set a number to control who appears first in the list.
7. Click **Save Profile**.

---

## 12. Programmes & Collaborating Partners

### 12.1 Managing Thematic Programmes (`/admin/programmes`)
- Add or update ACF's core programmes (e.g., *Policy Dialogue*, *Evidence-Based Research*, *Customary Land Tenure Rights*).
- Specify programme objectives, current initiatives, and contact officers.

### 12.2 Managing Collaborating Partners (`/admin/partners`)
- Add partner organizations, donors, and academic collaborators.
- Upload partner logos (PNG with transparent background or high-res JPG).
- Add website links for each partner entity.
- These logos appear on both the public Partners directory and the homepage Collaborating Partners strip.

---

## 13. Media Library & File Upload Rules

**Navigation:** Click **Media Library** in the left sidebar (`/admin/media`).

### 13.1 Supported File Formats & Limits
| File Type | Accepted Extensions | Maximum File Size | Recommended Dimensions |
| :--- | :--- | :--- | :--- |
| **Photographs** | `.jpg`, `.jpeg`, `.png`, `.webp` | 15 MB | 1920x1080 (Hero), 1200x800 (Cards) |
| **Documents** | `.pdf`, `.docx`, `.xlsx`, `.pptx` | 50 MB | Standard document layouts |

> [!WARNING]
> - SVG image files are strictly rejected for security reasons.
> - High-resolution camera photos (e.g. 10MB+) are automatically optimized when uploaded.
> - Uploaded files are stored in secure cloud storage with encrypted URLs.

---

## 14. Staff User Management & Invitations

**Navigation:** Click **Staff Accounts** in the left sidebar (`/admin/staff`) *(Super Admin only)*.

### 14.1 Inviting a New Team Member
1. Click **Invite Staff Member**.
2. Enter the employee's official email address and full name.
3. Assign their role (**Admin**, **Editor**, or **Viewer**).
4. Click **Send Invitation**.
5. The system generates a secure initial password and sends onboarding instructions to their email.

### 14.2 Revoking or Modifying Access
- Click **Edit Role** to change permissions between Editor, Admin, or Viewer.
- Click **Deactivate Account** if a staff member departs the Secretariat. Deactivated users cannot log in.

---

## 15. Troubleshooting & Frequently Asked Questions

### Q1: I updated the working hours in Settings, but I still see the old hours on my phone.
> **Answer:** Your mobile browser may have temporarily cached the page. Perform a hard refresh (pull down on mobile or press `Ctrl + F5` on desktop). The server immediately updates the database.

### Q2: Why is my PDF download link showing "Access Denied"?
> **Answer:** If the publication is still in **Draft** status, its attached document remains protected and is only visible to logged-in staff. Change the publication status to **Published** to make the file accessible to the public.

### Q3: An opportunity closed yesterday, but it is still showing on the website.
> **Answer:** Opportunities stay active until 23:59:59 Central Africa Time (CAT) on their specified closing date. Once that timestamp passes, the opportunity automatically transitions to the `/opportunities/archive` tab without requiring manual staff intervention.

### Q4: How do I change the order of the Membership Categories?
> **Answer:** Navigate to **Membership &gt; Categories &amp; Requirements** (`/admin/membership/categories`) and click the **Move Up** or **Move Down** arrow on any category card. The public apply dropdown and overview page will immediately match your new sequence.

---

*Document Version:* 2.0  
*Last Updated:* November 2026  
*Maintained by:* Agricultural Consultative Forum (ACF), Lusaka, Zambia.

