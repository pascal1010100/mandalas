import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { format, differenceInDays } from 'date-fns'

// --- Types ---

// --- Types ---

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

// --- Database Interfaces (Snake Case) ---

// --- Database Interfaces (Snake Case) ---

export interface InventoryItem {
    id: string;
    name: string;
    category: 'bebidas' | 'limpieza' | 'amenities' | 'insumos' | 'otros';
    currentStock: number;
    minStockAlert: number;
    unit: string;
    costPrice: number;
}

export interface InventoryMovement {
    id: string;
    itemId: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reason: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    image?: string;
    icon?: React.ReactNode;
    stock?: number;
    createdAt: string;
}

export interface Charge {
    id: string;
    booking_id: string;
    product_id?: string;
    item_name: string;
    amount: number;
    status: 'pending' | 'paid';
    created_at: string;
    updated_at?: string;
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
    units_housekeeping?: Record<string, 'clean' | 'dirty' | 'maintenance'>;
    last_cleaned_at?: string;
    maintenance_note?: string;
    ical_import_url?: string;
    ical_export_token?: string;
}

interface AppState {
    events: AppEvent[];

    rooms: RoomConfig[];
    inventory: InventoryItem[]; // Init
    isLoading: boolean;
    isAdmin: boolean;

    // Actions

    fetchInventory: () => Promise<void>;
    addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
    updateStock: (itemId: string, type: 'in' | 'out' | 'adjustment', quantity: number, reason: string) => Promise<void>;



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
    updateRoomStatus: (roomId: string, status: 'clean' | 'dirty' | 'maintenance', unitId?: string, note?: string) => Promise<void>;

