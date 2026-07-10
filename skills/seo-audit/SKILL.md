---
name: seo-audit
description: Auditar y mejorar el SEO técnico y on-page del sitio Next.js de Mandalas. Usar al cambiar metadata, contenido público, rutas, canonical, robots, sitemap, JSON-LD, Open Graph, imágenes, enlaces internos, accesibilidad o rendimiento de páginas indexables, y al investigar pérdidas de visibilidad orgánica.
---

# Auditar SEO

1. Leer `AGENTS.md`, `README.md`, `src/app/layout.tsx`, `src/app/robots.ts` y `src/app/sitemap.ts`.
2. Identificar páginas públicas indexables y separar rutas privadas, administrativas, previews y API.
3. Revisar por URL título y descripción únicos, canonical correcto, H1, idioma, contenido útil, enlaces, imágenes y texto alternativo.
4. Verificar que robots y sitemap usen `https://www.mandalashostels.com`, incluyan solo URLs indexables y no contradigan metadata.
5. Validar Open Graph y JSON-LD. Mantener los datos estructurados coherentes con el contenido visible; no inventar reseñas, precios ni disponibilidad.
6. Ejecutar lint, pruebas y build. Probar `/`, `/pueblo`, `/hideout`, `/contact`, `/robots.txt` y `/sitemap.xml` en escritorio y móvil cuando corresponda.
7. Reportar cada hallazgo con prioridad, URL, evidencia, impacto y corrección.

No publicar ni solicitar indexación sin aprobación.
