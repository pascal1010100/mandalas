
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const TARGET_BALANCE = 2860.00

async function fixPeterAndBalance() {
    console.log("--- FIXING PETER & RE-BALANCING ---")

    // 1. Find the incorrect Peter Transaction (150)
    // We search for amount 150 and description containing 'peter' and 'hideout_private_4' or just 'peter' and time today.
    // Based on previous log: 'Pago Reserva: peter (hideout_private_4)'

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

    const { data: duplicateTx } = await supabase.from('cash_transactions')
        .select('*')
        .eq('amount', 150)
        .ilike('description', '%peter%')
        .gte('created_at', todayStart.toISOString())
        .single() // Expecting one

    if (duplicateTx) {
        console.log(`Found duplicate transaction: ${duplicateTx.description} (ID: ${duplicateTx.id})`)
        const { error } = await supabase.from('cash_transactions').delete().eq('id', duplicateTx.id)
        if (error) console.error("Error deleting:", error)
        else console.log("Deleted successfully.")
    } else {
        console.log("No transaction found matching Q150 for Peter today... (Already deleted?)")
    }

    // 2. DELETE PREVIOUS ADJUSTMENT (The one we made minutes ago)
    // It had description 'Cuadre Final Caja (Auditoría)'
    const { data: oldAdj } = await supabase.from('cash_transactions')
        .select('id')
        .eq('description', 'Cuadre Final Caja (Auditoría)')
        .single()

    if (oldAdj) {
        console.log("Deleting previous adjustment...")
        await supabase.from('cash_transactions').delete().eq('id', oldAdj.id)
    }

    // 3. RE-CALCULATE AND INSERT NEW ADJUSTMENT
    const { data: allTx } = await supabase
        .from('cash_transactions')
        .select('amount, type, payment_method')

    const cashTx = (allTx || []).filter((t: any) => t.payment_method === 'cash' || !t.payment_method)

    const totalIncome = cashTx.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
    const totalExpense = cashTx.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)

    const currentBalance = totalIncome - totalExpense
    console.log(`New Calculated System Balance: ${currentBalance}`)
    console.log(`Target Physical Balance: ${TARGET_BALANCE}`)

    const diff = TARGET_BALANCE - currentBalance
    const type = diff > 0 ? 'income' : 'expense'
    const amount = Math.abs(diff)

    console.log(`Inserting final adjustment: ${type} ${amount}`)

    await supabase.from('cash_transactions').insert({
        amount: amount,
        type: type,
        category: 'adjustment',
        description: 'Cuadre Final Caja (Auditoría)',
        payment_method: 'cash',
        created_at: new Date().toISOString()
    })

    console.log("DONE.")
}

fixPeterAndBalance()
