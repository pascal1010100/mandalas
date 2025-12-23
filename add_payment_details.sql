-- Add Payment Details columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_method text CHECK (payment_method IN ('cash', 'card', 'transfer', 'other')),
ADD COLUMN IF NOT EXISTS payment_reference text;

-- Add comments for clarity
COMMENT ON COLUMN bookings.payment_method IS 'Method of payment (cash, card, transfer, other)';
COMMENT ON COLUMN bookings.payment_reference IS 'Reference number or note for the payment transaction';
