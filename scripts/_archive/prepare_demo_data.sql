
-- prepare_demo_data.sql
-- CLEANUP & SEED SCRIPT FOR PRESENTATION
-- ⚠️ WARNING: This will DELETE all existing bookings, charges, and service requests.

BEGIN;

-- 1. CLEANUP
TRUNCATE TABLE service_requests CASCADE;
TRUNCATE TABLE charges CASCADE;
TRUNCATE TABLE bookings CASCADE;

-- 2. SEED VARIABLES (Adjust dates relative to NOW)
-- We use exact dates for stability in the demo, or relative to current_date in a real script.
-- For this static seed, we'll assume "Today" is the demo day.

-- 3. INSERT SCENARIO A: "Active Guest" (En Casa)
-- Sofía Martínez - Room 101 (Private)
-- Checked In, Paid, Has some charges.
INSERT INTO bookings (
    id, created_at, guest_name, email, phone, 
    location, room_type, guests, 
    check_in, check_out, 
    status, payment_status, total_price, source
) VALUES (
    'a1111111-1111-1111-1111-111111111111', NOW(), 'Sofía Martínez', 'sofia@demo.com', '+502 5555-0001',
    'pueblo', 'room-101', 2,
    CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days', -- Staying for 4 days
    'checked_in', 'paid', 1200.00, 'web'
);

-- Charges for Sofía
INSERT INTO charges (booking_id, item_name, amount, quantity, status, created_at)
VALUES 
('a1111111-1111-1111-1111-111111111111', 'Cerveza Gallo', 25.00, 2, 'paid', NOW() - INTERVAL '1 day'),
('a1111111-1111-1111-1111-111111111111', 'Coca Cola', 15.00, 1, 'pending', NOW());


-- 4. INSERT SCENARIO B: "Arrival Today" (Llegada)
-- Carlos Ruiz - Dorm Bed (Hideout)
-- Confirmed, Payment Verifying (Demo the verification flow)
INSERT INTO bookings (
    id, created_at, guest_name, email, phone, 
    location, room_type, guests, 
    check_in, check_out, 
    status, payment_status, total_price, source
) VALUES (
    'b2222222-2222-2222-2222-222222222222', NOW(), 'Carlos Ruiz', 'carlos@demo.com', '+502 5555-0002',
    'hideout', 'dorm-1', 1,
    CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days',
    'confirmed', 'verifying', 450.00, 'ota'
);


-- 5. INSERT SCENARIO C: "Checkout Pending" (Salida con Deuda)
-- John Doe - Room 102
-- Status: Checked In (needs checkout), Has UNPAID charges (Demo the Guard)
INSERT INTO bookings (
    id, created_at, guest_name, email, phone, 
    location, room_type, guests, 
    check_in, check_out, 
    status, payment_status, total_price, source
) VALUES (
    'c3333333-3333-3333-3333-333333333333', NOW(), 'John Doe', 'john@demo.com', '+502 5555-0003',
    'pueblo', 'room-102', 1,
    CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE, -- Leaves Today
    'checked_in', 'paid', 900.00, 'walk_in'
);

-- Unpaid Minibar Item (Blocks checkout)
INSERT INTO charges (booking_id, item_name, amount, quantity, status, created_at)
VALUES 
('c3333333-3333-3333-3333-333333333333', 'Pringles', 35.00, 1, 'pending', NOW());


-- 6. INSERT SCENARIO D: "Maintenance/Housekeeping"
-- Room 103 needs cleaning
-- Ana Polo - Just checked out yesterday
-- We update the Room Status in the 'rooms' table (if we tracked it there dynamically, but here we add a request)

INSERT INTO service_requests (
    booking_id, type, status, description, created_at
) VALUES 
('a1111111-1111-1111-1111-111111111111', 'amenity', 'pending', 'Solicitud de toallas extra', NOW()),
('c3333333-3333-3333-3333-333333333333', 'cleaning', 'completed', 'Limpieza post-checkout', NOW() - INTERVAL '1 hour');

COMMIT;
