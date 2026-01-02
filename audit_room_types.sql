-- AUDIT ROOM TYPES
-- Check what kind of room_type strings we actually have in the database
select distinct room_type, location 
from bookings 
order by location, room_type;

-- Check specifically for 'Hideout' dorms to see variations
select id, guest_name, room_type, unit_id 
from bookings 
where location = 'hideout' and (room_type ilike '%dorm%' or room_type ilike '%female%' or room_type ilike '%shared%')
limit 10;
