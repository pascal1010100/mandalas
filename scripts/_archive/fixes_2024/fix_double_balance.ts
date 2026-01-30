
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function fixDoubleCount() {
    console.log("--- FIXING DOUBLE COUNTING BUG ---")

    // Find the transaction with amount 2950 created in the last hour
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()

    const { data: txs } = await supabase.from('cash_transactions')
        .select('*')
        .eq('amount', 2950)
        .ilike('description', '%CIERRE DE TURNO%')
        .gte('created_at', oneHourAgo)

    if (txs && txs.length > 0) {
        console.log(`Found ${txs.length} erroneous transactions. Deleting...`)
        const ids = txs.map((t: any) => t.id)
        const { error } = await supabase.from('cash_transactions').delete().in('id', ids)

        if (error) console.error("Error deleting:", error)
        else console.log("Deleted successfully. Balance should return to Q2950.")
    } else {
        console.log("No erroneous transaction found.")
    }
}

fixDoubleCount()
