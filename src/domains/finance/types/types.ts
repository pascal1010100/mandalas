/**
 * Finance Domain Types
 */

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
    | 'reservation'
    | 'laundry'
    | 'shuttle'
    | 'bar'
    | 'supplies'
    | 'salary'
    | 'adjustment'
    | 'other';

export type PaymentMethod = 'cash' | 'card' | 'transfer';

export interface CashTransaction {
    id: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    bookingId?: string;
    paymentMethod?: PaymentMethod;
    createdAt: Date;
}

export interface CashTransactionRow {
    id: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    booking_id?: string;
    payment_method?: PaymentMethod;
    created_at: string;
}

export interface Charge {
    id: string;
    booking_id: string;
    product_id: string | null;
    item_name: string;
    amount: number;
    quantity: number;
    status: 'pending' | 'paid';
    created_at: string;
}

export interface ShiftClosureDTO {
    physicalCount: number;
    systemCount: number;
    difference: number;
    note?: string;
}

export interface FinanceStats {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
}
