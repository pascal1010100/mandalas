
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function cancelDuplicate() {
    // Peter's generic/duplicate booking in Room 4
    const idToCancel = '73a22b2d-c3bd-4672-b25c-bd0934ab8eb6'

    console.log(`Cancelling booking ID: ${idToCancel}`)

    const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('id', idToCancel)

    if (error) {
        console.error("Error cancelling:", error)
    } else {
        console.log("✅ Booking cancelled successfully. It should disappear from the Active Grid.")
    }
}

cancelDuplicate()
