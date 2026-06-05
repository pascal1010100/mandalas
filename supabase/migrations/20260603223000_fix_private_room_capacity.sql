-- Private rooms and suites are single sellable units.
-- `max_guests` controls guest occupancy; `capacity` must not allow duplicate
-- bookings for one private room row.

update public.rooms
set capacity = 1,
    updated_at = timezone('utc'::text, now())
where type in ('private', 'suite')
  and capacity <> 1;
