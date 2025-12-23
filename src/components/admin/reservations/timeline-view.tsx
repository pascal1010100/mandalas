"use client"

import { useState } from "react"
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addMonths,
    subMonths,
    differenceInDays,
    parseISO
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, CalendarDays, Eraser } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppStore, Booking } from "@/lib/store"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface TimelineViewProps {
    bookings: Booking[]
    onSelectBooking: (booking: Booking) => void
}

// Configuration Constants
const DAY_WIDTH = 64 // slightly wider for breathing room
const ROW_HEIGHT = 88 // slightly taller
const HEADER_HEIGHT = 56 // taller header

export function TimelineView({ bookings, onSelectBooking }: TimelineViewProps) {
    const { rooms, deleteBooking } = useAppStore() // Fetch from store
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isPurging, setIsPurging] = useState(false)

    // Ghost Logic: Find expired pending bookings
    const expiredBookings = bookings.filter(b =>
        b.status === 'pending' &&
        new Date(b.checkIn) < new Date()
    )

    const handlePurge = async () => {
        if (!confirm(`¿Eliminar ${expiredBookings.length} solicitudes expiradas?`)) return

        setIsPurging(true)
        try {
            // Batch delete
            await Promise.all(expiredBookings.map(b => deleteBooking(b.id)))
            toast.success(`🧹 Se eliminaron ${expiredBookings.length} solicitudes antiguas`)
        } catch (error) {
            toast.error("Error al limpiar")
        } finally {
            setIsPurging(false)
        }
    }

    // Sort rooms logic: Pueblo first, then by type
    const sortedRooms = [...rooms].sort((a, b) => {
        if (a.location !== b.location) return b.location.localeCompare(a.location) // Pueblo (p) > Hideout (h)
        return a.label.localeCompare(b.label)
    })

    // Determine Visible Range (Month)
    const viewStart = startOfMonth(currentDate)
    const viewEnd = endOfMonth(currentDate)

    // Generate X-Axis Ticks
    const days = eachDayOfInterval({ start: viewStart, end: viewEnd })

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

    // Helper: Position calculation
    const getPosition = (date: Date) => {
        const diff = differenceInDays(date, viewStart)
        return diff * DAY_WIDTH
    }

    return (
        <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-stone-200/50 dark:shadow-none border border-white/50 dark:border-stone-800 overflow-hidden flex flex-col h-[650px] animate-in fade-in duration-700">

            {/* 1. Toolbar */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200/50 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 z-20">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 shadow-inner">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-light font-heading capitalize text-stone-900 dark:text-stone-100">
                                {format(currentDate, "MMMM yyyy", { locale: es })}
                            </h2>
                            <p className="text-xs text-stone-500 font-medium tracking-wide uppercase">Vista General</p>
                        </div>
                    </div>

                    <div className="flex gap-2 bg-stone-100/50 dark:bg-stone-800/50 p-1 rounded-full border border-stone-200/50 dark:border-stone-700/50">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-full hover:bg-white dark:hover:bg-stone-700 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full hover:bg-white dark:hover:bg-stone-700 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {expiredBookings.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handlePurge}
                            disabled={isPurging}
                            className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-900/50 h-8 text-xs font-semibold px-3 rounded-full shadow-sm animate-in fade-in zoom-in"
                        >
                            <Eraser className={cn("w-3.5 h-3.5 mr-1.5", isPurging && "animate-spin")} />
                            {isPurging ? "Limpiando..." : `Limpiar (${expiredBookings.length})`}
                        </Button>
                    )}

                    <div className="flex items-center gap-2 text-xs font-medium text-stone-400 bg-stone-100/50 dark:bg-stone-800/50 px-3 py-1.5 rounded-full border border-stone-200/50 dark:border-stone-700/50">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Tiempo Real
                    </div>
                </div>
            </div>

            {/* 2. Timeline Grid Container */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* 2a. Sidebar (Y-Axis Resources) */}
                <div className="w-56 flex-shrink-0 border-r border-stone-200/50 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-900/30 backdrop-blur-sm z-10 overflow-hidden relative mt-[56px]">
                    {sortedRooms.map(room => (
                        <div
                            key={room.id}
                            className="border-b border-stone-100/50 dark:border-stone-800/50 flex flex-col justify-center px-6 transition-colors hover:bg-white/40 dark:hover:bg-stone-800/40"
                            style={{ height: `${ROW_HEIGHT}px` }}
                        >
                            <span className="font-heading font-medium text-base text-stone-800 dark:text-stone-200 truncate leading-tight transform -translate-y-0.5">
                                {room.label}
                            </span>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className={cn(
                                    "text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-sm border",
                                    room.location === 'pueblo'
                                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-500 dark:border-amber-800/50"
                                        : "bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-900/20 dark:text-lime-500 dark:border-lime-800/50"
                                )}>
                                    {room.location}
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono">
                                    Cap: {room.capacity}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2b. Scrollable Grid Area (X-Axis & Content) */}
                <ScrollArea className="flex-1 w-full bg-stone-50/10 dark:bg-stone-900/10">
                    <div className="relative min-w-full" style={{ width: `${days.length * DAY_WIDTH}px` }}>

                        {/* Header Row (Sticky Dates) */}
                        <div
                            className="flex border-b border-stone-200/50 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-10 shadow-sm"
                            style={{ height: `${HEADER_HEIGHT}px` }}
                        >
                            {days.map(day => {
                                const isToday = isSameDay(day, new Date())
                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={cn(
                                            "flex-shrink-0 flex flex-col items-center justify-center border-r border-stone-100 dark:border-stone-800/30 transition-colors",
                                            isToday ? "bg-amber-50/50 dark:bg-amber-900/10" : "hover:bg-stone-50 dark:hover:bg-stone-800/30"
                                        )}
                                        style={{ width: `${DAY_WIDTH}px` }}
                                    >
                                        <span className={cn(
                                            "text-[10px] uppercase font-bold mb-0.5",
                                            isToday ? "text-amber-600 dark:text-amber-500" : "text-stone-400"
                                        )}>
                                            {format(day, "EEE", { locale: es })}
                                        </span>
                                        <div className={cn(
                                            "h-7 w-7 rounded-full flex items-center justify-center text-sm font-medium transition-all group",
                                            isToday
                                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110"
                                                : "text-stone-700 dark:text-stone-300 group-hover:bg-stone-200 dark:group-hover:bg-stone-700"
                                        )}>
                                            {format(day, "d")}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Grid Body */}
                        <div className="relative">
                            {/* Background Grid Lines */}
                            <div className="absolute inset-0 flex pointer-events-none">
                                {days.map((day, i) => {
                                    const isToday = isSameDay(day, new Date())
                                    return (
                                        <div
                                            key={day.toISOString()}
                                            className={cn(
                                                "border-r flex-shrink-0 h-full",
                                                isToday
                                                    ? "bg-amber-50/30 dark:bg-amber-900/5 border-amber-200/30 dark:border-amber-800/30"
                                                    : "border-stone-100/50 dark:border-stone-800/30"
                                            )}
                                            style={{ width: `${DAY_WIDTH}px` }}
                                        />
                                    )
                                })}
                            </div>

                            {/* Resource Rows */}
                            {sortedRooms.map(room => (
                                <div
                                    key={room.id}
                                    className="relative border-b border-stone-100/50 dark:border-stone-800/50 hover:bg-stone-50/30 dark:hover:bg-stone-800/10 transition-colors"
                                    style={{ height: `${ROW_HEIGHT}px` }}
                                >
                                    {/* Bookings will reside here absolutely positioned */}
                                    {(() => {
                                        // 1. FILTER bookings for this room
                                        const roomBookings = bookings.filter(b => {
                                            const isCompositeMatch = b.roomType === room.id
                                            const isSemanticMatch = b.location === room.location && b.roomType === room.type
                                            return (isCompositeMatch || isSemanticMatch) && b.status !== 'cancelled'
                                        }).filter(b => {
                                            const start = parseISO(b.checkIn)
                                            const end = parseISO(b.checkOut)
                                            return start <= viewEnd && end >= viewStart
                                        })

                                        // 2. SORT by start date
                                        roomBookings.sort((a, b) => parseISO(a.checkIn).getTime() - parseISO(b.checkIn).getTime())

                                        // 3. CALCULATE overlaps
                                        const lanes: Date[] = []

                                        return roomBookings.map((booking) => {
                                            const start = parseISO(booking.checkIn)
                                            const end = parseISO(booking.checkOut)

                                            // Find lane
                                            let laneIndex = lanes.findIndex(laneEnd => start >= laneEnd)

                                            if (laneIndex === -1) {
                                                laneIndex = lanes.length
                                                lanes.push(end)
                                            } else {
                                                lanes[laneIndex] = end
                                            }

                                            // Render
                                            const effectiveStart = start < viewStart ? viewStart : start
                                            const duration = differenceInDays(end, effectiveStart)
                                            const width = Math.max(duration, 1) * DAY_WIDTH
                                            const left = getPosition(effectiveStart)

                                            // Updated Vertical positioning
                                            const top = 12 + (laneIndex * 38)

                                            const isExpired = booking.status === 'pending' && new Date(booking.checkIn) < new Date()

                                            return (
                                                <div
                                                    key={booking.id}
                                                    onClick={() => onSelectBooking(booking)}
                                                    className={cn(
                                                        "absolute h-[34px] rounded-lg px-3 flex items-center shadow-lg hover:shadow-xl cursor-pointer hover:scale-[1.02] transition-all text-xs font-medium truncate select-none border group overflow-hidden z-10",
                                                        booking.status === 'confirmed'
                                                            ? "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-900 border-white/50 dark:from-emerald-900/60 dark:to-emerald-800/60 dark:text-emerald-100 dark:border-emerald-700"
                                                            : booking.status === 'checked_in'
                                                                ? "bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-900 border-white/50 dark:from-indigo-900/60 dark:to-indigo-800/60 dark:text-indigo-100 dark:border-indigo-700 shadow-indigo-200/50"
                                                                : booking.status === 'checked_out'
                                                                    ? "bg-stone-200 text-stone-500 border-stone-300 opacity-50 grayscale decoration-stone-400 line-through"
                                                                    : booking.status === 'cancelled'
                                                                        ? "bg-rose-50/50 text-rose-300 border-rose-100/50 opacity-40 grayscale-[0.5] decoration-rose-300/50 line-through dashed border-dashed"
                                                                        : booking.status === 'no_show'
                                                                            ? "bg-stone-800 text-stone-400 border-stone-700 opacity-60 grayscale decoration-stone-500 line-through"
                                                                            : isExpired
                                                                                ? "bg-amber-50/50 text-amber-900/50 border-amber-200/50 border-dashed opacity-80" // Expired Pending
                                                                                : "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 border-white/50 dark:from-amber-900/60 dark:to-amber-800/60 dark:text-amber-100 dark:border-amber-700"
                                                    )}
                                                    style={{
                                                        left: `${left + 2}px`, // +2 padding
                                                        width: `${width - 8}px`, // -8 for gaps
                                                        top: `${top}px`,
                                                        zIndex: 20 + laneIndex
                                                    }}
                                                >
                                                    <span className="truncate drop-shadow-sm flex items-center gap-1">
                                                        {isExpired && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                                                        {booking.guestName}
                                                    </span>
                                                </div>
                                            )
                                        })
                                    })()}
                                </div>
                            ))}
                        </div>
                    </div>
                    <ScrollBar orientation="horizontal" className="h-3" />
                </ScrollArea>
            </div>
        </div>
    )
}
