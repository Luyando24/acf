-- ====================================================================
-- ACF - Row Level Security (RLS) Policies
-- File: supabase/migrations/20261012000002_rls_policies.sql
-- ====================================================================

-- Helper function to check if current user is an authenticated staff member
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_active = TRUE
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is an admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND is_active = TRUE
              AND role IN ('admin', 'super_admin')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 1. Profiles Policies
-- --------------------------------------------------------------------
-- Public cannot view profiles. Staff can view all active profiles. Users can update their own profile.
CREATE POLICY "Staff can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can manage profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 2. Site Settings Policies
-- --------------------------------------------------------------------
-- Public can read site settings
CREATE POLICY "Public can read site settings"
    ON public.site_settings FOR SELECT
    USING (true);

-- Admins can update site settings
CREATE POLICY "Admins can update site settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 3. Pages Policies
-- --------------------------------------------------------------------
CREATE POLICY "Public can read published pages"
    ON public.pages FOR SELECT
    USING (status = 'published');

CREATE POLICY "Staff can read all pages"
    ON public.pages FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Staff can edit pages"
    ON public.pages FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 4. People Policies
-- --------------------------------------------------------------------
CREATE POLICY "Public can read visible people"
    ON public.people FOR SELECT
    USING (is_visible = true);

CREATE POLICY "Staff can view and manage people"
    ON public.people FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 5. Programmes Policies
-- --------------------------------------------------------------------
CREATE POLICY "Public can read published programmes"
    ON public.programmes FOR SELECT
    USING (status = 'published');

CREATE POLICY "Staff can manage programmes"
    ON public.programmes FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 6. Publications & Categories Policies
-- --------------------------------------------------------------------
CREATE POLICY "Public can read categories"
    ON public.publication_categories FOR SELECT
    USING (true);

CREATE POLICY "Staff can manage publication categories"
    ON public.publication_categories FOR ALL
    USING (public.is_staff());

CREATE POLICY "Public can read published publications"
    ON public.publications FOR SELECT
    USING (status = 'published');

CREATE POLICY "Staff can manage publications"
    ON public.publications FOR ALL
    USING (public.is_staff());

CREATE POLICY "Public can read publication programmes"
    ON public.publication_programmes FOR SELECT
    USING (true);

CREATE POLICY "Staff can manage publication programmes"
    ON public.publication_programmes FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 7. News & Events Policies
-- --------------------------------------------------------------------
CREATE POLICY "Public can read published news"
    ON public.news_posts FOR SELECT
    USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Staff can manage news"
    ON public.news_posts FOR ALL
    USING (public.is_staff());

CREATE POLICY "Public can read news programmes"
    ON public.news_programmes FOR SELECT
    USING (true);

CREATE POLICY "Staff can manage news programmes"
    ON public.news_programmes FOR ALL
    USING (public.is_staff());

CREATE POLICY "Public can read published events"
    ON public.events FOR SELECT
    USING (status = 'published');

CREATE POLICY "Staff can manage events"
    ON public.events FOR ALL
    USING (public.is_staff());

CREATE POLICY "Public can read event programmes"
    ON public.event_programmes FOR SELECT
    USING (true);

CREATE POLICY "Staff can manage event programmes"
    ON public.event_programmes FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 8. Opportunities Policies (Auto-archive query logic)
-- --------------------------------------------------------------------
CREATE POLICY "Public can read active published opportunities"
    ON public.opportunities FOR SELECT
    USING (status = 'published');

CREATE POLICY "Staff can manage opportunities"
    ON public.opportunities FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 9. Partners Policies
-- --------------------------------------------------------------------
CREATE POLICY "Public can read visible partners"
    ON public.partners FOR SELECT
    USING (is_visible = true);

CREATE POLICY "Staff can manage partners"
    ON public.partners FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 10. Membership Policies
-- --------------------------------------------------------------------
CREATE POLICY "Public can read membership categories"
    ON public.membership_categories FOR SELECT
    USING (true);

CREATE POLICY "Staff can manage membership categories"
    ON public.membership_categories FOR ALL
    USING (public.is_staff());

CREATE POLICY "Anyone can submit membership application"
    ON public.membership_applications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Staff can view and update membership applications"
    ON public.membership_applications FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 11. Contact Messages Policies
-- --------------------------------------------------------------------
CREATE POLICY "Anyone can submit contact message"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Staff can view and update contact messages"
    ON public.contact_messages FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 12. Newsletter Subscribers Policies
-- --------------------------------------------------------------------
CREATE POLICY "Anyone can subscribe to newsletter"
    ON public.newsletter_subscribers FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Staff can view and manage subscribers"
    ON public.newsletter_subscribers FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 13. Media Assets & Attachments
-- --------------------------------------------------------------------
CREATE POLICY "Public can read media assets"
    ON public.media_assets FOR SELECT
    USING (bucket = 'public-media');

CREATE POLICY "Staff can manage media assets"
    ON public.media_assets FOR ALL
    USING (public.is_staff());

CREATE POLICY "Public can read attachments"
    ON public.attachments FOR SELECT
    USING (true);

CREATE POLICY "Staff can manage attachments"
    ON public.attachments FOR ALL
    USING (public.is_staff());

-- --------------------------------------------------------------------
-- 14. Activity Log
-- --------------------------------------------------------------------
CREATE POLICY "Admins can view activity logs"
    ON public.activity_log FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Staff can create activity logs"
    ON public.activity_log FOR INSERT
    WITH CHECK (public.is_staff());
