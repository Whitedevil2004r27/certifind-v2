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

-- API keys (server/scraper) don't need RLS policies when utilizing the Service Role Key.
