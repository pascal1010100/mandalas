"use client"

import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Wrench, SprayCan, LucideIcon } from "lucide-react"

export default function HousekeepingPage() {
    const { rooms, updateRoomStatus } = useAppStore()

    const handleStatusChange = (roomId: string, newStatus: 'clean' | 'dirty' | 'maintenance') => {
        updateRoomStatus(roomId, newStatus)
    }

    interface StatusButtonProps {
        currentStatus: string | undefined;
        statusType: string;
        onClick: () => void;
        icon: LucideIcon;
        label: string;
        colorClass: string;
    }

    const StatusButton = ({ currentStatus, statusType, onClick, icon: Icon, label, colorClass }: StatusButtonProps) => {
        const isActive = currentStatus === statusType
        return (
            <Button
                variant={isActive ? "default" : "outline"}
                size="lg"
                className={cn(
                    "flex-1 h-14 text-sm font-medium transition-all duration-300",
                    isActive ? colorClass : "text-stone-400 border-stone-200 dark:border-stone-800",
                    !isActive && "hover:bg-stone-50 dark:hover:bg-stone-900"
                )}
                onClick={onClick}
            >
                <Icon className={cn("w-4 h-4 mr-2", isActive && "animate-pulse")} />
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

        return (
            <Card className={cn(
                "overflow-hidden transition-all duration-500",
                isClean ? "border-emerald-100 dark:border-emerald-900/30" :
                    isDirty ? "border-rose-100 dark:border-rose-900/30" : "border-stone-200"
            )}>
                <CardContent className="p-0">
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                                {room.label}
                            </h3>
                            <p className="text-xs uppercase tracking-widest font-medium text-stone-400 mt-1">
                                {room.type === 'dorm' ? 'Dormitorio' : 'Privada'} • {room.location}
                            </p>
                        </div>
                        <Badge className={cn("uppercase tracking-widest text-[10px] px-3 py-1", statusColors[room.housekeeping_status as keyof typeof statusColors])}>
                            {room.housekeeping_status === 'clean' ? 'Limpia' :
                                room.housekeeping_status === 'dirty' ? 'Sucia' : 'Mantenimiento'}
                        </Badge>
                    </div>

                    {/* Action Bar */}
                    <div className="flex gap-2 p-2 bg-stone-50 dark:bg-stone-900/50">
                        <StatusButton
                            currentStatus={room.housekeeping_status}
                            statusType="clean"
                            onClick={() => handleStatusChange(room.id, 'clean')}
                            icon={Check}
                            label="Limpia"
                            colorClass="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500"
                        />
                        <StatusButton
                            currentStatus={room.housekeeping_status}
                            statusType="dirty"
                            onClick={() => handleStatusChange(room.id, 'dirty')}
                            icon={SprayCan}
                            label="Sucia"
                            colorClass="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 ring-1 ring-rose-500"
                        />
                        {/* Maintenance is toggled elsewhere usually, but helpful to see/reset here */}
                        <StatusButton
                            currentStatus={room.housekeeping_status}
                            statusType="maintenance"
                            onClick={() => handleStatusChange(room.id, 'maintenance')}
                            icon={Wrench}
                            label="Mant."
                            colorClass="bg-stone-600 hover:bg-stone-700 text-white shadow-lg shadow-stone-500/20"
                        />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-light tracking-tight text-stone-900 dark:text-white font-heading">
                    Limpieza
                    <span className="text-stone-400">.</span>
                </h2>
                <p className="text-stone-500 dark:text-stone-400 font-light text-sm">
                    Gestión de estado de habitaciones en tiempo real.
                </p>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="bg-stone-100/50 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200/50 dark:border-stone-800 p-1 h-auto rounded-full w-full">
                    <TabsTrigger value="all" className="flex-1 rounded-full text-xs font-medium">Todas</TabsTrigger>
                    <TabsTrigger value="pueblo" className="flex-1 rounded-full text-xs font-medium">Pueblo</TabsTrigger>
                    <TabsTrigger value="hideout" className="flex-1 rounded-full text-xs font-medium">Hideout</TabsTrigger>
                </TabsList>

                {['all', 'pueblo', 'hideout'].map(tab => (
                    <TabsContent key={tab} value={tab} className="space-y-4">
                        {rooms
                            ?.filter(r => tab === 'all' || r.location === tab)
                            .map(room => (
                                <RoomCard key={room.id} room={room} />
                            ))}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
