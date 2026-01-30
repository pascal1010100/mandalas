
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// Try to get Service Role Key, fallback to Anon (which might fail)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log(`Using key type: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON'}`)

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAllocations() {
    // 1. Restore Peter (Room 4)
    console.log("Restoring Peter (Hideout Private 4)...")

    // Try setting to 'checked_in' directly as he is in the room
    const { error: restoreError } = await supabase
        .from('bookings')
        .update({ status: 'checked_in', cancelled_at: null })
        .eq('id', '73a22b2d-c3bd-4672-b25c-bd0934ab8eb6')

    if (restoreError) {
        console.error("Restore failed:", restoreError)
    } else {
        console.log("✅ Peter (Room 4) restored to 'checked_in'.")
    }

    // 2. Ensure Peter Karrenbelt (Room 3) is CANCELLED
    // My previous attempt said "Peter Karrenbelt... removed" but didn't show "Cancel failed".
    // Let's verify or re-run just in case.
    const { error: cancelError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('id', 'bbccc3ef-0629-4a39-afb7-8fa59fbb7b17')

    if (cancelError) {
        // If it fails, it might be because it's already cancelled? Or permission?
        console.error("Cancel failed:", cancelError)
    } else {
        console.log("✅ Peter Karrenbelt (Room 3) ensured cancelled.")
    }
}

fixAllocations()
