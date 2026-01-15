-- Clean up accidental year-long maintenance blocks
-- Deletes bookings marked as 'maintenance' or with guest name 'MANTENIMIENTO'
-- Specifically targeting the admin created ones

DELETE FROM bookings 
WHERE guest_name = 'MANTENIMIENTO' 
   OR (email = 'admin@mandalas.com' AND status = 'maintenance')
   OR (status = 'pending' AND guest_name = 'MANTENIMIENTO');

-- Optional: Verify deletion
SELECT count(*) as remaining_maintenance FROM bookings WHERE guest_name = 'MANTENIMIENTO';
