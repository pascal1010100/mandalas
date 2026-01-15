-- Add housekeeping status to rooms if not exists
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS housekeeping_status TEXT DEFAULT 'clean';

-- Ensure it has valid values constraint
ALTER TABLE rooms 
DROP CONSTRAINT IF EXISTS check_housekeeping_status;

ALTER TABLE rooms 
ADD CONSTRAINT check_housekeeping_status 
CHECK (housekeeping_status IN ('clean', 'dirty', 'maintenance'));
