# Mandalas Hostels — Fase 2: Orientación y conversión

> **Estado:** propuesta de alcance pendiente de aprobación final  
> **Prioridad:** alta  
> **Implementación:** Pascal.dev  
> **Revisión:** Administración de Hostal Mandalas revisa el resultado final cuando Pascal.dev lo presente  
> **Fecha objetivo:** sin fecha acordada  
> **Sitio:** https://www.mandalashostels.com  
> **Repositorio:** https://github.com/pascal1010100/mandalas

## Resumen ejecutivo

La Fase 2 convierte el sitio oficial de Mandalas Hostels en un flujo de conversión que acompaña al huésped desde el descubrimiento de las dos propiedades hasta el inicio de una reserva oficial.

El valor de esta fase no está en una sola página o función. Está en conectar seis capacidades en una experiencia coherente:

```text
Descubrimiento
      │
      ▼
Elección entre Mandalas y Hideout
      │
      ▼
Orientación y guía de llegada
      │
      ▼
Consulta de disponibilidad real
      │
      ▼
Transición al motor oficial
      │
      ▼
Intención de reserva medible
```

La experiencia propia ayudará a seleccionar la propiedad, las fechas y el número de huéspedes, y podrá mostrar disponibilidad proveniente de Cloudbeds. La confirmación de habitación, la creación final de la reserva y el pago continuarán en el motor oficial de Cloudbeds durante esta fase.

## Objetivo de la fase

Reducir dudas y fricción antes de la reserva para que más visitantes puedan:

- entender que Mandalas Hostels ofrece dos experiencias diferentes;
- identificar cuál propiedad se ajusta mejor a su viaje;
- comprender cómo llegar a San Pedro La Laguna y a cada hostal;
- consultar disponibilidad real sin depender primero de una conversación manual;
- avanzar con contexto hacia el motor oficial de Cloudbeds;
- contactar por WhatsApp cuando necesiten ayuda.

Esta fase busca mejorar el recorrido hacia la reserva. No promete un porcentaje específico de conversión, ingresos ni reservas pagadas.

## Visión del producto

Mandalas Hostels debe sentirse como una sola marca con dos formas de vivir San Pedro La Laguna:

- **Mandalas:** una experiencia céntrica, caminable y social.
- **Hideout:** una experiencia tranquila, relajada y cerca del lago.

El visitante no debería necesitar explorar varias páginas para entender esta diferencia. Desde el primer contacto, la interfaz debe ayudarle a comparar, decidir, orientarse y continuar hacia la opción disponible correcta.

La experiencia terminada debe ser:

- clara para una persona que no conoce San Pedro La Laguna;
- rápida y legible en móvil;
- visualmente coherente con ambas propiedades;
- accesible y resistente a errores externos;
- medible sin identificar personas;
- segura para las credenciales y datos de Cloudbeds;
- honesta sobre qué ocurre en el sitio y qué se completa en Cloudbeds.

## Valor para el negocio

La Fase 2 conecta la inversión técnica con resultados operativos concretos:

- reduce confusión entre las dos propiedades;
- disminuye preguntas repetitivas antes de la llegada;
- dirige al huésped al canal de reserva adecuado;
- permite observar dónde se pierde la intención de reserva;
- mantiene Cloudbeds como fuente oficial de disponibilidad, reservas e ingresos;
- crea una base segura para futuras mejoras sin reconstruir el sitio.

## Estado actual y baseline

### Ya implementado

- Sitio público en producción.
- Home comparativa para Mandalas y Hideout.
- Páginas `/pueblo`, `/hideout`, `/contact` y `/guide`.
- CTA hacia los motores oficiales de Cloudbeds.
- Contacto por WhatsApp.
- Galerías y mapa con carga diferida.
- SEO técnico: metadata, canonical, Open Graph, JSON-LD, robots y sitemap.
- Vercel Web Analytics y Speed Insights integrados en el código.
- PostHog configurado para pageviews y eventos anónimos de intención.
- Cliente server-side tipado para Cloudbeds PMS API v1.3.
- Integración de lectura para Hideout.
- CI configurado para lint, Vitest, Playwright y build.

### Implementado, pendiente de validación

- Contenido y experiencia de `/guide`.
- Rutas, horarios, tarifas de transporte, políticas y contactos incluidos en la guía.
- Recorrido visual en móvil y escritorio.
- Disponibilidad efectiva de datos en Speed Insights.
- Baseline de analíticas sin tráfico interno o de prueba.

