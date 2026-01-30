/**
 * Bookings Store (Zustand)
 * 
 * Manages bookings state and delegates business logic to services
 * Much smaller than the original monolithic store (~150 lines vs 1734)
 */

import { create } from 'zustand';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Booking } from '../types/types';

interface BookingsState {
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setBookings: (bookings: Booking[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

    // Realtime subscription
    refetchVersion: number;
    triggerRefetch: () => void;
    subscribeToBookings: () => () => void;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
    bookings: [],
    isLoading: false,
    error: null,

    setBookings: (bookings) => set({ bookings }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    refetchVersion: 0,
    triggerRefetch: () => set((state) => ({ refetchVersion: state.refetchVersion + 1 })),

    /**
     * Subscribe to realtime booking changes
     */
    subscribeToBookings: () => {
        let debounceTimer: NodeJS.Timeout | null = null;

        const subscription = supabase
            .channel('bookings-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookings' },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (payload: any) => {
                    if (payload.eventType === 'INSERT') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const row = payload.new as any;
                        toast.info(`Nueva reserva: ${row.guest_name || 'Huésped'}`);
                    }

                    // DEBOUNCE REFETCH (1000ms)
                    if (debounceTimer) clearTimeout(debounceTimer);

                    debounceTimer = setTimeout(() => {
                        get().triggerRefetch();
                    }, 1000);
                }
            )
            .subscribe();

        return () => {
            if (debounceTimer) clearTimeout(debounceTimer);
            supabase.removeChannel(subscription);
        };
    },
}));
