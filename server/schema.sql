-- CertiFind Database Schema (Supabase PostgreSQL)
-- Execute this script inside your Supabase project's SQL Editor

CREATE TABLE courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  platform text NOT NULL,
  category text NOT NULL,
  is_free boolean DEFAULT true,
  price text,
  rating float DEFAULT 0.0,
  thumbnail text,
  course_url text NOT NULL,
  scraped_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Enable row-level security if public read access requires restrictions, 
-- but generally we can allow read-only access for a public catalog.
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to courses"
  ON courses
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert courses (Ideally locked to an admin role or email via auth.jwt() ->> 'email' = 'admin@example.com')
CREATE POLICY "Allow authenticated inserts"
  ON courses
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- API keys (server/scraper) don't need RLS policies when utilizing the Service Role Key.

-- ----------------------------------------------------------------------------
-- Phase 4 Expansion: Bookmarking System
-- Execute the following in Supabase SQL Editor to enable user bookmarking.
-- ----------------------------------------------------------------------------

CREATE TABLE bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id) -- Prevent duplicating a bookmark
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can only SEE their own bookmarks
CREATE POLICY "Users can only view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can only INSERT their own bookmarks
CREATE POLICY "Users can only insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can only DELETE their own bookmarks
CREATE POLICY "Users can only delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);
