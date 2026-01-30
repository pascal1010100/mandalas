/**
 * Service Locator
 * 
 * Centralized dependency injection for services
 * Implements singleton pattern to avoid creating multiple instances
 */

import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store'; // For room config and cash transactions
import { BookingRepository } from '@/domains/bookings/repositories/booking.repository';
import { AvailabilityService } from '@/domains/bookings/services/availability.service';
import { BookingService } from '@/domains/bookings/services/booking.service';
import { FinanceRepository } from '@/domains/finance/repositories/finance.repository';
import { FinanceService } from '@/domains/finance/services/finance.service';

class ServiceLocator {
    private static bookingRepository: BookingRepository | null = null;
    private static availabilityService: AvailabilityService | null = null;
    private static bookingService: BookingService | null = null;
    private static financeRepository: FinanceRepository | null = null;
    private static financeService: FinanceService | null = null;

    /**
     * Get BookingRepository singleton
     */
    static getBookingRepository(): BookingRepository {
        if (!this.bookingRepository) {
            this.bookingRepository = new BookingRepository(supabase);
        }
        return this.bookingRepository;
    }

    /**
     * Get AvailabilityService singleton
     */
    static getAvailabilityService(): AvailabilityService {
        if (!this.availabilityService) {
            const repo = this.getBookingRepository();

            // Helper to get room config from main store
            const getRoomConfig = (roomId: string) => {
                const state = useAppStore.getState();
                return state.rooms.find(r => r.id === roomId);
            };

            this.availabilityService = new AvailabilityService(repo, getRoomConfig);
        }
        return this.availabilityService;
    }

    /**
   * Get BookingService singleton
   */
    static getBookingService(): BookingService {
        if (!this.bookingService) {
            const repo = this.getBookingRepository();
            const availabilityService = this.getAvailabilityService();
            const financeService = this.getFinanceService();

            // Helper to add cash transaction
            const addCashTransaction = async (tx: {
                amount: number;
                type: 'income' | 'expense';
                category: any; // Using any for transition
                description: string;
                bookingId?: string;
                paymentMethod?: any;
            }) => {
                await financeService.addTransaction(tx as any);
            };

            this.bookingService = new BookingService(
                repo,
                availabilityService,
                addCashTransaction
            );
        }
        return this.bookingService;
    }

    /**
     * Get FinanceRepository singleton
     */
    static getFinanceRepository(): FinanceRepository {
        if (!this.financeRepository) {
            this.financeRepository = new FinanceRepository(supabase);
        }
        return this.financeRepository;
    }

    /**
     * Get FinanceService singleton
     */
    static getFinanceService(): FinanceService {
        if (!this.financeService) {
            const repo = this.getFinanceRepository();
            this.financeService = new FinanceService(repo);
        }
        return this.financeService;
    }

    /**
     * Reset all singletons (useful for testing)
     */
    static reset(): void {
        this.bookingRepository = null;
        this.availabilityService = null;
        this.bookingService = null;
        this.financeRepository = null;
        this.financeService = null;
    }
}

export default ServiceLocator;
