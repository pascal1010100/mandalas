# AGENTS — Instrucciones operativas para Mandalas Hostels

Este archivo define cómo deben trabajar personas y asistentes sobre el ecosistema de Mandalas Hostels.

## Misión

Mantener la presencia digital de Mandalas y Hideout, gestionar la integración con los motores de reserva de Cloudbeds y automatizar la operativa interna según sea necesario.

## Contrato técnico actual

- Next.js 16 con App Router y React 19.
- TypeScript estricto.
- Tailwind CSS y shadcn UI.
- React Leaflet para mapas.
- Cloudbeds PMS API para integración.
- Vitest / Playwright para QA.
- pnpm 10 y Node.js 20 como toolchain.

## Comandos oficiales

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

## Antes de modificar código

1. Leer `README.md` y la documentación en `docs/`.
2. Verificar si el cambio afecta la integración con Cloudbeds o los motores de reserva.
3. Explicar cambios arquitectónicos grandes.
4. Documentar deuda técnica.

## Automatización y agentes

- Workflows de CI para validación.
- Scripts para sincronización de datos de Cloudbeds (solo lectura).
- Aprobación humana obligatoria para cualquier escritura (aunque no hay escrita de momento).

## Skills del proyecto

Antes de trabajar en estas áreas, leer y aplicar la skill correspondiente:

- SEO técnico o contenido indexable: `skills/seo-audit/SKILL.md`.
- Diagnóstico u operaciones de Vercel: `skills/vercel-operations/SKILL.md`.
- Salud, rendimiento y alertas de producción: `skills/production-monitoring/SKILL.md`.
- Cualquier tarea relacionada con Cloudbeds: `skills/cloudbeds-safety/SKILL.md`.

Las skills complementan este archivo; no pueden relajar sus restricciones.

## Entornos y producción

- Producción canónica: `https://www.mandalashostels.com`.
- Usar previews de Vercel para validar antes de producción.
- Se permiten consultas remotas de solo lectura que no expongan secretos ni datos de huéspedes.
- Requieren aprobación humana explícita: desplegar o revertir, promover deployments, y cambiar dominios, aliases, variables, integraciones, webhooks o configuración de Cloudbeds.
- Nunca imprimir ni documentar tokens, API keys, payloads de huéspedes o valores secretos.

## Páginas y recorridos críticos

- `/`, `/pueblo`, `/hideout` y `/contact#book-directly`.
- `robots.txt`, `sitemap.xml` y las salidas hacia ambos motores Cloudbeds.
- Validar escritorio y móvil cuando cambien navegación, llamadas a reservar o contenido indexable.

## SEO y monitorización

- Cada página pública indexable debe tener título y descripción únicos, canonical correcto y una intención principal.
- Mantener robots, sitemap, Open Graph y JSON-LD coherentes con el dominio canónico.
- No indexar paneles internos, portales privados, previews ni endpoints.
- Enlaces de reserva rotos, errores 5xx y canonical incorrecto son incidentes críticos.
- Regresiones de accesibilidad, indexación o Core Web Vitals bloquean la promoción a producción.
- Toda medición debe registrar fecha, URL, dispositivo, herramienta y baseline.

## Calidad mínima

- TypeScript, ESLint y build en verde.
- Playwright de recorridos de reserva (escritorio y móvil).
- Accesibilidad en motores de reserva.
- Seguridad en variables de entorno (Cloudbeds keys).
