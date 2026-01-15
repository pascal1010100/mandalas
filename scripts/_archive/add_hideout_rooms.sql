-- Add missing Hideout Private Rooms 3 and 4
INSERT INTO rooms (id, location, type, label, capacity, max_guests, base_price, housekeeping_status)
VALUES 
('hideout_private_3', 'hideout', 'private', 'Hideout Private 3', 1, 2, 40, 'clean'),
('hideout_private_4', 'hideout', 'private', 'Hideout Private 4', 1, 2, 40, 'clean')
ON CONFLICT (id) DO NOTHING;
