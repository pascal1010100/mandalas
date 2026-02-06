# 🔐 Configuración de GitHub Secrets

Para que el pipeline de CI/CD funcione correctamente, necesitas configurar los siguientes secrets en tu repositorio de GitHub:

## 📋 Secrets Requeridos

### Vercel Configuration
- `VERCEL_TOKEN`: Token de autenticación de Vercel
- `VERCEL_ORG_ID`: ID de tu organización en Vercel
- `VERCEL_PROJECT_ID`: ID del proyecto Mandalas en Vercel

### Environment Variables
- `PRODUCTION_URL`: URL de producción (https://mandalas.com)
- `STAGING_URL`: URL de staging (https://staging.mandalas.com)

### Database & Services
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY`: Clave anónima de Supabase
- `RESEND_API_KEY`: API key para envío de emails

## 🚀 Cómo Obtener los Secrets

### 1. Vercel Credentials
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login y obtener token
vercel login
vercel projects list
```

### 2. Supabase Credentials
- Ve a tu dashboard de Supabase
- Settings → API
- Copia Project URL y anon public key

### 3. Resend API Key
- Ve a https://resend.com/api-keys
- Crea una nueva API key

## ⚙️ Configuración en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Agrega cada uno de los secrets listados arriba

## ✅ Verificación

Una vez configurados, puedes verificar que todo funciona:

```bash
# Hacer un push a develop para probar staging
git checkout develop
git push origin develop

# Hacer un push a main para probar producción
git checkout main
git push origin main
```

## 🔍 Troubleshooting

Si el pipeline falla:
1. Verifica que todos los secrets estén correctamente configurados
2. Revisa los logs del Action en GitHub
3. Asegúrate que el proyecto existe en Vercel
4. Verifica que las URLs sean accesibles

---

**Nota**: Los secrets son encriptados y solo accesibles por los Actions de GitHub.
