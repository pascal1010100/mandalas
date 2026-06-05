-- Mandalas Hostal public schema.
-- Source: public tables recovered from db_cluster-27-01-2026 backup.
-- Guest PII and historical bookings are intentionally not committed here.

create extension if not exists pgcrypto with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

create table if not exists public.bookings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    guest_name text not null,
    email text not null,
    phone text,
    location text not null,
    room_type text not null,
    guests text not null,
    check_in date not null,
    check_out date not null,
    total_price numeric not null,
    status text default 'pending'::text,
    cancellation_reason text,
    refund_status text,
    actual_check_out timestamptz,
    payment_status text default 'pending'::text,
    unit_id text,
    cancelled_at timestamptz,
    external_id text unique,
    source text default 'internal'::text,
    refund_amount numeric default 0,
    guest_id_type text,
    guest_id_number text,
    payment_method text,
    payment_reference text,
    constraint bookings_guest_id_type_check check (guest_id_type = any (array['passport', 'dni', 'license', 'other'])),
    constraint bookings_payment_method_check check (payment_method = any (array['cash', 'card', 'transfer', 'other'])),
    constraint bookings_payment_status_check check (payment_status = any (array['pending', 'verifying', 'paid', 'refunded'])),
    constraint bookings_status_check check (status = any (array['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'maintenance', 'no_show']))
);

create table if not exists public.cash_transactions (
    id uuid default gen_random_uuid() primary key,
    amount numeric not null,
    type text not null,
    category text not null,
    description text,
    payment_method text default 'cash'::text,
    booking_id uuid references public.bookings(id) on delete set null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    constraint cash_transactions_type_check check (type = any (array['income', 'expense']))
);

create table if not exists public.products (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    price numeric(10, 2) not null,
    category text not null,
    icon text,
    active boolean default true,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.charges (
    id uuid default gen_random_uuid() primary key,
    booking_id uuid references public.bookings(id) on delete cascade,
    product_id uuid references public.products(id),
    item_name text not null,
    amount numeric(10, 2) not null,
    quantity integer default 1,
    status text default 'pending'::text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.events (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    date timestamptz not null,
    category text,
    location text,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    constraint events_category_check check (category = any (array['music', 'food', 'social', 'wellness'])),
    constraint events_location_check check (location = any (array['Pueblo', 'Hideout']))
);

create table if not exists public.inventory_items (
    id uuid default extensions.uuid_generate_v4() primary key,
    name text not null,
    category text not null,
    current_stock numeric default 0 not null,
    min_stock_alert numeric default 5 not null,
    unit text default 'unidad'::text not null,
    cost_price numeric default 0,
    created_at timestamptz default now()
);

create table if not exists public.inventory_movements (
    id uuid default extensions.uuid_generate_v4() primary key,
    item_id uuid references public.inventory_items(id) on delete cascade,
    type text not null,
    quantity numeric not null,
    previous_stock numeric not null,
    new_stock numeric not null,
    reason text,
    created_by uuid references auth.users(id),
    created_at timestamptz default now(),
    constraint inventory_movements_type_check check (type = any (array['in', 'out', 'adjustment']))
);

create table if not exists public.rooms (
    id text primary key,
    location text not null,
    type text not null,
    label text not null,
    capacity integer default 1 not null,
    max_guests integer default 1 not null,
    base_price numeric default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    housekeeping_status text default 'clean'::text,
    ical_import_url text,
    ical_export_token uuid default gen_random_uuid(),
    last_cleaned_at timestamptz,
    maintenance_note text,
    units_housekeeping jsonb default '{}'::jsonb,
    constraint rooms_housekeeping_status_check check (housekeeping_status = any (array['clean', 'dirty', 'maintenance'])),
    constraint rooms_location_check check (location = any (array['pueblo', 'hideout'])),
    constraint rooms_type_check check (type = any (array['dorm', 'private', 'suite']))
);

create table if not exists public.service_requests (
    id uuid default gen_random_uuid() primary key,
    booking_id uuid references public.bookings(id) on delete cascade,
    type text not null,
    status text default 'pending'::text,
    description text,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    completed_at timestamptz,
    constraint service_requests_status_check check (status = any (array['pending', 'in_progress', 'completed', 'cancelled'])),
    constraint service_requests_type_check check (type = any (array['cleaning', 'maintenance', 'amenity', 'other']))
);

create index if not exists idx_bookings_external_id on public.bookings using btree (external_id);
create index if not exists idx_rooms_ical_token on public.rooms using btree (ical_export_token);
create index if not exists idx_bookings_email on public.bookings using btree (lower(email));
create index if not exists idx_bookings_dates on public.bookings using btree (check_in, check_out);
create index if not exists idx_charges_booking_id on public.charges using btree (booking_id);
create index if not exists idx_service_requests_booking_id on public.service_requests using btree (booking_id);
create index if not exists idx_inventory_movements_item_id on public.inventory_movements using btree (item_id);

alter table public.bookings enable row level security;
alter table public.cash_transactions enable row level security;
alter table public.charges enable row level security;
alter table public.events enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.products enable row level security;
alter table public.rooms enable row level security;
alter table public.service_requests enable row level security;

create policy "Authenticated manage bookings" on public.bookings for all to authenticated using (true) with check (true);
create policy "Public compatibility read bookings" on public.bookings for select to anon using (true);
create policy "Public compatibility insert bookings" on public.bookings for insert to anon with check (true);
create policy "Public compatibility update bookings" on public.bookings for update to anon using (true) with check (true);

create policy "Authenticated manage cash transactions" on public.cash_transactions for all to authenticated using (true) with check (true);
create policy "Authenticated manage charges" on public.charges for all to authenticated using (true) with check (true);
create policy "Public compatibility read charges" on public.charges for select to anon using (true);
create policy "Public compatibility insert charges" on public.charges for insert to anon with check (true);

create policy "Authenticated manage events" on public.events for all to authenticated using (true) with check (true);
create policy "Public read events" on public.events for select to anon using (true);

create policy "Authenticated manage inventory items" on public.inventory_items for all to authenticated using (true) with check (true);
create policy "Authenticated manage inventory movements" on public.inventory_movements for all to authenticated using (true) with check (true);

create policy "Authenticated manage products" on public.products for all to authenticated using (true) with check (true);
create policy "Public read active products" on public.products for select to anon using (active is true);

create policy "Authenticated manage rooms" on public.rooms for all to authenticated using (true) with check (true);
create policy "Public read rooms" on public.rooms for select to anon using (true);

create policy "Authenticated manage service requests" on public.service_requests for all to authenticated using (true) with check (true);
create policy "Public read service requests" on public.service_requests for select to anon using (true);
create policy "Public create service requests" on public.service_requests for insert to anon with check (true);
create policy "Public update service requests" on public.service_requests for update to anon using (true) with check (true);

insert into public.products (id, name, price, category, icon, active)
values
    ('443bd85a-3632-4f02-bb5e-3299c353fd35', 'Cerveza Gallo', 20.00, 'beer', 'beer', true),
    ('82d860c4-9494-4acd-bfd4-5eac9a8de647', 'Cerveza Monte Carlo', 25.00, 'beer', 'beer', true),
    ('e858e7bd-213b-462a-8e2f-0f4b6529417f', 'Coca Cola', 10.00, 'soda', 'soda', true),
    ('2e17b6d7-2fb5-4358-8288-1a1ab28c61d9', 'Agua Pura', 5.00, 'water', 'water', true),
    ('1b0ccd02-b9e0-4bc5-9e54-d3ba8ad8ed08', 'Gatorade', 15.00, 'soda', 'energy', true),
    ('8513edb5-91cc-4132-86c9-e050ffb6a84f', 'Tortrix', 5.00, 'snack', 'snack', true),
    ('dcffe337-34be-465e-8a6d-ae984e7b6b48', 'Mani Japones', 5.00, 'snack', 'snack', true)
on conflict (id) do update set
    name = excluded.name,
    price = excluded.price,
    category = excluded.category,
    icon = excluded.icon,
    active = excluded.active;

insert into public.rooms (id, location, type, label, capacity, max_guests, base_price, housekeeping_status, units_housekeeping)
values
    ('pueblo_private_2', 'pueblo', 'private', 'Habitacion Privada 2 (Estandar)', 4, 2, 40, 'clean', '{}'::jsonb),
    ('pueblo_dorm_mixed_8', 'pueblo', 'dorm', 'Dormitorio Mixto (8 Camas)', 8, 8, 18, 'clean', '{"1":"clean","2":"clean","3":"clean","4":"clean","5":"clean","6":"clean","7":"clean","8":"clean"}'::jsonb),
    ('pueblo_private_1', 'pueblo', 'private', 'Habitacion Privada 1 (Jardin)', 4, 2, 45, 'clean', '{}'::jsonb),
    ('hideout_dorm_female', 'hideout', 'dorm', 'Hideout Dorm A (Chicas)', 5, 5, 50, 'clean', '{"1":"clean","2":"clean","3":"clean","4":"clean","5":"clean"}'::jsonb),
    ('hideout_dorm_mixed', 'hideout', 'dorm', 'Hideout Dorm B (Mixto)', 5, 5, 150, 'clean', '{"1":"clean","2":"clean","3":"clean","4":"clean","5":"clean"}'::jsonb),
    ('pueblo_suite_balcony', 'pueblo', 'suite', 'Suite con Balcon', 1, 3, 75, 'clean', '{}'::jsonb),
    ('hideout_private_3', 'hideout', 'private', 'Hideout Private 3', 2, 2, 150, 'clean', '{"1":"clean","2":"clean"}'::jsonb),
    ('hideout_private_4', 'hideout', 'private', 'Hideout Private 4', 2, 2, 150, 'clean', '{"1":"clean","2":"clean"}'::jsonb),
    ('hideout_private_1', 'hideout', 'private', 'Hideout Private 1', 2, 2, 250, 'clean', '{}'::jsonb),
    ('hideout_private_2', 'hideout', 'private', 'Hideout Private 2', 2, 2, 150, 'clean', '{}'::jsonb),
    ('pueblo_dorm_female_6', 'pueblo', 'dorm', 'Dormitorio Femenino (6 Camas)', 6, 6, 20, 'clean', '{}'::jsonb),
    ('pueblo_private_family', 'pueblo', 'private', 'Habitacion Familiar', 4, 4, 60, 'clean', '{}'::jsonb)
on conflict (id) do update set
    location = excluded.location,
    type = excluded.type,
    label = excluded.label,
    capacity = excluded.capacity,
    max_guests = excluded.max_guests,
    base_price = excluded.base_price,
    housekeeping_status = excluded.housekeeping_status,
    units_housekeeping = excluded.units_housekeeping,
    updated_at = timezone('utc'::text, now());
