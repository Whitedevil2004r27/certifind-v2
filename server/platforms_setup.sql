-- CertiFind Platforms System Setup

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
