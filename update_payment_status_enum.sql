-- Update payment_status check constraint to include 'verifying'
DO $$ 
BEGIN 
    -- 1. Try to drop existing constraint if it exists (generic name assumption)
    ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
    
    -- 2. Add new constraint with 'verifying'
    ALTER TABLE bookings 
    ADD CONSTRAINT bookings_payment_status_check 
    CHECK (payment_status IN ('pending', 'verifying', 'paid', 'refunded'));
    
    -- 3. Add comment
    COMMENT ON COLUMN bookings.payment_status IS 'Status of payment: due (pending), under review (verifying), completed (paid), or returned (refunded)';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error upgrading payment status constraint: %', SQLERRM;
END $$;
