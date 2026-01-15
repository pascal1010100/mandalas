-- Add Housekeeping Status to Rooms
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS housekeeping_status text DEFAULT 'clean' 
CHECK (housekeeping_status IN ('clean', 'dirty', 'maintenance'));

-- Update RLS to allow updates (already covered by "Admins can update rooms" policy, but good to verify)
