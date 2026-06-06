# Mandalas Hostal Website

![Mandalas Hostal](https://via.placeholder.com/1200x600?text=Mandalas+Hostal+Preview)

A boutique public website for **Mandalas Hostal** in San Pedro La Laguna. Phase 1 focuses on direct WhatsApp inquiries and a clear presentation of two stays:
*   **Mandalas**: central, walkable and social.
*   **Hideout**: quieter, closer to the lake and outside the center.

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

---
Developed with ❤️ for Mandalas Hostal.
