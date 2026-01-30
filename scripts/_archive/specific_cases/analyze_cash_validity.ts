
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function analyzeCashIntegrity() {
    console.log("--- CASH INTEGRITY CHECK ---")

    // YESTERDAY'S REPORTED BALANCE (Baseline)
    const YESTERDAY_BALANCE = 1905.00
    const TARGET = 2860.00

    // GET TODAY'S TRANSACTIONS (Local Time consideration approximation)
    // Assuming server runs on UTC, and today is 15th.
    const startOfDay = '2026-01-15T00:00:00.000Z'

    const { data: txs } = await supabase.from('cash_transactions')
        .select('*')
        .gte('created_at', startOfDay) // Get everything from today
        .neq('description', 'Cuadre Final Caja (Auditoría)') // Exclude my forced fix

    const cashTxs = (txs || []).filter((t: any) => t.payment_method === 'cash' || !t.payment_method)

    const income = cashTxs.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
    const expense = cashTxs.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)

    const netToday = income - expense

    console.log(`Reported Balance Yesterday: Q${YESTERDAY_BALANCE}`)
    console.log(`Today's Verified Income:    +Q${income}`)
    console.log(`Today's Verified Expense:   -Q${expense}`)
    console.log(`Today's Net Flow:           Q${netToday}`)
    console.log(`-----------------------------------`)
    console.log(`Theoretical Total:          Q${YESTERDAY_BALANCE + netToday}`)
    console.log(`Actual Physical Total:      Q${TARGET}`)
    console.log(`Difference (Unaccounted):   Q${TARGET - (YESTERDAY_BALANCE + netToday)}`)

    console.log("\n--- Today's Income Details ---")
    cashTxs.filter((t: any) => t.type === 'income').forEach((t: any) => {
        console.log(` + ${t.amount} | ${t.description}`)
    })

    console.log("\n--- Today's Expense Details ---")
    cashTxs.filter((t: any) => t.type === 'expense').forEach((t: any) => {
        console.log(` - ${t.amount} | ${t.description}`)
    })
}

analyzeCashIntegrity()
