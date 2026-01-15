-- Add external_id to bookings to track iCal events and prevent duplicates
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS external_id TEXT;

-- Create index for fast lookups during sync
CREATE INDEX IF NOT EXISTS idx_bookings_external_id ON bookings(external_id);

-- Optional: Add source column to know where it came from (internal, booking.com, airbnb)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'internal';
