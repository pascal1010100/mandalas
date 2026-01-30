/**
 * useBookings Hook
 * 
 * Clean API for components to interact with bookings domain
 * Combines store state with service operations
 */

import { useEffect, useCallback } from 'react';
import { useBookingsStore } from '../store/bookings.store';
import ServiceLocator from '@/infrastructure/service-locator';
import type { Booking } from '../types/types';
import type {
    CreateBookingDTO,
    UpdateBookingDTO,
    BookingStatus,
    RefundData,
    AvailabilityParams,
    CapacityParams,
} from '../types/types';

export function useBookings() {
    // Actions (Stable)
    const setBookings = useBookingsStore(state => state.setBookings);
    const setLoading = useBookingsStore(state => state.setLoading);
    const setError = useBookingsStore(state => state.setError);
    const subscribeToBookings = useBookingsStore(state => state.subscribeToBookings);
    const triggerRefetchAction = useBookingsStore(state => state.triggerRefetch);

    // State (watched for change)
    const bookings = useBookingsStore(state => state.bookings);
    const isLoading = useBookingsStore(state => state.isLoading);
    const error = useBookingsStore(state => state.error);
    const refetchVersion = useBookingsStore(state => state.refetchVersion);

    const bookingService = ServiceLocator.getBookingService();
    const availabilityService = ServiceLocator.getAvailabilityService();

    /**
     * Fetch all bookings
     */
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await bookingService.fetchAll();
            setBookings(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar reservas';
            setError(message);
            console.error('[useBookings] Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [bookingService, setBookings, setLoading, setError]);

    /**
     * Create a new booking
     */
    const createBooking = useCallback(
        async (dto: CreateBookingDTO) => {
            try {
                const result = await bookingService.createBooking(dto);
                if (result.success && result.data) {
                    const currentBookings = bookings;
                    setBookings([...currentBookings, result.data]);
                    return { success: true, data: result.data };
                }
                return { success: false, error: result.error };
            } catch (error) {
                return { 
                    success: false, 
                    error: error instanceof Error ? error.message : 'Error desconocido' 
                };
            }
        },
        [bookingService, setBookings, bookings]
    );

    /**
     * Create multiple bookings (group booking)
     */
    const createGroupBooking = useCallback(
        async (dtos: CreateBookingDTO[]) => {
            await bookingService.createGroupBooking(dtos);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Update booking status
     */
    const updateBookingStatus = useCallback(
        async (id: string, status: BookingStatus) => {
            await bookingService.updateBookingStatus(id, status);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Register payment
     */
    const registerPayment = useCallback(
        async (
            bookingId: string,
            amount: number,
            method: 'cash' | 'card' | 'transfer' | 'other',
            reference?: string
        ) => {
            await bookingService.registerPayment(bookingId, amount, method, reference);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Update booking details
     */
    const updateBooking = useCallback(
        async (id: string, data: UpdateBookingDTO) => {
            await bookingService.updateBooking(id, data);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Confirm group bookings by email
     */
    const confirmGroupBookings = useCallback(
        async (email: string) => {
            await bookingService.confirmGroupBookings(email);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Check out a booking
     */
    const checkOutBooking = useCallback(
        async (
            id: string,
            paymentStatus: 'pending' | 'paid' | 'verifying',
            manualUnitId?: string
        ) => {
            await bookingService.checkOutBooking(id, paymentStatus, manualUnitId);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Cancel a booking
     */
    const cancelBooking = useCallback(
        async (id: string, reason: string, refundData?: RefundData) => {
            await bookingService.cancelBooking(id, reason, refundData);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Extend booking checkout date
     */
    const extendBooking = useCallback(
        async (bookingId: string, newCheckOutDate: string) => {
            await bookingService.extendBooking(bookingId, newCheckOutDate);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Delete a booking
     */
    const deleteBooking = useCallback(
        async (id: string) => {
            await bookingService.deleteBooking(id);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Block unit for maintenance
     */
    const blockUnit = useCallback(
        async (
            roomId: string,
            location: 'pueblo' | 'hideout',
            unitId?: string,
            startDate?: string,
            endDate?: string
        ) => {
            await bookingService.blockUnit(roomId, location, unitId, startDate, endDate);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Unblock unit
     */
    const unblockUnit = useCallback(
        async (bookingId: string) => {
            await bookingService.unblockUnit(bookingId);
            await fetchBookings();
        },
        [bookingService, fetchBookings]
    );

    /**
     * Check availability
     */
    const checkAvailability = useCallback(
        async (params: AvailabilityParams): Promise<boolean> => {
            return availabilityService.checkAvailability(params);
        },
        [availabilityService]
    );

    /**
     * Get remaining capacity
     */
    const getRemainingCapacity = useCallback(
        async (params: CapacityParams): Promise<number> => {
            return availabilityService.getRemainingCapacity(params);
        },
        [availabilityService]
    );

    /**
     * Subscribe to realtime updates on mount
     */
    useEffect(() => {
        const unsubscribe = subscribeToBookings();

        // Initial fetch
        fetchBookings();

        return () => {
            unsubscribe();
        };
    }, [subscribeToBookings, fetchBookings]);

    /**
     * Refetch when realtime version changes
     */
    useEffect(() => {
        if (refetchVersion > 0) {
            fetchBookings();
        }
    }, [refetchVersion, fetchBookings]);

    // Derived state
    const activeBookings = bookings.filter(b =>
        ['confirmed', 'checked_in'].includes(b.status)
    );

    const pendingBookings = bookings.filter(b => b.status === 'pending');

    const todayCheckIns = bookings.filter(b => {
        const today = new Date().toISOString().split('T')[0];
        return b.checkIn === today && b.status !== 'cancelled';
    });

    const todayCheckOuts = bookings.filter(b => {
        const today = new Date().toISOString().split('T')[0];
        return b.checkOut === today && b.status === 'checked_in';
    });

    return {
        // State
        bookings,
        isLoading,
        error,

        // Derived state
        activeBookings,
        pendingBookings,
        todayCheckIns,
        todayCheckOuts,

        // Actions
        fetchBookings,
        createBooking,
        createGroupBooking,
        updateBookingStatus,
        registerPayment,
        updateBooking,
        confirmGroupBookings,
        checkOutBooking,
        cancelBooking,
        extendBooking,
        deleteBooking,
        blockUnit,
        unblockUnit,

        // Queries
        checkAvailability,
        getRemainingCapacity,
    };
}