### Pendiente de construir o completar

- Recurso visual o animación inicial que explique las dos propiedades.
- Credencial API independiente de Mandalas.
- Mapeo de habitaciones de Mandalas.
- Consulta pública de disponibilidad para ambas propiedades.
- Interfaz de fechas, huéspedes, propiedad y estados de disponibilidad.
- Transición contextual al motor oficial de Cloudbeds.
- Eventos de analítica para el nuevo recorrido.
- QA completo del flujo de conversión.
- Evidencia y aprobación final de la fase.

### Fuera del alcance comprometido

- PMS propio.
- Procesamiento directo de tarjetas.
- Creación, modificación o cancelación de reservas dentro de la aplicación.
- Portal público del huésped.
- Panel administrativo activo en producción.
- Automatizaciones, alertas o webhooks no aprobados.
- Identificación de personas, autocapture, session replay o heatmaps.

## Alcance de la Fase 2

| Módulo | Resultado esperado | Estado actual | Dependencia principal | Evidencia de finalización |
| --- | --- | --- | --- | --- |
| Experiencia de decisión | El visitante entiende las dos propiedades y puede elegir con confianza | Base comparativa existente | Dirección visual y contenido aprobado | Pruebas visuales y recorrido móvil/escritorio |
| Guía de llegada | El huésped comprende cómo llegar al destino y a cada propiedad | Implementación inicial completa | Validación operativa del propietario de los datos | Checklist de contenido y revisión final |
| Disponibilidad en tiempo real | La web consulta disponibilidad de ambas propiedades | Hideout en lectura; Mandalas pendiente | API key y property ID independientes | Respuestas verificadas y estados de UI probados |
| Transición a reserva oficial | El usuario continúa a Cloudbeds con la propiedad correcta | Enlaces directos existentes | URLs y capacidades del motor oficial | Pruebas E2E de enlaces y fallback |
| Analíticas | El equipo entiende intención y abandono del recorrido | PostHog básico implementado | Taxonomía y revisión de privacidad | Eventos anónimos visibles y documentados |
| QA y despliegue | La experiencia es estable, accesible y verificable | CI existente | Preview, contenido aprobado y credenciales | Lint, pruebas, build, preview y acta de revisión |

## Arquitectura propuesta

### Flujo del huésped

```text
┌──────────────────────┐
│ Descubre Mandalas    │
│ Hostels              │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Compara experiencias │
│ Mandalas / Hideout   │
└──────────┬───────────┘
           │
           ├──────────────► Consulta la guía de llegada
           │
           ▼
┌──────────────────────┐
│ Selecciona propiedad,│
│ fechas y huéspedes   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Consulta disponibilidad│
│ real de Cloudbeds      │
└──────────┬─────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
 Disponible    Sin disponibilidad
     │           │
     ▼           ├──► Probar otras fechas
 Motor oficial   └──► Solicitar ayuda por WhatsApp
 de Cloudbeds
```

### Arquitectura del sistema

```text
┌─────────────────────────────┐
│ Navegador del huésped       │
│ Next.js + React             │
└──────────────┬──────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────┐
│ Capa pública de Mandalas    │
│ UI, validación y analítica  │
└──────────────┬──────────────┘
               │ solicitud sin secretos
               ▼
┌─────────────────────────────┐
│ API server-side de Mandalas │
│ validación, caché y límites │
└──────────┬───────────┬──────┘
           │           │
           │           └──────────► PostHog
           │                         eventos anónimos
           ▼
┌─────────────────────────────┐
│ Cloudbeds PMS API           │
│ credencial por propiedad    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Motor oficial de Cloudbeds  │
│ reserva, confirmación, pago │
└─────────────────────────────┘
```

### Flujo de disponibilidad

```text
Fechas + huéspedes + propiedad
               │
               ▼
Validación server-side
               │
               ▼
Selección de credencial
  ├── Mandalas API key
  └── Hideout API key
               │
               ▼
Cloudbeds getAvailableRoomTypes
               │
        ┌──────┴───────┐
        │              │
        ▼              ▼
 Resultado válido    Error / timeout / límite
        │              │
        ▼              ▼
 Normalización UI    Mensaje accesible
        │              ├── Motor oficial
        ▼              └── WhatsApp
 CTA de reserva
```

### Flujo de analíticas

