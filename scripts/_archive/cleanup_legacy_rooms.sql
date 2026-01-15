-- 🧹 DEEP CLEAN: REMOVE GHOST ROOMS
-- This deletes any room that is NOT part of the official inventory.

DELETE FROM rooms 
WHERE id NOT IN (
    -- PUEBLO (6)
    'pueblo_dorm_mixed_8', 
    'pueblo_dorm_female_6', 
    'pueblo_private_1', 
    'pueblo_private_2', 
    'pueblo_private_family', 
    'pueblo_suite_balcony',

    -- HIDEOUT (6)
    'hideout_dorm_female', 
    'hideout_dorm_mixed', 
    'hideout_private_1', 
    'hideout_private_2', 
    'hideout_private_3', 
    'hideout_private_4'
);

-- OPTIONAL: Reset sequence if needed, but IDs are text so no sequence needed.
