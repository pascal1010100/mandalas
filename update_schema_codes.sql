-- Add confirmation_code column
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmation_code text UNIQUE;

-- Optional: You might want to backfill existing manual bookings
-- UPDATE bookings SET confirmation_code = 'RES-' || to_hex(floor(random() * 1000000)::int) WHERE confirmation_code IS NULL;
