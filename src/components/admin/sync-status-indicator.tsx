"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    RefreshCw, 
    Loader2,
    Wifi,
    WifiOff
} from "lucide-react"
import { toast } from "sonner"

interface SyncStatus {
    isOnline: boolean
    lastSync?: Date
    nextSync?: Date
    syncingRooms: string[]
    recentlySynced: string[]
    errors: string[]
}

export function SyncStatusIndicator() {
    const [syncStatus, setSyncStatus] = useState<SyncStatus>({
        isOnline: navigator.onLine,
        syncingRooms: [],
        recentlySynced: [],
        errors: []
    })

    const [currentTime, setCurrentTime] = useState(Date.now())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now())
        }, 60000) // Update every minute

        return () => clearInterval(timer)
    }, [])

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => {
            setSyncStatus(prev => ({ ...prev, isOnline: true }))
            toast.success("Conexión restablecida")
        }

        const handleOffline = () => {
            setSyncStatus(prev => ({ ...prev, isOnline: false }))
            toast.error("Conexión perdida")
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Listen for sync events (would need to implement event system)
    useEffect(() => {
        const handleSyncEvent = (event: CustomEvent) => {
            const { type, roomId, status } = event.detail
            
            setSyncStatus(prev => {
                const newStatus = { ...prev }
                
                switch (type) {
                    case 'sync_start':
                        newStatus.syncingRooms = [...new Set([...prev.syncingRooms, roomId])]
                        break
                    case 'sync_success':
                        newStatus.syncingRooms = prev.syncingRooms.filter(id => id !== roomId)
                        newStatus.recentlySynced = [roomId, ...prev.recentlySynced.slice(0, 4)]
                        newStatus.lastSync = new Date()
                        break
                    case 'sync_error':
                        newStatus.syncingRooms = prev.syncingRooms.filter(id => id !== roomId)
                        newStatus.errors = [`Error en ${roomId}: ${status}`, ...prev.errors.slice(0, 2)]
                        break
                }
                
                return newStatus
            })
        }

        // This would need to be implemented in the sync service
        window.addEventListener('sync-event', handleSyncEvent as EventListener)
        
        return () => {
            window.removeEventListener('sync-event', handleSyncEvent as EventListener)
        }
    }, [])

    const getStatusIcon = () => {
        if (!syncStatus.isOnline) {
            return <WifiOff className="w-4 h-4 text-red-500" />
        }
        
        if (syncStatus.syncingRooms.length > 0) {
            return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        }
        
        if (syncStatus.errors.length > 0) {
            return <AlertCircle className="w-4 h-4 text-yellow-500" />
        }
        
        if (syncStatus.lastSync) {
            return <CheckCircle className="w-4 h-4 text-green-500" />
        }
        
        return <Clock className="w-4 h-4 text-gray-400" />
    }

    const getStatusText = () => {
        if (!syncStatus.isOnline) {
            return "Sin conexión"
        }
        
        if (syncStatus.syncingRooms.length > 0) {
            return `Sincronizando ${syncStatus.syncingRooms.length} habitaciones...`
        }
        
        if (syncStatus.errors.length > 0) {
            return `${syncStatus.errors.length} errores`
        }
        
        if (syncStatus.lastSync) {
            const timeAgo = Math.floor((currentTime - syncStatus.lastSync.getTime()) / 60000)
            if (timeAgo < 1) return "Sincronizado ahora"
            if (timeAgo < 60) return `Hace ${timeAgo} min`
            return `Hace ${Math.floor(timeAgo / 60)}h`
        }
        
        return "Pendiente"
    }

    const getStatusColor = () => {
        if (!syncStatus.isOnline) return "destructive"
        if (syncStatus.syncingRooms.length > 0) return "default"
        if (syncStatus.errors.length > 0) return "secondary"
        return "secondary"
    }

    const triggerManualSync = async () => {
        if (!syncStatus.isOnline) {
            toast.error("Sin conexión a internet")
            return
        }

        // This would trigger the global sync
        window.dispatchEvent(new CustomEvent('trigger-global-sync'))
        toast.info("Iniciando sincronización manual...")
    }

    return (
        <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
                {syncStatus.isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-stone-600 dark:text-stone-400">
                    {syncStatus.isOnline ? "Conectado" : "Desconectado"}
                </span>
            </div>

            {/* Sync Status */}
            <div className="flex items-center gap-2">
                {getStatusIcon()}
                <Badge variant={getStatusColor()} className="text-xs">
                    {getStatusText()}
                </Badge>
            </div>

            {/* Manual Sync Button */}
            <Button
                size="sm"
                variant="outline"
                onClick={triggerManualSync}
                disabled={!syncStatus.isOnline || syncStatus.syncingRooms.length > 0}
                className="h-8 px-2"
            >
                <RefreshCw className="w-3 h-3 mr-1" />
                Sync
            </Button>

            {/* Recent Activity */}
            {syncStatus.recentlySynced.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-stone-500">
                    <span>Recientes:</span>
                    {syncStatus.recentlySynced.map(roomId => (
                        <Badge key={roomId} variant="outline" className="text-xs">
                            {roomId}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}
