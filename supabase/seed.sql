-- ====================================================================
-- ACF Seed Data (Clearly labelled placeholder / test data)
-- File: supabase/seed.sql
-- ====================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (key, value, description) VALUES
('general', '{
    "site_name": "Agricultural Consultative Forum (ACF)",
    "tagline": "Multi-stakeholder dialogue & evidence-based policy for sustainable agriculture in Zambia",
    "description": "ACF is a Zambian multi-stakeholder agricultural policy NGO bringing together the public sector, private sector, smallholder farmers, and civil society to champion sustainable agricultural development.",
    "email": "info@acfzambia.org",
    "phone": "+260 95 4755071",
    "address": "24 Elm Rd, Woodlands, Lusaka, Zambia",
    "office_hours": "Monday - Friday: 08:00 - 17:00 CAT",
    "logo_url": "/photos/logo.png",
    "facebook_url": "https://facebook.com/ACFZambia",
    "twitter_url": "https://twitter.com/ACFZambia",
    "linkedin_url": "https://linkedin.com/company/acfzambia",
    "youtube_url": ""
}'::jsonb, 'General contact information, logo and social profiles'),

('hero_slides', '[
    {
        "image_url": "/photos/fosta-stakeholders-dialogue.jpg",
        "alt_text": "FoSTA Health Stakeholders Policy Dialogue in Lusaka",
        "caption": "FoSTA Health Stakeholders Policy Dialogue"
    },
    {
        "image_url": "/photos/agricultural-budget-analysis.jpg",
        "alt_text": "National Agricultural Budget Analysis and Validation Session",
        "caption": "National Agricultural Budget Analysis"
    },
    {
        "image_url": "/photos/beef-report-workshop.jpg",
        "alt_text": "Livestock and Beef Value Chain Report Dissemination Workshop",
        "caption": "Livestock & Beef Value Chain Dissemination"
    },
    {
        "image_url": "/photos/budget-proposal-workshop.jpg",
        "alt_text": "Agricultural Policy Budget Proposal Consultative Workshop",
        "caption": "Agricultural Budget Proposal Consultative Forum"
    }
]'::jsonb, 'Homepage hero background photography slides'),

('stats', '[
    {"label": "Policy Dialogues Held", "value": "120+", "order": 1},
    {"label": "Research Publications", "value": "85+", "order": 2},
    {"label": "Farmer Groups Reached", "value": "50,000+", "order": 3},
    {"label": "Stakeholder Partners", "value": "40+", "order": 4}
]'::jsonb, 'Homepage impact counter metrics'),

('hero', '{
    "title": "Evidence-Based Policy Dialogue for Zambia''s Agricultural Transformation",
    "subtitle": "Bridging smallholder farmers, policymakers, agribusinesses, and researchers to advance food security, climate resilience, and equitable land rights across Zambia.",
    "cta_primary_label": "Explore Our Work",
    "cta_primary_url": "/our-work",
    "cta_secondary_label": "Publications Repository",
    "cta_secondary_url": "/publications"
}'::jsonb, 'Homepage hero banner configuration')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Publication Categories
INSERT INTO public.publication_categories (id, slug, name, order_index) VALUES
('11111111-1111-1111-1111-111111111101', 'policy-briefs', 'Policy Briefs', 1),
('11111111-1111-1111-1111-111111111102', 'research-reports', 'Research Reports', 2),
('11111111-1111-1111-1111-111111111103', 'technical-reports', 'Technical Reports', 3),
('11111111-1111-1111-1111-111111111104', 'policy-advisory-notes', 'Policy Advisory Notes', 4),
('11111111-1111-1111-1111-111111111105', 'newsletters', 'Newsletters', 5),
('11111111-1111-1111-1111-111111111106', 'presentations', 'Presentations & Working Papers', 6),
('11111111-1111-1111-1111-111111111107', 'other', 'Other Documents', 7)
ON CONFLICT (slug) DO NOTHING;

-- 3. Programmes (Our Work)
INSERT INTO public.programmes (id, slug, title, summary, body, icon, order_index, status) VALUES
('22222222-2222-2222-2222-222222222201', 'policy-advocacy', 'Agricultural Policy Advocacy', 'Mobilising multi-stakeholder consultations and evidence to influence national agricultural policy formulation and implementation in Zambia.', '<p>The Agricultural Consultative Forum (ACF) facilitates high-level policy advocacy that connects grassroots smallholder farmer experiences with national policymakers in Lusaka.</p><p>We conduct regular policy roundtables with the Ministry of Agriculture, parliamentary committees, and donor working groups.</p>', 'Scale', 1, 'published'),

