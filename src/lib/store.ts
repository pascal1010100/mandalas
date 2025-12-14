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

export interface RoomConfig {
    id: string; // Composite key: `${location}_${roomType}`
    label: string;
    location: 'pueblo' | 'hideout';
    type: 'dorm' | 'private' | 'suite';
    capacity: number;
    basePrice: number;
}

interface AppState {
    bookings: Booking[];
    events: AppEvent[];

    rooms: RoomConfig[];
    isLoading: boolean;

    // Actions
    fetchBookings: () => Promise<void>;
    addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'totalPrice' | 'status'> & { totalPrice?: number, status?: BookingStatus }, totalPrice?: number) => Promise<void>;
    updateBookingStatus: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => Promise<void>;
    updateBooking: (id: string, data: Partial<Omit<Booking, 'id' | 'createdAt'>>) => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;

    // Events
    fetchEvents: () => Promise<void>;
    addEvent: (event: Omit<AppEvent, 'id'>) => Promise<void>;
    removeEvent: (id: string) => Promise<void>;

    // Room & Price Management
    updateRoomPrice: (roomId: string, price: number) => void;
    updateRoomCapacity: (roomId: string, newCapacity: number) => void;

    // Logic
    checkAvailability: (location: string, roomType: string, startDate: string, endDate: string, requestedGuests?: number) => boolean;
    getRemainingCapacity: (location: string, roomType: string, startDate: string, endDate: string) => number;
}

// --- Initial Data ---

const initialRooms: RoomConfig[] = [
    // PUEBLO
    { id: 'pueblo_dorm', location: 'pueblo', type: 'dorm', label: 'Dormitorio Pueblo', capacity: 6, basePrice: 18 },
    { id: 'pueblo_private', location: 'pueblo', type: 'private', label: 'Habitación Privada Pueblo', capacity: 1, basePrice: 35 },
    { id: 'pueblo_suite', location: 'pueblo', type: 'suite', label: 'Suite Pueblo', capacity: 1, basePrice: 55 },
    // HIDEOUT
    { id: 'hideout_dorm', location: 'hideout', type: 'dorm', label: 'Dormitorio Hideout', capacity: 6, basePrice: 16 }, // Assuming 6 for now
    { id: 'hideout_private', location: 'hideout', type: 'private', label: 'Habitación Privada Hideout', capacity: 1, basePrice: 40 },
    { id: 'hideout_suite', location: 'hideout', type: 'suite', label: 'Suite Hideout', capacity: 1, basePrice: 55 },
]



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

