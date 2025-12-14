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
    parseISO,
    isWithinInterval
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Booking } from "@/lib/store"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface TimelineViewProps {
    bookings: Booking[]
    onSelectBooking: (booking: Booking) => void
}

// Configuration Constants
const DAY_WIDTH = 60 // pixels per day column
const ROW_HEIGHT = 80 // pixels per room row (allows stacking)
const HEADER_HEIGHT = 50 // sticky header

// Resource Definitions (Y-Axis)
const ROOM_TYPES = [
    { id: 'pueblo_dorm', label: 'Dormitorio Pueblo', location: 'pueblo', type: 'dorm' },
    { id: 'pueblo_private', label: 'Privada Pueblo', location: 'pueblo', type: 'private' },
    { id: 'pueblo_suite', label: 'Suite Pueblo', location: 'pueblo', type: 'suite' },
    { id: 'hideout_dorm', label: 'Dormitorio Hideout', location: 'hideout', type: 'dorm' },
    { id: 'hideout_private', label: 'Privada Hideout', location: 'hideout', type: 'private' },
    { id: 'hideout_suite', label: 'Suite Hideout', location: 'hideout', type: 'suite' },
]

export function TimelineView({ bookings, onSelectBooking }: TimelineViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

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
        <div className="bg-white dark:bg-stone-900/50 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden flex flex-col h-[600px]">

            {/* 1. Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 z-20">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold font-heading capitalize text-stone-900 dark:text-stone-100 w-48">
                        {format(currentDate, "MMMM yyyy", { locale: es })}
                    </h2>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="text-xs text-stone-400">
                    Arrastra para mover • Click para detalles
                </div>
            </div>

            {/* 2. Timeline Grid Container */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* 2a. Sidebar (Y-Axis Resources) */}
                <div className="w-48 flex-shrink-0 border-r border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900 z-10 overflow-hidden relative mt-[50px]">
                    {ROOM_TYPES.map(room => (
                        <div
                            key={room.id}
                            className="border-b border-stone-100 dark:border-stone-800 flex flex-col justify-center px-4"
                            style={{ height: `${ROW_HEIGHT}px` }}
                        >
                            <span className="font-medium text-sm text-stone-700 dark:text-stone-300">
                                {room.label}
                            </span>
                            <span className="text-[10px] uppercase text-stone-400 tracking-wider">
                                {room.location}
                            </span>
                        </div>
                    ))}
                </div>

                {/* 2b. Scrollable Grid Area (X-Axis & Content) */}
                <ScrollArea className="flex-1 w-full">
                    <div className="relative min-w-full" style={{ width: `${days.length * DAY_WIDTH}px` }}>

                        {/* Header Row (Sticky Dates) */}
                        <div
                            className="flex border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 sticky top-0 z-10"
                            style={{ height: `${HEADER_HEIGHT}px` }}
                        >
                            {days.map(day => {
                                const isToday = isSameDay(day, new Date())
                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={cn(
                                            "flex-shrink-0 flex flex-col items-center justify-center border-r border-stone-100 dark:border-stone-800/50",
                                            isToday && "bg-amber-500/10"
                                        )}
                                        style={{ width: `${DAY_WIDTH}px` }}
                                    >
                                        <span className="text-[10px] uppercase text-stone-400 font-bold">
                                            {format(day, "EEE", { locale: es })}
                                        </span>
                                        <span className={cn(
                                            "text-sm font-medium",
                                            isToday ? "text-amber-600 dark:text-amber-500" : "text-stone-600 dark:text-stone-400"
                                        )}>
                                            {format(day, "d")}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Grid Body */}
                        <div className="relative">
                            {/* Background Grid Lines */}
                            <div className="absolute inset-0 flex pointer-events-none">
                                {days.map(day => (
                                    <div
                                        key={day.toISOString()}
                                        className="border-r border-stone-50 dark:border-stone-800/30 flex-shrink-0 h-full"
                                        style={{ width: `${DAY_WIDTH}px` }}
                                    />
                                ))}
                            </div>

                            {/* Resource Rows */}
                            {ROOM_TYPES.map(room => (
                                <div
                                    key={room.id}
                                    className="relative border-b border-stone-100 dark:border-stone-800/50"
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

                                        // 3. CALCULATE overlaps (simple greedy algorithm)
                                        // We assign a "lane" or "row" (0, 1, 2...) to each booking so they don't overlap visually
                                        const lanes: Date[] = [] // Stores the end date of the last booking in each lane

                                        return roomBookings.map((booking) => {
                                            const start = parseISO(booking.checkIn)
                                            const end = parseISO(booking.checkOut)

                                            // Find the first lane where this booking fits (start > lane release date)
                                            let laneIndex = lanes.findIndex(laneEnd => start >= laneEnd)

                                            if (laneIndex === -1) {
                                                // No available lane found, create a new one
                                                laneIndex = lanes.length
                                                lanes.push(end)
                                            } else {
                                                // Update existing lane
                                                lanes[laneIndex] = end
                                            }

                                            // Render
                                            const effectiveStart = start < viewStart ? viewStart : start
                                            const duration = differenceInDays(end, effectiveStart)
                                            const width = Math.max(duration, 1) * DAY_WIDTH
                                            const left = getPosition(effectiveStart)

                                            // Calculate vertical position based on lane (36px height per bar + 4px gap)
                                            const top = 8 + (laneIndex * 36)

                                            return (
                                                <div
                                                    key={booking.id}
                                                    onClick={() => onSelectBooking(booking)}
                                                    className={cn(
                                                        "absolute h-8 rounded-md px-2 flex items-center shadow-sm cursor-pointer hover:brightness-95 transition-all text-[10px] font-medium truncate select-none border group overflow-hidden",
                                                        booking.status === 'confirmed'
                                                            ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800"
                                                            : booking.status === 'cancelled'
                                                                ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-800"
                                                                : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800"
                                                    )}
                                                    style={{
                                                        left: `${left}px`,
                                                        width: `${width - 4}px`, // -4 for gap
                                                        top: `${top}px`,
                                                        zIndex: 10 + laneIndex
                                                    }}
                                                >
                                                    <span className="truncate">{booking.guestName}</span>
                                                </div>
                                            )
                                        })
                                    })()}
                                </div>
                            ))}
                        </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    )
}
