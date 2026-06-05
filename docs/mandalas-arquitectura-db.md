# Mandalas DB y arquitectura base

## Estado actual

- La app usa Supabase/Postgres.
- El proyecto antiguo `mandalas-db` (`zfbrcdwkunbvjnxmwlor`) esta `INACTIVE`.
- Supabase Dashboard confirma que `mandalas-db` lleva mas de 90 dias pausado y no puede restaurarse directamente.
- Se pauso `not-your-money-laundry` (`tbxpvmmajcvlojucratx`) para liberar un cupo free.
- Se creo el proyecto nuevo `mandalas-hostal` (`lwrnljsufsgezvkyvzxh`) en `us-west-2`.
- `.env.local` ahora apunta a `https://lwrnljsufsgezvkyvzxh.supabase.co`.
- Docker Desktop no queda listo en esta maquina, por eso Supabase local no puede iniciar todavia.
- Ya esta instalado `psql` via `libpq`: `/usr/local/opt/libpq/bin/psql`.

## Backup encontrado

Backup local:

```bash
/Users/usuario/Downloads/db_cluster-27-01-2026@07-35-03.backup
```

Tablas public recuperadas del backup:

- `bookings`
- `rooms`
- `charges`
- `products`
- `cash_transactions`
- `events`
- `inventory_items`
- `inventory_movements`
- `service_requests`

## Decision profesional

No se debe commitear data historica de reservas, emails, telefonos o documentos.

Por eso se agrego una migracion limpia con:

- esquema public de Mandalas
- indices importantes
- RLS compatible con la app actual
- seed no sensible de habitaciones y productos

Migracion:

```bash
supabase/migrations/20260603002500_mandalas_public_schema.sql
```

## Primer objetivo real

Tener una DB activa para desarrollo y deploy. Este objetivo esta resuelto con:

```text
mandalas-hostal / lwrnljsufsgezvkyvzxh
```

La data public restaurada desde el backup incluye:

- 26 reservas
- 12 habitaciones
- 7 productos
- 33 transacciones de caja
- 1 cargo
- 4 eventos

## Siguiente comando cuando haya DB remota activa

Con proyecto linkeado:

```bash
supabase link --project-ref lwrnljsufsgezvkyvzxh
supabase db push
```

Con URL directa de Postgres:

```bash
/usr/local/opt/libpq/bin/psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20260603002500_mandalas_public_schema.sql
```

Como la red local no tiene ruta IPv6 para la conexion directa, usar pooler:

```bash
PGPASSWORD='<DB_PASSWORD>' /usr/local/opt/libpq/bin/psql \
  -h aws-1-us-west-2.pooler.supabase.com \
  -p 6543 \
  -U postgres.lwrnljsufsgezvkyvzxh \
  -d postgres
```

## Nota de seguridad

La app actual hace operaciones del portal de huesped usando la anon key.
Para mantener compatibilidad inicial, la migracion incluye politicas publicas amplias.
La siguiente mejora arquitectonica debe mover estas acciones a API routes/RPC seguras:

- buscar reserva por email/id
- self check-in
- checkout
- agregar cargos de honesty bar
- crear solicitudes de servicio

Asi se evita exponer todas las reservas desde el cliente.
