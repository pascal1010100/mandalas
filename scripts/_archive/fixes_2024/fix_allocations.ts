
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function fixAllocations() {
    // 1. Restore Peter (Room 4) - ID: 73a22b2d-c3bd-4672-b25c-bd0934ab8eb6
    console.log("Restoring Peter (Hideout Private 4)...")
    const { error: restoreError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' }) // Set to confirmed (or checked_in if he's here)
        .eq('id', '73a22b2d-c3bd-4672-b25c-bd0934ab8eb6')

    if (restoreError) console.error("Restore failed:", restoreError)
    else console.log("✅ Peter (Room 4) restored.")

    // 2. Cancel Peter Karrenbelt (Room 3) - ID: bbccc3ef-0629-4a39-afb7-8fa59fbb7b17
    // This removes him from Room 3, leaving Sophia alone there.
    console.log("Removing Peter Karrenbelt (Hideout Private 3)...")
    const { error: cancelError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('id', 'bbccc3ef-0629-4a39-afb7-8fa59fbb7b17')

    if (cancelError) console.error("Cancel failed:", cancelError)
    else console.log("✅ Peter Karrenbelt (Room 3) removed.")
}

fixAllocations()