```text
pageview pública
      │
      ├── property_compared
      ├── guide_viewed
      ├── availability_started
      ├── availability_result
      ├── booking_intent
      └── whatsapp_intent
               │
               ▼
       PostHog anónimo
               │
               ▼
 Tendencias de intención

Cloudbeds ─────────────► reservas e ingresos confirmados
```

Los eventos de PostHog representan navegación e intención. No sustituyen los datos de reservas e ingresos de Cloudbeds.

### Fallback operativo

```text
Consulta pública
      │
      ▼
¿Cloudbeds responde correctamente?
      │
 ┌────┴────┐
 │ Sí      │ No
 ▼         ▼
Mostrar    Mensaje claro y no alarmista
opciones      │
              ├── Abrir motor oficial
              ├── Reintentar
              └── Contactar por WhatsApp
```

## Módulo 1 — Experiencia de decisión

### Problema que resuelve

Un visitante puede no comprender que Mandalas y Hideout son dos propiedades con ambientes y ubicaciones diferentes. Esa ambigüedad aumenta dudas y puede dirigirlo a la opción incorrecta.

### Resultado esperado

El visitante identifica en pocos segundos cuál experiencia se ajusta mejor a su viaje y puede continuar hacia información o reserva de esa propiedad.

### Flujo del usuario

1. Entra a la home.
2. Ve una introducción breve de la marca y las dos experiencias.
3. Compara ambiente, ubicación y propuesta.
4. Elige Mandalas o Hideout.
5. Continúa a la propiedad, la guía o la disponibilidad.

### Componentes de interfaz

- Mensaje introductorio de una sola marca y dos experiencias.
- Comparador visual Mandalas / Hideout.
- Animación breve, opcional y respetuosa de `prefers-reduced-motion`.
- CTA principal por propiedad.
- Enlace secundario a la guía.

### Componentes técnicos

- Componentes React reutilizables.
- Framer Motion con carga controlada.
- Imágenes optimizadas.
- Diseño responsive y estados sin animación.

### APIs o servicios

- No requiere una API externa para la presentación inicial.
- PostHog registra únicamente interacciones anónimas aprobadas.

### Dependencias

- Mensaje y propuesta visual aprobados.
- Fotografías existentes autorizadas.
- Decisión sobre el tipo de animación.

### Estados de carga, vacío y error

- La comprensión no debe depender de que la animación cargue.
- Si JavaScript o movimiento están deshabilitados, se muestra una composición estática completa.

### Analíticas

- Propiedad seleccionada.
- Origen del CTA.
- Continuación hacia guía, propiedad o disponibilidad.

### Riesgos

- Animación excesiva que retrase la carga.
- Preferir impacto visual sobre claridad.
- Crear competencia entre los CTA.

### Criterios de aceptación

- Las diferencias entre las propiedades son comprensibles en móvil y escritorio.
- El CTA de cada propiedad lleva al destino correcto.
- La experiencia respeta movimiento reducido.
- No hay regresión relevante de rendimiento o accesibilidad.

### Fuera del alcance

- Video producido profesionalmente.
- Nueva sesión fotográfica.
- Personalización basada en perfiles individuales.

## Módulo 2 — Guía de llegada

### Problema que resuelve

El huésped necesita entender cómo llegar a San Pedro La Laguna y después a la propiedad elegida, normalmente desde un teléfono y con conectividad variable.

### Resultado esperado

La guía reduce incertidumbre antes y durante el traslado y ofrece una salida clara hacia reserva o asistencia.

### Flujo del usuario

1. Abre `/guide` desde navegación, propiedad o CTA contextual.
2. Identifica su punto de origen o ruta.
3. Consulta pasos, tiempos y referencias.
4. Revisa el mapa o indicaciones de la propiedad.
5. Continúa a reservar o solicita ayuda.

### Componentes de interfaz

- Navegación móvil por secciones.
- Rutas y puntos de llegada.
- Mapas con carga diferida.
- CTA de reserva y WhatsApp.
- Indicaciones diferenciadas por propiedad.

### Componentes técnicos

- Página pública indexable en Next.js.
- Metadata, canonical, Open Graph y JSON-LD.
- React Leaflet cargado solo cuando sea necesario.
- Navegación accesible y sin desbordamiento horizontal.

### APIs o servicios

- Mapa y recursos geográficos existentes.
- Cloudbeds únicamente para CTA de reserva, no para el contenido de transporte.

### Dependencias

- Validación humana de rutas, horarios, tarifas, políticas y contactos.
- Propietario identificado para cada dato operativo.

### Estados de carga, vacío y error

