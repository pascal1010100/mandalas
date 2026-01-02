-- DIAGNOSTIC SCRIPT FOR DASHBOARD METRICS

-- 1. Check Date Settings
select now()::date as server_date, current_time as server_time;

-- 2. "Caja Real" Audit (Revenue This Month)
-- Logic: Bookings with check_in in current month AND status != cancelled AND payment_status = 'paid'
select 
    id, guest_name, check_in, total_price, payment_status, status
from bookings
where 
    check_in >= date_trunc('month', now())
    and check_in < date_trunc('month', now()) + interval '1 month'
    and status != 'cancelled'
order by check_in;

-- 3. "Por Cobrar" Audit (Outstanding Debt)
-- Logic: All bookings (any date) that are confirmed/checked_in/checked_out AND payment_status != 'paid'
select 
    id, guest_name, check_in, total_price, payment_status, status
from bookings
where 
    status in ('confirmed', 'checked_in', 'checked_out')
    and payment_status != 'paid';

-- 4. "Occupancy" Audit (For Today)
-- Logic: Bookings where check_in <= today AND check_out > today AND valid status
with params as (
    select now()::date as business_date -- Verify if this matches your local date
)
select 
    b.id, b.guest_name, b.check_in, b.check_out, b.status, r.name as room_name, r.capacity
from bookings b
join rooms r on b.room_id = r.id
cross join params p
where 
    b.check_in <= p.business_date 
    and b.check_out > p.business_date
    and b.status in ('confirmed', 'pending', 'checked_in', 'maintenance');

-- 5. Total Capacity Check
select sum(capacity) as total_hotel_capacity from rooms;
