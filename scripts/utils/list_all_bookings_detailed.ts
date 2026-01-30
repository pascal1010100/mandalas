import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) env[key.trim()] = value.trim()
})

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

const supabase = createClient(supabaseUrl, supabaseKey)

async function listAllBookings() {
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('id, guest_name, email, status, created_at')
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return
    }

    console.log('ID | GUEST NAME | EMAIL | STATUS | CREATED AT')
    console.log('--------------------------------------------')
    bookings?.forEach(b => {
        console.log(`${b.id} | ${b.guest_name} | ${b.email} | ${b.status} | ${b.created_at}`)
    })
}

listAllBookings()
