
-- fix_anon_rls.sql
-- CRITICAL FIX for Guest Realtime Updates
-- Even if Realtime is enabled, Supabase will NOT send updates to the guest
-- if the 'anon' user (the guest) does not have explicit SELECT permission on the row.

-- 1. Create Policy for Bookings (Public Read for Guests)
DROP POLICY IF EXISTS "Anon can view bookings" ON bookings;
CREATE POLICY "Anon can view bookings"
ON bookings FOR SELECT
TO anon
USING (true);

-- 2. Create Policy for Charges (Public Read for Guests)
DROP POLICY IF EXISTS "Anon can view charges" ON charges;
CREATE POLICY "Anon can view charges"
ON charges FOR SELECT
TO anon
USING (true);

-- 3. Create Policy for Service Requests
DROP POLICY IF EXISTS "Anon can view service_requests" ON service_requests;
CREATE POLICY "Anon can view service_requests"
ON service_requests FOR SELECT
TO anon
USING (true);
