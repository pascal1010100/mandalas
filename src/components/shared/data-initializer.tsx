"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

export function DataInitializer() {
    const fetchBookings = useAppStore(state => state.fetchBookings)

    useEffect(() => {
        // Initial fetch of bookings from Supabase
        fetchBookings()
    }, [fetchBookings])

    return null
}
