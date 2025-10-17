-- Setup script for Supabase database
-- Run this in your Supabase SQL Editor

-- Create counter table
CREATE TABLE IF NOT EXISTS counter (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial record if it doesn't exist
INSERT INTO counter (id, count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE counter ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read/write (for demo purposes)
-- This allows anyone to read and write to the counter table
DROP POLICY IF EXISTS "Allow public access" ON counter;
CREATE POLICY "Allow public access" ON counter FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_counter_updated_at ON counter;
CREATE TRIGGER update_counter_updated_at
    BEFORE UPDATE ON counter
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
