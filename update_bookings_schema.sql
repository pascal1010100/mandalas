-- Add missing columns to support Specific Bed Selection and Cancellation Logic
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS unit_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS refund_status text;

-- Verify check_in/check_out exist (usually they do, but good to ensure date type)
-- ALTER TABLE bookings ALTER COLUMN check_in TYPE date;
-- ALTER TABLE bookings ALTER COLUMN check_out TYPE date;
