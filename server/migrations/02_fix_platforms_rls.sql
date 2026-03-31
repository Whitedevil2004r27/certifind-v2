-- Fix Platforms RLS for Public Access
-- This enables the frontend to see the 32 platform icons and metadata.

ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to platforms" ON platforms;
CREATE POLICY "Allow public read access to platforms"
  ON platforms FOR SELECT
  USING (true);

-- Ensure the foreign key is properly recognized by the PostgREST API
-- By granting schema access toanon role
GRANT SELECT ON platforms TO anon;
GRANT SELECT ON courses TO anon;
