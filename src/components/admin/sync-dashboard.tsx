"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Activity,
    Calendar,
    Clock,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    RefreshCw,
    BarChart3,
    Wifi,
    WifiOff,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import { useAppStore } from "@/lib/store"

interface SyncStats {
    totalBookings: number
    activeBookings: number
    cancelledBookings: number
    lastSyncTime: string | null
    roomsWithSync: number
    roomsNeedingSync: number
    errors: string[]
    warnings: string[]
}

interface RoomSyncStatus {
    roomId: string
    roomName: string
    lastSync: string | null
    status: 'synced' | 'syncing' | 'error' | 'pending'
    eventCount: number
    hasUrl: boolean
}

export function SyncDashboard() {
    const { rooms } = useAppStore()
    const [stats, setStats] = useState<SyncStats>({
        totalBookings: 0,
        activeBookings: 0,
        cancelledBookings: 0,
        lastSyncTime: null,
        roomsWithSync: 0,
        roomsNeedingSync: 0,
        errors: [],
        warnings: []
    })
    const [roomStatuses, setRoomStatuses] = useState<RoomSyncStatus[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Load initial data
    useEffect(() => {
        loadSyncData()
    }, [rooms])

    const loadSyncData = async () => {
        setIsLoading(true)
        try {
            const roomsWithIcal = rooms.filter(r => r.icalImportUrl)
            const roomStatusPromises = roomsWithIcal.map(async (room) => {
                try {
                    const response = await fetch(`/api/admin/sync-ical?roomId=${room.id}`)
                    const data = await response.json()
                    
                    return {
                        roomId: room.id,
                        roomName: room.label,
                        lastSync: data.success ? data.data.lastSync : null,
                        status: (data.success ? 'synced' : 'error') as 'synced' | 'syncing' | 'error' | 'pending',
                        eventCount: data.success ? data.data.active : 0,
                        hasUrl: !!room.icalImportUrl
                    }
                } catch {
                    return {
                        roomId: room.id,
                        roomName: room.label,
                        lastSync: null,
                        status: 'error' as const,
                        eventCount: 0,
                        hasUrl: !!room.icalImportUrl
                    }
                }
            })

            const roomStatusesData = await Promise.all(roomStatusPromises)
            setRoomStatuses(roomStatusesData)

            // Calculate aggregate stats
            const totalBookings = roomStatusesData.reduce((sum, room) => sum + room.eventCount, 0)
            const roomsWithSync = roomStatusesData.filter(r => r.status === 'synced').length
            const roomsNeedingSync = roomStatusesData.filter(r => r.status === 'error' || r.status === 'pending').length
            const lastSyncTime = roomStatusesData
                .filter(r => r.lastSync)
                .sort((a, b) => new Date(b.lastSync!).getTime() - new Date(a.lastSync!).getTime())[0]?.lastSync || null

            setStats({
                totalBookings,
                activeBookings: totalBookings,
                cancelledBookings: 0, // Would need separate query
                lastSyncTime,
                roomsWithSync,
                roomsNeedingSync,
                errors: roomStatusesData.filter(r => r.status === 'error').map(r => r.roomName),
                warnings: []
            })

        } catch (error) {
            console.error('Failed to load sync data:', error)
            toast.error("Error al cargar datos de sincronización")
        } finally {
            setIsLoading(false)
        }
    }

    const refreshData = async () => {
        setIsRefreshing(true)
        await loadSyncData()
        setIsRefreshing(false)
        toast.success("Datos actualizados")
    }

    const getStatusIcon = (status: RoomSyncStatus['status']) => {
        switch (status) {
            case 'synced':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'syncing':
                return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            case 'error':
                return <AlertTriangle className="w-4 h-4 text-red-500" />
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />
        }
    }

    const getStatusBadge = (status: RoomSyncStatus['status']) => {
        switch (status) {
            case 'synced':
                return <Badge className="bg-green-500">Sincronizado</Badge>
            case 'syncing':
                return <Badge className="bg-blue-500">Sincronizando</Badge>
            case 'error':
                return <Badge variant="destructive">Error</Badge>
            case 'pending':
                return <Badge variant="secondary">Pendiente</Badge>
        }
    }

    const formatLastSync = (dateString: string | null) => {
        if (!dateString) return 'Nunca'
        
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
        
        if (diffInMinutes < 1) return 'Ahora'
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
        if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`
        return `Hace ${Math.floor(diffInMinutes / 1440)} días`
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-stone-600">Cargando datos de sincronización...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-6 h-6" />
                        Dashboard de Sincronización
                    </h2>
                    <p className="text-stone-600 dark:text-stone-400 mt-1">
                        Estado general de la sincronización iCal
                    </p>
                </div>
                
                <Button 
                    onClick={refreshData}
                    disabled={isRefreshing}
                    variant="outline"
                >
                    {isRefreshing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Actualizar
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                                    Habitaciones con Sync
                                </p>
                                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                                    {stats.roomsWithSync}
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-indigo-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                                    Reservas Activas
                                </p>
                                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                                    {stats.activeBookings}
                                </p>
                            </div>
                            <Activity className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                                    Necesitan Atención
                                </p>
                                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                                    {stats.roomsNeedingSync}
                                </p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                                    Última Sincronización
                                </p>
                                <p className="text-lg font-bold text-stone-900 dark:text-stone-100">
                                    {formatLastSync(stats.lastSyncTime)}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-stone-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Room Status Grid */}
            <div className="grid gap-4">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Estado por Habitación
                </h3>
                
                {roomStatuses.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <Calendar className="w-12 h-12 mx-auto text-stone-400 mb-4" />
                            <h4 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
                                Sin habitaciones configuradas
                            </h4>
                            <p className="text-stone-600 dark:text-stone-400">
                                No hay habitaciones con URLs iCal configuradas
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {roomStatuses.map((room) => (
                            <Card key={room.roomId} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(room.status)}
                                            <div>
                                                <h4 className="font-medium text-stone-900 dark:text-stone-100">
                                                    {room.roomName}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {getStatusBadge(room.status)}
                                                    <span className="text-sm text-stone-500">
                                                        {room.eventCount} eventos
                                                    </span>
                                                    {room.lastSync && (
                                                        <span className="text-sm text-stone-500">
                                                            • {formatLastSync(room.lastSync)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            {!room.hasUrl && (
                                                <Badge variant="outline" className="text-xs">
                                                    Sin URL
                                                </Badge>
                                            )}
                                            {room.status === 'error' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        // Trigger sync for this room
                                                        window.location.href = `/admin/settings?tab=ical&room=${room.roomId}`
                                                    }}
                                                >
                                                    Reintentar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Warnings and Errors */}
            {(stats.errors.length > 0 || stats.warnings.length > 0) && (
                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            Advertencias y Errores
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {stats.errors.map((error, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                                <AlertTriangle className="w-4 h-4" />
                                {error}
                            </div>
                        ))}
                        {stats.warnings.map((warning, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-yellow-600">
                                <AlertTriangle className="w-4 h-4" />
                                {warning}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
