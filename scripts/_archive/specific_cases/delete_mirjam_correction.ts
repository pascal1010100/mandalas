
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

async function deleteTransaction() {
    const transactionId = '1d2eb685-d8fc-495e-a099-fe5805070fa0';
    console.log(`--- DELETING TRANSACTION ${transactionId} ---`)

    const { error } = await supabase
        .from('cash_transactions')
        .delete()
        .eq('id', transactionId)

    if (error) {
        console.error('Error deleting transaction:', error)
    } else {
        console.log('Transaction deleted successfully.')
    }
}

deleteTransaction()
