-- Check if 'hideout_dorm_female' exists and its properties
select id, label, capacity, housekeeping_status, units_housekeeping
from rooms
where id = 'hideout_dorm_female';
