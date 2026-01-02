-- ⚠️ DANGER: THIS WILL DELETE ALL BOOKINGS AND RELATED DATA
-- Use this only for starting fresh (Dogfooding Launch)

-- 1. Delete dependent data first (Foreign Keys)
DELETE FROM charges;
DELETE FROM service_requests;

-- 2. Delete all bookings
DELETE FROM bookings;

-- 3. Reset any room statuses to 'clean' (Optional but recommended)
UPDATE rooms SET housekeeping_status = 'clean';

-- 4. Delete alerts/notifications if any (assuming table name)
-- DELETE FROM notifications; 
