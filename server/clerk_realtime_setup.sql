-- Clerk + realtime course module migration.
-- Safe to run repeatedly on Neon.

ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_fkey;
ALTER TABLE bookmarks ALTER COLUMN user_id TYPE text USING user_id::text;
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_alt text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE courses
SET updated_at = COALESCE(scraped_at, last_updated::timestamptz, now())
WHERE updated_at IS NULL;

CREATE OR REPLACE FUNCTION set_courses_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_courses_updated_at ON courses;
CREATE TRIGGER trg_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION set_courses_updated_at();

CREATE INDEX IF NOT EXISTS idx_courses_updated_at ON courses(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_scraped_at ON courses(scraped_at DESC);
