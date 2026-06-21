# AGENTE.md

Guía de trabajo para agentes que colaboren en el proyecto Mandalas. El objetivo es mantener el proyecto ordenado, seguro y alineado con la entrega real por fases.

## Contexto del proyecto

Mandalas es un sitio Next.js para Mandalas Hostal en San Pedro La Laguna. La fase actual prioriza el sitio público, en inglés, orientado a consultas directas por WhatsApp y preparado para el dominio `mandalashostels.com`.

El repositorio también conserva módulos operativos/admin que podrían reactivarse en una fase posterior. No asumir que esos módulos forman parte de la entrega pública actual.

Cloudbeds pertenece a fase 2. La integración todavía está en investigación y no debe guiar cambios de fase 1 salvo documentación explícita.

## Prioridad actual: fase 1

La prioridad actual es entregar un sitio público profesional para Mandalas Hostal.

Objetivo de fase 1:

*   Sitio público en inglés.
*   Dominio previsto: `mandalashostels.com`.
*   Presentar claramente las dos opciones de hospedaje: Mandalas y Hideout.
*   Facilitar contacto y solicitudes por WhatsApp.
*   Generar confianza con fotos, ubicación, amenidades, tono profesional y contenido claro.
*   Mantener apagados admin, guest portal y funciones operativas que no estén listas para público.

Fase 1 no incluye:

*   Reservas directas completas dentro de la web.
*   Pagos en línea.
*   Integración activa con Cloudbeds.
*   Sincronización automática de disponibilidad.
*   Panel administrativo público.
*   Portal de huéspedes.

## Requisitos de idioma

Todo lo visible para visitantes debe estar en inglés:

*   Navegación.
*   Títulos y subtítulos.
*   Descripciones de Mandalas y Hideout.
*   Botones y llamadas a la acción.
*   Formularios.
*   Mensajes de error o confirmación.
*   Metadata SEO.
*   Open Graph y textos para compartir.
*   Mensajes prellenados de WhatsApp.

Evitar traducciones literales desde español. El tono debe sentirse natural para viajeros internacionales: claro, cálido, confiable y fácil de entender.

## Dominio y producción

El dominio de producción es `https://www.mandalashostels.com`; `mandalashostels.com` redirige a esta URL canónica.

Checklist de producción:

*   Usar `NEXT_PUBLIC_APP_URL=https://www.mandalashostels.com`.
*   Configurar canonical URL.
*   Revisar Open Graph para WhatsApp, Facebook y previews sociales.
*   Confirmar metadata básica: title, description, image y site name.
*   Verificar que el CTA principal funcione en móvil.
*   Confirmar que no haya rutas incompletas visibles al público.
*   Confirmar que `ENABLE_ADMIN=false` y `ENABLE_GUEST_PORTAL=false` en producción si esos módulos no serán entregados.

## Experiencia esperada para usuarios

El usuario debe poder:

*   Entender rápidamente qué es Mandalas Hostal.
*   Diferenciar Mandalas y Hideout.
*   Ver fotos reales y atractivas.
*   Identificar ubicación y contexto de San Pedro La Laguna.
*   Revisar amenidades relevantes.
*   Contactar por WhatsApp sin fricción.
*   Sentir que el sitio está terminado, aunque fase 2 todavía no exista.

Para fase 1, el flujo recomendado es:

```text
Visitante entra al sitio
→ entiende las opciones Mandalas / Hideout
→ revisa fotos, ubicación y detalles
→ usa WhatsApp para consultar disponibilidad o reservar
→ el equipo gestiona la reserva por su flujo actual
```

## Criterios de entrega de fase 1

Antes de considerar fase 1 lista:

*   Todo el contenido público está en inglés.
*   El sitio construye sin errores con `pnpm build`.
*   La navegación principal funciona en desktop y móvil.
*   WhatsApp abre con número correcto y mensaje útil.
*   Las imágenes cargan correctamente y no son placeholders evidentes.
*   SEO básico y Open Graph están configurados para el dominio final.
*   No hay módulos admin, guest portal o rutas internas expuestas accidentalmente.
*   No hay credenciales ni datos sensibles en el repo.
*   El README refleja cómo correr y desplegar el proyecto.

## Fase 2: Cloudbeds

Cloudbeds se investigará después de cerrar el alcance público de fase 1.

## Objetivo de la integración Cloudbeds

Queremos evaluar e implementar, paso a paso, una integración que ayude a Mandalas a operar con menos trabajo manual y datos más confiables.

Objetivos posibles:

*   Leer datos de propiedades, habitaciones, reservas y huéspedes.
*   Recibir eventos de Cloudbeds mediante webhooks.
*   Preparar automatizaciones para comunicación, reportes, housekeeping, CRM o check-in.
*   Mantener Cloudbeds como fuente principal para datos sensibles de reservas y huéspedes.
*   Evitar sincronizaciones agresivas o escritura en Cloudbeds hasta entender permisos, riesgos y reglas del negocio.

## Tipos de integración compatibles con Cloudbeds

Cloudbeds documenta varios caminos:

*   **Property-level API key**: recomendado para empezar rápido con una propiedad. Útil para pruebas controladas.
*   **Partner-level API key / Marketplace app**: flujo más formal para apps de partners. Requiere autorización de la propiedad y entrega de API key, idealmente automática.
*   **Webhooks**: permiten recibir eventos cuando ocurren cambios en Cloudbeds. Son útiles para reaccionar a reservas creadas, cambios de habitación o actualizaciones de huéspedes.
*   **PMS API**: API principal para reservas, huéspedes, habitaciones, propiedades y recursos operativos.
*   **Accounting API**: para folios, transacciones, balances y reportes financieros. Tratar como fase avanzada.
*   **Data Insights API**: para reportes y análisis avanzados. Tratar como fase avanzada.
*   **Blueprints**: guías por caso de uso, como CRM, housekeeping, point of sale, booking engine, revenue management y access management.

## Orden recomendado para Cloudbeds

1.  Investigar primero en documentación oficial.
2.  Documentar hallazgos relevantes en `README.md` o en archivos dentro de `docs/`.
3.  Definir caso de uso antes de escribir código.
4.  Confirmar scopes mínimos necesarios.
5.  Implementar lectura antes de escritura.
6.  Agregar webhooks solo cuando exista un endpoint seguro e idempotente.
7.  Probar con sandbox o credenciales controladas.

## Reglas de seguridad

*   Nunca guardar API keys, client secrets, tokens, authorization codes ni datos reales de huéspedes en Git.
*   Usar variables de entorno para credenciales.
*   No imprimir secretos en logs.
*   No crear endpoints públicos de webhook sin validación, rate limiting o manejo seguro de errores.
*   Trabajar con permisos mínimos.
*   Tratar reservas, huéspedes, pagos y contabilidad como datos sensibles.
*   Antes de escribir datos en Cloudbeds, documentar qué cambia, por qué cambia y cómo revertirlo.

## Variables de entorno sugeridas

No crear valores reales en el repo. Estas claves son solo nombres tentativos:

```bash
CLOUDBEDS_API_BASE_URL=https://hotels.cloudbeds.com/api/v1.3
CLOUDBEDS_API_KEY=
CLOUDBEDS_CLIENT_ID=
CLOUDBEDS_CLIENT_SECRET=
CLOUDBEDS_REDIRECT_URI=
CLOUDBEDS_WEBHOOK_SECRET=
```

## Fuentes oficiales

Consultar estas fuentes antes de implementar:

*   https://developers.cloudbeds.com/reference/about-pms-api
*   https://developers.cloudbeds.com/docs/about-cloudbeds-api
*   https://developers.cloudbeds.com/docs/authentication-1
*   https://developers.cloudbeds.com/docs/api-keys-authentication-guide-for-technology-partners
*   https://developers.cloudbeds.com/docs/quickstart-guide-api-authentication-for-property-level-users
*   https://developers.cloudbeds.com/docs/webhooks-1
*   https://developers.cloudbeds.com/llms.txt

## Primeros endpoints/capacidades a investigar

Prioridad inicial:

*   Autenticación con API key.
*   Información de propiedad/hotel.
*   Reservas.
*   Habitaciones o tipos de habitación.
*   Huéspedes.
*   Webhooks de reservas.

Prioridad posterior:

*   Disponibilidad.
*   Tarifas.
*   House accounts.
*   Contabilidad.
*   Reportes avanzados.

## Criterio general para cambios de código

Antes de tocar código:

*   Leer la estructura existente.
*   Mantener patrones de Next.js, TypeScript, pnpm y Tailwind ya usados.
*   Preferir módulos pequeños y testeables.
*   No activar funciones admin/operativas sin decisión explícita.
*   No mezclar fase 1 con Cloudbeds salvo documentación explícita.
*   No hacer rediseños visuales no relacionados con la entrega actual.

Cuando se implemente Cloudbeds:

*   Crear cliente de Cloudbeds aislado.
*   Centralizar errores y timeouts.
*   Validar payloads externos.
*   Escribir pruebas para transformaciones y manejo de errores.
*   Mantener logs útiles, sin datos sensibles.
