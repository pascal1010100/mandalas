"use client"

import { useEffect, useRef } from "react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

const SYNC_INTERVAL_MS = 1000 * 60 * 15 // 15 Minutes
const LAST_SYNC_KEY = 'mandalas_last_autoupdate'

export function AutoSyncHandler() {
    const { rooms, subscribeToBookings, subscribeToEvents } = useAppStore()
    const isSyncing = useRef(false)

    useEffect(() => {
        const checkAndSync = async () => {
            if (isSyncing.current) return
            if (!rooms || rooms.length === 0) return

            const lastSync = localStorage.getItem(LAST_SYNC_KEY)
            const now = Date.now()

            // If synced recently (less than 15 mins), skip
            if (lastSync && (now - parseInt(lastSync) < SYNC_INTERVAL_MS)) {
                console.log("AutoSync: Skipping (Synced recently)")
                return
            }

            console.log("AutoSync: Starting background sync...")
            isSyncing.current = true

            // Find rooms with Import URLs
            const roomsToSync = rooms.filter(r => r.icalImportUrl && r.icalImportUrl.length > 5)

            if (roomsToSync.length === 0) {
                isSyncing.current = false
                return
            }

            let successCount = 0

            // Sequential sync to avoid server stress
            for (const room of roomsToSync) {
                try {
                    await fetch('/api/admin/sync-ical', {
                        method: 'POST',
                        body: JSON.stringify({ roomId: room.id })
                    })
                    successCount++
                } catch (e) {
                    console.error(`AutoSync failed for ${room.id}`, e)
                }
            }

            // Update timestamp
            localStorage.setItem(LAST_SYNC_KEY, now.toString())
            isSyncing.current = false

            if (successCount > 0) {
                toast.success(`Calendarios actualizados (${successCount} habitaciones)`, {
                    description: "Sincronización automática completada",
                    duration: 3000
                })
            }
        }

        // Run on mount
        checkAndSync()

        // Optional: Set interval to keep checking if they leave the tab open
        const interval = setInterval(checkAndSync, SYNC_INTERVAL_MS)
        return () => clearInterval(interval)

    }, [rooms])

    // Real-time Database Sync (Supabase)
    useEffect(() => {
        console.log("AutoSync: Initializing Realtime Connection...")
        const unsubBookings = subscribeToBookings()
        const unsubEvents = subscribeToEvents()

        return () => {
            console.log("AutoSync: Cleaning up Realtime Connection...")
            if (unsubBookings) unsubBookings()
            if (unsubEvents) unsubEvents()
        }
    }, []) // Run once on mount

    return null // Invisible component
}
