---
name: cloudbeds-safety
description: Aplicar seguridad y privacidad a cualquier integración, script, URL, webhook, prueba o diagnóstico de Cloudbeds para Mandalas y Hideout. Usar siempre que una tarea lea o pueda modificar reservas, huéspedes, habitaciones, disponibilidad, precios, propiedades o motores de reserva.
---

# Trabajar con Cloudbeds

1. Leer `AGENTS.md` y `docs/CLOUDBEDS_API_SETUP.md`. Identificar Mandalas o Hideout antes de consultar.
2. Mantener credenciales server-side sin `NEXT_PUBLIC_`. No imprimir keys, secretos, contactos ni payloads completos.
3. Preferir `cloudbeds:verify`, `cloudbeds:rooms` y `cloudbeds:reservations`, que son de solo lectura y minimizan datos.
4. Aplicar mínimo privilegio. No ampliar scopes sin necesidad documentada y aprobación.
5. Pedir aprobación antes de crear, editar o cancelar reservas; cambiar inventario o precios; crear webhooks, suscripciones o credenciales.
6. Validar que `/pueblo` apunta a Mandalas y `/hideout` a Hideout, sin enviar reservas de prueba.
7. Agregar o redactar datos en informes y usar IDs solo para casos autorizados.

Si no puede demostrarse que una operación es de solo lectura, tratarla como escritura y detenerse.
