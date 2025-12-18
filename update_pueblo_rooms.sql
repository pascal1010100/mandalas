-- Migration: Update Mandalas Pueblo Inventory
-- Confirmed Structure

-- 1. Remove old generic rooms to avoid clutter (Optional but recommended)
DELETE FROM rooms WHERE id IN ('pueblo_dorm', 'pueblo_private', 'pueblo_suite');

-- 2. Insert Real Rooms
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price)
VALUES 
    -- DORMITORIOS
    ('pueblo_dorm_mixed_8', 'pueblo', 'dorm', 'Dormitorio Mixto (8 Camas)', 8, 8, 18),
    ('pueblo_dorm_female_6', 'pueblo', 'dorm', 'Dormitorio Femenino (6 Camas)', 6, 6, 20),
    
    -- PRIVADAS
    ('pueblo_private_1', 'pueblo', 'private', 'Habitación Privada 1 (Jardín)', 4, 2, 45),
    ('pueblo_private_2', 'pueblo', 'private', 'Habitación Privada 2 (Estándar)', 4, 2, 40),
    ('pueblo_private_family', 'pueblo', 'private', 'Habitación Familiar', 4, 4, 60),

    -- SUITES
    ('pueblo_suite_balcony', 'pueblo', 'suite', 'Suite con Balcón', 1, 3, 75)

ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    capacity = EXCLUDED.capacity,
    max_guests = EXCLUDED.max_guests,
    base_price = EXCLUDED.base_price;
