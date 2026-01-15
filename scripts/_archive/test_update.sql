-- TEST MANUALLY UPDATING HOUESKEEPING
-- This simulates exactly what the App tries to do upon checkout.

-- 1. Check Initial State
SELECT id, housekeeping_status, units_housekeeping 
FROM rooms WHERE id = 'hideout_dorm_female';

-- 2. Try to Update (Simulate App)
UPDATE rooms 
SET 
    housekeeping_status = 'dirty',
    units_housekeeping = '{"4": "dirty"}'::jsonb,
    maintenance_note = 'Test Update from SQL'
WHERE id = 'hideout_dorm_female';

-- 3. Verify if it Stuck
SELECT id, housekeeping_status, units_housekeeping, maintenance_note 
FROM rooms WHERE id = 'hideout_dorm_female';

-- 4. Revert (Optional, or keep it dirty to see if App reflects it on reload)
-- UPDATE rooms SET housekeeping_status = 'clean', units_housekeeping = '{}'::jsonb WHERE id = 'hideout_dorm_female';
