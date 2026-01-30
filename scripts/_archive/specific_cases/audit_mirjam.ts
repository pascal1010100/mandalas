
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditMirjam() {
    console.log('--- AUDIT MIRJAM TRANSACTIONS ---')

    const { data: txs, error } = await supabase
        .from('cash_transactions')
        .select('*')
        .ilike('description', '%mirjam%')
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error:', error)
        return
    }

    if (!txs || txs.length === 0) {
        console.log("No transactions found for 'mirjam'.")
    } else {
        console.table(txs.map(t => ({
            id: t.id,
            created_at: new Date(t.created_at).toLocaleString(),
            type: t.type,
            amount: t.amount,
            desc: t.description
        })))
    }
}

auditMirjam()
