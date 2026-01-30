
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const TARGET_BALANCE = 2860.00
const IDS_TO_DELETE = [
    'f182c674-fcf1-4e1b-bf7e-33407bf38706', // Hannah duplicate (85)
    '881b1798-482a-4272-88e0-ec2dde950596', // Gianluca duplicate (90)
    // We will look up the 420 adjustment by query to be safe
]

async function fixCash() {
    console.log("--- FINAL CASH CORRECTION ---")

    // 1. DELETE DUPLICATES
    console.log(`Deleting ${IDS_TO_DELETE.length} duplicate transactions...`)
    const { error: errDel } = await supabase.from('cash_transactions').delete().in('id', IDS_TO_DELETE)
    if (errDel) console.error("Error deleting duplicates:", errDel)

    // 2. DELETE OLD ADJUSTMENT (420)
    const { data: adjTx } = await supabase.from('cash_transactions')
        .select('id')
        .eq('amount', 420)
        .ilike('description', '%Ajuste Saldo%')
        .single()

    if (adjTx) {
        console.log(`Deleting old adjustment (ID: ${adjTx.id})...`)
        await supabase.from('cash_transactions').delete().eq('id', adjTx.id)
    }

    // 3. CALCULATE CURRENT BALANCE
    const { data: allTx } = await supabase
        .from('cash_transactions')
        .select('amount, type, payment_method')

    const cashTx = (allTx || []).filter((t: any) => t.payment_method === 'cash' || !t.payment_method)

    const totalIncome = cashTx.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
    const totalExpense = cashTx.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
    console.log(`Income: ${totalIncome}, Expense: ${totalExpense}`)

    const currentBalance = totalIncome - totalExpense
    console.log(`Current Calculated Balance: ${currentBalance}`)
    console.log(`Target Balance: ${TARGET_BALANCE}`)

    // 4. INSERT FINAL ADJUSTMENT
    const diff = TARGET_BALANCE - currentBalance

    if (Math.abs(diff) < 0.01) {
        console.log("Balance is already correct.")
        return
    }

    const type = diff > 0 ? 'income' : 'expense'
    const amount = Math.abs(diff)

    console.log(`Inserting ${type} adjustment of ${amount}...`)

    const { error: errIns } = await supabase.from('cash_transactions').insert({
        amount: amount,
        type: type,
        category: 'adjustment',
        description: 'Cuadre Final Caja (Auditoría)',
        payment_method: 'cash',
        created_at: new Date().toISOString()
    })

    if (errIns) console.error("Error inserting adjustment:", errIns)
    else console.log("SUCCESS. Refresh dashboard.")
}

fixCash()
