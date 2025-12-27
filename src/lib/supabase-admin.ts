import { createClient } from '@supabase/supabase-js'

// Admin/Service Role Client Initialization
// USE WITH CAUTION: This client bypasses RLS policies.
export const getSupabaseAdmin = () => {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        // Prefer Service Role Key, fall back to Anon key (though Anon might fail for admin tasks)
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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

export const supabaseAdmin = getSupabaseAdmin()
