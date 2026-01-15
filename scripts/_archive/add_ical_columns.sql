-- Add iCal support columns to rooms table

-- 1. Import URL: Where we pull external bookings from (e.g. Booking.com iCal link)
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS ical_import_url TEXT;

-- 2. Export Token: A safe, unique UUID to generate our own iCal feed without exposing internal IDs
-- We use gen_random_uuid() to auto-generate one for existing and new rooms.
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS ical_export_token UUID DEFAULT gen_random_uuid();

-- 3. Create an index on the token for fast lookups when the API is hit
CREATE INDEX IF NOT EXISTS idx_rooms_ical_token ON rooms(ical_export_token);

-- 4. Comment/Documentation
COMMENT ON COLUMN rooms.ical_import_url IS 'URL to fetch external iCal (.ics) events from OTAs';
COMMENT ON COLUMN rooms.ical_export_token IS 'Public token for accessing this rooms iCal feed via API';
