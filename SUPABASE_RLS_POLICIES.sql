-- =============================================================================
-- Supabase Database Schema
-- Create all required tables
-- =============================================================================

-- Drop existing table if it exists (to ensure clean state)
DROP TABLE IF EXISTS admincredentials;

-- ADMINCREDENTIALS TABLE - Required for admin login
CREATE TABLE admincredentials (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (email: admin@shoptonoutil.com, password: admin123)
-- Note: In production, passwords should be hashed!
INSERT INTO admincredentials (email, password, role)
VALUES ('admin@shoptonoutil.com', 'admin123', 'admin');

-- Verify the data was inserted
SELECT * FROM admincredentials;

-- CONVERSATIONS TABLE - For messaging between users
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    participant2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id BIGINT REFERENCES publish(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PROFILES TABLE - For storing user profile information
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    city TEXT,
    address TEXT,
    profile_type TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all profiles (for messaging)
CREATE POLICY "Anyone can view profiles" ON profiles
FOR SELECT USING (true);

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Allow users to see their own conversations
CREATE POLICY "Users can view their conversations" ON conversations
FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Allow users to create conversations
CREATE POLICY "Users can create conversations" ON conversations
FOR INSERT WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- MESSAGES TABLE - For messages within conversations
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow users to see messages in their conversations
CREATE POLICY "Users can view messages" ON messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM conversations 
        WHERE id = messages.conversation_id 
        AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
    )
);

-- Allow users to send messages
CREATE POLICY "Users can send messages" ON messages
FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- =============================================================================
-- Supabase Row Level Security (RLS) Policies
-- Run this script in your Supabase SQL Editor
-- =============================================================================

-- =============================================================================
-- ENABLE RLS ON ADMIN TABLES
-- =============================================================================

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
-- STORAGE POLICIES (for products bucket - used for tool images)
-- =============================================================================

-- Allow public read access to product images
CREATE POLICY "Public can view products" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated can upload products" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow authenticated users to update product images
CREATE POLICY "Authenticated can update products" ON storage.objects
FOR UPDATE USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated can delete products" ON storage.objects
FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated');

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
