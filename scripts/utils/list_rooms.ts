
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function listRooms() {
    console.log("Fetching rooms...")
    const { data: rooms, error } = await supabase.from('rooms').select('*')

    if (error) {
        console.error("Error:", error)
        return
    }

    if (rooms?.length) {
        console.table(rooms.map(r => ({ id: r.id, label: r.label, location: r.location })))
    } else {
        console.log("No rooms found in DB")
    }
}

listRooms()
