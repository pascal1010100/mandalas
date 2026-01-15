
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditRooms() {
    console.log('--- AUDIT: ROOM CONFIGURATIONS (Channel Manager Source) ---')

    const { data: rooms, error } = await supabase
        .from('rooms')
        .select('id, label, type, capacity, max_guests, base_price, ical_import_url')
        .order('location')

    if (error) {
        console.error('Error fetching rooms:', error)
        return
    }

    if (!rooms || rooms.length === 0) {
        console.log('⚠ NO ROOMS FOUND IN DATABASE. System might be using hardcoded fallbacks.')
        return
    }

    console.table(rooms.map(r => ({
        ID: r.id,
        Label: r.label,
        Type: r.type,
        'Cap (Beds/Qty)': r.capacity,
        'MaxPax': r.max_guests,
        'Price (Q)': r.base_price,
        'Synced?': r.ical_import_url ? 'YES' : 'NO'
    })))
}

auditRooms()
