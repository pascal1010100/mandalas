import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { format } from 'date-fns'

// --- Types ---

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'checked_out' | 'maintenance';

export interface Booking {
    id: string;
    guestName: string;
    email: string;
    phone?: string;
    location: 'pueblo' | 'hideout';
    roomType: string;
    unitId?: string; // New: Specific bed/room assignment (e.g., "1", "2")
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
    // Check-Out Metadata
    actualCheckOut?: string;
    paymentStatus?: 'pending' | 'paid';
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
    maxGuests: number; // New: Physical limit per unit (for Private/Suite)
    basePrice: number;
    description?: string;
    image?: string;
    housekeeping_status?: 'clean' | 'dirty' | 'maintenance'; // New: Housekeeping
}

// --- Database Interfaces (Snake Case) ---

interface BookingRow {
    id: string;
    guest_name: string;
    email: string;
    phone?: string;
    location: 'pueblo' | 'hideout';
    room_type: string;
    guests: string;
    check_in: string;
    check_out: string;
    status: BookingStatus;
    total_price: number;
    created_at: string;
    cancellation_reason?: string;
    refund_status?: 'none' | 'partial' | 'full';
    cancelled_at?: string;
    actual_check_out?: string;
    payment_status?: 'pending' | 'paid';
    unit_id?: string;
}

interface RoomRow {
    id: string;
    location: 'pueblo' | 'hideout';
    type: 'dorm' | 'private' | 'suite';
    label: string;
    capacity: number;
    max_guests: number;
    base_price: number;
    housekeeping_status?: 'clean' | 'dirty' | 'maintenance';
}

interface AppState {
    bookings: Booking[];
    events: AppEvent[];

    rooms: RoomConfig[];
    isLoading: boolean;

    // Actions
    fetchBookings: () => Promise<void>;
    addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'totalPrice' | 'status'> & { totalPrice?: number, status?: BookingStatus }, totalPrice?: number) => Promise<void>;
    updateBookingStatus: (id: string, status: 'confirmed' | 'pending' | 'cancelled' | 'checked_out') => Promise<void>;
    updateBooking: (id: string, data: Partial<Omit<Booking, 'id' | 'createdAt'>>) => Promise<void>;
    checkOutBooking: (id: string, paymentStatus: 'paid' | 'pending') => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;

    // Maintenance
    blockUnit: (roomId: string, location: 'pueblo' | 'hideout', unitId?: string) => Promise<void>;
    unblockUnit: (bookingId: string) => Promise<void>;
    updateRoomStatus: (roomId: string, status: 'clean' | 'dirty' | 'maintenance') => Promise<void>; // New Action

    // Events
    fetchEvents: () => Promise<void>;
    addEvent: (event: Omit<AppEvent, 'id'>) => Promise<void>;
    removeEvent: (id: string) => Promise<void>;

    // Room & Price Management
    updateRoomPrice: (roomId: string, price: number) => void;
    updateRoomCapacity: (roomId: string, newCapacity: number) => void;
    updateRoomMaxGuests: (roomId: string, maxGuests: number) => void;

    // Logic
    checkAvailability: (location: string, roomType: string, startDate: string, endDate: string, requestedGuests?: number) => boolean;
    getRemainingCapacity: (location: string, roomType: string, startDate: string, endDate: string) => number;
    fetchRooms: () => Promise<void>;
}

// --- Initial Data ---

