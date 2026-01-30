
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function inspectRooms() {
    console.log("Fetching all rooms...")
    const { data: rooms, error } = await supabase.from('rooms').select('*')

    if (error) {
        console.error("Error:", error)
        return
    }

    console.log(`Total Rooms Found: ${rooms?.length}`)
    rooms?.forEach(r => {
        console.log(`ID: '${r.id}' (len: ${r.id.length}), Label: ${r.label}`)
    })

    console.log("\nChecking specifically for 'hideout_dorm_mixed'...")
    const { data: specific } = await supabase.from('rooms').select('*').eq('id', 'hideout_dorm_mixed')
    console.log("Specific query result:", specific)
}

inspectRooms()
