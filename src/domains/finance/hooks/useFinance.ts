/**
 * useFinance Hook
 * 
 * Clean API for components to interact with finance domain
 */

import { useCallback, useEffect } from 'react';
import { useFinanceStore } from '../store/finance.store';
import ServiceLocator from '@/infrastructure/service-locator';
import {
    CashTransaction,
    ShiftClosureDTO
} from '../types/types';
import { toast } from 'sonner';

export function useFinance() {
    const transactions = useFinanceStore(state => state.transactions);
    const cashBalance = useFinanceStore(state => state.cashBalance);
    const isLoading = useFinanceStore(state => state.isLoading);
    const error = useFinanceStore(state => state.error);

    const setTransactions = useFinanceStore(state => state.setTransactions);
    const setCashBalance = useFinanceStore(state => state.setCashBalance);
    const setLoading = useFinanceStore(state => state.setLoading);
    const setError = useFinanceStore(state => state.setError);

    const financeService = ServiceLocator.getFinanceService();

    /**
     * Refresh all finance data
     */
    const refreshFinanceData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [todayTransactions, currentBalance] = await Promise.all([
                financeService.fetchTodayTransactions(),
                financeService.calculateCashBalance()
            ]);
            setTransactions(todayTransactions);
            setCashBalance(currentBalance);
        } catch (err: any) {
            const message = err.message || 'Error al cargar datos financieros';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [financeService, setTransactions, setCashBalance, setLoading, setError]);

    /**
     * Add a new transaction
     */
    const addTransaction = useCallback(async (tx: Omit<CashTransaction, 'id' | 'createdAt'>) => {
        setLoading(true);
        try {
            await financeService.addTransaction(tx);
            toast.success('Movimiento registrado');
            await refreshFinanceData();
        } catch (err: any) {
            toast.error(err.message || 'Error al registrar movimiento');
        } finally {
            setLoading(false);
        }
    }, [financeService, refreshFinanceData, setLoading]);

    /**
     * Delete a transaction
     */
    const deleteTransaction = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await financeService.deleteTransaction(id);
            toast.success('Movimiento eliminado');
            await refreshFinanceData();
        } catch (err: any) {
            toast.error(err.message || 'Error al eliminar movimiento');
        } finally {
            setLoading(false);
        }
    }, [financeService, refreshFinanceData, setLoading]);

    /**
     * Register shift closure
     */
    const registerShiftClosure = useCallback(async (data: ShiftClosureDTO) => {
        setLoading(true);
        try {
            await financeService.performShiftClosure(data);
            const hasDiff = Math.abs(data.difference) > 0.01;
            toast.success(hasDiff ? "Turno cerrado con ajuste automático" : "Turno cerrado correctamente");
            await refreshFinanceData();
        } catch (err: any) {
            toast.error(err.message || 'Error al cerrar turno');
        } finally {
            setLoading(false);
        }
    }, [financeService, refreshFinanceData, setLoading]);

    /**
     * Fetch historical transactions for a date
     */
    const fetchHistoricalTransactions = useCallback(async (date: Date) => {
        try {
            return await financeService.fetchHistoricalTransactions(date);
        } catch (err: any) {
            toast.error('Error al cargar historial');
            return [];
        }
    }, [financeService]);

    // Initial load
    useEffect(() => {
        refreshFinanceData();
    }, [refreshFinanceData]);

    return {
        // State
        transactions,
        cashBalance,
        isLoading,
        error,

        // Actions
        refreshFinanceData,
        addTransaction,
        deleteTransaction,
        registerShiftClosure,
        fetchHistoricalTransactions,

        // Helpers
        getStats: (txs: CashTransaction[]) => financeService.getStats(txs)
    };
}