('22222222-2222-2222-2222-222222222202', 'research-and-evidence', 'Research & Evidence Generation', 'Generating credible empirical data, analytical briefs, and sector performance reviews to guide agricultural investments.', '<p>Sound policies require rigorous evidence. ACF works closely with agricultural research institutes and universities to conduct independent studies on input subsidy performance, grain markets, and agricultural financing in Zambia.</p>', 'BookOpen', 2, 'published'),

('22222222-2222-2222-2222-222222222203', 'multi-stakeholder-dialogue', 'Multi-Stakeholder Dialogue', 'Providing a neutral, inclusive convening platform where government, agribusiness, donors, and smallholder farmer groups collaborate.', '<p>ACF serves as a trusted national forum where diverse and sometimes competing interests converge to reach consensus on vital sector challenges, including export bans, trade tariffs, and strategic grain reserves.</p>', 'Users', 3, 'published'),

('22222222-2222-2222-2222-222222222204', 'climate-resilience', 'Climate Resilience & Sustainable Systems', 'Advocating for climate-smart agriculture, soil health conservation, and resilient rural farming systems in Zambia.', '<p>In the wake of prolonged regional droughts, ACF champions sustainable farming systems that build climate resilience for vulnerable smallholders across all ten provinces of Zambia.</p>', 'Sprout', 4, 'published'),

('22222222-2222-2222-2222-222222222205', 'land-rights-tenure', 'Land Tenure & Women''s Rights', 'Advocating for secure customary land tenure and equal rights for women and small-scale farming households.', '<p>ACF actively participates in land policy advocacy, promoting tenure security as a cornerstone for long-term farm investment, food sovereignty, and poverty reduction.</p>', 'Shield', 5, 'published')
ON CONFLICT (slug) DO NOTHING;

-- 4. Sample Publications
INSERT INTO public.publications (id, slug, title, summary, category_id, published_on, file_path, file_size, mime, is_featured, download_count, status) VALUES
('33333333-3333-3333-3333-333333333301', 'zambia-agricultural-policy-brief-2026', 'Zambia Agricultural Sector Policy Review 2025/2026', 'An evidence-based assessment of agricultural performance, input support programmes, and market policies in Zambia.', '11111111-1111-1111-1111-111111111101', '2026-02-15', '/documents/acf-policy-review-2026.pdf', 2450000, 'application/pdf', true, 142, 'published'),

('33333333-3333-3333-3333-333333333302', 'smallholder-drought-resilience-study', 'Building Climate Resilience Among Smallholder Maize Farmers', 'Empirical study on drought mitigation strategies, crop diversification, and irrigation adoption in Southern and Eastern Provinces.', '11111111-1111-1111-1111-111111111102', '2026-01-20', '/documents/acf-climate-resilience-study.pdf', 3820000, 'application/pdf', true, 98, 'published'),

('33333333-3333-3333-3333-333333333303', 'customary-land-rights-brief-women', 'Securing Customary Land Rights for Women Farmers in Zambia', 'Policy advisory note detailing practical legal mechanisms to strengthen women smallholders land tenure security.', '11111111-1111-1111-1111-111111111104', '2025-11-10', '/documents/acf-women-land-rights.pdf', 1850000, 'application/pdf', false, 76, 'published'),

('33333333-3333-3333-3333-333333333304', 'acf-newsletter-q4-2025', 'ACF Quarterly Newsletter - Q4 2025', 'Highlights from national agricultural policy consultative forums, stakeholder submissions, and upcoming programmes.', '11111111-1111-1111-1111-111111111105', '2025-12-22', '/documents/acf-newsletter-q4-2025.pdf', 1240000, 'application/pdf', false, 54, 'published')
ON CONFLICT (slug) DO NOTHING;

-- 5. Sample News Posts
INSERT INTO public.news_posts (id, slug, title, excerpt, body, category, published_at, is_featured, status) VALUES
('44444444-4444-4444-4444-444444444401', 'national-consultative-dialogue-food-security-2026', 'ACF Convenes National Stakeholder Dialogue on Sustainable Food Security', 'Key stakeholders from government, farmer federations, and agribusiness gathered in Lusaka to review post-drought recovery mechanisms.', '<p>The Agricultural Consultative Forum (ACF) convened a high-level consultative dialogue in Lusaka, bringing together over 80 representatives from farmer unions, agribusiness associations, research bodies, and the Ministry of Agriculture.</p><p>Discussions centred on evidence-backed strategies for the upcoming cropping season, emergency irrigation expansion, and targeted support for smallholder farming families affected by climate shocks.</p>', 'Policy Dialogue', '2026-03-01 09:00:00+02', true, 'published'),

