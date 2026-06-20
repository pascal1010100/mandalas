# Mandalas Hostal Website

![Mandalas Hostal](https://via.placeholder.com/1200x600?text=Mandalas+Hostal+Preview)

A boutique public website for **Mandalas Hostal** in San Pedro La Laguna. Phase 1 focuses on direct WhatsApp inquiries and a clear presentation of two stays:
*   **Mandalas**: central, walkable and social.
*   **Hideout**: quieter, closer to the lake and outside the center.

Phase 1 should be delivered in English and prepared for the planned domain `mandalashostels.com`.

The repository still contains an older operational app/admin area for a possible phase 2. It is disabled by default unless explicitly enabled with environment flags.

## 🚀 Tecnologías

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Package Manager**: pnpm
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Maps**: [React Leaflet](https://react-leaflet.js.org/)
*   **Database**: Supabase
*   **State Management**: Zustand
*   **Architecture**: Public website plus archived operational modules for future phases

## 🛠️ Instalación

1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/pascal1010100/mandalas.git
    cd mandalas
    ```
2.  Instalar dependencias:
    ```bash
    pnpm install
    ```
3.  Configurar variables de entorno:
    ```bash
    cp .env.example .env.local
    # Editar .env.local con tus credenciales de Supabase
    ```
4.  Ejecutar en desarrollo:
    ```bash
    pnpm dev
    ```
5.  Abrir [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy

### Docker (Recomendado)

```bash
# Construir imagen
docker build -t mandalas-app .

# Ejecutar con docker-compose
docker-compose up -d
```

### Manual

```bash
# Construir para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

### CI/CD

El proyecto incluye pipelines automáticos:

- **Staging**: Se despliega automáticamente al hacer push a `develop` o `staging`
- **Producción**: Se despliega automáticamente al hacer push a `main`
- **Docker Images**: Se construyen y publican en Docker Hub para cada tag y push

### Variables de Entorno

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=502XXXXXXXX
NEXT_PUBLIC_CONTACT_EMAIL=info@example.com
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-api-key
ENABLE_ADMIN=false
ENABLE_GUEST_PORTAL=false
```

## 🌳 Ramas (Gitflow)

*   `main`: Producción (Estable)
*   `develop`: Desarrollo (Integración)

## Cloudbeds PMS API

Esta sección documenta la investigación inicial para una posible integración entre Mandalas Hostal y Cloudbeds. Cloudbeds pertenece a fase 2; por ahora no hay código de integración activo en el proyecto.

### Qué queremos conseguir

El objetivo es conectar el sitio y, más adelante, las áreas operativas del proyecto con Cloudbeds para reducir trabajo manual y mantener datos más confiables entre sistemas.

Posibles resultados:

*   Consultar propiedades, habitaciones, huéspedes y reservas desde Cloudbeds.
*   Sincronizar disponibilidad o información operativa cuando tenga sentido para Mandalas.
*   Recibir eventos mediante webhooks, por ejemplo nuevas reservas o cambios relevantes.
*   Preparar una base para automatizaciones futuras: reportes, CRM, comunicación con huéspedes, check-in, housekeeping o contabilidad.
*   Evitar duplicar datos sensibles en el proyecto si Cloudbeds ya debe ser la fuente principal.

### Tipos de integración compatibles

Cloudbeds permite varios enfoques de integración. Para este proyecto conviene avanzar de menor a mayor complejidad:

*   **API key a nivel propiedad**: útil para pruebas iniciales y desarrollo rápido con una propiedad concreta.
*   **API key a nivel partner / Marketplace**: necesaria si la integración quiere convertirse en una app conectable por propiedades desde Cloudbeds Marketplace. Cloudbeds recomienda automatizar la entrega de API keys para partners.
*   **Webhooks**: Cloudbeds puede enviar eventos a un endpoint del proyecto cuando ocurren cambios, como reservas creadas o modificaciones de datos.
*   **PMS API**: API principal para recursos frecuentes como reservas, huéspedes, habitaciones, house accounts y propiedades.
*   **Accounting API**: integración especializada para transacciones, folios, balances, trial balance y reportes contables.
*   **Data Insights API**: integración orientada a reportes avanzados y análisis.
*   **Blueprints por caso de uso**: Cloudbeds documenta guías para áreas como booking engine, CRM, housekeeping, point of sale, access management, revenue management y más.

### Enfoque recomendado para Mandalas

1.  **Fase 0: documentación y alcance**
    *   Definir qué problema resolvemos primero.
    *   Confirmar si se trabajará con sandbox, API key real de propiedad o flujo partner.
    *   Registrar endpoints, scopes y reglas de seguridad.

2.  **Fase 1: lectura segura**
    *   Probar autenticación.
    *   Leer información básica de propiedad/hotel.
    *   Leer reservas, habitaciones y huéspedes con permisos mínimos.

3.  **Fase 2: eventos**
    *   Configurar webhooks para eventos importantes.
    *   Guardar logs mínimos e idempotentes.
    *   Consultar la API después de recibir un evento si hace falta más detalle.

4.  **Fase 3: automatización**
    *   Decidir si el proyecto solo lee datos o también escribe en Cloudbeds.
    *   Implementar sincronizaciones puntuales.
    *   Agregar pruebas, auditoría y manejo de errores.

### Pendientes antes de escribir código

*   Conseguir acceso sandbox o credenciales de API.
*   Definir si Mandalas usará API key de propiedad o app partner.
*   Listar scopes mínimos necesarios.
*   Elegir primer caso de uso: lectura de reservas, disponibilidad, contacto con huésped, reportes u otro.
*   Crear variables de entorno para Cloudbeds sin guardar secretos en Git.
*   Revisar límites, errores comunes y requisitos de seguridad.

### Fuentes oficiales

*   Cloudbeds PMS API: https://developers.cloudbeds.com/reference/about-pms-api
*   About Cloudbeds APIs: https://developers.cloudbeds.com/docs/about-cloudbeds-api
*   Authentication: https://developers.cloudbeds.com/docs/authentication-1
*   API Keys for Technology Partners: https://developers.cloudbeds.com/docs/api-keys-authentication-guide-for-technology-partners
*   Quickstart API Authentication: https://developers.cloudbeds.com/docs/quickstart-guide-api-authentication-for-property-level-users
*   Webhooks: https://developers.cloudbeds.com/docs/webhooks-1
*   LLM documentation index: https://developers.cloudbeds.com/llms.txt

---
Developed with ❤️ for Mandalas Hostal.
