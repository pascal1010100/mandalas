# Hideout: reactivación de reservas directas

Fecha: 19 de octubre de 2026.

## Cambio

El motor de Hideout estaba configurado, pero `getBookingEngineUrl` devolvía
`undefined` salvo que la variable pública de activación fuera exactamente `true`.
Los CTA de Hideout terminaban en el formulario de consulta.

Hideout queda activo por defecto. Un `false` explícito sigue pausándolo y conserva
la consulta de contacto como alternativa. `.env.example` refleja el estado activo.
Los enlaces de Mandalas Pueblo no cambian.

| Propiedad | Motor oficial |
| --- | --- |
| Mandalas Pueblo | https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq |
| Mandalas Hideout | https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq |

La función compartida cubre inicio, página de propiedad, opciones de alojamiento,
navegación, barra móvil y tarjetas de reserva directa, tanto en inglés como en
español. Los botones generales mantienen el selector de propiedad; WhatsApp
permanece disponible como ayuda.

## Verificación

- El motor externo de Hideout respondió HTTP 200 y devolvió el título
  `Mandalas Hideout - San Pedro La Laguna, Guatemala - Book Now`.
- No se enviaron reservas de prueba ni se modificó el PMS.
- Vitest: 38/38 pruebas correctas, incluyendo activación por defecto, pausa,
  activación explícita y URL personalizada por propiedad.
- TypeScript: sin errores.
- ESLint completo: 0 errores y 394 advertencias; los archivos modificados pasan
  la revisión específica sin advertencias.
- Build: completado con Node 24.19.0 y pnpm 10.18.2. El contrato del repositorio
  fija Node 22.23.2; la versión local coincide con la familia 24.x observada en
  Vercel, pero no sustituye la validación de CI con el runtime contractual.
- El build local necesitó certificados TLS del sistema y valores ficticios para
  las variables públicas Supabase legacy; no se utilizaron credenciales reales
  ni se activó el backend. Persisten avisos de baseline-browser-mapping y de
  prettier en react-email. No se cambian dependencias en este ajuste.

Playwright específico: 16 pruebas correctas, 6 omitidas por corresponder a otro
dispositivo y 2 sin completar por cierre del navegador al abrir contacto en
emulación móvil (inglés y español). Una ejecución aislada confirmó ambas
tarjetas de contacto en escritorio, pero volvió a cerrar el navegador en móvil.
No se presenta la validación móvil de contacto como completada.

La prueba ampliada del
formulario de consulta no completó la selección de fechas en este entorno;
no se afirma que toda la suite E2E esté en verde. También hubo cierres del
navegador local durante intentos iniciales. No se modificó el formulario para
resolver cuestiones ajenas a los enlaces de reserva.

## Antes de publicar

1. Revisar en preview y producción `NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED`.
   Un valor `false` explícito conserva la pausa; aprobar su cambio a `true` o
   eliminar esa sobrescritura antes de reconstruir.
2. Confirmar que las URL públicas personalizadas de cada propiedad corresponden
   a los motores de la tabla. No mostrar valores de otras variables.
3. Validar el preview y obtener la autorización de publicación indicada en
   `AGENTS.md`. No se han publicado ni promovido cambios con esta entrega.
4. Después del despliegue, revisar `/`, `/hideout`, `/pueblo`,
   `/contact#book-directly`, `/es`, `/es/hideout` y `/es/contacto#book-directly`,
   incluyendo menú y barra móvil, sin completar una reserva real.

La conexión Vercel devolvió 403 para la consulta de variables del proyecto
`mandalas` en su equipo. El intento alternativo por CLI no tenía credenciales.
Por tanto, no se conoce el valor remoto del interruptor y la publicación queda
pendiente. El estado del motor externo no demuestra inventario para fechas
concretas ni confirma una reserva.

## Reversión

Una pausa autorizada puede establecer la variable pública en `false` y generar
un nuevo deployment. Las variables `NEXT_PUBLIC_*` se incorporan durante el
build: cambiar una variable sin reconstruir no actualiza los enlaces publicados.
