-- ALIGN DB WITH CODEBASE (Source of Truth)
-- Run this to fix "Fake Rooms" or "Missing Rooms"

-- 1. PUEBLO ROOMS
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price, housekeeping_status) VALUES
('pueblo_dorm_mixed_8', 'pueblo', 'dorm', 'Dormitorio Mixto (8 Camas)', 8, 8, 18, 'clean'),
('pueblo_dorm_female_6', 'pueblo', 'dorm', 'Dormitorio Femenino (6 Camas)', 6, 6, 20, 'clean'),
('pueblo_private_1', 'pueblo', 'private', 'Habitación Privada 1 (Jardín)', 4, 2, 45, 'clean'),
('pueblo_private_2', 'pueblo', 'private', 'Habitación Privada 2 (Estándar)', 4, 2, 40, 'clean'),
('pueblo_private_family', 'pueblo', 'private', 'Habitación Familiar', 4, 4, 60, 'clean'),
('pueblo_suite_balcony', 'pueblo', 'suite', 'Suite con Balcón', 1, 3, 75, 'clean')
ON CONFLICT (id) DO UPDATE SET 
    label = EXCLUDED.label, 
    capacity = EXCLUDED.capacity, 
    max_guests = EXCLUDED.max_guests,
    base_price = EXCLUDED.base_price;

-- 2. HIDEOUT ROOMS
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price, housekeeping_status) VALUES
('hideout_dorm_female', 'hideout', 'dorm', 'Hideout Dorm A (Chicas)', 5, 5, 18, 'clean'),
('hideout_dorm_mixed', 'hideout', 'dorm', 'Hideout Dorm B (Mixto)', 5, 5, 18, 'clean'),
('hideout_private_1', 'hideout', 'private', 'Hideout Private 1', 2, 2, 40, 'clean'),
('hideout_private_2', 'hideout', 'private', 'Hideout Private 2', 2, 2, 40, 'clean'),
('hideout_private_3', 'hideout', 'private', 'Hideout Private 3', 2, 2, 40, 'clean'),
('hideout_private_4', 'hideout', 'private', 'Hideout Private 4', 2, 2, 40, 'clean')
ON CONFLICT (id) DO UPDATE SET 
    label = EXCLUDED.label, 
    capacity = EXCLUDED.capacity, 
    max_guests = EXCLUDED.max_guests,
    base_price = EXCLUDED.base_price;

-- 3. CLEANUP (Optional: Remove legacy rooms that are NOT in this list)
-- DELETE FROM rooms WHERE id NOT IN (
--    'pueblo_dorm_mixed_8', 'pueblo_dorm_female_6', 'pueblo_private_1', ..., 'hideout_private_4'
-- );
