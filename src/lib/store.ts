import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

    // Actions
    addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>, totalPrice?: number) => void;
    updateBookingStatus: (id: string, status: BookingStatus) => void;
    addEvent: (event: Omit<AppEvent, 'id'>) => void;
    removeEvent: (id: string) => void;
    updatePrice: (key: string, value: number) => void;
    resetData: () => void;
    checkAvailability: (location: string, roomType: string, startDate: string, endDate: string) => boolean;
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
        id: '1',
        title: "Cena Familiar",
        description: "Pasta casera y vino para compartir.",
        date: new Date().toISOString(),
        category: 'food',
        location: 'Pueblo'
    },
    {
        id: '2',
        title: "Noche de Salsa",
        description: "Clases gratis para principiantes.",
        date: new Date(Date.now() + 86400000).toISOString(),
        category: 'music',
        location: 'Pueblo'
    },
    {
        id: '3',
        title: "Trivia Night",
        description: "Premios en tragos para los ganadores.",
        date: new Date(Date.now() + 172800000).toISOString(),
        category: 'social',
        location: 'Hideout'
    },
    {
        id: '4',
        title: "Yoga & Brunch",
        description: "Recupera tu energía frente al lago.",
        date: new Date(Date.now() + 259200000).toISOString(),
        category: 'wellness',
        location: 'Hideout'
    },
]

// --- Store ---

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            bookings: [],
            events: initialEvents,
            prices: initialPrices,

            updatePrice: (key, value) => set((state) => ({
                prices: { ...state.prices, [key]: value }
            })),

            addBooking: (bookingData, totalPrice) => set((state) => ({
                bookings: [
                    ...state.bookings,
                    {
                        ...bookingData,
                        totalPrice: totalPrice || bookingData.totalPrice || 0, // Ensure total is captured
                        id: Math.random().toString(36).substring(7),
                        createdAt: new Date(),
                        status: 'pending'
                    }
                ]
            })),

            updateBookingStatus: (id, status) => set((state) => ({
                bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
            })),

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

            checkAvailability: (location, roomType, startDate, endDate) => {
                const state = get();
                const start = new Date(startDate);
                const end = new Date(endDate);

                return !state.bookings.some(booking => {
                    if (booking.status === 'cancelled') return false;
                    if (booking.location !== location) return false;
                    if (booking.roomType !== roomType) return false;

                    const bookingStart = new Date(booking.checkIn);
                    const bookingEnd = new Date(booking.checkOut);

                    // Check for overlap
                    // Overlap exists if: (StartA < EndB) and (EndA > StartB)
                    return start < bookingEnd && end > bookingStart;
                });
            }
        }),
        {
            name: 'mandalas-storage',
            // We need to handle Date serialization/deserialization if strictly needed, 
            // but for this demo, standard JSON generic behavior might suffice or we simply process dates on read.
            // For simplicity in a demo, we'll let JSON.stringify handle strings and re-hydrate manually if needed,
            // or just assume dates come back as ISO strings.
        }
    )
)
