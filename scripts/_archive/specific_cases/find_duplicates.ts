
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function findDuplicates() {
    const { data: txs } = await supabase
        .from('cash_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

    if (!txs) return

    // Group by description/amount/time
    const groups = new Map<string, any[]>()

    txs.forEach(tx => {
        // Key: Description + Amount + Time(Minute precision to catch slight delays)
        const timeKey = tx.created_at.substring(0, 16) // "2026-01-15T14:23"
        const key = `${tx.description}-${tx.amount}-${timeKey}`

        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(tx)
    })

    console.log("--- POTENTIAL DUPLICATES ---")
    groups.forEach((list, key) => {
        if (list.length > 1) {
            console.log(`\nKey: ${key}`)
            list.forEach(item => {
                console.log(` - ID: ${item.id} | Time: ${item.created_at} | Amount: ${item.amount}`)
            })
        }
    })
}

findDuplicates()
