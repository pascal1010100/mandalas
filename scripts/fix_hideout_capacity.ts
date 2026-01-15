
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

async function correctHideoutCapacity() {
    console.log('--- CORRECTING HIDEOUT CAPACITY (Capacity: 2 -> 1) ---')

    // Target only Hideout PRIVATE rooms
    // We can identify them by location='hideout' and type='private'

    const { data: rooms, error } = await supabase
        .from('rooms')
        .select('id, label, capacity')
        .eq('location', 'hideout')
        .eq('type', 'private')

    if (error) {
        console.error('Error fetching rooms:', error)
        return
    }

    if (!rooms || rooms.length === 0) {
        console.log('No Hideout private rooms found.')
        return
    }

    console.log(`Found ${rooms.length} private rooms in Hideout. Updating capacity to 1...`)

    for (const room of rooms) {
        if (room.capacity !== 1) {
            const { error: updateError } = await supabase
                .from('rooms')
                .update({ capacity: 1 })
                .eq('id', room.id)

            if (updateError) {
                console.error(`Failed to update ${room.id}:`, updateError)
            } else {
                console.log(`✅ Updated ${room.id} (Old: ${room.capacity} -> New: 1)`)
            }
        } else {
            console.log(`Skipping ${room.id} (Already 1)`)
        }
    }
}

correctHideoutCapacity()
