-- 1. Add new columns for Check-Out logic
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS actual_check_out TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- 2. Drop the existing check constraint on 'status' if it exists
-- (This name might vary, check your table definition if this fails, or use the UI)
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

-- 3. Add the updated check constraint including 'checked_out'
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_out'));

-- 4. (Optional) If you are using a Postgres ENUM type instead of a text check constraint:
-- ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'checked_out';
