-- CRITICAL FIX: Add missing 'units_housekeeping' column
-- This column is required to track status of individual beds (units)
-- It stores JSON like: {"1": "dirty", "2": "clean"}

ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS units_housekeeping JSONB DEFAULT '{}'::jsonb;

-- Verify it worked
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rooms' AND column_name = 'units_housekeeping';