('44444444-4444-4444-4444-444444444402', 'evidence-based-review-fisp-reforms', 'Stakeholder Submission on Agricultural Input Programme Modernisation', 'ACF presents its comprehensive policy review on input distribution efficiency and transparent electronic vouchers.', '<p>In its latest policy submission, ACF presented findings from rural field monitoring indicating the critical need to enhance private agro-dealer participation in input delivery systems across Zambia.</p><p>The brief recommends accelerating e-voucher rollouts to ensure farmers have flexible choices of certified seeds, drought-tolerant legumes, and soil-specific fertilisers.</p>', 'Sector News', '2026-02-18 10:30:00+02', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- 6. Sample Events
INSERT INTO public.events (id, slug, title, description, starts_at, ends_at, venue, status) VALUES
('55555555-5555-5555-5555-555555555501', 'annual-agricultural-policy-symposium-2026', 'Annual Zambia Agricultural Policy Symposium 2026', 'A two-day national symposium gathering policymakers, agricultural economists, and farmer leaders to discuss Zambia''s agricultural transformation roadmap.', '2026-11-18 08:30:00+02', '2026-11-19 17:00:00+02', 'Mulungushi International Conference Centre, Lusaka', 'published'),

('55555555-5555-5555-5555-555555555502', 'workshop-land-tenure-governance-2026', 'Multi-Stakeholder Workshop on Customary Land Tenure', 'Deliberations on equitable land allocation and tenure documentation guidelines for small-scale rural producers.', '2026-10-28 09:00:00+02', '2026-10-28 16:00:00+02', 'Golden Peacock Hotel, Lusaka', 'published'),

('55555555-5555-5555-5555-555555555503', 'seed-systems-stakeholder-forum-2025', 'Past Forum: National Seed Systems & Climate Adaptation', 'Review of certified seed varieties and community seed bank systems in drought-prone agro-ecological zones.', '2025-09-12 09:00:00+02', '2025-09-12 16:30:00+02', 'Cresta Golfview Hotel, Lusaka', 'published')
ON CONFLICT (slug) DO NOTHING;

-- 7. Sample Opportunities (Active & Expired to test auto-archive)
INSERT INTO public.opportunities (id, slug, title, type, description, opens_on, closes_on, application_instructions, apply_url, contact_info, status) VALUES
('66666666-6666-6666-6666-666666666601', 'consultancy-agricultural-policy-analyst', 'Senior Agricultural Policy Consultant', 'Consultancy', 'ACF seeks a qualified Agricultural Economist or Policy Analyst to lead an independent study on Zambian agricultural value chain competitiveness.', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'Submit your technical proposal, detailed CV, and financial quotation via email.', NULL, 'opportunities@acfzambia.org', 'published'),

('66666666-6666-6666-6666-666666666602', 'tender-annual-audit-services-2026', 'Expression of Interest: External Audit Services', 'Tender', 'Provision of statutory external financial audit services for the Agricultural Consultative Forum for the 2026 fiscal year.', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '15 days', 'Eligible registered audit firms should submit sealed proposals to the ACF Secretariat in Lusaka.', NULL, 'procurement@acfzambia.org', 'published'),

('66666666-6666-6666-6666-666666666603', 'consultancy-monitoring-evaluation-officer-expired', 'Monitoring & Evaluation Specialist (Closed)', 'Job', 'Full-time position to coordinate institutional monitoring and evaluation frameworks across all ACF dialogue programmes.', '2026-01-01', '2026-02-15', 'Applications closed. Shortlisted candidates have been notified.', NULL, 'careers@acfzambia.org', 'published')
ON CONFLICT (slug) DO NOTHING;

-- 8. People (Board, Management, Staff)
INSERT INTO public.people (id, group_type, name, position, bio, order_index, is_visible) VALUES
('77777777-7777-7777-7777-777777777701', 'board', '[PLACEHOLDER] Board Chairperson', 'Board Chairperson', 'Distinguished agricultural leader with extensive experience in Zambian rural development policy and agricultural enterprise.', 1, true),
('77777777-7777-7777-7777-777777777702', 'board', '[PLACEHOLDER] Vice Chairperson', 'Vice Chairperson', 'Specialist in agricultural trade, commodity exchange systems, and cooperative management.', 2, true),
('77777777-7777-7777-7777-777777777703', 'management', '[PLACEHOLDER] Executive Director', 'Executive Director', 'Leads the ACF Secretariat in executing policy dialogues, stakeholder coordination, and institutional strategy.', 1, true),
('77777777-7777-7777-7777-777777777704', 'management', '[PLACEHOLDER] Head of Policy & Research', 'Head of Policy & Research', 'Coordinates empirical studies, policy briefs, and dialogue working groups across Zambia.', 2, true),
('77777777-7777-7777-7777-777777777705', 'staff', '[PLACEHOLDER] Communications & Knowledge Manager', 'Communications & Knowledge Manager', 'Manages publications dissemination, media relations, digital platforms, and stakeholder outreach.', 1, true),
('77777777-7777-7777-7777-777777777706', 'staff', '[PLACEHOLDER] Finance & Administration Officer', 'Finance & Administration Officer', 'Oversees financial management, grant compliance, and operational logistics for ACF programmes.', 2, true)
ON CONFLICT (id) DO NOTHING;

-- 9. Partners
INSERT INTO public.partners (id, name, type, description, order_index, show_on_home, is_visible) VALUES
('88888888-8888-8888-8888-888888888801', 'Ministry of Agriculture - Zambia', 'Collaborating Institution', 'Key governmental counterpart in agricultural policy dialogues and implementation.', 1, true, true),
('88888888-8888-8888-8888-888888888802', 'Zambia National Farmers Union (ZNFU)', 'Partner', 'Apex representative organization for farmers across Zambia.', 2, true, true),
('88888888-8888-8888-8888-888888888803', 'Indaba Agricultural Policy Research Institute (IAPRI)', 'Partner', 'Collaborating research institute on agricultural economics and food policy analysis.', 3, true, true),
('88888888-8888-8888-8888-888888888804', 'International Land Coalition (ILC)', 'Network & Affiliation', 'Global alliance working together for secure tenure and land rights.', 4, true, true),
('88888888-8888-8888-8888-888888888805', 'Grain Traders Association of Zambia', 'Partner', 'Key private sector association representing commodity grain trade and market linkages.', 5, true, true)
ON CONFLICT (id) DO NOTHING;

-- 10. Membership Categories
INSERT INTO public.membership_categories (id, name, description, benefits, requirements, order_index) VALUES
('99999999-9999-9999-9999-999999999901', 'Agricultural Producer Associations & Cooperatives', 'For registered farmer cooperatives, smallholder unions, and commodity associations.', '[
    "Direct participation in national policy consultative roundtables",
    "Early access to research publications and market analysis briefs",
    "Representation in multi-stakeholder dialogue working groups",
    "Voting rights in relevant stakeholder advisory caucuses"
]'::jsonb, '[
    "Registered legal cooperative or association in Zambia",
    "Active membership base in the agricultural sector",
    "Commitment to evidence-based agricultural advancement"
]'::jsonb, 1),

('99999999-9999-9999-9999-999999999902', 'Agri-Business & Private Sector Enterprises', 'For input suppliers, commodity traders, food processors, and agricultural finance institutions.', '[
    "Engagement with senior policymakers on trade tariffs, subsidies, and regulations",
    "Networking opportunities across the Zambian agricultural ecosystem",
    "Contribution to policy submissions and sector position papers",
    "Listing in the ACF partner directory"
]'::jsonb, '[
    "PACRA-registered business entity operating in Zambia",
    "Demonstrated commercial engagement in agriculture or allied sectors",
    "Adherence to transparent and ethical business practices"
]'::jsonb, 2),

('99999999-9999-9999-9999-999999999903', 'Research Institutes & Academic Entities', 'For universities, research centres, and agricultural think tanks.', '[
    "Collaboration on national research agendas and empirical surveys",
    "Platform to disseminate scientific findings to policymakers",
    "Co-hosting of policy symposiums and technical conferences"
]'::jsonb, '[
    "Accredited higher learning or registered research institution",
    "Focus on agricultural economics, agronomy, climate, or rural sociology"
]'::jsonb, 3)
ON CONFLICT (id) DO NOTHING;
