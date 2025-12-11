"use client"

import * as React from "react"
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isWithinInterval,
    parseISO,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Booking } from "@/lib/store"

interface ReservationCalendarProps {
    bookings: Booking[]
    onSelectBooking: (booking: Booking) => void
}

export function ReservationCalendar({ bookings, onSelectBooking }: ReservationCalendarProps) {
    const [currentDate, setCurrentDate] = React.useState(new Date())

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { locale: es })
    const calendarEnd = endOfWeek(monthEnd, { locale: es })

    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd
    })

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

    // Filter bookings relevant to this calendar view (any overlap with the visible range)
    // Minimally, they should overlap with the month, but for strict correctness with the calendar grid (start/end week), 
    // we can check overlap with calendarStart/End.
    const visibleBookings = bookings.filter(b => {
        if (b.status === 'cancelled') return false
        const start = parseISO(b.checkIn)
        const end = parseISO(b.checkOut)
        // Check overlap
        return start <= calendarEnd && end >= calendarStart
    })

    return (
        <div className="bg-white dark:bg-stone-900/50 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800">
                <h2 className="text-lg font-bold font-heading capitalize text-stone-900 dark:text-stone-100">
                    {format(currentDate, "MMMM yyyy", { locale: es })}
                </h2>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Grid Days Header */}
            <div className="grid grid-cols-7 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/20">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7 auto-rows-fr bg-stone-100 dark:bg-stone-800 gap-[1px]">
                {calendarDays.map((day, dayIdx) => {
                    const isCurrentMonth = isSameMonth(day, currentDate)

                    // Find bookings for this day
                    const dayBookings = visibleBookings.filter(b =>
                        isWithinInterval(day, { start: parseISO(b.checkIn), end: parseISO(b.checkOut) })
                    )

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[120px] bg-white dark:bg-stone-900 p-2 transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-900/80 relative group",
                                !isCurrentMonth && "bg-stone-50/30 dark:bg-stone-900/30 text-stone-300 dark:text-stone-600"
                            )}
                        >
                            <span className={cn(
                                "text-sm font-medium block mb-2",
                                isSameDay(day, new Date())
                                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 w-7 h-7 flex items-center justify-center rounded-full shadow-md"
                                    : "text-stone-500 dark:text-stone-400"
                            )}>
                                {format(day, "d")}
                            </span>

                            <div className="space-y-1">
                                {dayBookings.slice(0, 3).map(b => {
                                    const isStart = isSameDay(day, parseISO(b.checkIn))
                                    const isEnd = isSameDay(day, parseISO(b.checkOut))

                                    // Style based on status/location
                                    const colorClass = b.location === 'pueblo'
                                        ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800"
                                        : "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-800"

                                    return (
                                        <button
                                            key={b.id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onSelectBooking(b)
                                            }}
                                            className={cn(
                                                "w-full text-left text-[10px] font-medium px-1.5 py-1 rounded truncate border shadow-sm transition-transform hover:scale-[1.02] flex items-center gap-1",
                                                colorClass,
                                                // Check in/out visual cues could be added here
                                                b.status === 'pending' && "opacity-70 border-dashed"
                                            )}
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                                            <span className="truncate">{b.guestName}</span>
                                        </button>
                                    )
                                })}
                                {dayBookings.length > 3 && (
                                    <div className="text-[10px] text-stone-400 font-medium pl-1">
                                        + {dayBookings.length - 3} más
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
