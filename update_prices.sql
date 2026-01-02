-- UPDATE PRICES TO REAL WORLD (QUETZALES)
-- Based on Notebook 01/01/26

UPDATE rooms SET base_price = 175 WHERE id = 'hideout_dorm_female';
UPDATE rooms SET base_price = 148.75 WHERE id = 'hideout_dorm_mixed';
UPDATE rooms SET base_price = 212.50 WHERE location = 'hideout' AND type = 'private';
