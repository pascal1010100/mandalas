import { Fragment, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { format, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { LayoutGrid, BedDouble, User, Brush, Hammer, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Booking, RoomConfig } from "@/lib/store"

interface RoomStatusGridProps {
    onSelectBooking?: (booking: Booking) => void
}

export function RoomStatusGrid({ onSelectBooking }: RoomStatusGridProps) {
    const { rooms, bookings, blockUnit, unblockUnit, updateRoomStatus } = useAppStore()
    const [isHousekeepingMode, setIsHousekeepingMode] = useState(false)

    // Helper: Group rooms by location
    const groupedRooms = {
        pueblo: {
            dorms: rooms.filter(r => r.location === 'pueblo' && r.type === 'dorm'),
            privates: rooms.filter(r => r.location === 'pueblo' && r.type === 'private'),
            suites: rooms.filter(r => r.location === 'pueblo' && r.type === 'suite'),
        },
        hideout: {
            dorms: rooms.filter(r => r.location === 'hideout' && r.type === 'dorm'),
            privates: rooms.filter(r => r.location === 'hideout' && r.type === 'private'),
            suites: rooms.filter(r => r.location === 'hideout' && r.type === 'suite'),
        }
    }

    // Helper: Get units with stable sorting
    const getRoomUnits = (roomConfig: RoomConfig) => {
        const today = new Date()

        // precise filtering
        const activeBookings = bookings.filter(b =>
            (b.roomType === roomConfig.id || b.roomType === roomConfig.type) &&
            b.location.toLowerCase() === roomConfig.location.toLowerCase() &&
            (b.status === 'confirmed' || b.status === 'pending' || b.status === 'maintenance') &&
            (
                (new Date(b.checkIn) <= today && new Date(b.checkOut) > today) ||
                isSameDay(parseISO(b.checkIn), today) ||
                isSameDay(parseISO(b.checkOut), today)
            )
        )

        // Initialize empty units
        const units = Array.from({ length: roomConfig.capacity }, (_, i) => {
            // Default label logic
            let label = ''
            if (roomConfig.type === 'dorm') label = `C${i + 1}`
            if (roomConfig.type === 'private') label = `H${i + 1}`
            if (roomConfig.type === 'suite') label = `STE`

            return {
                id: `${roomConfig.id}-${i}`,
                unitId: (i + 1).toString(), // The logical ID of this unit
                status: 'available',
                guestName: '',
                label,
                booking: undefined as Booking | undefined,
                housekeeping: roomConfig.housekeeping_status || 'clean'
            }
        })

        // 1. Assign bookings with specific unitId
        const unassignedBookings: Booking[] = []

        activeBookings.forEach(booking => {
            if (booking.unitId) {
                const index = parseInt(booking.unitId) - 1
                if (index >= 0 && index < roomConfig.capacity) {
                    // Assign to specific slot
                    units[index].booking = booking
                } else {
                    // Invalid unitId, fallback to unassigned
                    unassignedBookings.push(booking)
                }
            } else {
                unassignedBookings.push(booking)
            }
        })

        // 2. Fill remaining empty slots with unassigned bookings
        let unassignedIndex = 0
        units.forEach(unit => {
            if (!unit.booking && unassignedIndex < unassignedBookings.length) {
                unit.booking = unassignedBookings[unassignedIndex]
                unassignedIndex++
            }
        })

        // 3. Compute status/display for each unit
        return units.map(unit => {
            if (!unit.booking) return unit // Still available

            const booking = unit.booking
            let status = 'occupied'
            let guestName = booking.guestName

            const isCheckOutToday = isSameDay(parseISO(booking.checkOut), today)
            const isCheckInToday = isSameDay(parseISO(booking.checkIn), today)

            if (isCheckOutToday) status = 'checkout'
            else if (isCheckInToday) status = 'checkin'

            if (booking.status === 'pending') status = 'pending'

            if (booking.status === 'maintenance') {
                status = 'maintenance'
                guestName = 'M'
            }

            return { ...unit, status, guestName }
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUnitClick = (room: RoomConfig, unit: any) => {
        if (isHousekeepingMode) {
            // Toggle Logic: Clean -> Dirty -> Maintenance -> Clean
            const current = room.housekeeping_status || 'clean'
            let next: 'clean' | 'dirty' | 'maintenance' = 'dirty'
            if (current === 'dirty') next = 'maintenance'
            if (current === 'maintenance') next = 'clean'

            updateRoomStatus(room.id, next)
            return
        }

        if (unit.status === 'available') {
            // Block specific unit (e.g. "1", "2")
            blockUnit(room.id, room.location, unit.unitId)
        } else if (unit.status === 'maintenance' && unit.booking) {
            unblockUnit(unit.booking.id)
        } else if (unit.booking && onSelectBooking) {
            onSelectBooking(unit.booking)
        }
    }

    const renderRoomSection = (title: string, roomsList: typeof rooms, colorClass: string) => {
        if (roomsList.length === 0) return null
        return (
            <div className="mb-4 last:mb-0">
                <h5 className="text-[10px] font-bold uppercase text-stone-400 mb-2 pl-1 flex items-center gap-2">
                    {title}
                </h5>
                <div className="flex flex-wrap gap-2">
                    {roomsList.map(room => (
                        getRoomUnits(room).map((unit, idx) => (
                            <div
                                key={unit.id}
                                onClick={() => handleUnitClick(room, unit)}
                                title={unit.status === 'maintenance' ? 'Mantenimiento (Click para Habilitar)' : (unit.guestName ? `${unit.guestName} (${room.label})` : room.label)}
                                className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-lg border flex flex-col items-center justify-center p-1 transition-all hover:scale-105 relative overflow-hidden group shadow-sm",
                                    isHousekeepingMode && "ring-2 ring-primary ring-offset-2 cursor-pointer",
                                    // Status Colors
                                    unit.booking ? "cursor-pointer" : "cursor-default",
                                    unit.status === 'available' && "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-300",
                                    unit.status === 'occupied' && "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-900/20 dark:border-rose-900/30",
                                    unit.status === 'checkout' && "bg-amber-50 border-amber-100 text-amber-500 dark:bg-amber-900/20 dark:border-amber-900/30",
                                    unit.status === 'checkin' && "bg-blue-50 border-blue-100 text-blue-500 dark:bg-blue-900/20 dark:border-blue-900/30",
                                    unit.status === 'pending' && "bg-orange-50 border-orange-100 text-orange-500 dark:bg-orange-900/20 dark:border-orange-900/30 border-dashed",
                                    unit.status === 'maintenance' && "bg-stone-200 border-stone-300 text-stone-500 dark:bg-stone-800 dark:border-stone-700",

                                    // Housekeeping Overrides
                                    room.housekeeping_status === 'dirty' && "border-rose-300 bg-rose-50/50 dark:border-rose-800/50",
                                    room.housekeeping_status === 'maintenance' && "border-stone-400 bg-stone-100 dark:border-stone-600"
                                )
                                }
                            >
                                <span className="text-[9px] font-bold uppercase opacity-60">
                                    {unit.label}
                                </span>
                                {unit.status !== 'available' ? (
                                    <User className="w-4 h-4" />
                                ) : (
                                    <>
                                        {room.housekeeping_status === 'dirty' ? (
                                            <Brush className="w-4 h-4 text-rose-400 animate-pulse" />
                                        ) : room.housekeeping_status === 'maintenance' ? (
                                            <Hammer className="w-4 h-4 text-stone-500" />
                                        ) : (
                                            <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
                                        )}
                                    </>
                                )}

                                {unit.status !== 'available' && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <span className="text-[8px] text-white font-bold text-center px-1 truncate w-full">
                                            {unit.guestName.split(' ')[0]}
                                        </span>
                                    </div>
                                )}

                                {/* Housekeeping Badge Overlay */}
                                {isHousekeepingMode && (
                                    <div className="absolute top-0 right-0 p-0.5">
                                        {room.housekeeping_status === 'dirty' && <div className="w-2 h-2 bg-rose-500 rounded-full" />}
                                        {room.housekeeping_status === 'clean' && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                                        {room.housekeeping_status === 'maintenance' && <div className="w-2 h-2 bg-stone-500 rounded-full" />}
                                    </div>
                                )}
                            </div>
                        ))
                    ))}
                </div>
            </div>
        )
    }

    return (
        <Card className="bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 shadow-sm col-span-1 lg:col-span-2">
            <CardHeader className="pb-4 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold font-heading flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5 text-stone-400" />
                            Grid de Habitaciones
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            En vivo: {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={isHousekeepingMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsHousekeepingMode(!isHousekeepingMode)}
                            className={cn(
                                "flex items-center gap-2 text-xs uppercase font-bold tracking-wider rounded-full transition-all",
                                isHousekeepingMode ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600" : "text-stone-500 border-stone-200"
                            )}
                        >
                            <Brush className="w-3 h-3" />
                            {isHousekeepingMode ? 'Modo Limpieza' : 'Limpieza'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pueblo Column */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500" /> Pueblo
                        </h4>
                        {/* Split specific dorms for clear visibility */}
                        {groupedRooms.pueblo.dorms.map(room => (
                            <Fragment key={room.id}>
                                {renderRoomSection(room.label, [room], "bg-amber-500/30")}
                            </Fragment>
                        ))}
                        {renderRoomSection("Privadas", groupedRooms.pueblo.privates, "bg-amber-500/30")}
                        {renderRoomSection("Suites", groupedRooms.pueblo.suites, "bg-amber-500/30")}
                    </div>

                    {/* Hideout Column */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Hideout
                        </h4>
                        {/* Split specific dorms for clear visibility */}
                        {groupedRooms.hideout.dorms.map(room => (
                            <Fragment key={room.id}>
                                {renderRoomSection(room.label, [room], "bg-emerald-500/30")}
                            </Fragment>
                        ))}
                        {renderRoomSection("Privadas", groupedRooms.hideout.privates, "bg-emerald-500/30")}
                        {renderRoomSection("Suites", groupedRooms.hideout.suites, "bg-emerald-500/30")}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