import { persist } from 'zustand/middleware'

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            bookings: [],
            events: [],
            rooms: initialRooms,
            isLoading: false,

            fetchBookings: async () => {
                set({ isLoading: true })
                const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
                console.log('[Store] Supabase response:', { dataCount: data?.length, error })

                if (error) {
                    console.error('Error fetching bookings:', error)
                    toast.error('Error al cargar reservas')
                    set({ isLoading: false })
                    return
                }

                if (data) {
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
                        cancelledAt: row.cancelled_at,
                    }))
                    set({ bookings: mappedBookings, isLoading: false })
                }
            },

            fetchEvents: async () => {
                const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true })
                if (error) {
                    console.error('Error fetching events:', error)
                    return
                }
                if (data) {
                    set({ events: data as AppEvent[] })
                }
            },

            updateRoomPrice: (roomId, price) => set((state) => ({
                rooms: state.rooms.map(room =>
                    room.id === roomId ? { ...room, basePrice: price } : room
                )
            })),

            updateRoomCapacity: (roomId, newCapacity) => set((state) => ({
                rooms: state.rooms.map(room =>
                    room.id === roomId ? { ...room, capacity: newCapacity } : room
                )
            })),

            addBooking: async (bookingData, totalPrice) => {
                const computedTotal = totalPrice || bookingData.totalPrice || 0
                const status = bookingData.status || 'pending'

                const payload = {
                    guest_name: bookingData.guestName,
                    email: bookingData.email,
                    phone: bookingData.phone,
                    location: bookingData.location,
                    room_type: bookingData.roomType,
                    guests: bookingData.guests,
                    check_in: bookingData.checkIn,
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload: any = {}
                if (data.status) payload.status = data.status
                if (data.cancellationReason) payload.cancellation_reason = data.cancellationReason
                if (data.refundStatus) payload.refund_status = data.refundStatus
                if (data.status === 'cancelled') payload.cancelled_at = new Date().toISOString()
                // Allow updating other fields if needed, e.g. guests/dates logic handled elsewhere for now

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

            addEvent: async (eventData) => {
                const { error } = await supabase.from('events').insert([eventData])
                if (error) {
                    console.error('Error adding event:', error)
                    toast.error('Error al crear evento')
                    return
                }
                await get().fetchEvents()
            },

            removeEvent: async (id) => {
                const { error } = await supabase.from('events').delete().eq('id', id)
                if (error) {
                    console.error('Error deleting event:', error)
                    toast.error('Error al eliminar evento')
                    return
                }
                await get().fetchEvents()
            },

            resetData: () => set({ bookings: [], events: initialEvents }),

            checkAvailability: (location, roomType, startDate, endDate, requestedGuests = 1) => {
                const state = get();
                const start = new Date(startDate);
                const end = new Date(endDate);

                // Dynamic Capacity Logic
                const roomId = `${location}_${roomType}`;
                const roomConfig = state.rooms.find(r => r.id === roomId);
                const capacity = roomConfig?.capacity || (roomType.includes('dorm') ? 6 : 1);
                const isDorm = roomType.includes('dorm');


                const overlappingBookings = state.bookings.filter(booking => {
                    if (booking.status === 'cancelled') return false;
                    if (booking.location !== location) return false;
                    if (booking.roomType !== roomType) return false;

                    const bookingStart = new Date(booking.checkIn);
                    const bookingEnd = new Date(booking.checkOut);

                    return start < bookingEnd && end > bookingStart;
                });

                if (isDorm) {
                    const currentOccupancy = overlappingBookings.reduce((sum, booking) => {
                        const g = parseInt(booking.guests) || 1;
                        return sum + g;
                    }, 0);

                    const blocked = (currentOccupancy + requestedGuests) > capacity;

                    if (blocked || currentOccupancy > 0) {
                        console.log(`[Availability] Dorm Check (Dynamic): ${location} | ${roomType}`, {
                            limit: capacity,
                            current: currentOccupancy,
                            request: requestedGuests,
                            willBlock: blocked
                        });
                    }
                    return !blocked;

                } else {
                    // Private/Suite logic implies capacity is 1 booking (regardless of people count inside)
                    // Unless we want to support multiple private rooms of same type, but simpler model is 1 unit.
                    // If capacity > 1 for private, it means we have multiple private rooms.
                    // UPDATE: If capacity is e.g. 3 Private Rooms, we check overlapping count.
                    const blocked = overlappingBookings.length >= capacity;
                    if (blocked) {
                        console.log(`[Availability] Blocked Private (Dynamic): ${location} | ${roomType} - Count: ${overlappingBookings.length}/${capacity}`);
                    }
                    return !blocked;
                }
            },

            getRemainingCapacity: (location, roomType, startDate, endDate) => {
                const state = get();
                const start = new Date(startDate);
                const end = new Date(endDate);

                const roomId = `${location}_${roomType}`;
                const roomConfig = state.rooms.find(r => r.id === roomId);
                const capacity = roomConfig?.capacity || (roomType.includes('dorm') ? 6 : 1);
                const isDorm = roomType.includes('dorm');

                const overlappingBookings = state.bookings.filter(booking => {
                    if (booking.status === 'cancelled') return false;
                    if (booking.location !== location) return false;
                    if (booking.roomType !== roomType) return false;

                    const bookingStart = new Date(booking.checkIn);
                    const bookingEnd = new Date(booking.checkOut);

                    return start < bookingEnd && end > bookingStart;
                });

                if (isDorm) {
                    const currentOccupancy = overlappingBookings.reduce((sum, booking) => {
                        return sum + (parseInt(booking.guests) || 1);
                    }, 0);
                    return Math.max(0, capacity - currentOccupancy);
                } else {
                    // For Private rooms, if we have multiple units (capacity > 1), we return remaining units.
                    return Math.max(0, capacity - overlappingBookings.length);
                }
            }
        }),
        {
            name: 'mandalas-storage',
            partialize: (state) => ({ rooms: state.rooms }),
        }
    )
)
