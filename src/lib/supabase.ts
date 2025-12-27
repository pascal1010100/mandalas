import { createClient } from '@supabase/supabase-js'

// Safe Supabase Client Initialization
// This ensures the build never crashes due to missing env vars or invalid client creation

const getSupabaseClient = () => {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseAnonKey) {
            return createClient(supabaseUrl, supabaseAnonKey)
        } else {
            console.warn('⚠️ Supabase keys missing. Using mock client for build safety.')
        }
    } catch (error) {
        console.error('⚠️ Error creating Supabase client:', error)
    }

    // FAIL-SAFE MOCK CLIENT
    // Allows build to complete even if Supabase initialization fails completely
    return {
        from: () => ({
            select: () => ({ order: () => ({ data: [], error: null }) }),
            insert: () => ({ error: null }),
            update: () => ({ eq: () => ({ error: null }) }),
            delete: () => ({ eq: () => ({ error: null }) }),
        }),
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            signInWithPassword: () => Promise.resolve({ data: {}, error: { message: 'Mock Error' } }),
        },
        channel: () => ({
            on: () => ({ subscribe: () => { } }),
            subscribe: () => { }
        }),
        removeChannel: () => { },
        // Add other methods as needed to prevent runtime crashes during build
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
}

export const supabase = getSupabaseClient()
