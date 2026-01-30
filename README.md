# Mandalas Hostal Web App

![Mandalas Hostal](https://via.placeholder.com/1200x600?text=Mandalas+Hostal+Preview)

A modern, "Harmonic Duality" web application for **Mandalas Hostal** in San Pedro La Laguna. This project connects two unique experiences:
*   **Mandalas (Pueblo)**: Social hub, co-working, and events.
*   **Mandalas Hideout**: Nature retreat, yoga, and relaxation.

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
*   **Architecture**: Clean Architecture (Domain-Driven Design)

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
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-api-key
```

## 🌳 Ramas (Gitflow)

*   `main`: Producción (Estable)
*   `develop`: Desarrollo (Integración)

---
Developed with ❤️ for Mandalas Hostal.
