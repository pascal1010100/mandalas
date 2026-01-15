-- 1. Enable RLS on bookings (good practice, likely already on)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows ANY authenticated user (Admin/Staff) to VIEW all bookings
-- This solves the issue where admin cannot see bookings created by others or system
DROP POLICY IF EXISTS "Staff can view all bookings" ON bookings;

CREATE POLICY "Staff can view all bookings"
ON bookings FOR SELECT
TO authenticated
USING (true);

-- 3. Also allow update/delete if needed (optional based on your needs, but good for admin)
DROP POLICY IF EXISTS "Staff can update bookings" ON bookings;

CREATE POLICY "Staff can update bookings"
ON bookings FOR UPDATE
TO authenticated
USING (true);
