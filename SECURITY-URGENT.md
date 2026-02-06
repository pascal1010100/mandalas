# 🚨 ACCIÓN DE SEGURIDAD REQUERIDA INMEDIATAMENTE

## ⚠️ TOKEN EXPUESTO

El token de Vercel fue accidentalmente comprometido al ser guardado en el repositorio.

## 🔄 PASOS INMEDIATOS

### 1. REVOCAR TOKEN COMPROMETIDO
- Ve a: https://vercel.com/account/tokens
- Busca el token `github-ci-cd`
- **ELIMÍNALO AHORA** (click en el ícono de basura)

### 2. CREAR NUEVO TOKEN
- Crea un nuevo token con el mismo nombre
- **NO lo compartas en ningún lugar**
- Guárdalo temporalmente en un lugar seguro

### 3. CONFIGURAR GITHUB SECRETS (FORMA SEGURA)

Ve a: https://github.com/pascal1010100/mandalas/settings/secrets/actions

Agrega estos secrets uno por uno:

```
VERCEL_ORG_ID=team_eBliS0vkDcxbdpVnwaiQB2OO
VERCEL_PROJECT_ID=prj_c7gk9h1FRmXJpGepL5zsm0k7Nf5i
PRODUCTION_URL=https://mandalas-sigma.vercel.app
STAGING_URL=https://mandalas-sigma.vercel.app
SUPABASE_URL=https://zfbrcdwkunbvjnxmwlor.supabase.co
SUPABASE_ANON_KEY=sb_publishable_UQ8GSwZicCSQsMn37ZktrA_C9qdqG3I
RESEND_API_KEY=re_Wj4tVawh_HuvGdZgir6DqmNaZNiYQ4VvZ
VERCEL_TOKEN=nuevo_token_seguro
```

## 🧹 LIMPIEZA

Una vez configurados los secrets:
1. Eliminar el archivo comprometido del repositorio
2. Hacer push para limpiar el historial

## ⏰ URGENTE

Haz esto AHORA MISMO. Tu cuenta de Vercel está en riesgo.
