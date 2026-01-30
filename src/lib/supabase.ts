import { createClient } from '@supabase/supabase-js'

// Verificar que las variables de entorno estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '❌ Faltan las variables de entorno de Supabase. ' +
        'Asegúrate de que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén definidas en tu archivo .env.local'
    )
}

// Configuración de autenticación mejorada
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'mandalas_admin_auth',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        flowType: 'pkce',
        debug: process.env.NODE_ENV === 'development'
    },
    global: {
        headers: {
            'x-application-name': 'Mandalas Admin'
        }
    }
})

// Agregar logs para depuración en desarrollo
if (process.env.NODE_ENV === 'development') {
    console.log('🔑 Cliente de Supabase inicializado con éxito')
    console.log('URL:', supabaseUrl)
    console.log('Clave Anónima:', supabaseAnonKey ? '✅ Presente' : '❌ Faltante')
    
    // Monitorear cambios en la sesión
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔐 Cambio en la autenticación:', event, session)
    })
}

// Función para limpiar la sesión manualmente
export const clearAuthSession = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('mandalas_admin_auth')
        localStorage.removeItem('sb-' + (supabaseUrl || '').replace(/[^a-z0-9]/gi, '') + '-auth-token')
    }
}
