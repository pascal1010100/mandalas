"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
    RefreshCw, 
    ExternalLink, 
    Copy, 
    CheckCircle, 
    AlertCircle, 
    Clock,
    Calendar,
    Settings,
    Info,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface SyncStatus {
    roomId: string
    status: 'idle' | 'syncing' | 'success' | 'error'
    lastSync?: Date
    message?: string
    progress?: number
}

export function IcalSyncManager() {
    const { rooms, updateRoomIcalUrl: updateRoomIcalUrlInStore } = useAppStore()
    const [syncStatus, setSyncStatus] = useState<Record<string, SyncStatus>>({})
    const [isGlobalSyncing, setIsGlobalSyncing] = useState(false)
    const [globalProgress, setGlobalProgress] = useState(0)

    // Initialize sync status for rooms with iCal URLs
    useEffect(() => {
        const initialStatus: Record<string, SyncStatus> = {}
        rooms.forEach(room => {
            if (room.icalImportUrl) {
                initialStatus[room.id] = {
                    roomId: room.id,
                    status: 'idle',
                    lastSync: new Date() // This would come from DB in real implementation
                }
            }
        })
        setSyncStatus(initialStatus)
    }, [rooms])

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success("Enlace copiado al portapapeles")
        } catch (error) {
            toast.error("Error al copiar enlace")
        }
    }

    const getIcalExportUrl = (token?: string) => {
        if (!token) return "Generando enlace..."
        if (typeof window === 'undefined') return ""
        return `${window.location.origin}/api/ical/${token}`
    }

    const handleUpdateRoomIcalUrl = (roomId: string, url: string) => {
        updateRoomIcalUrlInStore(roomId, url)
        setSyncStatus(prev => ({
            ...prev,
            [roomId]: { ...prev[roomId], status: 'idle' }
        }))
    }

    const syncSingleRoom = async (roomId: string, importUrl?: string) => {
        const room = rooms.find(r => r.id === roomId)
        if (!room?.icalImportUrl && !importUrl) {
            toast.error("Esta habitación no tiene URL de importación configurada")
            return
        }

        if (!room) {
            toast.error("Habitación no encontrada")
            return
        }

        setSyncStatus(prev => ({
            ...prev,
            [roomId]: {
                roomId,
                status: 'syncing',
                progress: 0
            }
        }))

        try {
            const toastId = toast.loading(`Sincronizando ${room.label}...`)
            
            // Simulate progress
            const progressInterval = setInterval(() => {
                setSyncStatus(prev => {
                    const current = prev[roomId]?.progress || 0
                    return {
                        ...prev,
                        [roomId]: {
                            ...prev[roomId],
                            progress: Math.min(current + 20, 90)
                        }
                    }
                })
            }, 200)

            const res = await fetch('/api/admin/sync-ical', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    roomId, 
                    importUrl: importUrl || room.icalImportUrl 
                })
            })

            clearInterval(progressInterval)

            if (!res.ok) {
                throw new Error(await res.text())
            }

            const data = await res.json()
            
            setSyncStatus(prev => ({
                ...prev,
                [roomId]: {
                    roomId,
                    status: 'success',
                    lastSync: new Date(),
                    message: `${data.imported} eventos importados`,
                    progress: 100
                }
            }))

            toast.dismiss(toastId)
            toast.success(`${room.label}: ${data.message}`)
            
            // Clear success status after 3 seconds
            setTimeout(() => {
                setSyncStatus(prev => ({
                    ...prev,
                    [roomId]: {
                        ...prev[roomId],
                        status: 'idle',
                        progress: undefined
                    }
                }))
            }, 3000)

        } catch (error) {
            console.error('Sync error:', error)
            setSyncStatus(prev => ({
                ...prev,
                [roomId]: {
                    roomId,
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Error desconocido',
                    progress: 0
                }
            }))
            
            toast.error(`Error sincronizando ${room?.label || roomId}`)
        }
    }

    const syncAllRooms = async () => {
        const roomsWithIcal = rooms.filter(r => r.icalImportUrl)
        if (roomsWithIcal.length === 0) {
            toast.info("No hay habitaciones con URL de importación configurada")
            return
        }

        setIsGlobalSyncing(true)
        setGlobalProgress(0)

        try {
            const toastId = toast.loading("Sincronizando todas las habitaciones...")
            
            for (let i = 0; i < roomsWithIcal.length; i++) {
                const room = roomsWithIcal[i]
                if (room) {
                    setGlobalProgress((i / roomsWithIcal.length) * 100)
                    await syncSingleRoom(room.id)
                }
            }

            setGlobalProgress(100)
            toast.dismiss(toastId)
            toast.success(`Sincronización completada: ${roomsWithIcal.length} habitaciones`)

        } catch (error) {
            toast.error("Error en sincronización global")
        } finally {
            setIsGlobalSyncing(false)
            setTimeout(() => setGlobalProgress(0), 2000)
        }
    }

    const getStatusIcon = (status: SyncStatus['status']) => {
        switch (status) {
            case 'syncing':
                return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />
            default:
                return <Clock className="w-4 h-4 text-gray-400" />
        }
    }

    const getStatusBadge = (status: SyncStatus['status']) => {
        switch (status) {
            case 'syncing':
                return <Badge variant="default" className="bg-blue-500">Sincronizando</Badge>
            case 'success':
                return <Badge variant="default" className="bg-green-500">Actualizado</Badge>
            case 'error':
                return <Badge variant="destructive">Error</Badge>
            default:
                return <Badge variant="secondary">Pendiente</Badge>
        }
    }

    const roomsWithIcal = rooms.filter(room => room.icalImportUrl || room.icalExportToken)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <RefreshCw className="w-6 h-6" />
                        Sincronización iCal
                    </h2>
                    <p className="text-stone-600 dark:text-stone-400 mt-1">
                        Gestiona la sincronización con plataformas de booking externas
                    </p>
                </div>
                
                <Button 
                    onClick={syncAllRooms}
                    disabled={isGlobalSyncing || roomsWithIcal.length === 0}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    {isGlobalSyncing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sincronizando...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sincronizar Todo
                        </>
                    )}
                </Button>
            </div>

            {/* Global Progress */}
            {isGlobalSyncing && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progreso global</span>
                                <span>{Math.round(globalProgress)}%</span>
                            </div>
                            <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                                <div 
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${globalProgress}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Alert */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                            <strong>Import:</strong> Sincroniza reservas desde Booking.com u otras plataformas usando URLs iCal. 
                            <br />
                            <strong>Export:</strong> Genera URLs para que plataformas externas puedan leer tus disponibilidades.
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rooms Grid */}
            <div className="grid gap-4">
                {roomsWithIcal.map(room => {
                    const status = syncStatus[room.id]
                    const hasImport = !!room.icalImportUrl
                    const hasExport = !!room.icalExportToken

                    return (
                        <Card key={room.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <CardTitle className="text-lg">{room.label}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {room.location === 'pueblo' ? 'Pueblo' : 'Hideout'}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {room.type}
                                                </Badge>
                                                {status && getStatusBadge(status.status)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {status && getStatusIcon(status.status)}
                                        <Button
                                            size="sm"
                                            onClick={() => syncSingleRoom(room.id)}
                                            disabled={!hasImport || status?.status === 'syncing'}
                                            variant={hasImport ? "default" : "outline"}
                                        >
                                            {status?.status === 'syncing' ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {status?.progress !== undefined && (
                                    <div className="mt-2">
                                        <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-1">
                                            <div 
                                                className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
                                                style={{ width: `${status.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Status Message */}
                                {status?.message && (
                                    <div className={cn(
                                        "text-sm mt-2",
                                        status.status === 'error' ? "text-red-600" : "text-green-600"
                                    )}>
                                        {status.message}
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Import Section */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Importar (Booking.com → Mandalas)
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="https://admin.booking.com/ical/..."
                                                value={room.icalImportUrl || ''}
                                                onChange={(e) => handleUpdateRoomIcalUrl(room.id, e.target.value)}
                                                className="text-sm"
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => syncSingleRoom(room.id)}
                                                disabled={!room.icalImportUrl}
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {!hasImport && (
                                            <p className="text-xs text-stone-500">
                                                Configura URL para importar reservas externas
                                            </p>
                                        )}
                                    </div>

                                    {/* Export Section */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <ExternalLink className="w-4 h-4" />
                                            Exportar (Mandalas → Booking.com)
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                readOnly
                                                value={getIcalExportUrl(room.icalExportToken)}
                                                className="pr-20 text-sm font-mono bg-stone-50 dark:bg-stone-900"
                                            />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="absolute right-1 top-1 h-7"
                                                onClick={() => copyToClipboard(getIcalExportUrl(room.icalExportToken))}
                                            >
                                                <Copy className="w-3 h-3 mr-1" />
                                                Copiar
                                            </Button>
                                        </div>
                                        {hasExport && (
                                            <p className="text-xs text-green-600">
                                                ✅ URL activa para exportación
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Last Sync Info */}
                                {status?.lastSync && (
                                    <div className="text-xs text-stone-500 border-t pt-2">
                                        Última sincronización: {status.lastSync.toLocaleString()}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}

                {roomsWithIcal.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Calendar className="w-12 h-12 mx-auto text-stone-400 mb-4" />
                            <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
                                Sin configuración iCal
                            </h3>
                            <p className="text-stone-600 dark:text-stone-400">
                                No hay habitaciones con URLs iCal configuradas
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
