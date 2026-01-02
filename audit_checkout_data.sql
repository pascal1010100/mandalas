-- AUDIT SCRIPT: Check last checkout and room status mismatch

-- 1. Find the most recent 'checked_out' booking
WITH LastCheckout AS (
    SELECT 
        id as booking_id, 
        guest_name, 
        room_type as raw_room_id, 
        location, 
        status, 
        actual_check_out, 
        unit_id,
        created_at
    FROM bookings
    WHERE status = 'checked_out'
    ORDER BY actual_check_out DESC NULLS LAST, updated_at DESC
    LIMIT 1
)
-- 2. Join with Rooms to see the current housekeeping status
SELECT 
    lc.booking_id,
    lc.guest_name,
    lc.raw_room_id,
    lc.location,
    lc.actual_check_out,
    lc.unit_id,
    r.id as resolved_room_id,
    r.housekeeping_status as global_status,
    r.units_housekeeping as units_map_json
FROM LastCheckout lc
LEFT JOIN rooms r ON r.id = lc.raw_room_id 
   OR (r.type = lc.raw_room_id AND r.location = lc.location) -- Try to match by type+loc if ID fails
;
