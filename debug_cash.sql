-- check permissions
select * from information_schema.role_table_grants where table_name = 'cash_transactions';

-- check policies
select * from pg_policies where tablename = 'cash_transactions';

-- try manual insert and select
insert into public.cash_transactions (amount, type, category, description, payment_method)
values (1, 'income', 'test', 'Test via SQL', 'cash')
returning *;

select * from public.cash_transactions order by created_at desc limit 5;