- El texto de la ruta permanece útil si el mapa no carga.
- Los datos no confirmados se muestran como pendientes, no como hechos.

### Analíticas

- Vista de la guía.
- Ruta o propiedad seleccionada, sin fechas ni información personal.
- Clic a reserva o WhatsApp desde la guía.

### Riesgos

- Información de transporte desactualizada.
- Tarifas u horarios presentados como permanentes.
- Dependencia excesiva del mapa.

### Criterios de aceptación

- Administración de Hostal Mandalas valida los datos operativos.
- La guía funciona en móvil y escritorio.
- No existe desbordamiento horizontal.
- Los CTA llevan a la propiedad correcta.
- La página tiene metadata y canonical únicos.

### Fuera del alcance

- Garantizar horarios o precios de terceros.
- Seguimiento en tiempo real de transporte.

## Módulo 3 — Disponibilidad en tiempo real

### Problema que resuelve

Actualmente el visitante debe salir al motor externo o preguntar por WhatsApp antes de saber si existe disponibilidad para sus fechas.

### Resultado esperado

El visitante puede consultar disponibilidad real para Mandalas o Hideout desde la experiencia de marca y continuar al canal oficial adecuado.

### Flujo del usuario

1. Selecciona propiedad.
2. Indica check-in, check-out y huéspedes.
3. La aplicación valida los datos.
4. El servidor consulta Cloudbeds.
5. La interfaz presenta disponibilidad o alternativas.
6. El visitante continúa al motor oficial.

### Componentes de interfaz

- Selector de propiedad.
- Selector de fechas.
- Número de huéspedes.
- Resultados de disponibilidad.
- Estados de carga, vacío y error.
- CTA hacia Cloudbeds y fallback por WhatsApp.

### Componentes técnicos

- Endpoint server-side propio.
- Cliente tipado de Cloudbeds.
- Credenciales separadas por propiedad.
- Validación y normalización de parámetros.
- Timeout, caché breve, límites y manejo de errores.
- Mapeo de room types para ambas propiedades.

### APIs o servicios

- Cloudbeds PMS API v1.3.
- `getAvailableRoomTypes` o consulta equivalente aprobada.
- Motor oficial de Cloudbeds como destino final.

### Dependencias

- API key y property ID de Mandalas.
- Confirmación de scopes mínimos necesarios.
- Verificación de acceso API incluido o contratado en Cloudbeds.
- Mapeo correcto de habitaciones y ocupación.

### Estados de carga, vacío y error

- Cargando disponibilidad.
- Fechas inválidas.
- Sin disponibilidad.
- Credencial ausente.
- Timeout o límite externo.
- Respuesta inesperada.
- Fallback al motor oficial y WhatsApp.

### Analíticas

- Inicio de consulta.
- Resultado disponible o no disponible.
- Propiedad seleccionada.
- CTA de continuación.

No se envían a PostHog fechas, huéspedes, URLs de Cloudbeds, IDs de reserva ni datos personales.

### Riesgos

- Acceso API no incluido en la suscripción.
- Rate limits o cambios en la API.
- Disponibilidad que cambia antes de confirmar la reserva.
- Errores en mapeo de habitaciones.
- Exposición accidental de credenciales.

### Criterios de aceptación

- Cada propiedad usa su propia credencial server-side.
- La aplicación nunca imprime ni expone las API keys.
- Los resultados corresponden a la propiedad y fechas solicitadas.
- Los estados de error tienen alternativas claras.
- Se comunica que la disponibilidad queda sujeta a confirmación en Cloudbeds.

### Fuera del alcance

- Bloquear inventario.
- Cambiar precios o restricciones.
- Crear o cancelar reservas.
- Guardar datos de huéspedes.

## Módulo 4 — Transición a la reserva oficial

### Problema que resuelve

El huésped puede perder contexto al pasar desde el sitio de Mandalas al motor externo o abrir el motor de la propiedad equivocada.

### Resultado esperado

El visitante continúa al motor oficial correcto después de entender la propiedad y consultar disponibilidad, con una transición clara y confiable.

### Flujo del usuario

1. Consulta disponibilidad.
2. Revisa la propiedad y opciones encontradas.
3. Selecciona “Continuar a reserva oficial”.
4. Abre el motor Cloudbeds correspondiente.
5. Cloudbeds confirma habitación, datos, políticas y pago.

### Componentes de interfaz

