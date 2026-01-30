import { SupabaseClient } from '@supabase/supabase-js';
import {
    CashTransaction,
    CashTransactionRow,
    Charge,
    PaymentMethod
} from '../types/types';

export class FinanceRepository {
    constructor(private supabase: SupabaseClient) { }

    /**
     * Fetch all transactions (for balance calculation)
     */
    async findAllTransactions(): Promise<CashTransaction[]> {
        const { data, error } = await this.supabase
            .from('cash_transactions')
            .select('*');

        if (error) throw error;
        return (data || []).map(this.mapTransactionToDomain);
    }

    /**
     * Fetch transactions for a specific date range
     */
    async findTransactionsInRange(start: Date, end: Date): Promise<CashTransaction[]> {
        const { data, error } = await this.supabase
            .from('cash_transactions')
            .select('*')
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString())
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(this.mapTransactionToDomain);
    }

    /**
     * Create a new transaction
     */
    async createTransaction(tx: Omit<CashTransaction, 'id' | 'createdAt'>): Promise<CashTransaction> {
        const payload: Partial<CashTransactionRow> = {
            amount: tx.amount,
            type: tx.type,
            category: tx.category,
            description: tx.description,
            booking_id: tx.bookingId,
            payment_method: tx.paymentMethod
        };

        const { data, error } = await this.supabase
            .from('cash_transactions')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return this.mapTransactionToDomain(data);
    }

    /**
     * Delete a transaction
     */
    async deleteTransaction(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('cash_transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Fetch all charges for a booking
     */
    async findChargesByBookingId(bookingId: string): Promise<Charge[]> {
        const { data, error } = await this.supabase
            .from('charges')
            .select('*')
            .eq('booking_id', bookingId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    /**
     * Create a new charge
     */
    async createCharge(charge: Omit<Charge, 'id' | 'created_at'>): Promise<Charge> {
        const { data, error } = await this.supabase
            .from('charges')
            .insert([charge])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Update charge status
     */
    async updateChargeStatus(id: string, status: 'pending' | 'paid'): Promise<void> {
        const { error } = await this.supabase
            .from('charges')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Mark all pending charges as paid for a booking
     */
    async markAllChargesAsPaid(bookingId: string): Promise<void> {
        const { error } = await this.supabase
            .from('charges')
            .update({ status: 'paid' })
            .eq('booking_id', bookingId)
            .eq('status', 'pending');

        if (error) throw error;
    }

    /**
     * Delete a charge
     */
    async deleteCharge(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('charges')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Mapping Helper
     */
    private mapTransactionToDomain(row: CashTransactionRow): CashTransaction {
        return {
            id: row.id,
            amount: row.amount,
            type: row.type,
            category: row.category,
            description: row.description,
            bookingId: row.booking_id,
            paymentMethod: row.payment_method,
            createdAt: new Date(row.created_at)
        };
    }
}
