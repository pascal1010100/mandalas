-- FIX SYNC & VISIBILITY ISSUES

-- 1. ENABLE RLS FOR SERVICE REQUESTS (If not enabled)
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- 2. ADD POLICIES FOR SERVICE REQUESTS
-- Allow anyone (anon/authenticated) to insert (Guests making requests)
CREATE POLICY "Public can create requests" 
ON service_requests FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow anyone to read (Admin Dashboard needs this)
CREATE POLICY "Public can view requests" 
ON service_requests FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow anyone to update (Admin resolving requests)
CREATE POLICY "Public can update requests" 
ON service_requests FOR UPDATE 
TO anon, authenticated 
USING (true);

-- 3. ENSURE REALTIME IS ENABLED
-- (This usually requires Supabase Dashboard, but specific table replication can sometimes be set via SQL on self-hosted)
-- ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;
-- ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