const initialRooms: RoomConfig[] = [
    // PUEBLO
    // PUEBLO
    {
        id: 'pueblo_dorm_mixed_8', location: 'pueblo', type: 'dorm', label: 'Dormitorio Mixto (8 Camas)', capacity: 8, maxGuests: 8, basePrice: 18,
        description: 'Espacioso dormitorio mixto con lockers individuales',
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'pueblo_dorm_female_6', location: 'pueblo', type: 'dorm', label: 'Dormitorio Femenino (6 Camas)', capacity: 6, maxGuests: 6, basePrice: 20,
        description: 'Dormitorio exclusivo para chicas, más privacidad',
        image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'pueblo_private_1', location: 'pueblo', type: 'private', label: 'Habitación Privada 1 (Jardín)', capacity: 4, maxGuests: 2, basePrice: 45,
        description: 'Privada con vista directa al jardín',
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'pueblo_private_2', location: 'pueblo', type: 'private', label: 'Habitación Privada 2 (Estándar)', capacity: 4, maxGuests: 2, basePrice: 40,
        description: 'Habitación tranquila y confortable',
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'pueblo_private_family', location: 'pueblo', type: 'private', label: 'Habitación Familiar', capacity: 4, maxGuests: 4, basePrice: 60,
        description: 'Espacio amplio ideal para familias o grupos pequeños',
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'pueblo_suite_balcony', location: 'pueblo', type: 'suite', label: 'Suite con Balcón', capacity: 1, maxGuests: 3, basePrice: 75,
        description: 'Suite de lujo con el mejor balcón del pueblo',
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    // HIDEOUT
    {
        id: 'hideout_dorm_female', location: 'hideout', type: 'dorm', label: 'Dormitorio Solo Chicas', capacity: 6, maxGuests: 6, basePrice: 16,
        description: 'Espacio exclusivo para mujeres',
        image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'hideout_dorm_mixed', location: 'hideout', type: 'dorm', label: 'Dormitorio Mixto', capacity: 6, maxGuests: 6, basePrice: 16,
        description: 'Ambiente social y compartido',
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'hideout_private', location: 'hideout', type: 'private', label: 'Habitación Privada', capacity: 4, maxGuests: 2, basePrice: 40,
        description: 'Tranquilidad y privacidad en el Hideout',
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
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
                // Fetch Rooms First (Best Effort)
                await get().fetchRooms().catch(e => console.error("Room fetch failed", e));

                // Fetch Bookings
                const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
                console.log('[Store] Supabase response:', { dataCount: data?.length, error })

                if (error) {
                    console.error('Error fetching bookings:', error)
                    toast.error('Error al cargar reservas')
                    set({ isLoading: false })
                    return
                }

                if (data) {
                    const mappedBookings: Booking[] = (data as unknown as BookingRow[]).map((row) => {
                        // Hack: If guest_name is MANTENIMIENTO, treat as maintenance internally
                        // This allows using 'confirmed' in DB to bypass enum constraints if 'maintenance' isn't allowed
                        const isMaintenance = row.guest_name === 'MANTENIMIENTO' || row.status === 'maintenance';

                        return {
                            id: row.id,
                            guestName: row.guest_name,
                            email: row.email,
                            phone: row.phone,
                            location: row.location,
                            roomType: row.room_type,
                            guests: row.guests,
                            checkIn: row.check_in,
                            checkOut: row.check_out,
                            status: isMaintenance ? 'maintenance' : row.status,
                            totalPrice: row.total_price,
                            createdAt: new Date(row.created_at),
                            cancellationReason: row.cancellation_reason,
                            refundStatus: row.refund_status,
                            cancelledAt: row.cancelled_at,
                            actualCheckOut: row.actual_check_out,
                            paymentStatus: row.payment_status || 'pending',
                            unitId: row.unit_id // Map DB column
                        }
                    })
                    set({ bookings: mappedBookings, isLoading: false })
                }
            },

            fetchEvents: async () => {
                console.log("Fetching events from Supabase...")
                const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true })
                if (error) {
                    console.error('Error fetching events:', error)
                    // Don't clear events on error, keep current state (which might be initialEvents)
                    return
                }
                console.log("Events fetched:", data?.length)

                if (data && data.length > 0) {
                    set({ events: data as AppEvent[] })
                } else {
                    // Fallback: Force initial demo data if DB is empty to ensure UI is lively
                    console.log("No events in DB or fetch failed, validating fallback...")
                    set(state => {
                        if (state.events.length === 0) {
                            return { events: initialEvents }
                        }
                        return {}
                    })
                }
            },

            fetchRooms: async () => {
                const { data, error } = await supabase.from('rooms').select('*')
                if (!error && data && data.length > 0) {
                    // Map DB keys (snake_case) to Store keys (camelCase) if needed
                    // Dbtable: id, location, type, label, capacity, max_guests, base_price, housekeeping_status
                    const mappedRooms: RoomConfig[] = (data as unknown as RoomRow[]).map((r) => ({
                        id: r.id,
                        location: r.location,
                        type: r.type,
                        label: r.label,
                        capacity: r.capacity,
                        maxGuests: r.max_guests,
                        basePrice: r.base_price,
                        // If DB doesn't have image column, it will be undefined here. 
                        // But we want to preserve images from initial state if they are static constants?
                        // Actually, if we want dynamic images from DB, we need an image column.
                        // For now, let's merge with initialRooms to keep the images!
                        description: initialRooms.find(ir => ir.id === r.id)?.description,
                        image: initialRooms.find(ir => ir.id === r.id)?.image,
                        housekeeping_status: r.housekeeping_status || 'clean'
                    }));
                    set({ rooms: mappedRooms });
                    console.log("Loaded rooms from DB:", mappedRooms.length);
                } else {
                    console.log("Using local/fallback rooms (DB empty or error)");
                }
            },

            updateRoomStatus: async (roomId, status) => {
                set((state) => ({
                    rooms: state.rooms.map(room =>
                        room.id === roomId ? { ...room, housekeeping_status: status } : room
                    )
                }))
                // Persist to DB
                await supabase.from('rooms').update({ housekeeping_status: status }).eq('id', roomId);
                toast.success(`Habitación marquée como ${status === 'clean' ? 'Limpia' : status === 'dirty' ? 'Sucia' : 'Mantenimiento'}`)
            },

            updateRoomPrice: async (roomId, price) => {
                set((state) => ({
                    rooms: state.rooms.map(room =>
                        room.id === roomId ? { ...room, basePrice: price } : room
                    )
                }))
                // Persist to DB
                await supabase.from('rooms').update({ base_price: price }).eq('id', roomId);
            },

            updateRoomCapacity: async (roomId, newCapacity) => {
                set((state) => ({
                    rooms: state.rooms.map(room =>
                        room.id === roomId ? { ...room, capacity: newCapacity } : room
                    )
                }))
                // Persist to DB
                await supabase.from('rooms').update({ capacity: newCapacity }).eq('id', roomId);
            },

            updateRoomMaxGuests: async (roomId, maxGuests) => {
                set((state) => ({
                    rooms: state.rooms.map(room =>
                        room.id === roomId ? { ...room, maxGuests: maxGuests } : room
                    )
                }))
                // Persist to DB
                await supabase.from('rooms').update({ max_guests: maxGuests }).eq('id', roomId);
            },

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
                    status: status,
                    unit_id: bookingData.unitId // ENABLED: Specific bed assignment
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
                const payload: Partial<BookingRow> = {}
                if (data.status) payload.status = data.status
                if (data.cancellationReason) payload.cancellation_reason = data.cancellationReason
                if (data.refundStatus) payload.refund_status = data.refundStatus

                // ENABLED: Cancellation timestamp behavior (Schema updated)
                if (data.status === 'cancelled') {
                    payload.cancelled_at = new Date().toISOString()
                }

                if (data.actualCheckOut) payload.actual_check_out = data.actualCheckOut
                if (data.paymentStatus) payload.payment_status = data.paymentStatus

                const { error } = await supabase.from('bookings').update(payload).eq('id', id)

                if (error) {
                    console.error('Error updating booking:', error)
                    toast.error('Error al actualizar reserva')
                    return
                }
                await get().fetchBookings()
            },

            checkOutBooking: async (id, paymentStatus) => {
                const payload = {
                    status: 'checked_out',
                    actual_check_out: new Date().toISOString(),
                    payment_status: paymentStatus
                }
                const { error } = await supabase.from('bookings').update(payload).eq('id', id)
                if (error) {
                    console.error('Error checking out:', error)
                    toast.error('Error al realizar check-out')
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

            blockUnit: async (roomId, location, unitId) => {
                // Maintenance Block Logic
                const today = new Date()
                const nextYear = new Date(today)
                nextYear.setFullYear(today.getFullYear() + 1)

                const payload = {
                    guest_name: "MANTENIMIENTO",
                    email: "admin@mandalas.com",
                    location: location,
                    room_type: roomId,
                    guests: "1",
                    check_in: format(today, 'yyyy-MM-dd'),
                    check_out: format(nextYear, 'yyyy-MM-dd'),
                    status: 'confirmed', // Uses confirmed to bypass enum issues if any
                    total_price: 0,
                    unit_id: unitId // ENABLED: Block specific unit
                }

                const { error } = await supabase.from('bookings').insert([payload])

                if (error) {
                    console.error('Error blocking unit:', error)
                    toast.error('Error al bloquear unidad')
                    return
                }
                await get().fetchBookings()
                toast.success('Unidad bloqueada')
            },

            unblockUnit: async (bookingId) => {
                await get().deleteBooking(bookingId)
                toast.success('Unidad desbloqueada')
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

            checkAvailability: (location, roomId, startDate, endDate, requestedGuests = 1) => {
                const state = get();
                const start = new Date(startDate);
                const end = new Date(endDate);

                // Use the passed ID directly. It should match the DB key (e.g. 'pueblo_dorm')
                const roomConfig = state.rooms.find(r => r.id === roomId);
                // Fallback capacity logic
                const isDorm = roomId.includes('dorm');
                const capacity = roomConfig?.capacity || (isDorm ? 6 : 1);

                const overlappingBookings = state.bookings.filter(booking => {
                    if (booking.status === 'cancelled') return false;
                    // Double check location just in case
                    if (booking.location && booking.location !== location) return false;

                    // Match the stored roomType (which is actually the ID) against the checked ID
                    if (booking.roomType !== roomId) return false;

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
                        console.log(`[Availability] Dorm Check: ${roomId} (${currentOccupancy}/${capacity}) + Req: ${requestedGuests} -> Blocked: ${blocked}`);
                    }
                    return !blocked;

                } else {
                    // Private/Suite Checks:

                    // 1. Max Occupancy Check (Physical limit)
                    if (roomConfig && requestedGuests > roomConfig.maxGuests) {
                        return false;
                    }

                    // 2. Inventory Check (Capacity = Number of Rooms)
                    // If we have 1 unit, and 1 overlap, it's full.
                    const blocked = overlappingBookings.length >= capacity;
                    return !blocked;
                }
            },

            getRemainingCapacity: (location, roomId, startDate, endDate) => {
                const state = get();
                const start = new Date(startDate);
                const end = new Date(endDate);

                const roomConfig = state.rooms.find(r => r.id === roomId);
                const isDorm = roomId.includes('dorm');
                const capacity = roomConfig?.capacity || (isDorm ? 6 : 1);

                const overlappingBookings = state.bookings.filter(booking => {
                    if (booking.status === 'cancelled') return false;
                    if (booking.location && booking.location !== location) return false;
                    if (booking.roomType !== roomId) return false;

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
                    return Math.max(0, capacity - overlappingBookings.length);
                }
            }
        }),
        {
            name: 'mandalas-storage',
            partialize: (state) => ({ rooms: state.rooms }),
            version: 5, // FORCE CACHE RESET: Bumped to 5 to load new Pueblo rooms
            migrate: (persistedState: unknown, version) => {
                if (version < 4) {
                    // Ignore old persisted rooms if version < 4
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return { ...(persistedState as any), rooms: initialRooms }
                }
                return persistedState
            },
        }
    )
)
