import { FinanceRepository } from '../repositories/finance.repository';
import {
    CashTransaction,
    ShiftClosureDTO,
    FinanceStats
} from '../types/types';

export class FinanceService {
    constructor(private repo: FinanceRepository) { }

    /**
     * Fetch all transactions for today
     */
    async fetchTodayTransactions(): Promise<CashTransaction[]> {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        return this.repo.findTransactionsInRange(startOfDay, endOfDay);
    }

    /**
     * Fetch transactions for a specific date
     */
    async fetchHistoricalTransactions(date: Date): Promise<CashTransaction[]> {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

        return this.repo.findTransactionsInRange(startOfDay, endOfDay);
    }

    /**
     * Calculate current cash balance from all transactions
     */
    async calculateCashBalance(): Promise<number> {
        const allTransactions = await this.repo.findAllTransactions();

        // Filter: Only Cash (or legacy null)
        const cashRows = allTransactions.filter(t => t.paymentMethod === 'cash' || !t.paymentMethod);

        const income = cashRows
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = cashRows
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return income - expense;
    }

    /**
     * Register a new transaction
     */
    async addTransaction(tx: Omit<CashTransaction, 'id' | 'createdAt'>): Promise<CashTransaction> {
        return this.repo.createTransaction(tx);
    }

    /**
     * Delete a transaction and update status
     */
    async deleteTransaction(id: string): Promise<void> {
        await this.repo.deleteTransaction(id);
    }

    /**
     * Perform shift closure with automatic adjustment if needed
     */
    async performShiftClosure(data: ShiftClosureDTO): Promise<void> {
        const hasDiff = Math.abs(data.difference) > 0.01;
        const description = `CIERRE DE TURNO | Físico: Q${data.physicalCount} | Sistema: Q${data.systemCount} | Dif: Q${data.difference}`;

        let amount = 0;
        let type: 'income' | 'expense' = 'income';

        if (hasDiff) {
            amount = Math.abs(data.difference);
            type = data.difference > 0 ? 'income' : 'expense';
        }

        await this.repo.createTransaction({
            amount,
            type,
            category: 'adjustment',
            description,
            paymentMethod: 'cash'
        });
    }

    /**
     * Get summary statistics
     */
    getStats(transactions: CashTransaction[]): FinanceStats {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalIncome: income,
            totalExpense: expense,
            netBalance: income - expense
        };
    }
}
