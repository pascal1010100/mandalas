-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Inventory Items Table
create table if not exists inventory_items (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    category text not null, -- 'bebidas', 'limpieza', 'amenities', 'insumos', 'otros'
    current_stock numeric not null default 0,
    min_stock_alert numeric not null default 5,
    unit text not null default 'unidad', -- 'unidad', 'litro', 'kg', 'caja'
    cost_price numeric default 0,
    created_at timestamp with time zone default now()
);

-- 2. Inventory Movements Table (Traceability)
create table if not exists inventory_movements (
    id uuid primary key default uuid_generate_v4(),
    item_id uuid references inventory_items(id) on delete cascade,
    type text not null check (type in ('in', 'out', 'adjustment')),
    quantity numeric not null,
    previous_stock numeric not null,
    new_stock numeric not null,
    reason text, -- 'Compra', 'Venta', 'Consumo Interno', 'Merma', 'Ajuste'
    created_by uuid references auth.users(id),
    created_at timestamp with time zone default now()
);

-- 3. RLS Policies
alter table inventory_items enable row level security;
alter table inventory_movements enable row level security;

-- Allow public read (or authenticated) - For now public for ease of dev, strict later
create policy "Allow public read items" on inventory_items for select using (true);
create policy "Allow public insert items" on inventory_items for insert with check (true);
create policy "Allow public update items" on inventory_items for update using (true);
create policy "Allow public delete items" on inventory_items for delete using (true);

create policy "Allow public read movements" on inventory_movements for select using (true);
create policy "Allow public insert movements" on inventory_movements for insert with check (true);

-- 4. Realtime
alter publication supabase_realtime add table inventory_items;
alter publication supabase_realtime add table inventory_movements;
