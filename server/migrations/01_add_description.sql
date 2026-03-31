-- V2 Migration: Add Description Column
-- Run this in your Supabase SQL Editor

ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS description text;

-- Add a comment for clarification
COMMENT ON COLUMN courses.description IS 'Detailed course description scraped from platforms.';
