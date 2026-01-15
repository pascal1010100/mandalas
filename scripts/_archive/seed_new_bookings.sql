-- Seed Bookings for New Mandalas Pueblo Rooms
-- Run this to populate the Admin Dashboard with test data

-- 1. Insert Guests/Bookings for specific new rooms
INSERT INTO bookings (guest_name, email, phone, location, room_type, guests, check_in, check_out, status, total_price, payment_status, unit_id)
VALUES
    -- Active Booking (Check-in Today)
    ('Juan Pérez', 'juan@test.com', '555-0101', 'pueblo', 'pueblo_private_1', 2, CURRENT_DATE, CURRENT_DATE + 3, 'confirmed', 135, 'paid', '1'),
    
    -- Active Booking (Mid-stay)
    ('Maria Garcia', 'maria@test.com', '555-0102', 'pueblo', 'pueblo_dorm_mixed_8', 1, CURRENT_DATE - 1, CURRENT_DATE + 2, 'confirmed', 54, 'pending', '3'),
    
    -- Check-out Today
    ('Carlos Ruiz', 'carlos@test.com', '555-0103', 'pueblo', 'pueblo_dorm_female_6', 1, CURRENT_DATE - 2, CURRENT_DATE, 'confirmed', 40, 'paid', '1'),
    
    -- Pending Booking (Future)
    ('Ana López', 'ana@test.com', '555-0104', 'pueblo', 'pueblo_suite_balcony', 2, CURRENT_DATE + 5, CURRENT_DATE + 7, 'pending', 150, 'pending', '1'),
    
    -- Group in Dorm (Mixed)
    ('Grupo Amigos 1', 'grp@test.com', '555-0201', 'pueblo', 'pueblo_dorm_mixed_8', 1, CURRENT_DATE + 1, CURRENT_DATE + 4, 'confirmed', 54, 'paid', '1'),
    ('Grupo Amigos 2', 'grp@test.com', '555-0201', 'pueblo', 'pueblo_dorm_mixed_8', 1, CURRENT_DATE + 1, CURRENT_DATE + 4, 'confirmed', 54, 'paid', '2');