    // Logic
    fetchRooms: () => Promise<void>;
    subscribeToEvents: () => () => void; // New Action
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
        id: 'pueblo_private_1', location: 'pueblo', type: 'private', label: 'Habitación Privada 1 (Jardín)', capacity: 1, maxGuests: 2, basePrice: 45,
        description: 'Privada con vista directa al jardín',
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'pueblo_private_2', location: 'pueblo', type: 'private', label: 'Habitación Privada 2 (Estándar)', capacity: 1, maxGuests: 2, basePrice: 40,
        description: 'Habitación tranquila y confortable',
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'pueblo_private_family', location: 'pueblo', type: 'private', label: 'Habitación Familiar', capacity: 1, maxGuests: 4, basePrice: 60,
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
        id: 'hideout_dorm_female', location: 'hideout', type: 'dorm', label: 'Hideout Dorm A (Chicas)', capacity: 5, maxGuests: 5, basePrice: 175,
        description: 'Dormitorio de 5 camas exclusivo para mujeres',
        image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'hideout_dorm_mixed', location: 'hideout', type: 'dorm', label: 'Hideout Dorm B (Mixto)', capacity: 5, maxGuests: 5, basePrice: 148.75,
        description: 'Dormitorio mixto de 5 camas',
        image: "https://images.unsplash.com/photo-555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'hideout_private_1', location: 'hideout', type: 'private', label: 'Hideout Private 1', capacity: 2, maxGuests: 2, basePrice: 212.50,
        description: 'Habitación privada confortable y tranquila',
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'hideout_private_2', location: 'hideout', type: 'private', label: 'Hideout Private 2', capacity: 2, maxGuests: 2, basePrice: 212.50,
        description: 'Habitación privada confortable y tranquila',
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'hideout_private_3', location: 'hideout', type: 'private', label: 'Hideout Private 3', capacity: 2, maxGuests: 2, basePrice: 212.50,
        description: 'Habitación privada confortable y tranquila',
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    },
    {
        id: 'hideout_private_4', location: 'hideout', type: 'private', label: 'Hideout Private 4', capacity: 2, maxGuests: 2, basePrice: 212.50,
        description: 'Habitación privada confortable y tranquila',
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=300",
        housekeeping_status: 'clean'
    }
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
            events: [],
            serviceRequests: [],
            rooms: initialRooms,
            transactions: [],
            cashBalance: 0,
            inventory: [],
            isLoading: false,
            isAdmin: true,

            subscribeToEvents: () => {
                // console.log("Subscribing to realtime events...")
                const subscription = supabase
                    .channel('events-realtime')
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload: any) => {
                        console.log('Realtime Event Change detected:', payload.eventType)

                        if (payload.eventType === 'INSERT') {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const row = payload.new as any
                            toast.info(`Nuevo Evento: ${row.title}`)
                        }

                        get().fetchEvents()
                    })
                    .subscribe()

                return () => {
                    supabase.removeChannel(subscription)
                }
            },


            fetchEvents: async () => {
                // console.log("Fetching events from Supabase...")
                const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true })
                if (error) {
                    console.error('Error fetching events:', error)
                    return
                }
                // console.log("Events fetched:", data?.length)

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
                        units_housekeeping: r.units_housekeeping || {},
                        last_cleaned_at: r.last_cleaned_at,
                        maintenance_note: r.maintenance_note,
                        icalImportUrl: r.ical_import_url,
                        icalExportToken: r.ical_export_token
                    }));
                    set({ rooms: mappedRooms });
                    // console.log("Loaded rooms from DB:", mappedRooms.length);
                } else {
                    // console.log("Using local/fallback rooms (DB empty or error)");
                }
            },

            // --- Inventory System (Bodega) ---
            fetchInventory: async () => {
                const { data, error } = await supabase
                    .from('inventory_items')
                    .select('*')
                    .order('name', { ascending: true })

                if (error) {
                    console.error("Error fetching inventory:", error)
                    return
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const inventory = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    currentStock: Number(item.current_stock),
                    minStockAlert: Number(item.min_stock_alert),
                    unit: item.unit,
                    costPrice: Number(item.cost_price)
                }))

                set({ inventory })
            },

            addInventoryItem: async (item) => {
                const payload = {
                    name: item.name,
                    category: item.category,
                    current_stock: item.currentStock,
                    min_stock_alert: item.minStockAlert,
                    unit: item.unit,
                    cost_price: item.costPrice
                }
                const { error } = await supabase.from('inventory_items').insert([payload])
                if (error) {
                    console.error("Error adding item:", error)
                    toast.error("Error al crear producto")
                } else {
                    toast.success("Producto agregado a bodega")
                    get().fetchInventory()
                }
            },

            updateStock: async (itemId, type, quantity, reason) => {
                const item = get().inventory.find(i => i.id === itemId)
                if (!item) return

                const previousStock = item.currentStock
                let newStock = previousStock
                if (type === 'in') newStock += quantity
                if (type === 'out') newStock -= quantity
                if (type === 'adjustment') newStock = quantity

                // 1. Record Movement
                const movementPayload = {
                    item_id: itemId,
                    type,
                    quantity,
                    previous_stock: previousStock,
                    new_stock: newStock,
                    reason
                }
                await supabase.from('inventory_movements').insert([movementPayload])

                // 2. Update Item
                const { error } = await supabase
                    .from('inventory_items')
                    .update({ current_stock: newStock })
                    .eq('id', itemId)

                if (error) {
                    console.error("Error updating stock:", error)
                    toast.error("Error al actualizar existencias")
                } else {
                    toast.success(`Stock actualizado: ${newStock} ${item.unit}`)
                    get().fetchInventory()
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

            updateRoomStatus: async (roomId: string, status: 'clean' | 'dirty' | 'maintenance', unitId?: string, note?: string) => {
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
                    const { error } = await supabase.from('rooms').update({
                        housekeeping_status: newGlobalStatus,
                        units_housekeeping: newMap,
                        last_cleaned_at: lastCleanedAt,
                        maintenance_note: maintenanceNote
                    }).eq('id', roomId);

                    if (error) {
                        console.error("Failed to persist room status (Supabase):", error)
                        toast.error(`Error guardando Housekeeping: ${error.message}`)
                    }
                } catch (e) {
                    console.error("Failed to persist status (Exception)", e)
                }

                // LEACY MAINTENANCE BLOCKING REMOVED
                // Maintenance blocks should now be managed via the Bookings domain service/hook.

                toast.success(`Estado actualizado: ${status === 'clean' ? 'Limpia' : status === 'dirty' ? 'Sucia' : 'Mantenimiento'}`)
            },

            updateRoomPrice: async (roomId: string, price: number) => {
                set((state) => ({
                    rooms: state.rooms.map(room =>
                        room.id === roomId ? { ...room, basePrice: price } : room
                    )
                }))
                // Persist to DB
                await supabase.from('rooms').update({ base_price: price }).eq('id', roomId);
            },

            updateRoomIcalUrl: async (id: string, url: string) => {
                set((state) => ({
                    rooms: state.rooms.map(room =>
                        room.id === id ? { ...room, icalImportUrl: url } : room
                    )
                }))
                await supabase.from('rooms').update({ ical_import_url: url }).eq('id', id)
            },

            updateRoomCapacity: async (roomId: string, newCapacity: number) => {
                set((state) => ({
                    rooms: state.rooms.map(room =>
                        room.id === roomId ? { ...room, capacity: newCapacity } : room
                    )
                }))
                // Persist to DB
                await supabase.from('rooms').update({ capacity: newCapacity }).eq('id', roomId);
            },

            updateRoomMaxGuests: async (roomId: string, maxGuests: number) => {
                set((state) => ({
                    rooms: state.rooms.map(room =>
                        room.id === roomId ? { ...room, maxGuests: maxGuests } : room
                    )
                }))
                // Persist to DB
                await supabase.from('rooms').update({ max_guests: maxGuests }).eq('id', roomId);
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

            deleteEvent: async (id: string) => {
                const { error } = await supabase.from('events').delete().eq('id', id)
                if (error) {
                    console.error('Error deleting event:', error)
                    toast.error('Error al eliminar evento')
                    return
                }
                await get().fetchEvents()
            },

            resetData: () => set({ events: initialEvents }),

        }),
        {
            name: 'mandalas-storage',
            partialize: (state) => ({ rooms: state.rooms }),
            version: 7, // FORCE CACHE RESET: Bump to 7 to fix room count (4 vs 5)
            migrate: (persistedState: unknown, version) => {
                if (version < 7) {
                    // Force replace rooms with new initialRooms configuration
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return { ...(persistedState as any), rooms: initialRooms }
                }
                return persistedState
            },
        }
    )
)
