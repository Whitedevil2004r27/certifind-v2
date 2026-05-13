-- 0. Clean Slate
DROP TABLE IF EXISTS verification_token CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS platforms CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Standard NextAuth.js Tables
CREATE TABLE IF NOT EXISTS accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid NOT NULL,
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  UNIQUE(provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "sessionToken" text UNIQUE NOT NULL,
  "userId" uuid NOT NULL,
  expires timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text UNIQUE,
  "emailVerified" timestamp,
  image text,
  password text, -- Added for Credentials provider
  role text DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS verification_token (
  identifier text NOT NULL,
  token text NOT NULL,
  expires timestamp NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 2. Core Business Tables
CREATE TABLE IF NOT EXISTS platforms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN (
    'Global',
    'Tech & Development',
    'Indian',
    'Design & Creative',
    'Business & Management'
  )),
  type text NOT NULL CHECK (type IN ('Free', 'Paid', 'Free + Paid')),
  best_for text,
  website_url text,
  icon_name text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  course_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
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
  image_alt text,
  course_url text NOT NULL,
  last_updated date DEFAULT CURRENT_DATE,
  updated_at timestamptz DEFAULT now(),
  tags text[],
  is_bestseller boolean DEFAULT false,
  is_new boolean DEFAULT false,
  certificate_offered boolean DEFAULT false,
  scraped_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  course_id uuid REFERENCES courses(course_id) ON DELETE CASCADE NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(course_type);
CREATE INDEX IF NOT EXISTS idx_courses_platform ON courses(platform);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating);
CREATE INDEX IF NOT EXISTS idx_courses_updated_at ON courses(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_scraped_at ON courses(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_platforms_category ON platforms(category);

INSERT INTO platforms
  (name, category, type, best_for, website_url, icon_name)
VALUES
  ('Coursera','Global','Free + Paid','University courses','https://coursera.org','GraduationCap'),
  ('Udemy','Global','Paid','Skill-based courses','https://udemy.com','BookOpen'),
  ('edX','Global','Free + Paid','University + professional','https://edx.org','GraduationCap'),
  ('FutureLearn','Global','Free + Paid','Short courses','https://futurelearn.com','Globe'),
  ('Skillshare','Global','Paid','Creative + business','https://skillshare.com','Palette'),
  ('Udacity','Global','Paid','Tech nanodegrees','https://udacity.com','Cpu'),
  ('LinkedIn Learning','Global','Free + Paid','Professional development','https://linkedin.com/learning','Linkedin'),
  ('Khan Academy','Global','Free','Foundational learning','https://khanacademy.org','Brain'),
  ('Alison','Global','Free','Diploma + certificates','https://alison.com','Trophy'),
  ('Pluralsight','Global','Paid','Tech + IT skills','https://pluralsight.com','Code2'),
  ('freeCodeCamp','Tech & Development','Free','Web development','https://freecodecamp.org','Code2'),
  ('Codecademy','Tech & Development','Free + Paid','Coding fundamentals','https://codecademy.com','Code2'),
  ('GeeksforGeeks','Tech & Development','Free + Paid','DSA + CS fundamentals','https://geeksforgeeks.org','Cpu'),
  ('HackerRank','Tech & Development','Free','Coding practice','https://hackerrank.com','Trophy'),
  ('LeetCode','Tech & Development','Free + Paid','DSA + interview prep','https://leetcode.com','Trophy'),
  ('DataCamp','Tech & Development','Paid','Data science','https://datacamp.com','BarChart2'),
  ('Simplilearn','Tech & Development','Paid','Professional certifications','https://simplilearn.com','GraduationCap'),
  ('Great Learning','Tech & Development','Free + Paid','Tech + management','https://greatlearning.in','GraduationCap'),
  ('NPTEL','Indian','Free','Engineering + science','https://nptel.ac.in','GraduationCap'),
  ('SWAYAM','Indian','Free','Government certified','https://swayam.gov.in','GraduationCap'),
  ('Unacademy','Indian','Free + Paid','Competitive exam prep','https://unacademy.com','BookOpen'),
  ('BYJU''S','Indian','Paid','School + competitive','https://byjus.com','Brain'),
  ('upGrad','Indian','Paid','PG programs','https://upgrad.com','GraduationCap'),
  ('Internshala Trainings','Indian','Free + Paid','Job-ready skills','https://internshala.com','Building2'),
  ('PrepInsta','Indian','Free + Paid','Placement preparation','https://prepinsta.com','Trophy'),
  ('Domestika','Design & Creative','Paid','Creative arts','https://domestika.org','Palette'),
  ('Canva Design School','Design & Creative','Free','Graphic design','https://designschool.canva.com','Palette'),
  ('Interaction Design Foundation','Design & Creative','Paid','UX + UI design','https://interaction-design.org','Palette'),
  ('Envato Tuts+','Design & Creative','Free + Paid','Design tutorials','https://tutsplus.com','Palette'),
  ('Harvard Online','Business & Management','Free + Paid','Business + leadership','https://online.harvard.edu','Building2'),
  ('MIT OpenCourseWare','Business & Management','Free','Engineering + science','https://ocw.mit.edu','FlaskConical'),
  ('OpenLearn','Business & Management','Free','General education','https://openlearn.open.ac.uk','Globe')
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  best_for = EXCLUDED.best_for,
  website_url = EXCLUDED.website_url,
  icon_name = EXCLUDED.icon_name,
  is_active = true;

UPDATE courses
SET platform = 'LinkedIn Learning'
WHERE platform = 'LinkedIn';

-- Foreign Key constraints for Auth tables
ALTER TABLE accounts ADD CONSTRAINT fk_accounts_userId FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE sessions ADD CONSTRAINT fk_sessions_userId FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_courses_platform'
  ) THEN
    ALTER TABLE courses
      ADD CONSTRAINT fk_courses_platform
      FOREIGN KEY (platform)
      REFERENCES platforms(name)
      ON UPDATE CASCADE;
  END IF;
END $$;
