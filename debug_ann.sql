-- Find Ann's booking
select id, guest_name, room_type, unit_id, status, check_out, actual_check_out
from bookings
where guest_name ilike '%Ann%'
order by created_at desc
limit 5;

-- Check Room Status for likely targets (assuming Pueblo Dorms based on context)
select id, housekeeping_status, units_housekeeping
from rooms
where location = 'pueblo' and type = 'dorm';
