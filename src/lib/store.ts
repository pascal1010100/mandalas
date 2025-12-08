import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Utensils, Music, Zap, CalendarDays } from "lucide-react"

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

    // Actions
    addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
    updateBookingStatus: (id: string, status: BookingStatus) => void;
    addEvent: (event: Omit<AppEvent, 'id'>) => void;
    removeEvent: (id: string) => void;
    resetData: () => void;
    // Removed specific updateEvent for simplicity now
}

// --- Initial Data ---

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
        (set) => ({
            bookings: [],
            events: initialEvents,

            addBooking: (bookingData) => set((state) => ({
                bookings: [
                    ...state.bookings,
                    {
                        ...bookingData,
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

            resetData: () => set({ bookings: [], events: initialEvents })
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
