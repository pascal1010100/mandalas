-- Create Rooms Table for Persistent Configuration
create table if not exists rooms (
  id text primary key,
  location text not null check (location in ('pueblo', 'hideout')),
  type text not null check (type in ('dorm', 'private', 'suite')),
  label text not null,
  capacity int not null default 1,     -- Inventory Count
  max_guests int not null default 1,   -- Physical Occupancy Limit
  base_price numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table rooms enable row level security;

-- Policies
create policy "Public can view rooms"
  on rooms for select
  to anon, authenticated
  using (true);

create policy "Admins can update rooms"
  on rooms for update
  to authenticated
  using (true)
  with check (true);

-- Insert Default Data (The Real "Elite" Defaults we just defined)
-- Use ON CONFLICT DO NOTHING to avoid duplicate errors if run multiple times
insert into rooms (id, location, type, label, capacity, max_guests, base_price) values
  -- PUEBLO
  ('pueblo_dorm', 'pueblo', 'dorm', 'Dormitorio Pueblo', 8, 8, 18),
  ('pueblo_private', 'pueblo', 'private', 'Habitación Privada Pueblo', 4, 2, 35),
  ('pueblo_suite', 'pueblo', 'suite', 'Suite Pueblo', 1, 4, 55),
  -- HIDEOUT
  ('hideout_dorm', 'hideout', 'dorm', 'Dormitorio Hideout', 6, 6, 16),
  ('hideout_private', 'hideout', 'private', 'Habitación Privada Hideout', 3, 2, 40),
  ('hideout_suite', 'hideout', 'suite', 'Suite Hideout', 2, 4, 55)
on conflict (id) do update set
  capacity = excluded.capacity,
  max_guests = excluded.max_guests,
  base_price = excluded.base_price;
