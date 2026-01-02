-- Clean up bad presentation data
DELETE FROM bookings 
WHERE guest_name IN ('Sofía Martínez', 'Carlos Ruiz', 'John Doe');

-- Optional: Reset sequence if needed (usually handled by Supabase automatically)
-- Select * from bookings; -- Verify deletion
