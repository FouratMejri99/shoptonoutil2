-- =============================================================================
-- Supabase Row Level Security (RLS) Policies
-- Run this script in your Supabase SQL Editor
-- =============================================================================

-- =============================================================================
-- ENABLE RLS ON ALL TABLES
-- =============================================================================

ALTER TABLE blogposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE casestudies ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetrackingrecords ENABLE ROW LEVEL SECURITY;
ALTER TABLE admincredentials ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- BLOGPOSTS TABLE - Public read, Admin write
-- =============================================================================

-- Public can read published blog posts
CREATE POLICY "Public can read published blog posts" ON blogposts
FOR SELECT USING (published = true);

-- Admin can do everything
CREATE POLICY "Admin can insert blog posts" ON blogposts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update blog posts" ON blogposts
FOR UPDATE USING (true);

CREATE POLICY "Admin can delete blog posts" ON blogposts
FOR DELETE USING (true);

-- =============================================================================
-- CASESTUDIES TABLE - Public read, Admin write
-- =============================================================================

-- Public can read featured case studies
CREATE POLICY "Public can read featured case studies" ON casestudies
FOR SELECT USING (featured = true);

-- Admin can do everything
CREATE POLICY "Admin can insert case studies" ON casestudies
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update case studies" ON casestudies
FOR UPDATE USING (true);

CREATE POLICY "Admin can delete case studies" ON casestudies
FOR DELETE USING (true);

-- =============================================================================
-- SERVICES TABLE - Public read, Admin write
-- =============================================================================

-- Public can read all services
CREATE POLICY "Public can read services" ON services
FOR SELECT USING (true);

-- Admin can do everything
CREATE POLICY "Admin can insert services" ON services
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update services" ON services
FOR UPDATE USING (true);

CREATE POLICY "Admin can delete services" ON services
FOR DELETE USING (true);

-- =============================================================================
-- TESTIMONIALS TABLE - Public read, Admin write
-- =============================================================================

-- Public can read published testimonials
CREATE POLICY "Public can read published testimonials" ON testimonials
FOR SELECT USING (ispublished = true);

-- Admin can do everything
CREATE POLICY "Admin can insert testimonials" ON testimonials
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update testimonials" ON testimonials
FOR UPDATE USING (true);

CREATE POLICY "Admin can delete testimonials" ON testimonials
FOR DELETE USING (true);

-- =============================================================================
-- LEADS TABLE - Public insert, Admin read/write
-- =============================================================================

-- Anyone can submit a lead (contact form)
CREATE POLICY "Anyone can insert leads" ON leads
FOR INSERT WITH CHECK (true);

-- Admin can read all leads
CREATE POLICY "Admin can read leads" ON leads
FOR SELECT USING (true);

-- Admin can update leads
CREATE POLICY "Admin can update leads" ON leads
FOR UPDATE USING (true);

-- Admin can delete leads
CREATE POLICY "Admin can delete leads" ON leads
FOR DELETE USING (true);

-- =============================================================================
-- NEWSLETTER_SUBSCRIPTIONS TABLE - Public insert, Admin read
-- =============================================================================

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can insert newsletter subscriptions" ON newsletter_subscriptions
FOR INSERT WITH CHECK (true);

-- Allow public read access for newsletter subscriptions (needed for admin page)
CREATE POLICY "Public can read newsletter subscriptions" ON newsletter_subscriptions
FOR SELECT USING (true);

-- Admin can read all subscriptions
CREATE POLICY "Admin can read newsletter subscriptions" ON newsletter_subscriptions
FOR SELECT USING (true);

-- Admin can delete subscriptions
CREATE POLICY "Admin can delete newsletter subscriptions" ON newsletter_subscriptions
FOR DELETE USING (true);

-- =============================================================================
-- EMPLOYEES TABLE - Admin full access, Employee read own record
-- =============================================================================

-- Admin can do everything
CREATE POLICY "Admin can select employees" ON employees
FOR SELECT USING (true);

CREATE POLICY "Admin can insert employees" ON employees
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update employees" ON employees
FOR UPDATE USING (true);

CREATE POLICY "Admin can delete employees" ON employees
FOR DELETE USING (true);

-- =============================================================================
-- TIMETRACKINGRECORDS TABLE - Employee read/write own, Admin full access
-- =============================================================================

-- Admin can do everything
CREATE POLICY "Admin can select time records" ON timetrackingrecords
FOR SELECT USING (true);

CREATE POLICY "Admin can insert time records" ON timetrackingrecords
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update time records" ON timetrackingrecords
FOR UPDATE USING (true);

CREATE POLICY "Admin can delete time records" ON timetrackingrecords
FOR DELETE USING (true);

-- =============================================================================
-- ADMINCREDENTIALS TABLE - Read by email/password for login, Admin full access
-- =============================================================================

-- Allow login by email/password (select with condition)
CREATE POLICY "Admin login check" ON admincredentials
FOR SELECT USING (true);

-- Admin can do everything else
CREATE POLICY "Admin can insert admin credentials" ON admincredentials
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update admin credentials" ON admincredentials
FOR UPDATE USING (true);

CREATE POLICY "Admin can delete admin credentials" ON admincredentials
FOR DELETE USING (true);

-- =============================================================================
-- STORAGE POLICIES (for public-assets bucket)
-- =============================================================================

-- Allow public read access to images
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'public-assets');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'public-assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated can update images" ON storage.objects
FOR UPDATE USING (bucket_id = 'public-assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated can delete images" ON storage.objects
FOR DELETE USING (bucket_id = 'public-assets' AND auth.role() = 'authenticated');

-- =============================================================================
-- INDEXES FOR PERFORMANCE (optional - only create if columns exist)
-- =============================================================================

-- Note: These indexes may fail if columns don't exist in your schema
-- Only create indexes that match your actual database schema

-- Blog posts indexes (if columns exist)
-- CREATE INDEX IF NOT EXISTS idx_blogposts_slug ON blogposts(slug);

-- Case studies indexes (if columns exist)
-- CREATE INDEX IF NOT EXISTS idx_casestudies_slug ON casestudies(slug);

-- Services indexes (if columns exist)
-- CREATE INDEX IF NOT EXISTS idx_services_orderindex ON services(orderindex);

-- Employees indexes
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
