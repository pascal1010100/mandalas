import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// --- Types ---

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
    id: string;
    guestName: string;
    email: string;
    phone?: string;
    location: 'pueblo' | 'hideout';
    roomType: string;
    guests: string;
    checkIn: string;
    checkOut: string;
    status: BookingStatus;
    totalPrice: number;
    createdAt: Date;
    // Cancellation Metadata
    cancellationReason?: string;
    refundStatus?: 'none' | 'partial' | 'full';
    cancelledAt?: string;
}

export interface AppEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    category: 'music' | 'food' | 'social' | 'wellness';
    location: 'Pueblo' | 'Hideout';
}

interface AppState {
    bookings: Booking[];
    events: AppEvent[];
    prices: Record<string, number>;
    isLoading: boolean;

    // Actions
    fetchBookings: () => Promise<void>;
    addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'totalPrice' | 'status'> & { totalPrice?: number, status?: BookingStatus }, totalPrice?: number) => Promise<void>;
    updateBookingStatus: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => Promise<void>;
    updateBooking: (id: string, data: Partial<Omit<Booking, 'id' | 'createdAt'>>) => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;

    // Events (Still local for now, or move to DB later)
    addEvent: (event: Omit<AppEvent, 'id'>) => void;
    removeEvent: (id: string) => void;

    // Prices
    updatePrice: (key: string, value: number) => void;
    checkAvailability: (location: string, roomType: string, startDate: string, endDate: string, requestedGuests?: number) => boolean;
    getRemainingCapacity: (location: string, roomType: string, startDate: string, endDate: string) => number;
}

// --- Initial Data ---

const initialPrices: Record<string, number> = {
    // Pueblo
    'pueblo_dorm': 18,
    'pueblo_private': 35,
    'pueblo_suite': 55,
    // Hideout
    'hideout_dorm': 16,
    'hideout_private': 40,
    'hideout_suite': 55,
}

const initialEvents: AppEvent[] = [
    {
        id: '1', title: "Cena Familiar", description: "Pasta casera y vino para compartir.",
        date: "2025-12-12T20:00:00.000Z", category: 'food', location: 'Pueblo'
    },
    {
        id: '2', title: "Noche de Salsa", description: "Clases gratis para principiantes.",
        date: "2025-12-13T21:00:00.000Z", category: 'music', location: 'Pueblo'
    },
    {
        id: '3', title: "Trivia Night", description: "Premios en tragos para los ganadores.",
        date: "2025-12-14T19:30:00.000Z", category: 'social', location: 'Hideout'
    },
    {
        id: '4', title: "Yoga & Brunch", description: "Recupera tu energía frente al lago.",
        date: "2025-12-15T10:00:00.000Z", category: 'wellness', location: 'Hideout'
    },
]

// --- Store ---

