---
name: vercel-operations
description: Diagnosticar y operar Mandalas en Vercel mediante CLI, incluyendo deployments, inspect, logs, dominios, variables y aliases. Usar al investigar builds, runtime, previews, configuración o producción, con aprobación obligatoria antes de cualquier cambio remoto.
---

# Operar Vercel

1. Leer `AGENTS.md`, `README.md` y `.github/workflows/`.
2. Confirmar proyecto, scope y entorno. Revisar `.vercel/project.json` antes de considerar `vercel link`.
3. Preferir consultas de solo lectura: `vercel project inspect`, `vercel inspect`, `vercel list`, `vercel logs` y `vercel domains inspect`. Consultar `vercel --help` si la versión difiere.
4. Redactar tokens, cookies, datos de huéspedes y valores de variables. Para variables, mostrar solo nombres y entornos.
5. Correlacionar deployment con commit, rama, fecha y URL antes de atribuir una regresión.
6. Pedir aprobación antes de deploy, promoción, rollback, redeploy, alias, dominio, integración, `env add/rm/pull` o cualquier cambio remoto o escritura de secretos locales.
7. Tras un cambio aprobado, validar páginas críticas y documentar deployment y resultado sin secretos.

No convertir una inspección en un despliegue implícito ni experimentar en producción.
