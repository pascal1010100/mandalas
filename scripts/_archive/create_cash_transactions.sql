-- Create Cash Transactions Table
create table if not exists public.cash_transactions (
  id uuid default gen_random_uuid() primary key,
  amount decimal not null, -- Positive for income, negative for expense
  type text not null check (type in ('income', 'expense')),
  category text not null, -- 'reservation', 'laundry', 'shuttle', 'bar', 'other'
  description text,
  payment_method text default 'cash', -- 'cash', 'card', 'transfer'
  booking_id uuid references public.bookings(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.cash_transactions enable row level security;

-- Simple Policy (Open for authenticated users)
create policy "Enable all access for authenticated users" on public.cash_transactions
    for all using (auth.role() = 'authenticated');

-- Grant access
grant all on public.cash_transactions to postgres;
grant all on public.cash_transactions to anon;
grant all on public.cash_transactions to authenticated;
grant all on public.cash_transactions to service_role;
