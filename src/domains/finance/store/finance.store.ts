import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
    CashTransaction,
    FinanceStats
} from '../types/types';

interface FinanceState {
    transactions: CashTransaction[];
    cashBalance: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    setTransactions: (transactions: CashTransaction[]) => void;
    setCashBalance: (balance: number) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useFinanceStore = create<FinanceState>()(
    devtools(
        (set) => ({
            transactions: [],
            cashBalance: 0,
            isLoading: false,
            error: null,

            setTransactions: (transactions) => set({ transactions }),
            setCashBalance: (cashBalance) => set({ cashBalance }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
        }),
        { name: 'FinanceStore' }
    )
);
