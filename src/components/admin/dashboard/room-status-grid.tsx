import { Fragment, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { format, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { LayoutGrid, BedDouble, User, Brush, Hammer, CheckCircle2, Sparkles, SprayCan, Wrench, Clock, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Plus, Ban, Trash2 } from "lucide-react"

import { Booking, RoomConfig } from "@/lib/store"

interface RoomStatusGridProps {
    onSelectBooking?: (booking: Booking) => void
    onNewBooking?: (room: RoomConfig, unitId: string) => void
}

export function RoomStatusGrid({ onSelectBooking, onNewBooking }: RoomStatusGridProps) {
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
                housekeeping: roomConfig.units_housekeeping?.[(i + 1).toString()] || roomConfig.housekeeping_status || 'clean'
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

            // PRIORITY: Verifying Payment (Visible regardless of checkin status if pending)
            if (booking.paymentStatus === 'verifying') status = 'verifying'

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
            // INSTEAD OF BLOCKING, TRIGGER NEW RESERVATION
            if (onNewBooking) {
                onNewBooking(room, unit.unitId)
            }
        } else if (unit.status === 'maintenance' && unit.booking) {
            // Keep unblock logic for now, or maybe make it cleaner?
            // If it's maintenance, maybe open details too?
            // For now, let's leave unblock or remove it if user says so.
            // User complained about "New Reservation" on click.
            // Blocking was the issue. Unblocking is probably fine or should be via context.
            // Let's keep unblock for convenience but maybe add confirmation? 
            // Ideally maintenance management should be in Housekeeping Mode.
            // Let's disable instant unblock too to be consistent?
            // ACTUALLY, if I remove instant block, instant unblock is less dangerous but still weird.
            // Let's rely on Housekeeping mode for status changes.
            // But 'Maintenance' booking is a REAL booking in DB.
            // If I remove unblock here, how do they unblock?
            // Via 'Reservations' list (cancelling the maintenance booking).
            // Let's keep it consistent: Click -> Open Modal (even for maintenance?)
            // No, maintenance booking details.
            // Let's just focus on the 'available' case first.
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
                        getRoomUnits(room).map((unit, idx) => {
                            // Determine interaction wrapper
                            // dynamic components
                            const Container = isHousekeepingMode ? Popover : DropdownMenu
                            const Trigger = isHousekeepingMode ? PopoverTrigger : DropdownMenuTrigger
                            const Content = isHousekeepingMode ? PopoverContent : DropdownMenuContent

                            return (
                                <Container key={unit.id}>
                                    <Trigger asChild>
                                        <div
                                            onClick={(e) => {
                                                if (!isHousekeepingMode && unit.status !== "available") {
                                                    handleUnitClick(room, unit)
                                                }
                                            }}
                                            title={unit.status === "maintenance" ? "Mantenimiento (Click para Habilitar)" : (unit.guestName ? `${unit.guestName} (${room.label})` : room.label)}
                                            className={cn(
                                                "w-10 h-10 md:w-16 md:h-16 rounded-xl border flex flex-col items-center justify-center p-1 transition-all duration-300 relative overflow-hidden group shadow-sm z-0",
                                                isHousekeepingMode
                                                    ? "scale-[1.05] shadow-xl ring-0 cursor-pointer"
                                                    : "hover:scale-105",

                                                // Status Colors (Standard Mode)
                                                !isHousekeepingMode && unit.status === "available" && "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-300 hover:border-stone-400",
                                                !isHousekeepingMode && unit.status === "occupied" && "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-900/20 dark:border-rose-900/30",
                                                !isHousekeepingMode && unit.status === "checkout" && "bg-amber-50 border-amber-100 text-amber-500 dark:bg-amber-900/20 dark:border-amber-900/30",
                                                !isHousekeepingMode && unit.status === "checkin" && "bg-blue-50 border-blue-100 text-blue-500 dark:bg-blue-900/20 dark:border-blue-900/30",
                                                !isHousekeepingMode && unit.status === "pending" && "bg-orange-50 border-orange-100 text-orange-500 dark:bg-orange-900/20 dark:border-orange-900/30 border-dashed",
                                                !isHousekeepingMode && unit.status === "maintenance" && "bg-stone-200 border-stone-300 text-stone-500 dark:bg-stone-800 dark:border-stone-700",

                                                // VERIFYING STATUS (Blue + Pulse)
                                                !isHousekeepingMode && unit.status === "verifying" && "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 animate-pulse border-2 shadow-[0_0_10px_rgba(79,70,229,0.2)]",

                                                // Housekeeping Overrides (The Visual Layer)
                                                isHousekeepingMode && unit.housekeeping === "clean" && "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800",
                                                isHousekeepingMode && unit.housekeeping === "dirty" && "border-rose-300 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800",
                                                isHousekeepingMode && unit.housekeeping === "maintenance" && "border-stone-400 bg-stone-100 dark:border-stone-600 dark:bg-stone-800"
                                            )
                                            }
                                        >
                                            {/* HOUSEKEEPING VISUAL LAYER */}
                                            {isHousekeepingMode ? (
                                                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                                                    {unit.housekeeping === "clean" && (
                                                        <>
                                                            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 mb-0.5 md:mb-1" />
                                                            <span className="text-[6px] md:text-[8px] font-bold uppercase text-emerald-600 tracking-wider">Limpia</span>
                                                        </>
                                                    )}
                                                    {unit.housekeeping === "dirty" && (
                                                        <>
                                                            <SprayCan className="w-5 h-5 md:w-6 md:h-6 text-rose-500 mb-0.5 md:mb-1 animate-pulse" />
                                                            <span className="text-[6px] md:text-[8px] font-bold uppercase text-rose-600 tracking-wider">Sucia</span>
                                                        </>
                                                    )}
                                                    {unit.housekeeping === "maintenance" && (
                                                        <>
                                                            <Wrench className="w-5 h-5 md:w-6 md:h-6 text-stone-500 mb-0.5 md:mb-1" />
                                                            <span className="text-[6px] md:text-[8px] font-bold uppercase text-stone-600 tracking-wider">Mant.</span>
                                                        </>
                                                    )}
                                                    {/* Label overlay */}
                                                    <div className="absolute top-0.5 right-1 opacity-50">
                                                        <span className="text-[6px] md:text-[8px] font-mono text-stone-400">{unit.label.replace("Cama ", "C")}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                // STANDARD MODE (Guest View)
                                                <>
                                                    <span className="text-[9px] font-bold uppercase opacity-60">
                                                        {unit.label.replace("Cama ", "C")}
                                                    </span>
                                                    {unit.status === 'verifying' ? (
                                                        <Wallet className="w-4 h-4 animate-pulse" />
                                                    ) : unit.status !== "available" ? (
                                                        <User className="w-4 h-4" />
                                                    ) : (
                                                        <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
                                                    )}

                                                    {unit.status !== "available" && (
                                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                                            <span className="text-[8px] text-white font-bold text-center px-1 truncate w-full">
                                                                {unit.status === 'verifying' ? 'Verificar' : unit.guestName.split(" ")[0]}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Tiny Status Dot for housekeeping issues in normal mode */}
                                                    {unit.housekeeping === "dirty" && (
                                                        <div className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-sm" title="Sucia" />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </Trigger>

                                    {isHousekeepingMode ? (
                                        <PopoverContent className="w-48 p-2" align="center">
                                            <div className="grid gap-2">
                                                <div className="space-y-1">
                                                    <h4 className="font-medium leading-none text-xs uppercase tracking-widest text-stone-500">Estado de Habitación</h4>
                                                    <p className="text-[10px] text-muted-foreground">{room.label}</p>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Button
                                                        variant={unit.housekeeping === "clean" ? "default" : "outline"}
                                                        size="sm"
                                                        className={cn("justify-start", unit.housekeeping === "clean" && "bg-emerald-600 hover:bg-emerald-700")}
                                                        onClick={() => updateRoomStatus(room.id, "clean", unit.unitId)}
                                                    >
                                                        <Sparkles className="mr-2 h-4 w-4" /> Limpia
                                                    </Button>
                                                    <Button
                                                        variant={unit.housekeeping === "dirty" ? "default" : "outline"}
                                                        size="sm"
                                                        className={cn("justify-start", unit.housekeeping === "dirty" && "bg-rose-600 hover:bg-rose-700")}
                                                        onClick={() => updateRoomStatus(room.id, "dirty", unit.unitId)}
                                                    >
                                                        <SprayCan className="mr-2 h-4 w-4" /> Sucia
                                                    </Button>
                                                    <Button
                                                        variant={unit.housekeeping === "maintenance" ? "default" : "outline"}
                                                        size="sm"
                                                        className={cn("justify-start", unit.housekeeping === "maintenance" && "bg-stone-600 hover:bg-stone-700")}
                                                        onClick={() => updateRoomStatus(room.id, "maintenance", unit.unitId)}
                                                    >
                                                        <Wrench className="mr-2 h-4 w-4" /> Mantenimiento
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    ) : (
                                        <DropdownMenuContent align="center" className="w-48 z-50">
                                            <DropdownMenuLabel className="text-[10px] uppercase font-bold text-stone-400">
                                                {unit.label} • {unit.status === "available" ? "Disponible" : "Ocupada"}
                                            </DropdownMenuLabel>

                                            {unit.status === "available" && (
                                                <>
                                                    <DropdownMenuItem onClick={() => onNewBooking && onNewBooking(room, unit.unitId)}>
                                                        <Plus className="w-4 h-4 mr-2" /> Nueva Reserva
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-stone-500 focus:text-stone-700"
                                                        onClick={() => blockUnit(room.id, room.location, unit.unitId)}
                                                    >
                                                        <Ban className="w-4 h-4 mr-2" /> Bloquear (Mantenimiento)
                                                    </DropdownMenuItem>
                                                </>
                                            )}

                                            {unit.status === "maintenance" && unit.booking && (
                                                <DropdownMenuItem
                                                    className="text-emerald-600 focus:text-emerald-700"
                                                    onClick={() => unblockUnit(unit.booking!.id)}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Habilitar Cama
                                                </DropdownMenuItem>
                                            )}

                                            {unit.booking && unit.status !== "maintenance" && (
                                                <DropdownMenuItem onClick={() => onSelectBooking && onSelectBooking(unit.booking!)}>
                                                    <User className="w-4 h-4 mr-2" /> Ver Detalles Reserva
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    )}
                                </Container>
                            )
                        })
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
