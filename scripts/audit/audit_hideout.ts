import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function auditHideout() {
    console.log("=== AUDITORÍA MANDALAS HIDEOUT ===\n")

    // 1. Obtener todas las reservas de Hideout
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('location', 'hideout')
        .order('check_in', { ascending: true })

    if (error) {
        console.error("Error:", error)
        return
    }

    console.log(`📊 Total de reservas en Hideout: ${bookings?.length || 0}\n`)

    // 2. Agrupar por tipo de habitación
    const byRoomType = bookings?.reduce((acc, b) => {
        const type = b.room_type || 'sin_tipo'
        if (!acc[type]) acc[type] = []
        acc[type].push(b)
        return acc
    }, {} as Record<string, any[]>)

    console.log("📋 Reservas por tipo de habitación:");
    const roomTypeEntries = Object.entries(byRoomType || {}) as [string, any[]][];
    roomTypeEntries.forEach(([type, items]) => {
        console.log(`\n  ${type}: ${items.length} reservas`)
        items.forEach(b => {
            console.log(`    - ${b.guest_name} | ${b.check_in} → ${b.check_out} | Status: ${b.status} | Unit: ${b.unit_id || 'N/A'}`)
        })
    })

    // 3. Verificar capacidades
    console.log("\n\n🏨 CONFIGURACIÓN ESPERADA:")
    console.log("  Dorm Female (hideout_dorm_female): 5 camas")
    console.log("  Dorm Mixed (hideout_dorm_mixed): 5 camas")
    console.log("  Private 1-4 (hideout_private_1 a 4): 4 habitaciones (2 huéspedes max c/u)")

    // 4. Verificar reservas activas
    const today = new Date().toISOString().split('T')[0]
    const activeBookings = bookings?.filter(b =>
        b.status !== 'cancelled' &&
        b.status !== 'checked_out' &&
        b.check_out >= today
    )

    console.log(`\n\n✅ Reservas activas/futuras: ${activeBookings?.length || 0}`)
    activeBookings?.forEach(b => {
        console.log(`  - ${b.guest_name} | ${b.room_type} | Unit: ${b.unit_id || 'N/A'} | ${b.check_in} → ${b.check_out}`)
    })

    // 5. Detectar problemas
    console.log("\n\n🔍 ANÁLISIS DE PROBLEMAS:")

    // Problema 1: Habitaciones con IDs incorrectos
    const invalidRoomIds = bookings?.filter(b => {
        const validIds = [
            'hideout_dorm_female',
            'hideout_dorm_mixed',
            'hideout_private_1',
            'hideout_private_2',
            'hideout_private_3',
            'hideout_private_4'
        ]
        return !validIds.includes(b.room_type)
    })

    if (invalidRoomIds && invalidRoomIds.length > 0) {
        console.log(`\n  ⚠️  ${invalidRoomIds.length} reservas con IDs de habitación inválidos:`)
        invalidRoomIds.forEach(b => {
            console.log(`    - ${b.guest_name}: "${b.room_type}" (ID: ${b.id})`)
        })
    }

    // Problema 2: Privadas con capacity > 1
    const privateWithWrongCapacity = bookings?.filter(b =>
        b.room_type?.includes('private') &&
        b.room_type?.includes('hideout')
    )

    console.log(`\n  ℹ️  Habitaciones privadas encontradas: ${privateWithWrongCapacity?.length || 0}`)

    // Problema 3: Dorms sin unit_id
    const dormsWithoutUnit = bookings?.filter(b =>
        b.room_type?.includes('dorm') &&
        b.room_type?.includes('hideout') &&
        !b.unit_id &&
        b.status !== 'cancelled'
    )

    if (dormsWithoutUnit && dormsWithoutUnit.length > 0) {
        console.log(`\n  ⚠️  ${dormsWithoutUnit.length} reservas de dormitorio SIN cama asignada:`)
        dormsWithoutUnit.forEach(b => {
            console.log(`    - ${b.guest_name} | ${b.room_type} | ${b.check_in} → ${b.check_out}`)
        })
    }
}

auditHideout()
