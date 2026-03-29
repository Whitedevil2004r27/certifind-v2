-- CertiFind Database Schema V2 (Supabase PostgreSQL)
-- Execute this entirely within the Supabase SQL Editor.
-- WARNING: This replaces the legacy catalog. Previous data will be dropped.

-- 1. Drop old tables cleanly
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- 2. Create massive new courses schema
CREATE TABLE courses (
  course_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  instructor_name text NOT NULL,
  platform text NOT NULL,
  department text NOT NULL,
  course_type text NOT NULL CHECK (course_type IN ('Free', 'Paid')),
  price numeric DEFAULT 0,
  original_price numeric,
  discount_percentage numeric DEFAULT 0,
  rating float DEFAULT 0.0,
  total_ratings integer DEFAULT 0,
  duration_hours float,
  level text CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  language text DEFAULT 'English',
  thumbnail_url text,
  course_url text NOT NULL,
  last_updated date DEFAULT CURRENT_DATE,
  tags text[],
  is_bestseller boolean DEFAULT false,
  is_new boolean DEFAULT false,
  certificate_offered boolean DEFAULT false,
  scraped_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 3. Optimize DB utilizing B-Tree Indexes for faceted searching
CREATE INDEX idx_courses_department ON courses(department);
CREATE INDEX idx_courses_type ON courses(course_type);
CREATE INDEX idx_courses_platform ON courses(platform);
CREATE INDEX idx_courses_rating ON courses(rating);

-- 4. Set Public Read Access Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated inserts"
  ON courses FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Re-create Bookmarking System relying on new `course_id`
CREATE TABLE bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(course_id) ON DELETE CASCADE NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);
