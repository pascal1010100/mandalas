import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Admin/Service Role Client Initialization
// USE WITH CAUTION: This client bypasses RLS policies.
export const getSupabaseAdmin = () => {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (supabaseUrl && supabaseServiceKey) {
            return createClient(supabaseUrl, supabaseServiceKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            })
        }
    } catch (error) {
        console.error('⚠️ Error creating Supabase Admin client:', error)
    }

    throw new Error('Could not initialize Supabase Admin Client. Missing env vars.')
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_target, prop, receiver) {
        return Reflect.get(getSupabaseAdmin(), prop, receiver)
    },
})
