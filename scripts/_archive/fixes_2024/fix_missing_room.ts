
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function fixMissingRoom() {
    console.log("Checking for hideout_dorm_mixed...")
    const { data: existing } = await supabase.from('rooms').select('*').eq('id', 'hideout_dorm_mixed')

    if (existing && existing.length > 0) {
        console.log("Room already exists!")
        return
    }

    console.log("Inserting missing room...")
    const { error } = await supabase.from('rooms').insert([{
        id: 'hideout_dorm_mixed',
        location: 'hideout',
        type: 'dorm',
        label: 'Hideout Dorm B (Mixto)',
        capacity: 5,
        max_guests: 5,
        base_price: 148.75,
        housekeeping_status: 'clean'
    }])

    if (error) {
        console.error("Error inserting room:", error)
    } else {
        console.log("Success! Room 'hideout_dorm_mixed' added.")
    }
}

fixMissingRoom()
