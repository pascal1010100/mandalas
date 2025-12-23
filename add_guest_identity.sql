-- Add Guest Identity columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS guest_id_type text CHECK (guest_id_type IN ('passport', 'dni', 'license', 'other')),
ADD COLUMN IF NOT EXISTS guest_id_number text;

-- Add comment for clarity
COMMENT ON COLUMN bookings.guest_id_type IS 'Type of identification provided by the guest (passport, dni, license, other)';
COMMENT ON COLUMN bookings.guest_id_number IS 'The identification number provided by the guest';
