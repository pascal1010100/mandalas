"use client"

import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Wrench, SprayCan, LucideIcon, Building2, Palmtree } from "lucide-react"

export default function HousekeepingPage() {
    const { rooms, updateRoomStatus } = useAppStore()

    // 1. Calculate Stats
    const totalRooms = rooms?.length || 0
    const dirtyRooms = rooms?.filter(r => r.housekeeping_status === 'dirty').length || 0
    const cleanRooms = rooms?.filter(r => r.housekeeping_status === 'clean').length || 0

    const handleStatusChange = (roomId: string, newStatus: 'clean' | 'dirty' | 'maintenance', unitId?: string) => {
        updateRoomStatus(roomId, newStatus, unitId)
    }

    interface StatusButtonProps {
        currentStatus: string | undefined;
        statusType: string;
        onClick: () => void;
        icon: LucideIcon;
        label: string;
        colorClass: string;
        size?: "default" | "sm" | "lg" | "icon"
        variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
        className?: string
    }

    const StatusButton = ({ currentStatus, statusType, onClick, icon: Icon, label, colorClass, size = "lg", variant, className }: StatusButtonProps) => {
        const isActive = currentStatus === statusType
        return (
            <Button
                variant={variant || (isActive ? "default" : "outline")}
                size={size}
                className={cn(
                    "font-medium transition-all duration-300",
                    isActive ? colorClass : "text-stone-400 border-stone-200 dark:border-stone-800",
                    !isActive && "hover:bg-stone-50 dark:hover:bg-stone-900",
                    className
                )}
                onClick={onClick}
            >
                <Icon className={cn("w-3 h-3 mr-2", isActive && "animate-pulse")} />
                {label}
            </Button>
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const RoomCard = ({ room }: { room: any }) => {
        const statusColors = {
            clean: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
            dirty: 'bg-rose-500/10 text-rose-600 border-rose-200',
            maintenance: 'bg-stone-500/10 text-stone-600 border-stone-200'
        }

        const isClean = room.housekeeping_status === 'clean'
        const isDirty = room.housekeeping_status === 'dirty'

        // Generate Units
        const units = Array.from({ length: room.capacity }, (_, i) => {
            const unitId = (i + 1).toString()
            return {
                id: unitId,
                label: room.type === 'dorm' ? `C${unitId}` : (room.capacity > 1 ? `U${unitId}` : room.label),
                status: room.units_housekeeping?.[unitId] || room.housekeeping_status || 'clean'
            }
        })

        return (
            <Card className={cn(
                "overflow-hidden transition-all duration-500 bg-white/60 dark:bg-stone-900/40 backdrop-blur-xl",
                isClean ? "border-emerald-100 dark:border-emerald-900/30" :
                    isDirty ? "border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-900/10" : "border-stone-200"
            )}>
                <CardContent className="p-0">
                    <div className="p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                                    {room.label}
                                </h3>
                                <p className="text-xs uppercase tracking-widest font-medium text-stone-400 mt-1">
                                    {room.type === 'dorm' ? 'Dormitorio' : 'Privada'} • {room.location}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {/* Global Status Badge (Summary) */}
                                <Badge className={cn("uppercase tracking-widest text-[10px] px-3 py-1", statusColors[room.housekeeping_status as keyof typeof statusColors])}>
                                    {room.housekeeping_status === 'clean' ? 'Limpia' :
                                        room.housekeeping_status === 'dirty' ? 'Sucia' : 'Mantenimiento'}
                                </Badge>
                            </div>
                        </div>

                        {/* Units Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {units.map(unit => (
                                <div key={unit.id} className="flex items-center justify-between p-2 rounded-lg border bg-stone-50/50 dark:bg-stone-950/30 border-stone-100 dark:border-stone-800">
                                    <span className="text-xs font-bold text-stone-500">{unit.label}</span>
                                    <div className="flex gap-1">
                                        {/* Mini Toggles for Unit */}
                                        <Button
                                            size="icon"
                                            variant={unit.status === 'clean' ? 'default' : 'ghost'}
                                            className={cn("w-6 h-6", unit.status === 'clean' && "bg-emerald-500 hover:bg-emerald-600 border-none")}
                                            onClick={() => handleStatusChange(room.id, 'clean', unit.id)}
                                            title="Marcar Limpia"
                                        >
                                            <Check className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant={unit.status === 'dirty' ? 'default' : 'ghost'}
                                            className={cn("w-6 h-6", unit.status === 'dirty' && "bg-rose-500 hover:bg-rose-600 border-none")}
                                            onClick={() => handleStatusChange(room.id, 'dirty', unit.id)}
                                            title="Marcar Sucia"
                                        >
                                            <SprayCan className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Room Level Bulk Action Bar - Optional or for override */}
                    <div className="flex gap-2 p-2 bg-stone-50/50 dark:bg-stone-950/50 border-t border-stone-100 dark:border-stone-800">
                        <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center px-2">Global:</span>
                        <StatusButton
                            currentStatus={room.housekeeping_status}
                            statusType="clean"
                            onClick={() => handleStatusChange(room.id, 'clean')}
                            icon={Check}
                            label="Todo Limpio"
                            colorClass="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500"
                            className="flex-1 h-8 text-[10px]"
                        />
                        <StatusButton
                            currentStatus={room.housekeeping_status}
                            statusType="dirty"
                            onClick={() => handleStatusChange(room.id, 'dirty')}
                            icon={SprayCan}
                            label="Todo Sucio"
                            colorClass="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 ring-1 ring-rose-500"
                            className="flex-1 h-8 text-[10px]"
                        />
                        <StatusButton
                            currentStatus={room.housekeeping_status}
                            statusType="maintenance"
                            onClick={() => handleStatusChange(room.id, 'maintenance')}
                            icon={Wrench}
                            label="Mant."
                            colorClass="bg-stone-600 hover:bg-stone-700 text-white shadow-lg shadow-stone-500/20"
                            className="flex-1 h-8 text-[10px]"
                        />
                    </div>
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
                    <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-rose-600 dark:text-rose-500">{dirtyRooms}</span>
                            <span className="text-[10px] uppercase tracking-widest text-rose-600/70 font-bold">Por Limpiar</span>
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

            <Tabs defaultValue={dirtyRooms > 0 ? "attention" : "all"} className="space-y-6">
                <TabsList className="bg-stone-100/50 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200/50 dark:border-stone-800 p-1 h-auto rounded-full w-full sticky top-2 z-10 shadow-sm">
                    <TabsTrigger value="attention" className="flex-1 rounded-full text-xs font-medium data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-colors duration-500">
                        🚨 Prioridad ({dirtyRooms})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex-1 rounded-full text-xs font-medium">Todas</TabsTrigger>
                    <TabsTrigger value="pueblo" className="flex-1 rounded-full text-xs font-medium data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all duration-500">
                        <Building2 className="w-3 h-3 mr-1" /> Pueblo
                    </TabsTrigger>
                    <TabsTrigger value="hideout" className="flex-1 rounded-full text-xs font-medium data-[state=active]:bg-cyan-600 data-[state=active]:text-white transition-all duration-500">
                        <Palmtree className="w-3 h-3 mr-1" /> Hideout
                    </TabsTrigger>
                </TabsList>

                {/* Special "Attention" Tab */}
                <TabsContent value="attention" className="space-y-4 min-h-[50vh]">
                    {dirtyRooms === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-stone-400">
                            <Check className="w-12 h-12 mb-2 text-emerald-300 opacity-50" />
                            <p>Todo está impecable.</p>
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
