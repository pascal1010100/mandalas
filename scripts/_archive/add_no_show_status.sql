
DO $$ 
BEGIN 
    -- Drop existing constraint
    ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
    
    -- Re-add with 'no_show' included
    ALTER TABLE bookings 
    ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'maintenance', 'no_show'));
    
    RAISE NOTICE 'Added no_show to status check constraint';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error upgrading status constraint: %', SQLERRM;
END $$;
