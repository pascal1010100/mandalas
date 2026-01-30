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

async function inspectBookings() {
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')

    if (error) {
        console.error(error)
        return
    }

    console.log(`Total Bookings: ${bookings.length}`)

    // 1. Analyze Monthly Revenue
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]

    const monthlyBookings = bookings.filter(b => {
        const checkIn = b.check_in.split('T')[0]
        return checkIn >= startOfMonth && checkIn <= endOfMonth && b.status !== 'cancelled'
    })

    console.log(`Monthly Bookings (Active): ${monthlyBookings.length}`)

    const revenue = monthlyBookings
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + b.total_price, 0)

    console.log(`Monthly Revenue (Paid): ${revenue}`)

    const projected = monthlyBookings.reduce((sum, b) => sum + b.total_price, 0)
    console.log(`Projected Revenue: ${projected}`)

    console.log('--- Unpaid Bookings Details ---')
    monthlyBookings.filter(b => b.payment_status !== 'paid').forEach(b => {
        console.log(`- ${b.guest_name}: Q${b.total_price} (${b.check_in}) Status: ${b.status}, Payment: ${b.payment_status}`)
    })
}

inspectBookings()
