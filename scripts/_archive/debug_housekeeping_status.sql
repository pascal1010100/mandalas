-- Check Housekeeping JSON for Hideout Female Dorm
select id, housekeeping_status, units_housekeeping
from rooms
where id = 'hideout_dorm_female';

-- Also check if there are any other rooms with similar IDs (to rule out ID confusion)
select id, label from rooms where location = 'hideout';
