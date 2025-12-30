"use client"

import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Wrench, SprayCan, Building2, Palmtree, Clock, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default function HousekeepingPage() {
    const { rooms, updateRoomStatus, serviceRequests, updateServiceRequestStatus } = useAppStore()

    // 0. Auto-fetch requests
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activeRequests = serviceRequests?.filter((r: any) => r.type === 'cleaning' && r.status === 'pending') || []

    // 1. Calculate Stats
    // const totalRooms = rooms?.length || 0
    const dirtyRooms = rooms?.filter(r => r.housekeeping_status === 'dirty').length || 0
    const cleanRooms = rooms?.filter(r => r.housekeeping_status === 'clean').length || 0

    const handleStatusChange = (roomId: string, newStatus: 'clean' | 'dirty' | 'maintenance', unitId?: string, note?: string) => {
        updateRoomStatus(roomId, newStatus, unitId, note)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const RoomCard = ({ room }: { room: any }) => {
        const isClean = room.housekeeping_status === 'clean'
        const isDirty = room.housekeeping_status === 'dirty'

        // Generate Units
        const units = Array.from({ length: room.capacity }, (_, i) => {
            const unitId = (i + 1).toString()
            return {
                id: unitId,
                label: room.type === 'dorm' ? `Cama ${unitId}` : (room.capacity > 1 ? `Unidad ${unitId}` : room.label),
                status: room.units_housekeeping?.[unitId] || room.housekeeping_status || 'clean'
            }
        })

        const dirtyUnitsCount = units.filter(u => u.status === 'dirty').length

        return (
            <Card className={cn(
                "overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md",
                isClean ? "bg-white/50 border-emerald-200/50 dark:bg-stone-900/50 dark:border-emerald-900/30" :
                    "bg-stone-50 border-stone-200 dark:bg-stone-900 dark:border-stone-800"
            )}>
                {/* Maintenance Note Overlay */}
                {room.housekeeping_status === 'maintenance' && room.maintenance_note && (
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 text-xs text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="font-medium truncate">{room.maintenance_note}</span>
                    </div>
                )}

                {/* Header Strip - Visual Status Indicator */}
                <div className={cn("h-1 w-full",
                    isClean ? "bg-emerald-500" : isDirty ? "bg-rose-500" : "bg-stone-400"
                )} />

                <CardContent className="p-0">
                    <div className="p-4 space-y-4">
                        {/* Title & Badge Row */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                    {room.label}
                                    {room.type === 'dorm' && <Badge variant="secondary" className="text-[9px] font-mono opacity-70">DORM</Badge>}
                                </h3>
                                <p className="text-xs text-stone-500 font-medium mt-0.5 flex items-center gap-1">
                                    {room.location === 'hideout' ? <Palmtree className="w-3 h-3 text-cyan-500" /> : <Building2 className="w-3 h-3 text-orange-500" />}
                                    <span className="uppercase tracking-wider opacity-80">{room.location}</span>
                                    {isClean && room.last_cleaned_at && (
                                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 ml-2 border-l pl-2 border-stone-300 dark:border-stone-700">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(room.last_cleaned_at), { locale: es, addSuffix: true })}
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Master Switch */}
                            {room.type !== 'dorm' ? (
                                <div className="flex bg-stone-100 dark:bg-stone-950 rounded-lg p-1 border border-stone-200 dark:border-stone-800">
                                    <button
                                        onClick={() => handleStatusChange(room.id, 'clean')}
                                        className={cn("p-2 rounded-md transition-all", isClean ? "bg-emerald-500 text-white shadow-sm" : "text-stone-400 hover:text-stone-600")}
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(room.id, 'dirty')}
                                        className={cn("p-2 rounded-md transition-all", isDirty ? "bg-rose-500 text-white shadow-sm" : "text-stone-400 hover:text-stone-600")}
                                        title="Marcar Sucio"
                                    >
                                        <SprayCan className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const note = window.prompt("Descripción del problema (opcional):", room.maintenance_note || "")
                                            if (note !== null) {
                                                handleStatusChange(room.id, 'maintenance', undefined, note)
                                            }
                                        }}
                                        className={cn("p-2 rounded-md transition-all", room.housekeeping_status === 'maintenance' ? "bg-amber-500 text-white shadow-sm" : "text-stone-400 hover:text-stone-600")}
                                        title="Mantenimiento"
                                    >
                                        <Wrench className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-right">
                                    <Badge variant={dirtyUnitsCount === 0 ? "default" : "destructive"} className={cn("mb-1", dirtyUnitsCount === 0 && "bg-emerald-500 hover:bg-emerald-600")}>
                                        {dirtyUnitsCount === 0 ? "Listo" : `${dirtyUnitsCount} Pendientes`}
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Unit/Bed Grid (Only for Dorms or Multi-unit) */}
                        {room.type === 'dorm' && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {units.map(unit => {
                                    const isUnitDirty = unit.status === 'dirty'
                                    return (
                                        <button
                                            key={unit.id}
                                            onClick={() => handleStatusChange(room.id, isUnitDirty ? 'clean' : 'dirty', unit.id)}
                                            className={cn(
                                                "relative flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200",
                                                isUnitDirty
                                                    ? "bg-rose-50 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50"
                                                    : "bg-emerald-50/50 border-emerald-100/50 hover:bg-emerald-100/50 dark:bg-emerald-950/10 dark:border-emerald-900/20"
                                            )}
                                        >
                                            <span className="text-xs font-bold text-stone-600 dark:text-stone-300">{unit.label}</span>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                isUnitDirty ? "bg-rose-500 animate-pulse" : "bg-emerald-400"
                                            )} />
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {/* Dorm Quick Actions Footer */}
                        {room.type === 'dorm' && dirtyUnitsCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-900 dark:text-emerald-400"
                                onClick={() => handleStatusChange(room.id, 'clean')}
                            >
                                <Check className="w-3 h-3 mr-1.5" /> Marcar Todo Limpio
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const GuestRequestCard = ({ request }: { request: any }) => {
        return (
            <Card className="bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800 mb-4 animate-in slide-in-from-top-2">
                <CardContent className="p-4 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 border-none text-[10px]">
                                Solicitud de Huésped
                            </Badge>
                            <span className="text-xs text-stone-500 font-mono">
                                {formatDistanceToNow(new Date(request.created_at), { locale: es, addSuffix: true })}
                            </span>
                        </div>
                        <p className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                            {request.description || "Limpieza solicitada"}
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                            if (window.confirm("¿Marcar solicitud como completada?")) {
                                updateServiceRequestStatus(request.id, 'completed')
                            }
                        }}
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Completar
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Stats */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-light tracking-tight text-stone-900 dark:text-white font-heading">
                            Limpieza
                            <span className="text-stone-400">.</span>
                        </h2>
                        <p className="text-stone-500 dark:text-stone-400 font-light text-sm">
                            Control en tiempo real.
                        </p>
                    </div>
                    {dirtyRooms === 0 && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse">
                            ✨ Todo Limpio ✨
                        </Badge>
                    )}
                </div>

                {/* KPI Grid - Mobile First */}
                <div className="grid grid-cols-2 gap-3">
                    <Card className={cn("border transition-colors",
                        (dirtyRooms > 0 || activeRequests.length > 0) ? "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30" : "bg-stone-50 border-stone-100"
                    )}>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <span className={cn("text-3xl font-bold", (dirtyRooms > 0 || activeRequests.length > 0) ? "text-rose-600 dark:text-rose-500" : "text-stone-400")}>
                                {dirtyRooms + activeRequests.length}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-rose-600/70 font-bold">Por Atender</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">{cleanRooms}</span>
                            <span className="text-[10px] uppercase tracking-widest text-emerald-600/70 font-bold">Listas</span>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Tabs defaultValue={(dirtyRooms > 0 || activeRequests.length > 0) ? "attention" : "all"} className="space-y-6">
                <TabsList className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200/50 dark:border-stone-800 p-1 h-auto rounded-full w-full sticky top-2 z-10 shadow-sm grid grid-cols-4 gap-1">
                    <TabsTrigger value="attention" className="rounded-full text-xs font-bold data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-colors">
                        🚨 {dirtyRooms + activeRequests.length}
                    </TabsTrigger>
                    <TabsTrigger value="all" className="rounded-full text-xs font-medium">Todas</TabsTrigger>
                    <TabsTrigger value="pueblo" className="rounded-full text-xs font-medium text-orange-700 data-[state=active]:bg-orange-100 dark:text-orange-400 dark:data-[state=active]:bg-orange-900/30">
                        Pueblo
                    </TabsTrigger>
                    <TabsTrigger value="hideout" className="rounded-full text-xs font-medium text-cyan-700 data-[state=active]:bg-cyan-100 dark:text-cyan-400 dark:data-[state=active]:bg-cyan-900/30">
                        Hideout
                    </TabsTrigger>
                </TabsList>

                {/* Special "Attention" Tab */}
                <TabsContent value="attention" className="space-y-4 min-h-[50vh]">
                    {/* Active Guest Requests Section */}
                    {activeRequests.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-top-4">
                            <div className="flex items-center gap-2 pl-1 mb-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Solicitudes Urgentes</h3>
                            </div>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {activeRequests.map((req: any) => (
                                <GuestRequestCard key={req.id} request={req} />
                            ))}
                        </div>
                    )}

                    {(dirtyRooms === 0 && activeRequests.length === 0) ? (
                        <div className="flex flex-col items-center justify-center h-48 text-stone-400 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-900/20">
                            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3 animate-pulse">
                                <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-stone-600 dark:text-stone-300">¡Todo Limpio!</h3>
                            <p className="text-sm">No hay tareas pendientes.</p>
                        </div>
                    ) : (
                        rooms?.filter(r => r.housekeeping_status === 'dirty').map(room => (
                            <RoomCard key={room.id} room={room} />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="all" className="space-y-8">
                    {/* Pueblo Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pl-2">
                            <Building2 className="w-4 h-4 text-stone-400" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">Mandalas (Pueblo)</h3>
                        </div>
                        <div className="grid gap-4">
                            {rooms?.filter(r => r.location === 'pueblo').map(room => (
                                <RoomCard key={room.id} room={room} />
                            ))}
                        </div>
                    </div>

                    {/* Hideout Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pl-2">
                            <Palmtree className="w-4 h-4 text-stone-400" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">Hideout</h3>
                        </div>
                        <div className="grid gap-4">
                            {rooms?.filter(r => r.location === 'hideout').map(room => (
                                <RoomCard key={room.id} room={room} />
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="pueblo" className="space-y-6">
                    {/* Location Header Banner */}
                    <div className="relative overflow-hidden rounded-xl border border-orange-100 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900/30 p-6">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Building2 className="w-32 h-32 text-orange-500" />
                        </div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-full text-orange-600 dark:text-orange-400">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 uppercase tracking-widest">Mandalas Pueblo</h3>
                                <p className="text-orange-700 dark:text-orange-300 text-sm opacity-80">Gestión de limpieza zona central</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {rooms?.filter(r => r.location === 'pueblo').map(room => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="hideout" className="space-y-6">
                    {/* Location Header Banner */}
                    <div className="relative overflow-hidden rounded-xl border border-cyan-100 bg-cyan-50/50 dark:bg-cyan-950/20 dark:border-cyan-900/30 p-6">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Palmtree className="w-32 h-32 text-cyan-500" />
                        </div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/40 rounded-full text-cyan-600 dark:text-cyan-400">
                                <Palmtree className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-cyan-900 dark:text-cyan-100 uppercase tracking-widest">Hideout</h3>
                                <p className="text-cyan-700 dark:text-cyan-300 text-sm opacity-80">Gestión de limpieza zona playa/jardín</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {rooms?.filter(r => r.location === 'hideout').map(room => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
