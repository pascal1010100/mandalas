"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useBookings } from "@/domains/bookings"
import { useFinance } from "@/domains/finance"

export function DataInitializer() {
    const fetchRooms = useAppStore(state => state.fetchRooms)
    const fetchEvents = useAppStore(state => state.fetchEvents)

    useBookings() // Hook handles its own initialization on mount (fetch + subscribe)
    useFinance()  // Hook handles its own initialization on mount

    useEffect(() => {
        fetchRooms()
        fetchEvents()
    }, [fetchRooms, fetchEvents])

    return null
}
