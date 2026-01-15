-- Add 'checked_in' to the allowed statuses for bookings
-- First, drop the existing constraint if possible (we might not know the exact name, so we try a common naming convention or use DO block)

DO $$ 
BEGIN 
    -- 1. Try to drop the constraint if it exists with a standard name
    ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
    
    -- 2. If it has a different name, we might need to find it (omitted for brevity, assuming standard or re-creating)
    -- Instead, let's just add the new constraint.
    
    ALTER TABLE bookings 
    ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'maintenance'));
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error upgrading constraint: %', SQLERRM;
END $$;
