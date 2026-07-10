---
name: production-monitoring
description: Monitorizar la salud de Mandalas en producción o previews: disponibilidad, errores, latencia, Core Web Vitals, SEO básico y recorridos hacia Cloudbeds. Usar para health checks, incidentes, regresiones posteriores a deployments, alertas o informes periódicos.
---

# Monitorizar producción

1. Definir objetivo, entorno, ventana temporal y baseline.
2. Comprobar `/`, `/pueblo`, `/hideout`, `/contact`, `/robots.txt` y `/sitemap.xml`; registrar status, redirección final y latencia sin datos personales.
3. Verificar en escritorio y móvil que reservar lleva al motor Cloudbeds correcto. No completar reservas de prueba en producción.
4. Revisar errores 5xx, funciones y latencia en Vercel; correlacionarlos con deployment y commit.
5. Usar Speed Insights y Web Analytics agregados. Indicar periodo, percentil, dispositivo y país disponibles; no concluir con muestras insuficientes.
6. Priorizar como crítico: sitio o reservas inaccesibles, propiedad cruzada, fuga de secretos o datos, canonical incorrecto y errores 5xx sostenidos.
7. Entregar estado, evidencia reproducible, impacto, siguiente acción y responsable sugerido.

Crear alertas, integrar servicios o modificar producción requiere aprobación explícita.