- Resumen de la propiedad y búsqueda.
- CTA de reserva oficial.
- Mensaje que explica que la confirmación ocurre en Cloudbeds.
- Opción de asistencia por WhatsApp.

### Componentes técnicos

- Resolución segura de URL por propiedad.
- Conservación de contexto solo cuando Cloudbeds lo permita oficialmente.
- Tracking anónimo del clic de salida.
- Validación E2E de enlaces.

### APIs o servicios

- Motor oficial de Cloudbeds para Mandalas.
- Motor oficial de Cloudbeds para Hideout.
- Cloudbeds PMS API solo para lectura de disponibilidad en esta fase.

### Dependencias

- URLs oficiales confirmadas.
- Capacidades de parámetros o widget disponibles en el plan de Cloudbeds.
- Contenido de políticas y condiciones administrado en Cloudbeds.

### Estados de carga, vacío y error

- Enlace temporalmente no disponible.
- Apertura bloqueada por el navegador.
- Propiedad sin URL configurada.
- Fallback a contacto directo.

### Analíticas

- `booking_intent` por propiedad y origen.
- No se interpreta como reserva confirmada.

### Riesgos

- Prometer continuidad que el motor oficial no soporte.
- Confundir intención de reserva con conversión pagada.
- Enlace roto o propiedad incorrecta.

### Criterios de aceptación

- `/pueblo` abre el motor de Mandalas.
- `/hideout` abre el motor de Hideout.
- La salida se identifica como reserva oficial.
- Los recorridos funcionan en móvil y escritorio.
- No se crea ninguna reserva de prueba durante QA.

### Fuera del alcance

- Selección completa de habitación dentro de la aplicación.
- Formulario propio de datos del huésped.
- Procesamiento de pagos.
- Confirmaciones, modificaciones y cancelaciones propias.

## Módulo 5 — Analíticas de conversión

### Problema que resuelve

Sin medición no es posible saber si el visitante comprende las propiedades, usa la guía o avanza hacia una reserva.

### Resultado esperado

Pascal.dev puede detectar fricción y comparar intención por propiedad y origen del CTA sin identificar huéspedes.

### Flujo del usuario

1. El visitante navega por una ruta pública.
2. Interactúa con comparación, guía, disponibilidad o CTA.
3. La aplicación envía un evento anónimo mínimo.
4. El equipo revisa tendencias después de contar con una muestra suficiente.

### Componentes de interfaz

- No requiere componentes visibles salvo mensajes de privacidad si fueran necesarios.

### Componentes técnicos

- PostHog con configuración privada existente.
- Vercel Web Analytics.
- Taxonomía de eventos documentada.
- Exclusión de rutas privadas y datos sensibles.

### APIs o servicios

- PostHog Cloud.
- Vercel Web Analytics y Speed Insights.
- Cloudbeds para confirmar reservas e ingresos fuera de PostHog.

### Dependencias

- Token público de proyecto y host correctos.
- Revisión de privacidad antes de ampliar captura.
- Filtrado de tráfico interno y de prueba.

### Estados de carga, vacío y error

- La experiencia pública funciona aunque PostHog no cargue.
- El dashboard distingue ausencia de datos de una métrica igual a cero.

### Analíticas

- `$pageview` en rutas públicas.
- `property_compared`.
- `guide_viewed`.
- `availability_started`.
- `availability_result`.
- `booking_intent`.
- `whatsapp_intent`.

### Riesgos

- Interpretar clics como reservas.
- Contaminar datos con pruebas internas.
- Añadir datos personales a eventos.
- Habilitar funciones invasivas sin aprobación.

### Criterios de aceptación

- Los eventos contienen solo propiedades aprobadas.
- No contienen nombres, correos, teléfonos, fechas, huéspedes o IDs.
- Rutas privadas no generan eventos.
- El dashboard explica que Cloudbeds es la fuente de reservas e ingresos.

### Fuera del alcance

- Identificación de personas.
- Session replay, heatmaps y autocapture.
- Atribución de ingresos sin reconciliación con Cloudbeds.

## Módulo 6 — Control de calidad y despliegue

### Problema que resuelve

Un error en navegación, SEO, disponibilidad o salida a Cloudbeds puede bloquear una reserva y afectar la confianza del huésped.

### Resultado esperado

La Fase 2 se entrega con evidencia verificable, revisión en preview y aprobación del resultado final antes de producción.

### Flujo del usuario

