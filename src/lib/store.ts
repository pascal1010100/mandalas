import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { format, differenceInDays } from 'date-fns'

// --- Types ---

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'maintenance' | 'cancelled' | 'no_show';

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
    refundAmount?: number;
    cancelledAt?: string;
    // Check-Out Metadata
    actualCheckOut?: string;
    paymentStatus?: 'pending' | 'verifying' | 'paid' | 'refunded';
    // Elite Identity
    guestIdType?: 'passport' | 'dni' | 'license' | 'other';
    guestIdNumber?: string;
    // Payment Details
    paymentMethod?: 'card' | 'cash' | 'transfer' | 'other';
    paymentReference?: string | null;
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
    housekeeping_status?: 'clean' | 'dirty' | 'maintenance';
    units_housekeeping?: Record<string, 'clean' | 'dirty' | 'maintenance'>; // UnitID -> Status
    last_cleaned_at?: string; // ISO Timestamp
    maintenance_note?: string;
    // iCal Sync
    icalImportUrl?: string;
    icalExportToken?: string;
}

// --- Database Interfaces (Snake Case) ---

export interface BookingRow {
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
    refund_amount?: number;
    cancelled_at?: string;
    actual_check_out?: string;
    payment_status?: 'pending' | 'verifying' | 'paid' | 'refunded';
    unit_id?: string;
    guest_id_type?: 'passport' | 'dni' | 'license' | 'other';
    guest_id_number?: string;
    payment_method?: 'card' | 'cash' | 'transfer' | 'other';
    payment_reference?: string;
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

export interface Product {
    id: string;
    name: string;
    price: number;
    category: 'beer' | 'soda' | 'water' | 'snack';
    icon: string;
    active: boolean;
    created_at: string;
}

export interface ServiceRequest {
    id: string;
    booking_id: string;
    type: 'cleaning' | 'maintenance' | 'amenity' | 'other';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    description?: string;
    created_at: string;
    completed_at?: string;
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
    ical_import_url?: string;
    ical_export_token?: string;
}

interface AppState {
    bookings: Booking[];
    events: AppEvent[];

    rooms: RoomConfig[];
    isLoading: boolean;

    // Actions
    fetchBookings: () => Promise<void>;
    addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'totalPrice' | 'status'> & { totalPrice?: number, status?: BookingStatus }, totalPrice?: number) => Promise<void>;
    updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
    updateBooking: (id: string, data: Partial<Omit<Booking, 'id' | 'createdAt'>>) => Promise<void>;
    confirmGroupBookings: (email: string) => Promise<void>;
    checkOutBooking: (id: string, paymentStatus: 'paid' | 'pending') => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;
    extendBooking: (bookingId: string, newCheckOutDate: string) => Promise<void>; // New Action

    // Maintenance
    blockUnit: (roomId: string, location: 'pueblo' | 'hideout', unitId?: string) => Promise<void>;
    unblockUnit: (bookingId: string) => Promise<void>;
    updateRoomStatus: (roomId: string, status: 'clean' | 'dirty' | 'maintenance', unitId?: string, note?: string) => Promise<void>; // New Action

    // Events
    fetchEvents: () => Promise<void>;
    addEvent: (event: Omit<AppEvent, 'id'>) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;

