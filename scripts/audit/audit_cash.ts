
/* eslint-disable */
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

async function auditCash() {
    console.log('--- CASH AUDIT ---')

    // 1. Fetch TOTAL Balance
    const { data: allTx, error: errTotal } = await supabase
        .from('cash_transactions')
        .select('amount, type, payment_method, created_at')

    if (errTotal) {
        console.error("Error fetching all tx:", errTotal)
        return
    }

    const cashTx = (allTx || []).filter((t: any) => t.payment_method === 'cash' || !t.payment_method)

    const totalIncome = cashTx
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const totalExpense = cashTx
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const currentBalance = totalIncome - totalExpense
    console.log(`Current SYSTEM Cash Balance: ${currentBalance}`)

    // 2. Analyze Recent Transactions (Last 48 Hours)
    console.log('\n--- Recent Transactions (Last 48h) ---')

    const now = new Date()
    const yesterdayLimit = new Date(now.getTime() - (48 * 60 * 60 * 1000))

    const recentTx = cashTx.filter((t: any) => new Date(t.created_at) > yesterdayLimit)
        .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    let runningBalance = currentBalance // This is wrong if we go backwards.
    // Better: List them with details.

    // Fetch detailed info for recent ones
    const { data: detailedTx } = await supabase
        .from('cash_transactions')
        .select('*')
        .gte('created_at', yesterdayLimit.toISOString())
        .order('created_at', { ascending: true })

    const detailedCash = (detailedTx || []).filter((t: any) => t.payment_method === 'cash' || !t.payment_method)

    if (detailedCash.length === 0) {
        console.log("No recent cash transactions.")
    } else {
        console.table(detailedCash.map((t: any) => ({
            Time: new Date(t.created_at).toLocaleString(),
            Type: t.type,
            Amount: t.amount,
            Category: t.category,
            Desc: t.description || 'N/A'
        })))

        const recentIncome = detailedCash.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
        const recentExpense = detailedCash.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
        console.log(`\nRecent Movement: +${recentIncome} - ${recentExpense} = ${recentIncome - recentExpense}`)
    }
}

auditCash()