1. Pascal.dev completa un incremento verificable.
2. CI ejecuta validaciones automáticas.
3. Se revisa una preview de Vercel.
4. Se valida móvil, escritorio y estados de error.
5. Administración de Hostal Mandalas revisa el resultado final.
6. La promoción a producción requiere aprobación humana.

### Componentes de interfaz

- Estados accesibles de carga, vacío y error.
- Foco visible, navegación por teclado y contraste adecuado.
- Layout sin desbordamiento horizontal.

### Componentes técnicos

- TypeScript estricto.
- ESLint.
- Vitest.
- Playwright.
- Build de Next.js.
- Preview de Vercel.
- Verificación de metadata, robots, sitemap y enlaces críticos.

### APIs o servicios

- GitHub Actions.
- Vercel.
- Cloudbeds en modo de lectura durante pruebas públicas.

### Dependencias

- Credenciales configuradas solo en entornos autorizados.
- Datos operativos aprobados.
- Canal de revisión definido.

### Estados de carga, vacío y error

- QA cubre respuestas válidas, sin disponibilidad, timeout y configuración ausente.
- Una falla de Cloudbeds no debe inutilizar el resto del sitio.

### Analíticas

- Las pruebas y visitas internas deben excluirse del análisis operativo.

### Riesgos

- Promover sin evidencia.
- Confundir un build correcto con un recorrido de reserva correcto.
- Duplicar despliegues mediante la integración Git y Vercel CLI.
- Introducir dependencias de Docker sin decisión operativa.

### Criterios de aceptación

- TypeScript, lint y build completados correctamente.
- Pruebas relevantes ejecutadas y sus resultados documentados.
- Recorridos críticos verificados en escritorio y móvil.
- Accesibilidad, canonical y Core Web Vitals sin regresiones bloqueantes.
- Preview aprobada antes de producción.
- No se despliega sin autorización humana.

### Fuera del alcance

- Cambiar dominio, variables, permisos o configuración de Cloudbeds sin aprobación.
- Habilitar el panel administrativo o portal huésped.

## Roadmap de implementación

### Etapa 0 — Decisión de producto y validación

- Aprobar este alcance.
- Confirmar que la reserva final continúa en Cloudbeds.
- Confirmar inversión y condiciones.
- Identificar propietario de cada dato operativo de la guía.

### Etapa 1 — Cierre de la guía

- Validar rutas, horarios, tarifas, políticas y contactos.
- Revisar navegación móvil y accesibilidad.
- Verificar SEO y CTA.
- Documentar evidencia.

### Etapa 2 — Experiencia de decisión

- Definir storyboard de la introducción.
- Diseñar estado estático y animado.
- Implementar movimiento reducido.
- Validar comprensión con revisión visual.

### Etapa 3 — Credenciales y contrato de Cloudbeds

- Confirmar acceso API de Mandalas.
- Crear credencial independiente con scopes mínimos.
- Configurarla server-side.
- Verificar propiedad y habitaciones sin mostrar secretos.
- Completar mapeo de Mandalas.

### Etapa 4 — Disponibilidad

- Definir contrato de datos normalizado.
- Construir endpoint server-side.
- Implementar formulario y resultados.
- Añadir caché, timeout, límites y fallback.
- Probar ambas propiedades.

### Etapa 5 — Transición a reserva oficial

- Confirmar URLs y capacidades del motor.
- Diseñar resumen de búsqueda.
- Implementar CTA y fallback.
- Validar recorridos E2E.

### Etapa 6 — Analíticas

- Aprobar taxonomía.
- Implementar eventos mínimos.
- Verificar que no se envían datos sensibles.
- Preparar dashboard y guía de interpretación.

### Etapa 7 — QA y entrega

- Ejecutar lint, Vitest, Playwright y build.
- Revisar preview en móvil y escritorio.
- Medir baseline de rendimiento.
- Resolver observaciones.
- Presentar resultado final a Administración de Hostal Mandalas.
- Registrar aprobación y evidencia.

### Trabajo que puede avanzar en paralelo

- La guía y la experiencia visual pueden avanzar mientras se obtiene la credencial de Mandalas.
- La taxonomía de analíticas puede definirse mientras se construye la disponibilidad.
- Los casos de QA pueden escribirse junto con cada módulo.

### Ruta crítica

```text
Aprobación del alcance
        │
        ▼
Credencial Mandalas
        │
        ▼
Mapeo de habitaciones
        │
        ▼
Disponibilidad para dos propiedades
        │
        ▼
Recorrido hacia Cloudbeds
        │
        ▼
QA + preview + aprobación final
```

