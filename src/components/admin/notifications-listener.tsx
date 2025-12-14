"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function NotificationsListener() {
    const { fetchBookings, fetchEvents } = useAppStore()
    const router = useRouter()

    useEffect(() => {
        console.log("🔔 Inicializando Listener de Notificaciones...")

        // 1. Subscribe to BOOKINGS
        const bookingsChannel = supabase
            .channel('realtime-bookings')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bookings'
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (payload: any) => {
                    console.log('🔔 Nueva Reserva Recibida:', payload)
                    toast.success("¡Nueva Reserva!", {
                        description: `Huésped: ${payload.new.guest_name || 'Desconocido'}`,
                        action: {
                            label: "Ver",
                            onClick: () => router.push('/admin/reservations')
                        },
                        duration: 8000,
                    })
                    // Refresh data
                    fetchBookings()
                }
            )
            .subscribe()

        // 2. Subscribe to EVENTS
        const eventsChannel = supabase
            .channel('realtime-events')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'events'
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (payload: any) => {
                    console.log('🔔 Nuevo Evento Creado:', payload)
                    toast.info("Nuevo Evento Agregado", {
                        description: `${payload.new.title}`,
                        action: {
                            label: "Ver",
                            onClick: () => router.push('/admin/events')
                        },
                        duration: 8000,
                    })
                    // Refresh data
                    fetchEvents()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(bookingsChannel)
            supabase.removeChannel(eventsChannel)
        }
    }, [fetchBookings, fetchEvents, router])

    return null
}
