
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

async function checkCapacity() {
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', 'hideout_dorm_mixed')
        .single()

    if (error) console.error(error)
    else console.log(data)
}

checkCapacity()
