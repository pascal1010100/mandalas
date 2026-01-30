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
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useBookings } from "@/domains/bookings"

export function MiniCalendarWidget() {
    const { bookings } = useBookings()
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

    // Filter active bookings
    const activeBookings = bookings.filter(b => b.status !== 'cancelled')

    return (
        <Card className="bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 shadow-sm h-full">
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold font-heading capitalize">
                        {format(currentDate, "MMMM yyyy", { locale: es })}
                    </CardTitle>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-6 w-6">
                            <ChevronLeft className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-6 w-6">
                            <ChevronRight className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-7 text-center mb-2">
                    {["D", "L", "M", "M", "J", "V", "S"].map((day, i) => (
                        <div key={i} className="text-[10px] font-bold text-stone-400">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, dayIdx) => {
                        const isCurrentMonth = isSameMonth(day, currentDate)

                        // Count bookings for this day
                        const dayOccupancy = activeBookings.filter(b =>
                            isWithinInterval(day, {
                                start: parseISO(b.checkIn),
                                end: parseISO(b.checkOut)
                            })
                        ).length

                        // Heatmap logic (Max capacity approx 24)
                        let intensityClass = "bg-transparent text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                        if (dayOccupancy > 0) intensityClass = "bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-900/20 dark:text-emerald-400"
                        if (dayOccupancy > 5) intensityClass = "bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-900/40 dark:text-emerald-300"
                        if (dayOccupancy > 12) intensityClass = "bg-emerald-200 text-emerald-900 font-bold dark:bg-emerald-900/60 dark:text-emerald-200"
                        if (dayOccupancy > 18) intensityClass = "bg-emerald-300 text-emerald-950 font-bold dark:bg-emerald-900/80 dark:text-emerald-100"

                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "h-8 md:h-9 flex items-center justify-center text-xs rounded-md transition-colors cursor-default",
                                    !isCurrentMonth && "opacity-20",
                                    intensityClass,
                                    isSameDay(day, new Date()) && "ring-2 ring-stone-900 dark:ring-stone-100 z-10"
                                )}
                            >
                                {format(day, "d")}
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 flex justify-between items-center text-[10px] text-stone-400">
                    <span>Menos</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded bg-emerald-50" />
                        <div className="w-2 h-2 rounded bg-emerald-100" />
                        <div className="w-2 h-2 rounded bg-emerald-200" />
                        <div className="w-2 h-2 rounded bg-emerald-300" />
                    </div>
                    <span>Más Ocup.</span>
                </div>
            </CardContent>
        </Card>
    )
}