    // Service Requests (Elite Integration)
    serviceRequests: ServiceRequest[];
    fetchServiceRequests: () => Promise<void>;
    createServiceRequest: (bookingId: string, type: ServiceRequest['type'], description?: string) => Promise<void>;
    updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) => Promise<void>;
    subscribeToServiceRequests: () => () => void;

    // Room & Price Management
    updateRoomPrice: (roomId: string, price: number) => Promise<void>;
    updateRoomIcalUrl: (id: string, url: string) => Promise<void>;
    updateRoomCapacity: (roomId: string, newCapacity: number) => Promise<void>;
    updateRoomMaxGuests: (roomId: string, maxGuests: number) => Promise<void>;

    // Logic
    checkAvailability: (location: string, roomType: string, startDate: string, endDate: string, requestedGuests?: number, excludeBookingId?: string, checkUnitId?: string) => boolean;
    getRemainingCapacity: (location: string, roomType: string, startDate: string, endDate: string) => number;
    fetchRooms: () => Promise<void>;
    subscribeToBookings: () => () => void;
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
            serviceRequests: [],
            rooms: initialRooms,
            isLoading: false,

            subscribeToBookings: () => {
                console.log("Subscribing to realtime bookings...")
                const subscription = supabase
                    .channel('bookings-realtime')
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload: any) => {
                        console.log('Realtime Change:', payload)
                        const state = get()

                        if (payload.eventType === 'INSERT') {
                            const row = payload.new as BookingRow
                            const isMaintenance = row.guest_name === 'MANTENIMIENTO' || row.status === 'maintenance';
                            const newBooking: Booking = {
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
                                refundAmount: row.refund_amount,
                                cancelledAt: row.cancelled_at,
                                actualCheckOut: row.actual_check_out,
                                paymentStatus: row.payment_status || 'pending',
                                unitId: row.unit_id,
                                guestIdType: row.guest_id_type,
                                guestIdNumber: row.guest_id_number,
                                paymentMethod: row.payment_method,
                                paymentReference: row.payment_reference
                            }
                            // Prepend new booking
                            set({ bookings: [newBooking, ...state.bookings] })
                            toast.info(`Nueva reserva recibida: ${row.guest_name}`)
                        } else if (payload.eventType === 'UPDATE') {
                            const row = payload.new as BookingRow
                            console.log('Realtime UPDATE Payload:', row) // Debug

                            set({
                                bookings: state.bookings.map(b => {
                                    if (b.id === row.id) {
                                        // Safe Merge Helper
                                        const val = <T>(newVal: T | undefined, currVal: T) => newVal !== undefined ? newVal : currVal

                                        const isMaintenance = (row.guest_name === 'MANTENIMIENTO') || (row.status === 'maintenance') || (b.status === 'maintenance'); // Persist maintenance if not overridden

                                        // ELITE NOTIFICATIONS: Check for State Changes
                                        if (row.status === 'checked_in' && b.status !== 'checked_in') {
                                            toast.success(`¡Check-in Realizado!`, { description: `${b.guestName} ha ingresado al hostal.` })
                                            // Play sound? (Optional, maybe too intrusive)
                                        }
                                        if (row.payment_status === 'verifying' && b.paymentStatus !== 'verifying') {
                                            toast.warning(`Pago por Verificar`, { description: `${b.guestName} ha reportado un pago.` })
                                        }
                                        if (row.status === 'checked_out' && b.status !== 'checked_out') {
                                            toast.info(`Check-out Completado`, { description: `${b.guestName} ha dejado el hostal.` })
                                        }

                                        return {
                                            ...b,
                                            guestName: val(row.guest_name, b.guestName),
                                            email: val(row.email, b.email),
                                            phone: val(row.phone, b.phone),
                                            location: val(row.location, b.location),
                                            roomType: val(row.room_type, b.roomType),
                                            guests: val(row.guests, b.guests),
                                            checkIn: val(row.check_in, b.checkIn),
                                            checkOut: val(row.check_out, b.checkOut),
                                            // Status needs special handling for maintenance logic, but simple merge is safer for now unless status is explicit
                                            status: row.status !== undefined ? (isMaintenance ? 'maintenance' : row.status) : b.status,

                                            totalPrice: val(row.total_price, b.totalPrice),
                                            cancellationReason: val(row.cancellation_reason, b.cancellationReason),
                                            refundStatus: val(row.refund_status, b.refundStatus),
                                            refundAmount: val(row.refund_amount, b.refundAmount),
                                            cancelledAt: val(row.cancelled_at, b.cancelledAt),
                                            actualCheckOut: val(row.actual_check_out, b.actualCheckOut),
                                            paymentStatus: val(row.payment_status, b.paymentStatus),
                                            unitId: val(row.unit_id, b.unitId),
                                            guestIdType: val(row.guest_id_type, b.guestIdType),
                                            guestIdNumber: val(row.guest_id_number, b.guestIdNumber), // CRITICAL FIX
                                            paymentMethod: val(row.payment_method, b.paymentMethod),
                                            paymentReference: val(row.payment_reference, b.paymentReference)
                                        }
                                    }
                                    return b
                                })
                            })
                            // Generic update toast removed in favor of specfic ones, or kept silent for background details updates
                            if (window.location.pathname.includes('/admin')) {
                                // Only show generic toast if no specific one triggered? 
                                // Actually, let's keep it silent for generic updates (like typo fixes) to avoid noise.
                                // The specific alerts above handle the important stuff.
                            }
                        }
                        // Silent update usually better for edits, but maybe notify for status changes?
                        // toast.info("Reserva actualizada en tiempo real")
                        else if (payload.eventType === 'DELETE') {
                            const row = payload.old as { id: string }
                            set({
                                bookings: state.bookings.filter(b => b.id !== row.id)
                            })
                        }
                    })
                    .subscribe()

                // Optional: return unsubscribe function if needed, but for global store rarely used
                return () => supabase.removeChannel(subscription)
            },

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
                            refundAmount: row.refund_amount,
                            cancelledAt: row.cancelled_at,
                            actualCheckOut: row.actual_check_out,
                            paymentStatus: row.payment_status || 'pending',
                            unitId: row.unit_id, // Map DB column
                            guestIdType: row.guest_id_type,
                            guestIdNumber: row.guest_id_number,
                            paymentMethod: row.payment_method,
                            paymentReference: row.payment_reference
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
                        housekeeping_status: r.housekeeping_status || 'clean',
                        icalImportUrl: r.ical_import_url,
                        icalExportToken: r.ical_export_token
                    }));
                    set({ rooms: mappedRooms });
                    console.log("Loaded rooms from DB:", mappedRooms.length);
                } else {
                    console.log("Using local/fallback rooms (DB empty or error)");
                }
            },

            // --- Service Requests (Elite Integration) ---
            fetchServiceRequests: async () => {
                const { data, error } = await supabase
                    .from('service_requests')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error("Error fetching requests:", error)
                } else if (data) {
                    set({ serviceRequests: data as ServiceRequest[] })
                }
            },

            createServiceRequest: async (bookingId, type, description) => {
                const payload = {
                    booking_id: bookingId,
                    type,
                    description,
                    status: 'pending'
                }

                const { error } = await supabase.from('service_requests').insert([payload])

                if (error) {
                    console.error("Error creating request:", error)
                    toast.error("Error al enviar solicitud")
                    throw error
                } else {
                    toast.success("Solicitud enviada al equipo")
                    await get().fetchServiceRequests()
                }
            },

            updateServiceRequestStatus: async (id, status) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload: any = { status }
                if (status === 'completed') {
                    payload.completed_at = new Date().toISOString()
                }

                const { error } = await supabase
                    .from('service_requests')
                    .update(payload)
                    .eq('id', id)

                if (error) {
                    console.error("Error updating request:", error)
                    toast.error("Error al actualizar estado")
                } else {
                    toast.success("Estado actualizado")
                    await get().fetchServiceRequests()
                }
            },

            subscribeToServiceRequests: () => {
                console.log("Subscribing to Service Requests...")
                const channel = supabase
                    .channel('service-requests-channel')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'service_requests' }, () => {
                        get().fetchServiceRequests()
                    })
                    .subscribe()

                return () => {
                    supabase.removeChannel(channel)
                }
            },

            updateRoomStatus: async (roomId, status, unitId, note) => {
                const state = get()
                const roomIndex = state.rooms.findIndex(r => r.id === roomId)
                if (roomIndex === -1) return

                const room = state.rooms[roomIndex]
                const currentMap = room.units_housekeeping || {}
                const newMap = { ...currentMap }
                let newGlobalStatus = room.housekeeping_status

                // Metadata Updates
                let lastCleanedAt = room.last_cleaned_at
                let maintenanceNote = room.maintenance_note

                if (status === 'clean' && !unitId) {
                    // Only update timestamp if globally cleaning
                    lastCleanedAt = new Date().toISOString()
                    maintenanceNote = undefined // Clear note on clean
                }

                if (status === 'maintenance' && note) {
                    maintenanceNote = note
                }

                // HYDRATION FIX: If we are updating a specific unit, we must ensure ALL units 
                // have an explicit status in the map. Otherwise, untracked units will fallback 
                // to the valid (but potentially changed) global housekeeping_status.
                if (unitId) {
                    const previousGlobal = room.housekeeping_status || 'clean'
                    for (let i = 1; i <= room.capacity; i++) {
                        const uid = i.toString()
                        if (!newMap[uid]) {
                            newMap[uid] = previousGlobal
                        }
                    }

                    // Now safe to update the specific unit
                    newMap[unitId] = status

                    // Sync: If single unit, force global update
                    if (room.capacity === 1) {
                        newGlobalStatus = status
                    } else {
                        // Dorm/Multi-Unit Aggregation Logic (Elite)
                        const allUnits = Array.from({ length: room.capacity }, (_, i) => (i + 1).toString())
                        const getUnitStatus = (uid: string) => newMap[uid] // Safe now as we hydrated all


                        const anyMaintenance = allUnits.some(uid => getUnitStatus(uid) === 'maintenance')
                        const anyDirty = allUnits.some(uid => getUnitStatus(uid) === 'dirty')

                        if (anyMaintenance) {
                            newGlobalStatus = 'maintenance'
                        } else if (anyDirty) {
                            newGlobalStatus = 'dirty'
                        } else {
                            newGlobalStatus = 'clean'
                        }
                    }
                } else {
                    // Update Global -> Propagate to all units
                    newGlobalStatus = status
                    for (let i = 1; i <= room.capacity; i++) {
                        newMap[i.toString()] = status
                    }
                }

                // Update Local
                const updatedRooms = [...state.rooms]
                updatedRooms[roomIndex] = {
                    ...room,
                    housekeeping_status: newGlobalStatus,
                    units_housekeeping: newMap,
                    last_cleaned_at: lastCleanedAt,
                    maintenance_note: maintenanceNote
                }
                set({ rooms: updatedRooms })

                // Persist
                try {
                    await supabase.from('rooms').update({
                        housekeeping_status: newGlobalStatus,
                        units_housekeeping: newMap,
                        last_cleaned_at: lastCleanedAt,
                        maintenance_note: maintenanceNote
                    }).eq('id', roomId);
                } catch (e) {
                    console.error("Failed to persist status", e)
                }

                // 2. Handle Calendar Blocking

                if (status === 'maintenance') {
                    // BLOCK: Create a maintenance blocking booking
                    if (room) {
                        const today = new Date()
                        const nextYear = new Date(today)
                        nextYear.setFullYear(today.getFullYear() + 1) // Block for 1 year by default

                        const payload = {
                            guest_name: "MANTENIMIENTO",
                            email: "admin@mandalas.com",
                            location: room.location,
                            room_type: roomId,
                            guests: String(room.capacity), // Block FULL capacity
                            check_in: format(today, 'yyyy-MM-dd'),
                            check_out: format(nextYear, 'yyyy-MM-dd'),
                            status: 'confirmed',
                            total_price: 0
                        }

                        // Check if already blocked to avoid duplicates
                        const isBlocked = state.bookings.some(b =>
                            b.roomType === roomId &&
                            b.guestName === 'MANTENIMIENTO' &&
                            b.status !== 'cancelled' &&
                            new Date(b.checkOut) > new Date()
                        )

                        if (!isBlocked) {
                            const { error } = await supabase.from('bookings').insert([payload])
                            if (!error) {
                                await get().fetchBookings()
                                toast.success(`Bloqueo de calendario creado`)
                            }
                        }
                    }
                } else {
                    // UNBLOCK: Remove maintenance bookings if switching to Clean/Dirty
                    const maintenanceBookings = state.bookings.filter(b =>
                        b.roomType === roomId &&
                        b.guestName === 'MANTENIMIENTO' &&
                        b.status !== 'cancelled'
                    )

                    if (maintenanceBookings.length > 0) {
                        const ids = maintenanceBookings.map(b => b.id)
                        const { error } = await supabase.from('bookings').delete().in('id', ids)
                        if (!error) {
                            await get().fetchBookings()
                            toast.success(`Bloqueo de calendario eliminado`)
                        }
                    }
                }

                toast.success(`Estado actualizado: ${status === 'clean' ? 'Limpia' : status === 'dirty' ? 'Sucia' : 'Mantenimiento'}`)
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

            updateRoomIcalUrl: async (id, url) => {
                set((state) => ({
                    rooms: state.rooms.map(room =>
                        room.id === id ? { ...room, icalImportUrl: url } : room
                    )
                }))
                await supabase.from('rooms').update({ ical_import_url: url }).eq('id', id)
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
                    unit_id: bookingData.unitId,
                    payment_method: bookingData.paymentMethod // New: Persist preference
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
                // GUARD RAIL 1: Availability Check
                if (status === 'confirmed') {
                    const booking = get().bookings.find(b => b.id === id)
                    if (booking) {
                        const isAvailable = get().checkAvailability(
                            booking.location,
                            booking.roomType,
                            booking.checkIn,
                            booking.checkOut,
                            Number(booking.guests),
                            booking.id // excludeBookingId: Ignore self
                        )

                        if (!isAvailable) {
                            toast.error('❌ NO SE PUEDE CONFIRMAR: Fechas no disponibles (Overbooking)')
                            return
                        }
                    }
                }



                // Prepare Payload
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload: any = { status };

                if (status === 'cancelled') {
                    payload.cancelled_at = new Date().toISOString();
                }

                const { error } = await supabase.from('bookings').update(payload).eq('id', id)
                if (error) {
                    console.error('Error updating status:', error)
                    toast.error('Error al actualizar estado')
                    return
                }

                // Refresh local state first
                await get().fetchBookings()

                // AUTOMATED EMAIL SYSTEM (Elite Feature)
                // Trigger email in background after successful update
                try {
                    const updatedBooking = get().bookings.find(b => b.id === id);
                    if (updatedBooking && updatedBooking.email) {
                        let emailType = '';
                        if (status === 'confirmed') emailType = 'confirmation';
                        if (status === 'cancelled') emailType = 'cancellation';

                        if (emailType) {
                            const emailData = {
                                type: emailType,
                                to: updatedBooking.email,
                                data: {
                                    guestName: updatedBooking.guestName,
                                    bookingId: updatedBooking.id.slice(0, 8).toUpperCase(),
                                    checkIn: updatedBooking.checkIn,
                                    checkOut: updatedBooking.checkOut,
                                    roomName: get().rooms.find(r => r.id === updatedBooking.roomType)?.label || updatedBooking.roomType,
                                    totalPrice: updatedBooking.totalPrice,
                                    location: updatedBooking.location,
                                    refundStatus: updatedBooking.refundStatus,
                                    refundAmount: updatedBooking.refundAmount
                                }
                            };

                            // Non-blocking call
                            fetch('/api/emails/send', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(emailData)
                            }).then(res => {
                                if (res.ok) toast.success(`📧 Email de ${emailType === 'confirmation' ? 'Confirmación' : 'Cancelación'} enviado`);
                                else console.error("Email send failed");
                            }).catch(err => console.error("Email fetch error:", err));
                        }
                    }
                } catch (e) {
                    console.error("Email trigger error:", e);
                }
            },

            confirmGroupBookings: async (email: string) => {
                const state = get()
                const groupBookings = state.bookings.filter(b => b.email === email && b.status === 'pending')

                if (groupBookings.length === 0) return

                const ids = groupBookings.map(b => b.id)

                // 1. Update Local
                set({
                    bookings: state.bookings.map(b =>
                        ids.includes(b.id) ? { ...b, status: 'confirmed', paymentStatus: 'paid' } : b
                    )
                })

                // 2. Update DB
                const { error } = await supabase
                    .from('bookings')
                    .update({ status: 'confirmed', payment_status: 'paid' })
                    .in('id', ids)

                if (error) {
                    console.error("Error batch confirming:", error)
                    toast.error("Error al confirmar grupo")
                    // Revert? Complex, let's assume success or refresh.
                    await get().fetchBookings()
                } else {
                    toast.success(`Grupo confirmado (${ids.length} reservas)`)
                }
            },

            updateBooking: async (id, data) => {
                const payload: Partial<BookingRow> = {}
                if (data.status) payload.status = data.status
                if (data.cancellationReason) payload.cancellation_reason = data.cancellationReason
                if (data.refundStatus) payload.refund_status = data.refundStatus
                if (data.refundStatus) payload.refund_status = data.refundStatus
                if (data.refundAmount !== undefined) payload.refund_amount = data.refundAmount

                // Identity Updates
                if (data.guestIdType) payload.guest_id_type = data.guestIdType
                if (data.guestIdNumber) payload.guest_id_number = data.guestIdNumber

                // Payment Updates
                if (data.paymentMethod) payload.payment_method = data.paymentMethod
                if (data.paymentReference) payload.payment_reference = data.paymentReference

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
                const now = new Date()
                const payload = {
                    status: 'checked_out',
                    actual_check_out: now.toISOString(),
                    check_out: now.toISOString(), // RELEASE INVENTORY: Shorten booking to now
                    payment_status: paymentStatus
                }
                const { error } = await supabase.from('bookings').update(payload).eq('id', id)
                if (error) {
                    console.error('Error checking out:', error)
                    toast.error('Error al realizar check-out')
                    return
                }

                // Automation: Mark room as Dirty automatically
                const booking = get().bookings.find(b => b.id === id)
                if (booking) {
                    // Start async update but don't block UI
                    // FIX: Pass unitId to only dirtify the specific bed, not the whole room
                    get().updateRoomStatus(booking.roomType, 'dirty', booking.unitId).catch(err =>
                        console.error("Auto-dirty failed", err)
                    )
                    toast.success('Check-out realizado y cama liberada para venta')
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

            deleteEvent: async (id) => {
                const { error } = await supabase.from('events').delete().eq('id', id)
                if (error) {
                    console.error('Error deleting event:', error)
                    toast.error('Error al eliminar evento')
                    return
                }
                await get().fetchEvents()
            },

            resetData: () => set({ bookings: [], events: initialEvents }),

            extendBooking: async (bookingId, newCheckOutDate) => {
                const getStore = get();
                const booking = getStore.bookings.find(b => b.id === bookingId);

                if (!booking) {
                    toast.error("Reserva no encontrada");
                    return;
                }

                // 1. Availability Check
                // Note: We check from old checkOut to newCheckOut
                // However, checkAvailability takes full range. 
                // We should check the EXTENSION period mostly, but easier to check full new range excluding self.
                // Actually, checking full range (Start -> NewEnd) excluding self is the safest logic.

                const isAvailable = getStore.checkAvailability(
                    booking.location,
                    booking.roomType,
                    booking.checkIn,
                    newCheckOutDate,
                    Number(booking.guests),
                    bookingId, // Exclude self to allow overlap with old self
                    booking.unitId // Check specific bed if applicable
                );

                if (!isAvailable) {
                    toast.error("Fecha no disponible (Sin cupo)", {
                        description: "Intenta con otra habitación o fecha."
                    });
                    throw new Error("Unavailable");
                }

                // 2. Pricing Calculation
                const roomConfig = getStore.rooms.find(r => r.id === booking.roomType);
                if (!roomConfig) return;

                const oldCheckOutDate = new Date(booking.checkOut);
                const newCheckOutDateObj = new Date(newCheckOutDate);
                const extraDays = differenceInDays(newCheckOutDateObj, oldCheckOutDate);

                if (extraDays <= 0) {
                    toast.error("La nueva fecha debe ser posterior a la salida actual");
                    return;
                }

                const extraCost = extraDays * roomConfig.basePrice;
                const newTotalPrice = booking.totalPrice + extraCost;

                // 3. Update DB
                const { error } = await supabase
                    .from('bookings')
                    .update({
                        check_out: newCheckOutDate,
                        total_price: newTotalPrice
                        // We keep status as is (confirmed/checked_in covers it)
                        // Should we set payment status to 'pending' if it was paid?
                        // Yes, because now they owe money.
                        // payment_status: 'pending' (Wait, if they already paid, partial payment logic applies. 
                        // Let's set to 'pending' if the extra cost > 0)
                        , payment_status: 'pending'
                    })
                    .eq('id', bookingId);

                if (error) {
                    console.error("Error extending booking:", error);
                    toast.error("Error al extender reserva");
                    throw error;
                }

                // 4. Update Charge (Optional: Add 'Extension' charge to bill? No, we updated total_price)
                // However, updated total_price makes it confusing what was paid.
                // Better approach for Elite Traceability: Add a CHARGE for the extension.
                // But simplified mvp: Update Total Price. 
                // The payment logic subtracts payments from total price. 
                // So if we increase total price, pending amount increases. Correct.

                toast.success(`Estadía extendida (+${extraDays} noches)`);
                await getStore.fetchBookings();
            },

            checkAvailability: (location, roomId, startDate, endDate, requestedGuests = 1, excludeBookingId?: string, checkUnitId?: string) => {
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
                    // Exclude currently processed booking (e.g. valid when updating existing booking)
                    if (excludeBookingId && booking.id === excludeBookingId) return false;

                    // Double check location just in case
                    if (booking.location && booking.location !== location) return false;

                    // Match the stored roomType (which is actually the ID) against the checked ID
                    if (booking.roomType !== roomId) return false;

                    const bookingStart = new Date(booking.checkIn);
                    const bookingEnd = new Date(booking.checkOut);

                    return start < bookingEnd && end > bookingStart;
                });

                if (isDorm) {
                    // 1. Specific Unit Collision Check
                    if (checkUnitId) {
                        const isUnitTaken = overlappingBookings.some(b => b.unitId === checkUnitId);
                        if (isUnitTaken) {
                            console.warn(`[Availability] Unit ${checkUnitId} in ${roomId} is ALREADY BOOKED.`);
                            return false;
                        }
                    }

                    // 2. Global Capacity Check
                    const currentOccupancy = overlappingBookings.reduce((sum, booking) => {
                        const g = parseInt(booking.guests) || 1;
                        return sum + g;
                    }, 0);

                    const blocked = (currentOccupancy + requestedGuests) > capacity;
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
