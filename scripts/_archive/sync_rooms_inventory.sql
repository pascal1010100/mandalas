-- Update Rooms Table to Match Reality
-- 1. Remove deprecated rooms
DELETE FROM rooms WHERE id IN ('hideout_suite', 'hideout_dorm');

-- 2. Upsert Hideout Specific Inventory
-- Girls Dorm (6 beds, price 16)
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price)
VALUES ('hideout_dorm_female', 'hideout', 'dorm', 'Dormitorio Solo Chicas', 6, 6, 16)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    capacity = EXCLUDED.capacity,
    max_guests = EXCLUDED.max_guests,
    base_price = EXCLUDED.base_price;

-- Mixed Dorm (6 beds, price 16)
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price)
VALUES ('hideout_dorm_mixed', 'hideout', 'dorm', 'Dormitorio Mixto', 6, 6, 16)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    capacity = EXCLUDED.capacity,
    max_guests = EXCLUDED.max_guests,
    base_price = EXCLUDED.base_price;

-- Private Room (4 rooms, price 40)
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price)
VALUES ('hideout_private', 'hideout', 'private', 'Habitación Privada', 4, 2, 40)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    capacity = EXCLUDED.capacity,
    max_guests = EXCLUDED.max_guests,
    base_price = EXCLUDED.base_price;

-- 3. Verify Pueblo Inventory (Ensure consistency)
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price)
VALUES ('pueblo_dorm', 'pueblo', 'dorm', 'Dormitorio Pueblo', 8, 8, 18)
ON CONFLICT (id) DO NOTHING;

INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price)
VALUES ('pueblo_private', 'pueblo', 'private', 'Habitación Privada Pueblo', 4, 2, 35)
ON CONFLICT (id) DO NOTHING;

INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price)
VALUES ('pueblo_suite', 'pueblo', 'suite', 'Suite Pueblo', 1, 4, 55)
ON CONFLICT (id) DO NOTHING;
