
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

async function checkConflicts() {
    console.log('--- CHECKING CONFLICTS ---')
    const { data, error } = await supabase
        .from('bookings')
        .select('guest_name, unit_id, check_in, check_out, status')
        .eq('room_type', 'hideout_dorm_mixed')
        .in('status', ['confirmed', 'checked_in'])
        .order('unit_id')

    if (error) {
        console.error(error)
        return
    }

    console.table(data)
}

checkConflicts()