## Entregables

| Entregable | Cómo se verifica | Quién revisa | Evidencia |
| --- | --- | --- | --- |
| Guía de llegada validada | Revisión de contenido y recorrido responsive | Pascal.dev y Administración | Checklist y preview |
| Experiencia comparativa | Prueba visual y funcional en home | Pascal.dev; revisión final de Administración | Capturas y pruebas |
| Integración Mandalas de lectura | Comandos seguros y respuesta de propiedad correcta | Pascal.dev | Registro redactado de verificación |
| Disponibilidad para ambas propiedades | Casos con y sin disponibilidad | Pascal.dev | Pruebas unitarias/E2E y preview |
| Transición al motor oficial | Validación de propiedad y URL | Pascal.dev | Playwright y revisión manual |
| Analíticas del flujo | Eventos anónimos observables | Pascal.dev | Dashboard y diccionario de eventos |
| Paquete de QA | Validaciones técnicas y visuales | Pascal.dev | Resultados fechados y baseline |
| Entrega final | Revisión del resultado completo | Administración de Hostal Mandalas | Decisión registrada |

## Criterios de aceptación globales

### Experiencia

- El visitante entiende la diferencia entre Mandalas y Hideout sin asistencia.
- El recorrido principal tiene un CTA claro en cada etapa.
- La guía, disponibilidad y reserva oficial se perciben como partes de una experiencia coherente.

### Responsive y accesibilidad

- Los recorridos funcionan en móvil y escritorio.
- No existe desbordamiento horizontal.
- La interfaz funciona con teclado y foco visible.
- El movimiento reducido conserva toda la información.
- Los estados de carga y error se anuncian de forma accesible.

### SEO

- Las páginas públicas mantienen título y descripción únicos.
- Canonical, Open Graph y JSON-LD son coherentes con el dominio oficial.
- Robots y sitemap no indexan rutas privadas o APIs.
- La guía conserva una intención de búsqueda clara.

### Cloudbeds y seguridad

- Cada propiedad usa su propia credencial.
- Las API keys no se exponen al navegador, logs, repositorio o Notion.
- La integración pública es de lectura durante esta fase.
- No se envían reservas de prueba.
- La disponibilidad se comunica como sujeta a confirmación en Cloudbeds.

### Analíticas

- Los eventos son anónimos y mínimos.
- No contienen datos personales ni parámetros de reserva.
- PostHog mide intención; Cloudbeds confirma reservas e ingresos.

### Calidad

- Existen 12 archivos de pruebas declarados.
- El baseline documentado incluye 29 pruebas unitarias/integración y 19 E2E declaradas.
- No se afirma que pasan hasta ejecutar y registrar el resultado correspondiente.
- CI ejecuta lint, Vitest, Playwright y build.
- Un enlace roto de Cloudbeds, un error 5xx o un canonical incorrecto bloquea la entrega.

### Aprobación

- Pascal.dev decide cuándo el resultado está listo para revisión.
- Administración de Hostal Mandalas revisa el resultado final.
- Las observaciones acordadas se resuelven dentro de las rondas incluidas.
- Producción requiere aprobación humana explícita.

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Mandalas no tiene credencial independiente | Bloquea disponibilidad de esa propiedad | Solicitar acceso al inicio y continuar módulos paralelos |
| API no incluida en el plan de Cloudbeds | Costo o retraso externo | Confirmar plan antes de comprometer fechas |
| Rate limits o cambios de API | Consultas fallidas | Caché, timeout, límites, monitoreo y fallback |
| Disponibilidad cambia antes de confirmar | Expectativa incorrecta | Comunicar que Cloudbeds realiza la confirmación final |
| Mapeo incorrecto de habitaciones | Resultados equivocados | Validación por propiedad y casos controlados de lectura |
| Datos de guía desactualizados | Pérdida de confianza | Propietario y fecha de revisión por dato variable |
| Credenciales expuestas | Incidente de seguridad | Solo servidor, mínimo privilegio y secretos de entorno |
| Analíticas interpretadas como reservas | Decisiones comerciales erróneas | Separar intención de resultados confirmados |
| Rendimiento afectado por animación o mapa | Menor conversión | Carga diferida, presupuesto de rendimiento y movimiento reducido |
| Dependencia externa no disponible | Recorrido bloqueado | Motor oficial y WhatsApp como fallback |
| Crecimiento no controlado del alcance | Retraso y pérdida de margen | Precio fijo para alcance aprobado y extras por separado |
| Despliegue redundante de Vercel CLI | Ruido o fallos de CI | Corregir configuración o retirar el job redundante |
| Docker sin uso definido | Mantenimiento innecesario | Decidir si continúa antes de invertir en el workflow |

