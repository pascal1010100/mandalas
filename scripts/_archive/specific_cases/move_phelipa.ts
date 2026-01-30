
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

async function movePhelipa() {
    console.log('--- MOVING PHELIPA TO UNIT 5 ---')
    const { error } = await supabase
        .from('bookings')
        .update({ unit_id: '5' })
        .ilike('guest_name', 'phelipa')
        .eq('room_type', 'hideout_dorm_mixed')

    if (error) console.error(error)
    else console.log("Successfully moved Phelipa to Bed 5.")
}

movePhelipa()
