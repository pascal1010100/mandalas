"use client"

import * as React from "react"
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    parseISO,
    isWithinInterval,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, LogIn, LogOut, Wrench, Clock, CheckCircle, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Booking } from "@/lib/store"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

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
                <div className="flex gap-1 items-center">
                    <div className="flex items-center gap-2 mr-4 text-[10px] font-medium uppercase tracking-wider text-stone-500">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Pueblo</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Hideout</span>
                    </div>
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
            <div className="grid grid-cols-7 auto-rows-fr bg-stone-100 dark:bg-stone-800 gap-px border-b border-r border-stone-100 dark:border-stone-800">
                {calendarDays.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentDate)

                    // Find bookings for this day
                    const dayBookings = visibleBookings.filter(b =>
                        isWithinInterval(day, { start: parseISO(b.checkIn), end: parseISO(b.checkOut) })
                    )

                    // Sort: Check-ins first, then Stay-overs
                    dayBookings.sort((a, b) => {
                        const isStartA = isSameDay(day, parseISO(a.checkIn))
                        const isStartB = isSameDay(day, parseISO(b.checkIn))
                        return (isStartA === isStartB) ? 0 : isStartA ? -1 : 1
                    })

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[120px] bg-white dark:bg-stone-900/50 p-2 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 group flex flex-col gap-1",
                                !isCurrentMonth && "bg-stone-50/50 dark:bg-stone-900/20 opacity-50"
                            )}
                        >
                            <span className={cn(
                                "text-xs font-semibold mb-1 flex justify-between items-center",
                                isSameDay(day, new Date())
                                    ? "text-stone-900 dark:text-stone-100"
                                    : "text-stone-400 dark:text-stone-500"
                            )}>
                                {format(day, "d")}
                                {isSameDay(day, new Date()) && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                            </span>

                            <div className="flex flex-col gap-1">
                                {dayBookings.slice(0, 5).map(b => {
                                    const isStart = isSameDay(day, parseISO(b.checkIn))
                                    const isEnd = isSameDay(day, parseISO(b.checkOut))

                                    // Elite Status Logic
                                    let statusConfig = {
                                        bg: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800",
                                        icon: null as React.ReactNode,
                                        opacity: "opacity-100"
                                    }

                                    if (b.status === 'pending') {
                                        statusConfig.bg = "bg-amber-50 text-amber-700 border border-amber-200 border-dashed dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-800"
                                        statusConfig.icon = <Clock className="w-3 h-3 text-amber-500" />
                                    } else if (b.status === 'confirmed') {
                                        statusConfig.bg = "bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800/50"
                                        statusConfig.icon = <CheckCircle className="w-3 h-3 text-sky-500" />
                                    } else if (b.status === 'checked_in') {
                                        statusConfig.bg = "bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm font-semibold dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                                        statusConfig.icon = <Home className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    } else if (b.status === 'checked_out') {
                                        statusConfig.bg = "bg-stone-50 text-stone-400 decoration-stone-300 dark:bg-stone-900 dark:text-stone-600"
                                        statusConfig.opacity = "opacity-60"
                                        statusConfig.icon = <LogOut className="w-3 h-3" />
                                    } else if (b.status === 'maintenance') {
                                        statusConfig.bg = "bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:text-stone-400 border-dashed"
                                        statusConfig.icon = <Wrench className="w-3 h-3" />
                                    }

                                    // Day Specific Indicators
                                    let dayIndicator = ""
                                    if (isStart) {
                                        dayIndicator = "border-l-4 border-l-stone-800 dark:border-l-stone-200 pl-1" // Thick start marking
                                        if (b.status !== 'checked_in' && b.status !== 'checked_out') {
                                            statusConfig.icon = <LogIn className="w-3 h-3 text-indigo-500 animate-pulse" /> // Waiting for arrival
                                        }
                                    }
                                    if (isEnd) {
                                        dayIndicator += " border-r-2 border-r-stone-300 dark:border-r-stone-700 pr-1"
                                    }

                                    return (
                                        <TooltipProvider key={b.id}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onSelectBooking(b)
                                                        }}
                                                        className={cn(
                                                            "w-full text-left text-[9px] font-medium px-1.5 py-1 rounded-[4px] truncate transition-all hover:scale-[1.02] flex items-center gap-1.5",
                                                            statusConfig.bg,
                                                            statusConfig.opacity,
                                                            dayIndicator
                                                        )}
                                                    >
                                                        {statusConfig.icon ? statusConfig.icon : (
                                                            <div className={cn(
                                                                "w-1.5 h-1.5 rounded-full shrink-0",
                                                                b.location === 'pueblo' ? "bg-orange-400" : "bg-teal-400"
                                                            )} />
                                                        )}
                                                        <span className="truncate">{b.guestName}</span>
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent className="text-xs p-2 max-w-[200px]">
                                                    <div className="font-bold mb-1">{b.guestName}</div>
                                                    <div className="text-[10px] text-stone-500 mb-1">{b.roomType} (Unit: {b.unitId || 'N/A'})</div>
                                                    <div className="flex justify-between gap-4 text-[10px]">
                                                        <span>{format(parseISO(b.checkIn), "d MMM")} - {format(parseISO(b.checkOut), "d MMM", { locale: es })}</span>
                                                        <span className="font-mono">${b.totalPrice}</span>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )
                                })}
                                {dayBookings.length > 5 && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="text-[9px] text-stone-400 font-medium pl-1 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer transition-colors w-fit">
                                                + {dayBookings.length - 5} más
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-0 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xl z-50">
                                            <div className="p-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/50">
                                                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 mb-0.5">
                                                    {format(day, "EEEE d 'de' MMMM", { locale: es })}
                                                </h4>
                                                <p className="text-[10px] text-stone-500">{dayBookings.length} reservas en total</p>
                                            </div>
                                            <ScrollArea className="h-[280px]">
                                                <div className="p-2 flex flex-col gap-1">
                                                    {dayBookings.map(b => {
                                                        const isStart = isSameDay(day, parseISO(b.checkIn))
                                                        const isEnd = isSameDay(day, parseISO(b.checkOut))

                                                        // Elite Status Logic (Reused)
                                                        let statusConfig = {
                                                            bg: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800",
                                                            icon: null as React.ReactNode,
                                                            opacity: "opacity-100"
                                                        }

                                                        if (b.status === 'pending') {
                                                            statusConfig.bg = "bg-amber-50 text-amber-700 border border-amber-200 border-dashed dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-800"
                                                            statusConfig.icon = <Clock className="w-3 h-3 text-amber-500" />
                                                        } else if (b.status === 'confirmed') {
                                                            statusConfig.bg = "bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800/50"
                                                            statusConfig.icon = <CheckCircle className="w-3 h-3 text-sky-500" />
                                                        } else if (b.status === 'checked_in') {
                                                            statusConfig.bg = "bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm font-semibold dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                                                            statusConfig.icon = <Home className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                                        } else if (b.status === 'checked_out') {
                                                            statusConfig.bg = "bg-stone-50 text-stone-400 decoration-stone-300 dark:bg-stone-900 dark:text-stone-600"
                                                            statusConfig.opacity = "opacity-60"
                                                            statusConfig.icon = <LogOut className="w-3 h-3" />
                                                        } else if (b.status === 'maintenance') {
                                                            statusConfig.bg = "bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:text-stone-400 border-dashed"
                                                            statusConfig.icon = <Wrench className="w-3 h-3" />
                                                        }

                                                        // Day indicators (Simplified for List)
                                                        let dayIndicator = ""
                                                        if (isStart) dayIndicator = "border-l-4 border-l-stone-800 dark:border-l-stone-200 pl-2"

                                                        return (
                                                            <button
                                                                key={`popover-${b.id}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    onSelectBooking(b)
                                                                }}
                                                                className={cn(
                                                                    "w-full text-left text-[10px] font-medium px-2 py-2 rounded-md transition-all hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2 border border-transparent",
                                                                    statusConfig.bg,
                                                                    statusConfig.opacity,
                                                                    dayIndicator
                                                                )}
                                                            >
                                                                {statusConfig.icon}
                                                                <div className="flex flex-col overflow-hidden">
                                                                    <span className="truncate font-bold">{b.guestName}</span>
                                                                    <span className="truncate opacity-70 text-[9px]">{b.roomType}</span>
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </ScrollArea>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}
