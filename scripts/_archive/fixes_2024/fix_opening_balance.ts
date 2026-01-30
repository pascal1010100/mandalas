
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function correctOpeningBalance() {
    console.log("--- CORRECTING OPENING BALANCE ---")

    // The user states Opening Balance should be 1905.
    // The system (Modal) calculates it as Current (2860) - NetFlowToday.
    // Currently, NetFlowToday includes my adjustment of ~1110. 
    // If we simply fix the "Net Flow" calculation to be correct (only today's ops), 
    // then "Opening Balance" becomes whatever history dictates.
    // History dictates 1307. Discrepancy = 598.

    // STRATEGY: 
    // 1. Insert +598 transaction dated YESTERDAY (fixes History/Opening Balance).
    // 2. Adjust TODAY's adjustment so Total Balance remains 2860.

    const RETRO_AMOUNT = 598.00
    const TARGET_BALANCE = 2860.00

    // 1. INSERT RETROACTIVE TRANSACTION (Yesterday 23:59:59)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(23, 59, 59, 999)

    console.log(`Inserting retroactive adjustment of Q${RETRO_AMOUNT} for date: ${yesterday.toISOString()}...`)

    const { error: errRetro } = await supabase.from('cash_transactions').insert({
        amount: RETRO_AMOUNT,
        type: 'income',
        category: 'adjustment',
        description: 'Ajuste Saldo Inicial (Corrección Histórica)',
        payment_method: 'cash',
        created_at: yesterday.toISOString()
    })

    if (errRetro) {
        console.error("Error inserting retro:", errRetro)
        return
    }

    // 2. RE-BALANCE TODAY
    // Delete previous 'Cuadre Final Caja' adjustment
    const { data: oldAdj } = await supabase.from('cash_transactions')
        .select('id')
        .eq('description', 'Cuadre Final Caja (Auditoría)')
        .single()

    if (oldAdj) {
        console.log("Deleting previous today adjustment...")
        await supabase.from('cash_transactions').delete().eq('id', oldAdj.id)
    }

    // 3. CALCULATE NEW GAP
    const { data: allTx } = await supabase
        .from('cash_transactions')
        .select('amount, type, payment_method')

    const cashTx = (allTx || []).filter((t: any) => t.payment_method === 'cash' || !t.payment_method)

    const totalIncome = cashTx.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
    const totalExpense = cashTx.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)

    const currentBalance = totalIncome - totalExpense
    console.log(`New Balance (with retro): ${currentBalance}`)
    console.log(`Target: ${TARGET_BALANCE}`)

    const diff = TARGET_BALANCE - currentBalance
    if (Math.abs(diff) > 0.01) {
        const type = diff > 0 ? 'income' : 'expense'
        console.log(`Inserting NEW today adjustment: ${type} ${Math.abs(diff)}`)

        await supabase.from('cash_transactions').insert({
            amount: Math.abs(diff),
            type: type,
            category: 'adjustment',
            description: 'Cuadre Final Caja (Auditoría)',
            payment_method: 'cash',
            created_at: new Date().toISOString()
        })
    } else {
        console.log("Balance is perfectly 2860 without new adjustment? (Unlikely unless retro filled nearly all)")
    }

    console.log("DONE.")
}

correctOpeningBalance()
