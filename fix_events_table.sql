-- FIX EVENTS TABLE
-- 1. Create the table (it was missing!)
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  category text check (category in ('music', 'food', 'social', 'wellness')),
  location text check (location in ('Pueblo', 'Hideout')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Security
alter table events enable row level security;

-- 3. Policies (Public view, Admin edit)
create policy "Public events" on events for select to anon, authenticated using (true);
create policy "Admin events" on events for all to authenticated using (true) with check (true);

-- 4. Seed Data (Now that the table exists)
insert into events (title, description, date, category, location) values
  ('Yoga al Amanecer', 'Clase de Hatha Yoga para empezar el día.', (now() + interval '1 day')::date + time '07:30:00', 'wellness', 'Pueblo'),
  ('BBQ Familiar & Cervezas', 'Parrillada en el patio principal.', (now() + interval '2 days')::date + time '19:00:00', 'food', 'Pueblo'),
  ('Noche de Música Acústica', 'Jam session abierta.', (now() + interval '3 days')::date + time '20:30:00', 'music', 'Hideout'),
  ('Caminata a la Cascada', 'Tour guiado a la cascada local.', (now() + interval '4 days')::date + time '10:00:00', 'social', 'Hideout');