## Presupuesto y condiciones

### Inversión propuesta para Fase 2

> **Q9,000 — pendiente de aprobación**

La inversión corresponde a diseñar, integrar y validar un flujo completo de conversión:

```text
Experiencia de decisión
       +
Guía de llegada
       +
Disponibilidad Cloudbeds
       +
Transición a reserva oficial
       +
Analíticas
       +
QA y entrega
```

### Forma de pago propuesta

- **Q4,500 al iniciar.**
- **Q4,500 con la aprobación final.**
- Dos rondas de ajustes visuales incluidas.
- Solicitudes nuevas fuera del alcance se cotizan por separado.
- Costos de suscripción, acceso API o complementos de Cloudbeds no incluidos.
- Sin fecha final acordada hasta contar con credenciales y datos operativos aprobados.

### Registro comercial de Fase 1

- Inversión: **Q5,000**.
- Estado: pagado completamente.
- Fecha de pago completado: **4 de agosto de 2026**.
- Evidencia: transferencias disponibles bajo solicitud; no adjuntas para evitar exponer información sensible.

## Futuras fases

Estas posibilidades no forman parte del compromiso actual:

### Reserva propia mediante API

- Creación de reservas en Cloudbeds.
- Idempotencia y prevención de dobles envíos.
- Confirmaciones y manejo de fallos parciales.
- Modificaciones y cancelaciones.

### Pagos integrados

- Payment Element o solución compatible con Cloudbeds.
- Requisitos de dominio, gateway y seguridad.
- Conciliación y estados de pago.

### Operación y automatización

- Canal de alertas.
- Webhooks probados después del canal de entrega.
- Morning Brief operativo.
- Automatizaciones pequeñas y auditables.

### Portal y administración

- Portal del huésped.
- Usuario administrativo real.
- Autenticación y permisos.
- Panel de lectura o acciones autorizadas.

### Optimización avanzada

- Experimentos de conversión.
- Comparación de variantes.
- Contenido dinámico.
- Reconciliación de intención con reservas confirmadas.

## Decisiones pendientes

1. Aprobar el alcance de la Fase 2.
2. Aprobar o ajustar la inversión propuesta de Q9,000.
3. Confirmar acceso API independiente para Mandalas.
4. Confirmar si el plan de Cloudbeds incluye acceso API.
5. Validar rutas, horarios, tarifas, políticas y contactos de `/guide`.
6. Aprobar el concepto visual de la introducción de las dos propiedades.
7. Confirmar el nivel de contexto que puede transferirse al motor oficial.
8. Validar Speed Insights o definir un baseline alternativo.
9. Corregir o retirar el despliegue redundante mediante Vercel CLI.
10. Decidir si Docker continúa en la estrategia.
11. Definir si alertas y webhooks se evalúan en una fase posterior.

## Guion breve para presentar al cliente

> La Fase 1 construyó la presencia digital de Mandalas Hostels. La Fase 2 convierte esa presencia en un flujo de conversión. Ayudará al huésped a entender las diferencias entre Mandalas y Hideout, saber cómo llegar, consultar disponibilidad real y continuar al motor oficial de Cloudbeds para finalizar su reserva. La inversión incluye experiencia de usuario, integración segura, analíticas, pruebas y validación final; no es únicamente el costo de una página o de una función aislada.

## Fuentes de referencia

- Sitio público: https://www.mandalashostels.com
- Repositorio: https://github.com/pascal1010100/mandalas
- Cloudbeds — API access: https://developers.cloudbeds.com/docs/property-and-group-account-api-access
- Cloudbeds — Booking Engine blueprint: https://developers.cloudbeds.com/docs/booking-engine
- Cloudbeds — Availability: https://developers.cloudbeds.com/reference/get_getavailableroomtypes-2
- Cloudbeds — Booking Engine oficial: https://myfrontdesk.cloudbeds.com/hc/en-us/articles/218512197-Cloudbeds-Booking-Engine-Everything-you-need-to-know
- Documentación interna: `README.md`, `docs/CLOUDBEDS_API_SETUP.md`, `docs/POSTHOG_SETUP.md`, `docs/MEJORAS_JULIO_2026.md` y `docs/entrega-fase-uno.md`.

