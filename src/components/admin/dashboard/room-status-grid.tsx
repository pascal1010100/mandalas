"use client"

import { Fragment, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { LayoutGrid, User, Brush, CheckCircle2, Sparkles, SprayCan, Wrench, Wallet } from "lucide-react"
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

import { Plus, Ban, AlertCircle } from "lucide-react"

import { Booking, RoomConfig } from "@/lib/store"

interface RoomStatusGridProps {
    onSelectBooking?: (booking: Booking) => void
    onNewBooking?: (room: RoomConfig, unitId: string) => void
}

export function RoomStatusGrid({ onSelectBooking, onNewBooking }: RoomStatusGridProps) {
    const { rooms, bookings, blockUnit, unblockUnit, updateRoomStatus } = useAppStore()
    const [isHousekeepingMode, setIsHousekeepingMode] = useState(false)

    // Helper: Group rooms by location dynamically
    const groupedRooms = rooms.reduce((acc, room) => {
        const loc = room.location.toLowerCase()
        if (!acc[loc]) {
            acc[loc] = {
                dorms: [],
                privates: [],
                suites: []
            }
        }
        if (room.type === 'dorm') acc[loc].dorms.push(room)
        else if (room.type === 'private') acc[loc].privates.push(room)
        else if (room.type === 'suite') acc[loc].suites.push(room)
        return acc
    }, {} as Record<string, { dorms: RoomConfig[], privates: RoomConfig[], suites: RoomConfig[] }>)

    // Helper: Dynamic Color Styles by Location
    const getLocationColor = (location: string) => {
        switch (location) {
            case 'pueblo': return { color: 'bg-amber-500', bg: 'bg-amber-500/30' }
            case 'hideout': return { color: 'bg-emerald-500', bg: 'bg-emerald-500/30' }
            default: return { color: 'bg-stone-500', bg: 'bg-stone-500/30' } // Fallback for "La Casa" etc.
        }
    }

    // SMART RESOLVER: Handles Legacy IDs + Location Context
    const resolveCanonicalRoomId = (bookingType: string, bookingLocation: string): string | null => {
        // AGGRESSIVE NORMALIZATION: Remove everything except letters and numbers
        const type = bookingType?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
        const loc = bookingLocation?.toLowerCase().trim() || ''

        // PUEBLO MAPPINGS
        if (loc === 'pueblo') {
            if (type === 'room101' || type === '101') return 'pueblo_private_1'
            if (type === 'room102' || type === '102') return 'pueblo_private_2'
            if (type === 'dorm1' || type === 'mixed' || type === 'dorm') return 'pueblo_dorm_mixed_8'
            if (type === 'dorm2' || type === 'female') return 'pueblo_dorm_female_6'
            if (type === 'suite1' || type === 'suite') return 'pueblo_suite_balcony'
            // Family room map?
            if (type === 'family') return 'pueblo_private_family'
        }

        // HIDEOUT MAPPINGS
        if (loc === 'hideout') {
            // Mapping 'dorm-1' in Hideout to Mixed or Female?
            // Assuming dorm-1 = Mixed (Safe default)
            if (type === 'dorm1' || type === 'mixed' || type === 'dorm') return 'hideout_dorm_mixed'
            if (type === 'dorm2' || type === 'female') return 'hideout_dorm_female'
            if (type === 'room1' || type === 'private') return 'hideout_private'
        }

        return null
    }

    // Helper: Get units with stable sorting
    const getRoomUnits = (roomConfig: RoomConfig) => {
        const today = new Date()

        const activeBookings = bookings.filter(b => {
            // Robust String Comparison (UTC-safe)

            // Logic:
            // 1. Stayover: CheckIn < Today AND CheckOut > Today
            // 2. Arriving: CheckIn == Today
            // 3. Departing: CheckOut == Today

            // Note: Departing guests usually NOT shown in grid for new bookings, 
            // but shown as 'Checkout' status. 


            // 1. NORMALIZE STATUS & DATES
            const rawStatus = b.status?.toLowerCase().trim() || 'pending'
            const isCancelled = rawStatus === 'cancelled' || rawStatus === 'no_show' || rawStatus === 'refunded'
            if (isCancelled) return false;

            // PROFESSIONAL CHECKOUT LOGIC:
            // If checked out, only show if the departures happened TODAY.
            // If they left yesterday, they should not appear in the grid (bed is free).
            if (rawStatus === 'checked_out') {
                if (!b.actualCheckOut) return false; // Fallback: If no timestamp, assume past
                const actualOutDate = b.actualCheckOut.split('T')[0]
                const todayCurrent = format(new Date(), 'yyyy-MM-dd')
                if (actualOutDate < todayCurrent) return false;

                // FAST TURNAROUND LOGIC:
                // If the guest checked out TODAY, but the room has already been marked CLEAN,
                // we hide this booking so the slot appears "Available" for new check-ins.
                // We need to resolve the room/unit status here.
                const isDorm = b.roomType && b.roomType.includes('dorm');
                const targetRoom = rooms.find(r => r.id === b.roomType) || rooms.find(r => r.type === b.roomType && r.location === b.location);

                if (targetRoom) {
                    const unitStatus = isDorm && b.unitId
                        ? targetRoom.units_housekeeping?.[b.unitId]
                        : targetRoom.housekeeping_status;

                    // If strictly CLEAN, free the slot.
                    if (unitStatus === 'clean') return false;
                }
            }

            // DATE LOGIC
            const todayStart = new Date(today); todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date(today); todayEnd.setHours(23, 59, 59, 999);

            const bCheckIn = new Date(b.checkIn); bCheckIn.setHours(0, 0, 0, 0);
            const bCheckOut = new Date(b.checkOut); bCheckOut.setHours(0, 0, 0, 0);
            const isDateActive = bCheckIn <= todayEnd && bCheckOut >= todayStart;

            if (!isDateActive && rawStatus !== 'checked_in') return false;

            // 3. ID MATCHING
            let isMatch = false;

            if (b.roomType === roomConfig.id) {
                isMatch = true;
            }
            else {
                const typeSimple = b.roomType?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
                let targetId = null;
                if (typeSimple === 'room101') targetId = 'pueblo_private_1';
                if (typeSimple === 'room102') targetId = 'pueblo_private_2';
                if (typeSimple === 'dorm1') targetId = 'pueblo_dorm_mixed_8';

                if (!targetId) targetId = resolveCanonicalRoomId(b.roomType, b.location);

                if (targetId === roomConfig.id) isMatch = true;
            }

            if (!isMatch) {
                if (b.roomType === roomConfig.type) {
                    const bLoc = b.location?.toLowerCase().trim();
                    const cLoc = roomConfig.location?.toLowerCase().trim();
                    if (bLoc === cLoc) isMatch = true;
                }
            }

            return isMatch;
        }).sort((a, b) => {
            // Sort by CheckIn so arriving guests (later date) overwrite departing guests (earlier date) 
            // in the simple slot assignment logic
            return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
        })

        // GRID GENERATION LOGIC:
        // Dorms: Capacity = # of Beds (Units)
        // Privates/Suites: Capacity = Max Guests, but Entity = 1 Room (Unit)

        const isDorm = roomConfig.type === 'dorm'
        const gridSlots = isDorm ? roomConfig.capacity : 1 // FORCE 1 unit for Privates/Suites

        // Initialize units with an array for stacking
         
        const units = Array.from({ length: gridSlots }, (_, i) => {
            let label = ''
            if (isDorm) label = `C${i + 1}`
            if (!isDorm) label = `HAB`

            return {
                id: `${roomConfig.id}-${i}`,
                unitId: (i + 1).toString(),
                status: 'available',
                guestName: '',
                label,
                booking: undefined as Booking | undefined,
                allBookings: [] as Booking[], // STACKING SUPPORT
                housekeeping: roomConfig.units_housekeeping?.[(i + 1).toString()] || roomConfig.housekeeping_status || 'clean'
            }
        })

        // ASSIGNMENT LOGIC
        const unassignedBookings: Booking[] = []

        activeBookings.forEach(booking => {
            if (!isDorm) {
                // PRIVATE ROOM / SUITE:
                // Allow stacking if total guests fit capacity
                const currentOccupancy = units[0].allBookings.reduce((sum, b) => sum + Number(b.guests || 1), 0)
                const newGuests = Number(booking.guests || 1)

                // If room empty OR adding this guest doesn't exceed Max Guests (Capacity)
                // Note: roomConfig.capacity for Private is usually 1 (Entity), but maxGuests is e.g. 2.
                // We use maxGuests for stacking limit.
                const capacityLimit = roomConfig.maxGuests || roomConfig.capacity || 2

                if (currentOccupancy + newGuests <= capacityLimit) {
                    units[0].allBookings.push(booking)
                    // Primary booking (for status color) is usually the first one or the one checking in today
                    if (!units[0].booking) units[0].booking = booking
                } else {
                    unassignedBookings.push(booking)
                }
            } else {
                // DORM: Strict Unit ID Matching
                if (booking.unitId && !isNaN(parseInt(booking.unitId))) {
                    const index = parseInt(booking.unitId) - 1
                    if (index >= 0 && index < gridSlots) {
                        units[index].booking = booking // Dorms don't stack per bed usually
                    } else {
                        unassignedBookings.push(booking)
                    }
                } else {
                    unassignedBookings.push(booking)
                }
            }
        })

        // Compute status/display for each unit
        const resultUnits = units.map(unit => {
            if (!unit.booking && unit.allBookings.length === 0) return unit

            // Resolve Primary Booking (Priority: CheckIn > Stayover)
            const primaryBooking = unit.booking || unit.allBookings[0]

            let status = 'occupied'
            let guestName = primaryBooking.guestName

            // Display Logic for multiple
            if (unit.allBookings.length > 1) {
                guestName = `${primaryBooking.guestName.split(' ')[0]} +${unit.allBookings.length - 1}`
            }

            // Robust Date Comparison based on PRIMARY booking
            const checkInStr = primaryBooking.checkIn.split('T')[0]
            const checkOutStr = primaryBooking.checkOut.split('T')[0]
            const todayStrComp = format(new Date(), 'yyyy-MM-dd')

            const isCheckOutToday = checkOutStr === todayStrComp
            const isCheckInToday = checkInStr === todayStrComp

            if (isCheckOutToday) status = 'checkout'
            else if (isCheckInToday) status = 'checkin'

            if (primaryBooking.status === 'pending') status = 'pending'

            if (primaryBooking.status === 'checked_out') status = 'past_checkout'

            if (primaryBooking.paymentStatus === 'verifying') status = 'verifying'

            if (primaryBooking.status === 'maintenance') {
                status = 'maintenance'
                guestName = 'M'
            }

            return { ...unit, status, guestName, booking: primaryBooking }
        })

        const overflow = unassignedBookings
        return { units: resultUnits, overflow }
    }

    // DEBUG: Identify Orphaned Bookings (Active today but not displayed)
    const allDisplayedBookingIds = new Set<string>()
    rooms.forEach(room => {
        const { units, overflow } = getRoomUnits(room)
        units.forEach(u => u.booking && allDisplayedBookingIds.add(u.booking.id))
        overflow.forEach(b => allDisplayedBookingIds.add(b.id))
    })

    const orphanedBookings = bookings.filter(b => {
        const checkInStr = b.checkIn.split('T')[0]
        const checkOutStr = b.checkOut.split('T')[0]
        const todayStr = format(new Date(), 'yyyy-MM-dd')

        const isStayover = checkInStr < todayStr && checkOutStr > todayStr
        const isArriving = checkInStr === todayStr
        const isDeparting = checkOutStr === todayStr
        const isActive = isStayover || isArriving || isDeparting || b.status === 'checked_in'

        const isCancelled = b.status === 'cancelled' || b.status === 'no_show'

        // Exclude past checkouts from orphaned warning if they are "active" by date but not in grid
        // Actually, if we want to suppress them from grid "Active" view completely, we should do it sooner.
        // But for now, let's just make sure they render correctly.
        const isCheckedOut = b.status === 'checked_out'

        return isActive && !isCancelled && !isCheckedOut && !allDisplayedBookingIds.has(b.id)
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUnitClick = (room: RoomConfig, unit: any) => {
        if (isHousekeepingMode) {
            // Toggle Logic: Clean -> Dirty -> Maintenance -> Clean
            const current = (unit.unitId ? room.units_housekeeping?.[unit.unitId] : room.housekeeping_status) || 'clean'
            let next: 'clean' | 'dirty' | 'maintenance' = 'dirty'
            if (current === 'dirty') next = 'maintenance'
            if (current === 'maintenance') next = 'clean'

            updateRoomStatus(room.id, next, unit.unitId)
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
                    {roomsList.map(room => {
                        const { units, overflow } = getRoomUnits(room)
                        return (
                            <Fragment key={room.id}>
                                {units.map((unit) => {
                                    // Determine interaction wrapper
                                    // dynamic components
                                    const Container = isHousekeepingMode ? Popover : DropdownMenu
                                    const Trigger = isHousekeepingMode ? PopoverTrigger : DropdownMenuTrigger

                                    return (
                                        <Container key={unit.id}>
                                            <Trigger asChild>
                                                <div
                                                    onClick={() => {
                                                        if (!isHousekeepingMode && unit.status !== "available") {
                                                            handleUnitClick(room, unit)
                                                        }
                                                    }}
                                                    title={unit.status === "maintenance" ? "Mantenimiento (Click para Habilitar)" : (unit.guestName ? `${unit.guestName} (${room.label})` : room.label)}
                                                    className={cn(
                                                        "w-12 h-12 md:w-16 md:h-16 rounded-xl border flex flex-col items-center justify-center p-1 transition-all duration-300 relative overflow-hidden group shadow-sm z-0",
                                                        isHousekeepingMode
                                                            ? "scale-[1.05] shadow-xl ring-0 cursor-pointer"
                                                            : "hover:scale-105",

                                                        // Status Colors (Standard Mode)
                                                        !isHousekeepingMode && unit.housekeeping === 'dirty' && "bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-900/20 dark:border-rose-700 font-bold", // DIRTY PRIORITY
                                                        !isHousekeepingMode && unit.status === "available" && unit.housekeeping !== 'dirty' && "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-300 hover:border-stone-400",
                                                        !isHousekeepingMode && unit.status === "occupied" && unit.housekeeping !== 'dirty' && "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-900/20 dark:border-rose-900/30",
                                                        !isHousekeepingMode && unit.status === "checkout" && unit.housekeeping !== 'dirty' && "bg-amber-50 border-amber-100 text-amber-500 dark:bg-amber-900/20 dark:border-amber-900/30",
                                                        !isHousekeepingMode && unit.status === "checkin" && unit.housekeeping !== 'dirty' && "bg-blue-50 border-blue-100 text-blue-500 dark:bg-blue-900/20 dark:border-blue-900/30",
                                                        !isHousekeepingMode && unit.status === "pending" && unit.housekeeping !== 'dirty' && "bg-orange-50 border-orange-100 text-orange-500 dark:bg-orange-900/20 dark:border-orange-900/30 border-dashed",
                                                        !isHousekeepingMode && unit.status === "maintenance" && "bg-stone-200 border-stone-300 text-stone-500 dark:bg-stone-800 dark:border-stone-700",
                                                        !isHousekeepingMode && unit.status === "past_checkout" && unit.housekeeping !== 'dirty' && "bg-stone-100 border-stone-200 text-stone-400 dark:bg-stone-800 dark:border-stone-700 border-dashed",


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

                                                            {/* DEBUG STATUS - ALWAYS VISIBLE */}
                                                            <div className="flex flex-col items-center mt-1">
                                                                <span className="text-[6px] opacity-70 font-mono">
                                                                    {unit.housekeeping || 'unk'}
                                                                </span>
                                                            </div>
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
                                                            {/* Background Icon (faded) for Context */}
                                                            {unit.status === 'verifying' ? (
                                                                <Wallet className="absolute bottom-1 right-1 w-3 h-3 md:w-4 md:h-4 text-indigo-300 opacity-50" />
                                                            ) : unit.status !== "available" && unit.status !== "maintenance" ? (
                                                                <User className="absolute bottom-1 right-1 w-3 h-3 md:w-4 md:h-4 text-stone-300 opacity-30" />
                                                            ) : null}

                                                            {/* Available Dot */}
                                                            {unit.status === "available" && (
                                                                <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
                                                            )}

                                                            {unit.status !== "available" && unit.status !== "maintenance" && (
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-1">
                                                                    {/* Guest Name - Always Visible (Except past checkout? maybe keep so we know who left) */}
                                                                    <span className={cn(
                                                                        "text-[7px] md:text-[9px] font-bold text-center leading-none truncate w-full mb-0.5",
                                                                        unit.status === 'past_checkout' ? "text-stone-400 line-through" : "text-stone-600 dark:text-stone-300"
                                                                    )}>
                                                                        {unit.guestName?.split(" ")[0]}
                                                                    </span>
                                                                    {/* Status Icon/Info */}
                                                                    {unit.status === 'verifying' && <span className="text-[6px] text-indigo-500 font-bold uppercase">Verificar</span>}
                                                                    {unit.status === 'checkout' && <span className="text-[6px] text-amber-600 font-bold uppercase">Salida</span>}
                                                                    {unit.status === 'checkin' && <span className="text-[6px] text-blue-600 font-bold uppercase">Entrada</span>}
                                                                    {unit.status === 'pending' && <span className="text-[6px] text-orange-600 font-bold uppercase">Pend.</span>}
                                                                    {unit.status === 'past_checkout' && unit.housekeeping !== 'dirty' && <span className="text-[6px] text-stone-400 font-bold uppercase">Salió</span>}

                                                                    {/* DIRTY OVERLAY */}
                                                                    {unit.housekeeping === 'dirty' && (
                                                                        <span className="text-[7px] text-rose-600 font-extrabold uppercase bg-white/80 px-1 rounded shadow-sm backdrop-blur-sm animate-pulse">SUCIA</span>
                                                                    )}
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
                                })}

                                {/* OVERFLOW / OVERBOOKING HANDLING */}
                                {overflow.map(booking => (
                                    <div
                                        key={booking.id}
                                        onClick={() => onSelectBooking && onSelectBooking(booking)}
                                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-700 flex flex-col items-center justify-center p-1 cursor-pointer hover:scale-105 transition-all shadow-sm animate-in fade-in zoom-in"
                                        title={`Overbooking / Sin Asignar: ${booking.guestName}`}
                                    >
                                        <div className="absolute top-0 right-0 p-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                        </div>
                                        <p className="text-[7px] md:text-[9px] font-bold text-rose-700 dark:text-rose-400 text-center leading-none truncate w-full">
                                            {booking.guestName.split(" ")[0]}
                                        </p>
                                        <span className="text-[6px] font-bold uppercase text-rose-400 mt-0.5">EXTRA</span>
                                    </div>
                                ))}

                            </Fragment>
                        )
                    })}
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
                {/* DEBUG: ORPHANED BOOKINGS WARNING */}
                {orphanedBookings.length > 0 && (
                    <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-500">
                            <AlertCircle className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-widest text-xs">Reservas Sin Asignar (Detectadas: {orphanedBookings.length})</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {orphanedBookings.map(b => {
                                // Live debug of resolution logic
                                const typeSimple = b.roomType?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
                                const resolved = resolveCanonicalRoomId(b.roomType, b.location)

                                return (
                                    <div key={b.id} className="text-xs bg-white dark:bg-stone-900 p-2 rounded border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col gap-1">
                                        <span className="font-bold text-stone-700 dark:text-stone-300">{b.guestName}</span>
                                        <span className="font-mono text-[10px] text-stone-500 break-all">
                                            RAW ID: &quot;{b.roomType}&quot; <br />
                                            RAW LOC: &quot;{b.location}&quot; <br />
                                            RAW STATUS: &quot;{b.status}&quot; <br />
                                            NORM TYPE: &quot;{typeSimple}&quot; <br />
                                            RESOLVED: &quot;{resolved || 'NULL'}&quot;
                                        </span>
                                        <span className="text-[10px] text-amber-600 font-bold">
                                            {format(new Date(b.checkIn), "dd MMM")} - {format(new Date(b.checkOut), "dd MMM")}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <p className="mt-3 text-[10px] text-stone-500">
                            Estas reservas están activas hoy pero no coinciden con ninguna ID de habitación configurada.
                            Revise la configuración de habitaciones o contacte soporte.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {Object.entries(groupedRooms).map(([location, groups]) => {
                        const { color, bg } = getLocationColor(location)
                        return (
                            <div key={location} className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                                    <div className={cn("w-2 h-2 rounded-full", color)} />
                                    {location.toUpperCase()}
                                </h4>

                                {/* Specific Dorms */}
                                {groups.dorms.map(room => (
                                    <Fragment key={room.id}>
                                        {renderRoomSection(room.label, [room], bg)}
                                    </Fragment>
                                ))}

                                {renderRoomSection("Privadas", groups.privates, bg)}
                                {renderRoomSection("Suites", groups.suites, bg)}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}


