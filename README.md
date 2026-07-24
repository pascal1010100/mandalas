# Mandalas Hostels

Sitio público y herramientas de integración para **Mandalas** y **Hideout** en San Pedro La Laguna, Lake Atitlán.

Producción: [www.mandalashostels.com](https://www.mandalashostels.com)

## Propiedades

- **Mandalas:** ubicación céntrica, caminable y social.
- **Hideout:** estancia más tranquila, cerca del lago y fuera del centro.

El sitio público presenta ambas experiencias y dirige las reservas a los motores oficiales de Cloudbeds. Cloudbeds continúa siendo la fuente principal para administrar disponibilidad, precios y reservas.

## Tecnologías

- Next.js 16 y React 19
- TypeScript
- Tailwind CSS
- Radix UI / shadcn
- Framer Motion
- React Leaflet
- Cloudbeds PMS API
- Vercel Web Analytics
- PostHog para eventos de conversión anónimos
- Vitest y Playwright
- Supabase para módulos operativos heredados o futuros

## Instalación local

```bash
git clone https://github.com/pascal1010100/mandalas.git
cd mandalas
corepack pnpm install
cp .env.example .env.local
corepack pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables principales

```bash
NEXT_PUBLIC_APP_URL=https://www.mandalashostels.com
NEXT_PUBLIC_WHATSAPP_NUMBER=502XXXXXXXX
NEXT_PUBLIC_CONTACT_EMAIL=info@example.com

NEXT_PUBLIC_CLOUDBEDS_MANDALAS_URL=
NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_URL=

NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=
NEXT_PUBLIC_POSTHOG_HOST=

CLOUDBEDS_API_BASE_URL=https://api.cloudbeds.com/api/v1.3
CLOUDBEDS_HIDEOUT_API_KEY=
CLOUDBEDS_HIDEOUT_PROPERTY_ID=
CLOUDBEDS_MANDALAS_API_KEY=
CLOUDBEDS_MANDALAS_PROPERTY_ID=

ENABLE_ADMIN=false
ENABLE_GUEST_PORTAL=false
ADMIN_BYPASS_AUTH=false

# Módulos operativos heredados u opcionales
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Las API keys de Cloudbeds y la clave de servicio de Supabase son privadas y nunca deben usar el prefijo `NEXT_PUBLIC_`. El token público de proyecto de PostHog sí se utiliza en el navegador, pero nunca debe sustituirse por una personal API key. No se debe guardar `.env.local` en Git.

## Comandos

```bash
# Desarrollo
corepack pnpm dev

# Calidad
corepack pnpm lint
corepack pnpm test
corepack pnpm test:e2e
corepack pnpm build

# Cloudbeds, solo lectura
corepack pnpm cloudbeds:verify
corepack pnpm cloudbeds:rooms
corepack pnpm cloudbeds:reservations
```

## Reservas y Cloudbeds

- `/pueblo` abre el motor Cloudbeds de Mandalas.
- `/hideout` abre el motor Cloudbeds de Hideout.
- `/contact#book-directly` permite elegir entre las dos propiedades.
- Hideout tiene una integración API de lectura.
- Mandalas necesita una API key independiente antes de conectarse.
- El webhook de reservas está preparado, pero no debe activarse hasta configurar y probar el secreto y el canal de alertas.

Configuración detallada: [docs/CLOUDBEDS_API_SETUP.md](docs/CLOUDBEDS_API_SETUP.md).

## Panel interno

El panel interno funciona como un **Automation Studio** para lectura de Cloudbeds y automatizaciones pequeñas. No pretende reemplazar el panel de Cloudbeds.

Está deshabilitado por defecto. Para desarrollo local:

```bash
ENABLE_ADMIN=true
ADMIN_BYPASS_AUTH=true
```

`ADMIN_BYPASS_AUTH` nunca omite autenticación en producción.

## Pruebas

Vitest cubre lógica de dominio, analítica e integración Cloudbeds. Playwright cubre escritorio y móvil, incluyendo navegación pública, metadatos SEO, motores de reserva, WhatsApp, carga diferida del mapa, robots y sitemap.

```bash
corepack pnpm test
corepack pnpm test:e2e
```

GitHub Actions ejecuta lint, pruebas unitarias, Playwright y build.

## Despliegue

La producción se aloja en Vercel. Antes de considerar un cambio terminado:

```bash
corepack pnpm test
corepack pnpm test:e2e
corepack pnpm build
```

Los pushes a `main` activan la integración Git de Vercel, que es el mecanismo que publica actualmente el sitio. El workflow de GitHub contiene un segundo despliegue redundante mediante Vercel CLI; ese job seguirá fallando mientras `VERCEL_PROJECT_ID` no esté configurado y conviene configurarlo o retirarlo.

El workflow Docker es independiente de la producción en Vercel. Para volverlo operativo necesita credenciales válidas de Docker Hub y las variables públicas de Supabase durante el build, o debe retirarse si Docker ya no forma parte de la estrategia.

## Documentación

- [Resumen de mejoras de julio de 2026](docs/MEJORAS_JULIO_2026.md)
- [Configuración de Cloudbeds](docs/CLOUDBEDS_API_SETUP.md)
- [Configuración y operación de PostHog](docs/POSTHOG_SETUP.md)
- [Guía de sincronización iCal](docs/ICAL_SYNC_GUIDE.md)
- [Arquitectura de base de datos](docs/mandalas-arquitectura-db.md)

## Ramas

- `main`: producción.
- `develop`: integración y staging, cuando se utilice ese flujo.
