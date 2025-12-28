
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Error: Supabase environment variables missing')
    process.exit(1)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log(`Using key type: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE (Bypasses RLS)' : 'ANON (Subject to RLS)'}`)

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBooking() {
    const email = 'andy@gmail.com'
    console.log(`Checking booking for: ${email}`)

    const { data, error } = await supabase
        .from('bookings')
        .select('id, guest_name, email, total_price, status, payment_status, check_in')
        .order('created_at', { ascending: false })
        .limit(10)

    if (error) {
        console.error('Error fetching booking:', error)
        return
    }

    if (data && data.length > 0) {
        console.log('✅ Found Bookings (Last 10):')
        console.table(data)
    } else {
        console.log('❌ No bookings found in the database at all.')
    }
}

checkBooking()
