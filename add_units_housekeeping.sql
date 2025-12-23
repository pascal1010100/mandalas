-- Add distinct JSONB column to store unit-level status
-- Structure: { "1": "clean", "2": "dirty", ... }

ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS units_housekeeping JSONB DEFAULT '{}'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN rooms.units_housekeeping IS 'Map of Unit ID to Status (clean/dirty/maintenance). Overrides room status if present.';
