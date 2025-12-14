import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { format, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { LayoutGrid, BedDouble, User } from "lucide-react"

import { Booking, RoomConfig } from "@/lib/store"

interface RoomStatusGridProps {
    onSelectBooking?: (booking: Booking) => void
}

export function RoomStatusGrid({ onSelectBooking }: RoomStatusGridProps) {
    const { rooms, bookings } = useAppStore()

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

        // precise filtering and stable sort by ID to prevent "jumping"
        const activeBookings = bookings.filter(b =>
            (b.roomType === roomConfig.id || b.roomType === roomConfig.type) &&
            b.location.toLowerCase() === roomConfig.location.toLowerCase() &&
            (b.status === 'confirmed' || b.status === 'pending') &&
            (
                (new Date(b.checkIn) <= today && new Date(b.checkOut) > today) ||
                isSameDay(parseISO(b.checkIn), today) ||
                isSameDay(parseISO(b.checkOut), today)
            )
        ).sort((a, b) => a.id.localeCompare(b.id))

        const units = []
        for (let i = 0; i < roomConfig.capacity; i++) {
            const booking = activeBookings[i]
            let status = 'available'
            let guestName = ''

            if (booking) {
                const isCheckOutToday = isSameDay(parseISO(booking.checkOut), today)
                const isCheckInToday = isSameDay(parseISO(booking.checkIn), today)

                if (isCheckOutToday) status = 'checkout'
                else if (isCheckInToday) status = 'checkin'
                else status = 'occupied'

                // Override for pending
                if (booking.status === 'pending') status = 'pending'

                guestName = booking.guestName
            }

            // Generate logical label based on type
            let label = ''
            if (roomConfig.type === 'dorm') label = `C${i + 1}`
            if (roomConfig.type === 'private') label = `H${i + 1}`
            if (roomConfig.type === 'suite') label = `STE`

            // If multiple rooms of same type (e.g. 2 private rooms), we might need better logic if they were separate rows in DB
            // But currently rooms are aggregated by config. 
            // IMPROVEMENT: If we ever split room configs (e.g. Private 1, Private 2), this loop would be size 1.

            units.push({ id: `${roomConfig.id}-${i}`, status, guestName, label, booking })
        }
        return units
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
                                onClick={() => unit.booking && onSelectBooking?.(unit.booking)}
                                title={unit.guestName ? `${unit.guestName} (${room.label})` : room.label}
                                className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-lg border flex flex-col items-center justify-center p-1 transition-all hover:scale-105 relative overflow-hidden group shadow-sm",
                                    unit.booking ? "cursor-pointer" : "cursor-default",
                                    unit.status === 'available' && "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-300",
                                    unit.status === 'occupied' && "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-900/20 dark:border-rose-900/30",
                                    unit.status === 'checkout' && "bg-amber-50 border-amber-100 text-amber-500 dark:bg-amber-900/20 dark:border-amber-900/30",
                                    unit.status === 'checkin' && "bg-blue-50 border-blue-100 text-blue-500 dark:bg-blue-900/20 dark:border-blue-900/30",
                                    unit.status === 'pending' && "bg-orange-50 border-orange-100 text-orange-500 dark:bg-orange-900/20 dark:border-orange-900/30 border-dashed",
                                )}
                            >
                                <span className="text-[9px] font-bold uppercase opacity-60">
                                    {unit.label}
                                </span>
                                {unit.status !== 'available' ? (
                                    <User className="w-4 h-4" />
                                ) : (
                                    <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
                                )}

                                {unit.status !== 'available' && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <span className="text-[8px] text-white font-bold text-center px-1 truncate w-full">
                                            {unit.guestName.split(' ')[0]}
                                        </span>
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
                    <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-wider text-stone-500">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-stone-200" /> Libre</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> Ocupado</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /> Salida</span>
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
                        {renderRoomSection("Dormitorios", groupedRooms.pueblo.dorms, "bg-amber-500/30")}
                        {renderRoomSection("Privadas", groupedRooms.pueblo.privates, "bg-amber-500/30")}
                        {renderRoomSection("Suites", groupedRooms.pueblo.suites, "bg-amber-500/30")}
                    </div>

                    {/* Hideout Column */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Hideout
                        </h4>
                        {renderRoomSection("Dormitorios", groupedRooms.hideout.dorms, "bg-emerald-500/30")}
                        {renderRoomSection("Privadas", groupedRooms.hideout.privates, "bg-emerald-500/30")}
                        {renderRoomSection("Suites", groupedRooms.hideout.suites, "bg-emerald-500/30")}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
