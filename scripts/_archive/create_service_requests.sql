-- SERVICE REQUESTS MODULE (Elite Integration)

-- 1. Create Table
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('cleaning', 'maintenance', 'amenity', 'other')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 2. RLS Policies
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Publish for Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;

-- Policies
-- Admin: Full Access
CREATE POLICY "Admin full access requests" ON service_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Guest: Read/Create Own Requests (linked via booking_id app logic)
-- Note: Since guests are anon + ID/Email logic, we typically allow Insert for Anon but RLS is tricky without auth.uid().
-- We will allow Anon INSERT/SELECT for this table similar to bookings, relying on App Logic to filter by booking_id.
CREATE POLICY "Public read requests" ON service_requests FOR SELECT TO anon USING (true);
CREATE POLICY "Public insert requests" ON service_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public update requests" ON service_requests FOR UPDATE TO anon USING (true);
