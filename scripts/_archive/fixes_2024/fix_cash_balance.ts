
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function reconcileCash() {
    console.log("--- Starting Cash Reconciliation ---")

    // 1. Calculate Current System Balance (All Time)
    const { data: allTx, error: allError } = await supabase
        .from('cash_transactions')
        .select('*')

    if (allError) {
        console.error("Error fetching transactions:", allError)
        return
    }

    const cashTx = allTx.filter((t: any) => t.payment_method === 'cash' || !t.payment_method)

    const totalIncome = cashTx
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const totalExpense = cashTx
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const currentSystemBalance = totalIncome - totalExpense
    console.log(`Current System Balance: Q${currentSystemBalance.toFixed(2)}`)

    // 2. Calculate Today's Flow
    const todayStr = new Date().toISOString().split('T')[0]
    const todayTx = cashTx.filter((t: any) => t.created_at.startsWith(todayStr))

    const todayIncome = todayTx
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const todayExpense = todayTx
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const todayNetFlow = todayIncome - todayExpense
    console.log(`Today's Net Flow: Q${todayNetFlow.toFixed(2)} (Income: ${todayIncome} - Expense: ${todayExpense})`)

    // 3. Determine Target
    // User wants Opening Balance to be 1902.
    // Target Balance = Opening Balance + Today's Flow
    const targetOpening = 1902.00
    const targetBalance = targetOpening + todayNetFlow

    console.log(`Target Opening Balance: Q${targetOpening.toFixed(2)}`)
    console.log(`Target Final Balance: Q${targetBalance.toFixed(2)}`)

    // 4. Calculate Adjustment
    const difference = targetBalance - currentSystemBalance

    if (Math.abs(difference) < 0.01) {
        console.log("Balance is already correct. No action needed.")
        return
    }

    console.log(`Correction needed: ${difference > 0 ? '+' : ''}Q${difference.toFixed(2)}`)

    // 5. Insert Adjustment
    const payload = {
        amount: Math.abs(difference),
        type: difference > 0 ? 'income' : 'expense',
        category: 'adjustment',
        description: `Ajuste Saldo Inicial (Base Q1,902)`,
        payment_method: 'cash',
        created_at: new Date().toISOString() // Now
    }

    const { error: insertError } = await supabase.from('cash_transactions').insert([payload])

    if (insertError) {
        console.error("Error inserting adjustment:", insertError)
    } else {
        console.log("✅ Adjustment applied successfully.")
        console.log(`New Balance should be: Q${targetBalance.toFixed(2)}`)
    }
}

reconcileCash()
