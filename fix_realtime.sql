
-- 1. Add 'bookings' and 'charges' to the supabase_realtime publication
-- This is critical for the Guest App to receive updates (payment status, check-in, etc.)
BEGIN;

-- Check if publication exists (it usually does), otherwise create it
-- (Supabase default is 'supabase_realtime')

-- Add tables to publication. 
-- "ALTER PUBLICATION ... ADD TABLE" requires the table to not be in it already.
-- A safe way is to try drop first or ignore duplicate error, but usually we just run it.
-- If it fails because already added, that's fine (idempotent-ish manually).
-- But cleaner to do:

ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE charges;
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;

COMMIT;
