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

async function cleanupTestData() {
    console.log('--- Buscando datos de prueba para eliminar ---')

    // Fetch all bookings to filter in JS (safer than complex OR queries in first pass)
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('id, guest_name, email')

    if (error) {
        console.error('Error fetching bookings:', error)
        return
    }

    const testBookings = bookings?.filter(b => {
        const email = b.email?.toLowerCase() || ''
        const name = b.guest_name?.toLowerCase() || ''

        return email.includes('@demo.com') ||
            email.includes('@test.com') ||
            name.startsWith('test guest')
    }) || []

    if (testBookings.length === 0) {
        console.log('No se encontraron datos de prueba que coincidan con los criterios.')
        return
    }

    console.log(`Se encontraron ${testBookings.length} registros de prueba para eliminar:`)
    testBookings.forEach(b => console.log(`- ${b.guest_name} (${b.email})`))

    console.log('\n--- Procediendo a la eliminación definitiva ---')

    const idsToDelete = testBookings.map(b => b.id)

    const { data: deletedRows, error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .in('id', idsToDelete)
        .select('id')

    if (deleteError) {
        console.error('Error al eliminar los registros:', deleteError)
    } else {
        console.log(`✅ Resultado: Se intentó eliminar ${testBookings.length} registros. Se confirmaron ${deletedRows?.length || 0} eliminaciones reales.`)
    }
}

cleanupTestData()
