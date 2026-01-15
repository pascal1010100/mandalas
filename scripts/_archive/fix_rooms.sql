-- FIX ROOMS INVENTORY
-- Updates Hideout Private rooms from 1 generic to 4 specifics

-- 1. Remove generic/incorrect room if exists
DELETE FROM rooms WHERE id = 'hideout_private';



-- 2. Insert Correct Inventory (Standardized descriptions)
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price, housekeeping_status) VALUES
  ('hideout_private_1', 'hideout', 'private', 'Hideout Private 1', 2, 2, 40, 'clean'),
  ('hideout_private_2', 'hideout', 'private', 'Hideout Private 2', 2, 2, 40, 'clean'),
  ('hideout_private_3', 'hideout', 'private', 'Hideout Private 3', 2, 2, 40, 'clean'),
  ('hideout_private_4', 'hideout', 'private', 'Hideout Private 4', 2, 2, 40, 'clean')
ON CONFLICT (id) DO UPDATE SET
  label = excluded.label,
  capacity = excluded.capacity,
  base_price = excluded.base_price,
  max_guests = excluded.max_guests;

-- 3. Verify PUEBLO rooms match store.ts (Upsert to be safe)
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price, housekeeping_status) VALUES
  ('pueblo_private_1', 'pueblo', 'private', 'Habitación Privada 1 (Jardín)', 4, 2, 45, 'clean'),
  ('pueblo_private_2', 'pueblo', 'private', 'Habitación Privada 2 (Estándar)', 4, 2, 40, 'clean'),
  ('pueblo_private_family', 'pueblo', 'private', 'Habitación Familiar', 4, 4, 60, 'clean'),
  ('pueblo_suite_balcony', 'pueblo', 'suite', 'Suite con Balcón', 1, 3, 75, 'clean')
ON CONFLICT (id) DO UPDATE SET
  label = excluded.label,
  capacity = excluded.capacity,
  base_price = excluded.base_price;

-- 4. Correct HIDEOUT DORMS (5 beds each)
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price, housekeeping_status) VALUES
  ('hideout_dorm_female', 'hideout', 'dorm', 'Hideout Dorm A (Chicas)', 5, 5, 18, 'clean'),
  ('hideout_dorm_mixed', 'hideout', 'dorm', 'Hideout Dorm B (Mixto)', 5, 5, 18, 'clean')
ON CONFLICT (id) DO UPDATE SET
  label = excluded.label,
  capacity = excluded.capacity,
  max_guests = excluded.max_guests,
  base_price = excluded.base_price;
