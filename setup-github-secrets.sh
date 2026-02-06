#!/bin/bash

# 🚀 Script para configurar GitHub Secrets automáticamente
# Ejecutar: chmod +x setup-github-secrets.sh && ./setup-github-secrets.sh

echo "🔐 Configurando GitHub Secrets para Mandalas..."

# Variables extraídas de .env.local
SUPABASE_URL="https://zfbrcdwkunbvjnxmwlor.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_UQ8GSwZicCSQsMn37ZktrA_C9qdqG3I"
RESEND_API_KEY="re_Wj4tVawh_HuvGdZgir6DqmNaZNiYQ4VvZ"

# Variables de Vercel
VERCEL_ORG_ID="team_eBliS0vkDcxbdpVnwaiQB2OO"
VERCEL_PROJECT_ID="prj_c7gk9h1FRmXJpGepL5zsm0k7Nf5i"

# URLs del proyecto
PRODUCTION_URL="https://mandalas-sigma.vercel.app"
STAGING_URL="https://mandalas-sigma.vercel.app"

echo "📋 Secrets a configurar:"
echo "1. VERCEL_ORG_ID: $VERCEL_ORG_ID"
echo "2. VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo "3. PRODUCTION_URL: $PRODUCTION_URL"
echo "4. STAGING_URL: $STAGING_URL"
echo "5. SUPABASE_URL: $SUPABASE_URL"
echo "6. SUPABASE_ANON_KEY: $SUPABASE_ANON_KEY"
echo "7. RESEND_API_KEY: $RESEND_API_KEY"
echo ""
echo "⚠️  Necesitas obtener VERCEL_TOKEN manualmente desde:"
echo "   https://vercel.com/account/tokens"
echo ""

# Instrucciones para configurar manualmente
echo "🔗 Configuración manual en GitHub:"
echo "1. Ve a: https://github.com/pascal1010100/mandalas/settings/secrets/actions"
echo "2. Click 'New repository secret'"
echo "3. Agrega cada uno de estos secrets:"
echo ""

cat << 'EOF'
VERCEL_ORG_ID=team_eBliS0vkDcxbdpVnwaiQB2OO
VERCEL_PROJECT_ID=prj_c7gk9h1FRmXJpGepL5zsm0k7Nf5i
PRODUCTION_URL=https://mandalas-sigma.vercel.app
STAGING_URL=https://mandalas-sigma.vercel.app
SUPABASE_URL=https://zfbrcdwkunbvjnxmwlor.supabase.co
SUPABASE_ANON_KEY=sb_publishable_UQ8GSwZicCSQsMn37ZktrA_C9qdqG3I
RESEND_API_KEY=re_Wj4tVawh_HuvGdZgir6DqmNaZNiYQ4VvZ
VERCEL_TOKEN=obtener_desde_vercel_dashboard
EOF

echo ""
echo "✅ Una vez configurados, prueba con:"
echo "   git checkout develop && git push origin develop"
echo "   git checkout main && git push origin main"