export const useAppStore = create<AppState>((set, get) => ({
    bookings: [],
    events: initialEvents,
    prices: initialPrices,
    isLoading: false,

    fetchBookings: async () => {
        set({ isLoading: true })

        // Check if user is authenticated to avoid RLS error on public pages
        // const { data: { session } } = await supabase.auth.getSession()
        // console.log('[Store] Fetching bookings. Session:', session ? 'Active' : 'None')

        // if (!session) {
        //     console.log('[Store] No session, returning empty bookings')
        //     // If public, we currently don't fetch full bookings list (Privacy)
        //     // In a future update, we should fetch a "Public Availability View" (dates only)
        //     set({ isLoading: false, bookings: [] })
        //     return
        // }

        const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
        console.log('[Store] Supabase response:', { dataCount: data?.length, error })

        if (error) {
            console.error('Error fetching bookings:', error)
            toast.error('Error al cargar reservas')
            set({ isLoading: false })
            return
        }

        if (data) {
            // Map DB snake_case to Frontend camelCase
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedBookings: Booking[] = data.map((row: any) => ({
                id: row.id,
                guestName: row.guest_name,
                email: row.email,
                phone: row.phone,
                location: row.location,
                roomType: row.room_type,
                guests: row.guests,
                checkIn: row.check_in,
                checkOut: row.check_out,
                status: row.status,
                totalPrice: row.total_price,
                createdAt: new Date(row.created_at),
                cancellationReason: row.cancellation_reason,
                refundStatus: row.refund_status,
                cancelledAt: row.cancelled_at, // Ensure DB has this or map appropriately
            }))
            set({ bookings: mappedBookings, isLoading: false })
        }
    },

    updatePrice: (key, value) => set((state) => ({
        prices: { ...state.prices, [key]: value }
    })),

    addBooking: async (bookingData, totalPrice) => {
        // Prepare payload for Supabase (snake_case)
        const computedTotal = totalPrice || bookingData.totalPrice || 0
        const status = bookingData.status || 'pending'

        const payload = {
            guest_name: bookingData.guestName,
            email: bookingData.email,
            phone: bookingData.phone,
            location: bookingData.location,
            room_type: bookingData.roomType,
            guests: bookingData.guests,
            check_in: bookingData.checkIn, // Date "YYYY-MM-DD"
            check_out: bookingData.checkOut,
            total_price: computedTotal,
            status: status
        }

        const { error } = await supabase.from('bookings').insert([payload])

        if (error) {
            console.error('Error adding booking:', error)
            toast.error('Error al guardar reserva')
            throw error
        }

        // Optimistic update or refetch
        await get().fetchBookings()
    },

    updateBookingStatus: async (id, status) => {
        const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
        if (error) {
            console.error('Error updating status:', error)
            toast.error('Error al actualizar estado')
            return
        }
        await get().fetchBookings()
    },

    updateBooking: async (id, data) => {
        // Map partial updates to snake_case if needed
        // For now simpler to just support status/reasons or general refetch
        // Implementing support for cancellation logic:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {}
        if (data.status) payload.status = data.status
        if (data.cancellationReason) payload.cancellation_reason = data.cancellationReason
        if (data.refundStatus) payload.refund_status = data.refundStatus
        // Add cancelled_at logic if needed, usually handled by trigger or here
        if (data.status === 'cancelled') payload.cancelled_at = new Date().toISOString()

        const { error } = await supabase.from('bookings').update(payload).eq('id', id)

        if (error) {
            console.error('Error updating booking:', error)
            return
        }
        await get().fetchBookings()
    },

    deleteBooking: async (id) => {
        const { error } = await supabase.from('bookings').delete().eq('id', id)
        if (error) {
            console.error('Error deleting booking:', error)
            return
        }
        set((state) => ({
            bookings: state.bookings.filter(b => b.id !== id)
        }))
    },

    addEvent: (eventData) => set((state) => ({
        events: [
            ...state.events,
            { ...eventData, id: Math.random().toString(36).substring(7) }
        ]
    })),

    removeEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
    })),

    resetData: () => set({ bookings: [], events: initialEvents }),

    checkAvailability: (location, roomType, startDate, endDate, requestedGuests = 1) => {
        const state = get();
        const start = new Date(startDate);
        const end = new Date(endDate);

        const overlappingBookings = state.bookings.filter(booking => {
            if (booking.status === 'cancelled') return false;
            // Booking location/room must match
            if (booking.location !== location) return false;
            if (booking.roomType !== roomType) return false;

            const bookingStart = new Date(booking.checkIn);
            const bookingEnd = new Date(booking.checkOut);

            // Check for overlap
            const isOverlap = start < bookingEnd && end > bookingStart;
            return isOverlap;
        });

        // Capacity Logic
        const isDorm = roomType.includes('dorm');
        const capacity = isDorm ? 6 : 1; // User specified 6 beds for dorms

        if (isDorm) {
            // For dorms, we sum the distinct guests
            const currentOccupancy = overlappingBookings.reduce((sum, booking) => {
                const g = parseInt(booking.guests) || 1;
                console.log(`[CheckAvail] Found overlapping booking: ${booking.id} (${booking.guestName}) - Guests: ${g} - Status: ${booking.status}`);
                return sum + g;
            }, 0);

            const blocked = (currentOccupancy + requestedGuests) > capacity;

            if (blocked || currentOccupancy > 0) {
                console.log(`[Availability] Dorm Check: ${location} | ${roomType}`, {
                    capacity,
                    currentOccupancy,
                    requestedGuests,
                    willBlock: blocked,
                    overlappingCount: overlappingBookings.length
                });
            }
            return !blocked;

        } else {
            // For Private/Suite, any overlap blocks the room (Capacity 1 booking)
            const blocked = overlappingBookings.length >= 1;
            if (blocked) {
                console.log(`[Availability] Blocked Private: ${location} | ${roomType}`, {
                    overlaps: overlappingBookings.length
                });
            }
            return !blocked;
        }
    },

    getRemainingCapacity: (location, roomType, startDate, endDate) => {
        const state = get();
        const start = new Date(startDate);
        const end = new Date(endDate);
        const isDorm = roomType.includes('dorm');
        const capacity = isDorm ? 6 : 1;

        const overlappingBookings = state.bookings.filter(booking => {
            if (booking.status === 'cancelled') return false;
            // Booking location/room must match
            if (booking.location !== location) return false;
            if (booking.roomType !== roomType) return false;

            const bookingStart = new Date(booking.checkIn);
            const bookingEnd = new Date(booking.checkOut);

            // Check for overlap
            return start < bookingEnd && end > bookingStart;
        });

        if (isDorm) {
            const currentOccupancy = overlappingBookings.reduce((sum, booking) => {
                return sum + (parseInt(booking.guests) || 1);
            }, 0);
            console.log(`[RemainingCap] ${location} ${roomType}: Limit ${capacity} - Occupied ${currentOccupancy} = Remaining ${Math.max(0, capacity - currentOccupancy)}`);
            return Math.max(0, capacity - currentOccupancy);
        } else {
            // For Private/Suite
            return overlappingBookings.length >= 1 ? 0 : 1;
        }
    }
}))
