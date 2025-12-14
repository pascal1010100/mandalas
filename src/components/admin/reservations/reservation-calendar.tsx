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
import { ChevronLeft, ChevronRight, User, LogIn, LogOut } from "lucide-react"

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
                                "min-h-[80px] md:min-h-[120px] bg-white dark:bg-stone-900 p-1 md:p-2 transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-900/80 relative group flex flex-col justify-between",
                                !isCurrentMonth && "bg-stone-50/30 dark:bg-stone-900/30 text-stone-300 dark:text-stone-600"
                            )}
                        >
                            <span className={cn(
                                "text-xs md:text-sm font-medium block mb-1 md:mb-2",
                                isSameDay(day, new Date())
                                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full shadow-md"
                                    : "text-stone-500 dark:text-stone-400"
                            )}>
                                {format(day, "d")}
                            </span>

                            {/* Desktop View: Full Booking Buttons */}
                            <div className="hidden md:flex flex-col gap-1">
                                {dayBookings.slice(0, 3).map(b => {
                                    const isStart = isSameDay(day, parseISO(b.checkIn))
                                    const isEnd = isSameDay(day, parseISO(b.checkOut))

                                    const statusStyles = {
                                        confirmed: {
                                            solid: "bg-emerald-600 text-white border-emerald-600 shadow-sm hover:bg-emerald-700",
                                            outline: "bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:bg-stone-900 dark:border-emerald-800 dark:text-emerald-400",
                                            light: "bg-emerald-100/50 text-emerald-800 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/50"
                                        },
                                        pending: {
                                            solid: "bg-amber-500 text-white border-amber-500 shadow-sm hover:bg-amber-600",
                                            outline: "bg-white border-amber-200 text-amber-600 hover:bg-amber-50 dark:bg-stone-900 dark:border-amber-800 dark:text-amber-400",
                                            light: "bg-amber-100/50 text-amber-800 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/50"
                                        },
                                        cancelled: {
                                            solid: "bg-rose-500 text-white border-rose-500 opacity-60",
                                            outline: "bg-white border-rose-200 text-rose-400 opacity-60 dark:bg-stone-900 dark:border-rose-900 dark:text-rose-500",
                                            light: "bg-rose-50 text-rose-400 border-rose-100 opacity-60 dark:bg-rose-900/10 dark:text-rose-500 dark:border-rose-900/20"
                                        }
                                    }

                                    const style = statusStyles[b.status as keyof typeof statusStyles] || statusStyles.pending

                                    let variantClass = ""
                                    let icon = null

                                    if (isEnd) {
                                        variantClass = `${style.outline} border`
                                        icon = <LogOut className="w-3 h-3" />
                                    } else if (isStart) {
                                        variantClass = `${style.solid} border`
                                        icon = <LogIn className="w-3 h-3" />
                                    } else {
                                        variantClass = style.light
                                    }

                                    return (
                                        <button
                                            key={b.id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onSelectBooking(b)
                                            }}
                                            className={cn(
                                                "w-full text-left text-[10px] font-medium px-2 py-1.5 rounded-md truncate transition-all hover:scale-[1.02] flex items-center gap-2",
                                                variantClass,
                                                b.status === 'pending' && !isStart && "border-dashed"
                                            )}
                                        >
                                            {icon || <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
                                            <span className="truncate tracking-tight font-medium">
                                                {b.guestName}
                                            </span>
                                        </button>
                                    )
                                })}
                                {dayBookings.length > 3 && (
                                    <div className="text-[10px] text-stone-400 font-medium pl-1">
                                        + {dayBookings.length - 3} más
                                    </div>
                                )}
                            </div>

                            {/* Mobile View: Simple Dots */}
                            <div className="md:hidden flex flex-wrap gap-1 content-end">
                                {dayBookings.slice(0, 6).map(b => (
                                    <div
                                        key={b.id}
                                        className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            b.status === 'confirmed' ? "bg-emerald-500" :
                                                b.status === 'pending' ? "bg-amber-400" : "bg-rose-400"
                                        )}
                                    />
                                ))}
                                {dayBookings.length > 6 && (
                                    <span className="text-[8px] text-stone-400 leading-none">+</span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}
