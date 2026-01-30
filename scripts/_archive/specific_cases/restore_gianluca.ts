
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function restoreGianluca() {
    console.log("--- RESTORING GIANLUCA PAYMENT ---")

    // We mistakenly deleted one of the two Q90 payments.
    // User confirms it was a valid extension.
    // We will insert a new transaction for Q90.

    const { error } = await supabase.from('cash_transactions').insert({
        amount: 90.00,
        type: 'income',
        category: 'reservation',
        description: 'Pago Reserva: gianluca bloor (Extensión)',
        payment_method: 'cash',
        booking_id: null, // We don't have the ID handy easily, leaving null is fine for cash flow
        created_at: new Date().toISOString()
    })

    if (error) {
        console.error("Error inserting:", error)
    } else {
        console.log("Success! Added Q90. System should now match Q2950.")
    }
}

restoreGianluca()
