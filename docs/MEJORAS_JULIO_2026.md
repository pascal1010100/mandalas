# Mejoras de Mandalas Hostels — julio de 2026

Este documento resume los cambios realizados en la plataforma pública, la integración con Cloudbeds, las herramientas internas y el proceso de calidad. Su objetivo es servir como referencia operativa y técnica.

## Estado general

- Sitio público: activo en [www.mandalashostels.com](https://www.mandalashostels.com).
- Idioma público: inglés.
- Propiedades presentadas: Mandalas y Hideout.
- Motor de reservas: Cloudbeds, con un enlace independiente por propiedad.
- Cloudbeds API: Hideout conectado para lectura; Mandalas pendiente de credenciales propias.
- Panel interno: implementado, pero deshabilitado por defecto en producción.
- Web Analytics: activo en Vercel Hobby.
- PostHog: configurado para pageviews y eventos de intención de reserva y WhatsApp.
- Speed Insights: integrado en el código; la disponibilidad de datos depende de la configuración y límites del proyecto en Vercel.

## 1. Experiencia pública

Se simplificó la plataforma para que el visitante pueda entender las dos propiedades sin convertir el sitio en otro panel de administración.

### Navegación y contenido

- Nueva presentación de Mandalas como una estancia céntrica, caminable y social.
- Nueva presentación de Hideout como una estancia más tranquila, cerca del lago.
- Navegación unificada con el subtítulo `Hostels · Lake Atitlán`.
- Contenido público normalizado en inglés.
- Metadatos, favicon, imágenes sociales y datos estructurados para buscadores.
- Sitemap y robots disponibles en `/sitemap.xml` y `/robots.txt`.

### Reservas

- Las páginas `/pueblo` y `/hideout` llevan directamente al motor Cloudbeds correspondiente.
- `/contact#book-directly` presenta ambas propiedades y permite elegir antes de abrir Cloudbeds.
- El botón `Book now` del navbar:
  - abre Cloudbeds directamente cuando el visitante ya está en Pueblo o Hideout;
  - lleva a las dos opciones de reserva desde Inicio y Contacto;
  - cierra correctamente el menú móvil antes de mostrar la sección de reserva.
- Instagram se mantiene como enlace secundario para no competir visualmente con la reserva.

### URLs de reserva

| Propiedad | Motor de reservas |
| --- | --- |
| Mandalas | `https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq` |
| Hideout | `https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq` |

Las URLs pueden sobrescribirse mediante `NEXT_PUBLIC_CLOUDBEDS_MANDALAS_URL` y `NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_URL`.

## 2. Integración Cloudbeds

Mandalas y Hideout son cuentas o propiedades separadas. Nunca deben compartir una API key por conveniencia: cada una debe usar su propia credencial y su propio identificador.

### Implementado

- Cliente HTTP tipado para la API PMS v1.3.
- Configuración separada por propiedad.
- Verificación de conexión y lectura de datos básicos.
- Consulta de habitaciones físicas y tipos de habitación.
- Resumen de próximas reservas sin imprimir información sensible del huésped.
- Mapeo de habitaciones de Hideout.
- Vista interna de reservas y ocupación.
- Morning Brief de solo lectura.
- Endpoint de webhook para eventos de reserva.
- Validación de payloads, secreto en URL, límite de tamaño y deduplicación temporal en memoria.
- Alertas de webhook preparadas para Telegram, sin base de datos.

### Comandos disponibles

```bash
pnpm cloudbeds:verify
pnpm cloudbeds:rooms
pnpm cloudbeds:reservations
```

La configuración completa se encuentra en [CLOUDBEDS_API_SETUP.md](./CLOUDBEDS_API_SETUP.md).

### Seguridad

- Las API keys solo se leen en el servidor.
- Ninguna variable Cloudbeds utiliza el prefijo `NEXT_PUBLIC_`.
- `.env.local` está excluido de Git.
- Las pruebas y scripts evitan imprimir API keys o información de contacto de huéspedes.
- El webhook no debe activarse en Cloudbeds hasta configurar y probar su secreto y el canal de entrega.

## 3. Panel interno

El panel fue reconstruido como un `Automation Studio`, no como reemplazo de Cloudbeds.

### Áreas disponibles

- `/admin`: resumen operativo.
- `/admin/cloudbeds`: lectura y estado de Cloudbeds.
- `/admin/automations`: Morning Brief, estado de tiempo real y propuestas de automatización.

El panel y sus APIs están deshabilitados en producción salvo que `ENABLE_ADMIN=true`. El bypass de autenticación solo puede utilizarse en desarrollo local con `ADMIN_BYPASS_AUTH=true`; nunca funciona como bypass en producción.

## 4. Analítica

Se instalaron:

- `@vercel/analytics`
- `@vercel/speed-insights`
- `posthog-js`

Vercel Web Analytics registra tráfico general como páginas, referencias, países, dispositivos, navegadores y parámetros UTM. PostHog complementa esa información con los eventos anónimos `booking_intent` y `whatsapp_intent`, desglosados por propiedad y origen del botón.

Estos eventos representan clics o intención de continuar, no reservas pagadas. Cloudbeds sigue siendo la fuente para reservas confirmadas e ingresos. No se habilitan identificación personal, autocapture, persistencia, session replay ni heatmaps sin una revisión de privacidad y aprobación humana.

Recomendación operativa: revisar tendencias después de 7 a 14 días, no tomar decisiones con las primeras visitas de prueba.

Enlaces sugeridos para biografías de Instagram:

```text
https://www.mandalashostels.com/pueblo?utm_source=instagram&utm_medium=bio&utm_campaign=mandalas
https://www.mandalashostels.com/hideout?utm_source=instagram&utm_medium=bio&utm_campaign=hideout
```

## 5. Calidad y pruebas

### Vitest

Las pruebas unitarias cubren disponibilidad, validadores y componentes de la integración Cloudbeds.

```bash
pnpm test
```

### Playwright

Playwright valida en Chromium de escritorio y móvil:

- Inicio, Pueblo, Hideout y Contacto.
- Enlaces críticos a Cloudbeds e Instagram.
- Menú móvil.
- Comportamiento de `Book now` en Contacto.
- Preselección del formulario y apertura de WhatsApp.
- Carga diferida del mapa.
- Metadatos, datos estructurados, robots y sitemap.

```bash
pnpm test:e2e
pnpm test:e2e:ui
```

GitHub Actions instala Chromium y ejecuta las pruebas E2E antes del build.

## 6. Despliegue

- Producción se aloja en Vercel.
- El dominio principal es `www.mandalashostels.com`.
- Los pushes a `main` activan la integración Git de Vercel, que realiza el despliegue efectivo.
- El 24 de julio de 2026 se publicó y verificó en producción el trabajo de SEO y rendimiento mediante esa integración.
- Los cambios están versionados en `main` y publicados en GitHub.

GitHub Actions también contiene un job redundante de Vercel CLI. Sus pruebas y build pasan, pero el paso de despliegue falla mientras `VERCEL_PROJECT_ID` esté vacío. Este fallo no invalida el despliegue realizado correctamente por la integración Git de Vercel.

## 7. Pendientes conocidos

1. Conseguir y configurar la API key independiente de Mandalas.
2. Elegir el canal real para alertas: Telegram, WhatsApp o correo.
3. Activar webhooks solo después de probar el canal de entrega.
4. Confirmar la disponibilidad de datos de Speed Insights en el proyecto o mantener una línea base con Lighthouse/Playwright.
5. Configurar `VERCEL_PROJECT_ID` en GitHub Actions o retirar el despliegue redundante mediante Vercel CLI.
6. Decidir si Docker continúa en la estrategia. Si continúa, configurar las credenciales de Docker Hub y proporcionar las variables públicas de Supabase durante los builds de Pull Requests.
7. Crear un usuario administrativo nuevo antes de habilitar el panel en producción.

## 8. Commits principales

- `ea67e22` — modernización pública y herramientas Cloudbeds.
- `d50fd19` — pruebas Playwright e integración CI.
- `eb5fd15` — corrección del botón `Book now` del navbar.
- `093550c` — analítica privada con PostHog.
- `bb77e5a` — optimización SEO, renderizado público y protección de flujos de reserva.
