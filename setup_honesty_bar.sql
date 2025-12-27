-- 1. Create Products Catalog
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL, -- 'beer', 'soda', 'water', 'snack'
    icon TEXT, -- Emoji or URL
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Charges Table (Linked to Bookings)
CREATE TABLE IF NOT EXISTS charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id), -- Optional link for stats
    item_name TEXT NOT NULL, -- Snapshot of name in case product changes
    amount DECIMAL(10,2) NOT NULL, -- Snapshot of price
    quantity INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE charges ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Products: Public can read active products. Admin can do all.
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin full access products" ON products USING (true) WITH CHECK (true); -- Simplify for now

-- Charges: 
-- Public can insert (add to bar) IF they own the booking (email match check is hard in pure SQL without auth context perfectly set, but we can allow insert for anon for MVP or link by ID)
-- For this MVP/Public App flow, we often use the ANON key but we validate logic in API or reliable Client.
-- Ideally: 
CREATE POLICY "Public read own charges" ON charges FOR SELECT USING (true); -- MVP: allow read to show in UI
CREATE POLICY "Public insert charges" ON charges FOR INSERT WITH CHECK (true); -- MVP: allow insert

-- 5. Seed Data (Ejemplos)
INSERT INTO products (name, price, category, icon) VALUES
('Cerveza Gallo', 20.00, 'beer', '🍺'),
('Cerveza Monte Carlo', 25.00, 'beer', '🍺'),
('Coca Cola', 10.00, 'soda', '🥤'),
('Agua Pura', 5.00, 'water', '💧'),
('Gatorade', 15.00, 'soda', '⚡'),
('Tortrix', 5.00, 'snack', '🌽'),
('Mani Japonés', 5.00, 'snack', '🥜');
