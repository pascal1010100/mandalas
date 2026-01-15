import React from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent } from "@/components/ui/card"
import {
    DollarSign,
    Users,
    Clock,
    TrendingUp,
    CalendarCheck,
    AlertCircle,
    Activity,
    BarChart3
} from "lucide-react"
import { startOfMonth, endOfMonth, differenceInDays, parseISO, format, isSameDay } from "date-fns"

import { getBusinessDate, isStayNight } from '@/lib/business-date'
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/currency"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function DashboardStats() {
    const { bookings, rooms } = useAppStore()
    const businessDate = getBusinessDate()

    // Robust String Comparison (UTC-safe)
    const monthStartStr = format(startOfMonth(businessDate), 'yyyy-MM-dd')
    const monthEndStr = format(endOfMonth(businessDate), 'yyyy-MM-dd')
    const todayStr = format(businessDate, 'yyyy-MM-dd')

    // --- Financial Logic (Elite) ---

    // --- Financial Logic (Elite - Memoized) ---
    const stats = React.useMemo(() => {
        // 1. Revenue (Cash Flow vs Projected) - Filter by Check-In Date matching the Month
        const monthlyBookings = bookings.filter(b => {
            const checkInStr = b.checkIn.split('T')[0]
            return checkInStr >= monthStartStr && checkInStr <= monthEndStr && b.status !== 'cancelled'
        })

        const collectedRevenue = monthlyBookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

        const projectedRevenue = monthlyBookings
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

        // 2. Outstanding Debt (Global, not just this month)
        const debtBookings = bookings.filter(b =>
            b.status !== 'cancelled' &&
            b.paymentStatus !== 'paid' &&
            // Exclude maintenance "ghost" bookings if they exist in main list
            b.status !== 'maintenance'
        )
        const totalDebt = debtBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)

        // 3. Occupancy (Efficiency) - Active Stay Night
        const activeBookings = bookings.filter(b => {
            // EQUAL LOGIC TO GRID: Checked In = Occupying (always)
            if (b.status === 'checked_in') return true

            const isActiveStatus = b.status === 'confirmed' || b.status === 'pending' || b.status === 'maintenance'
            if (!isActiveStatus) return false

            // Is stay night? checkIn <= Today < checkOut
            const checkInStr = b.checkIn.split('T')[0]
            const checkOutStr = b.checkOut.split('T')[0]

            return checkInStr <= todayStr && checkOutStr > todayStr
        })

        const totalOccupiedBeds = activeBookings.reduce((sum, b) => {
            // ELITE LOGIC: Private Room Booking = 100% Occupancy of that room
            const room = rooms.find(r => r.id === b.roomType)

            if (room && (room.type === 'private' || room.type === 'suite')) {
                // Occupy the FULL capacity of the room (e.g. 2 beds), regardless of guest count
                return sum + room.capacity
            }

            // For Dorms: 1 Booking = 1 Bed (Guest Count usually 1)
            // Safety: Parse guests just in case, but usually dorm bookings come as single units.
            const guestCount = parseInt(b.guests || "1", 10)
            return sum + (isNaN(guestCount) ? 1 : guestCount)
        }, 0)

        const totalUnits = rooms.reduce((sum, room) => sum + room.capacity, 0)

        // Cap at 100% just in case of overbooking artifacts
        const occupancyRate = totalUnits > 0 ? Math.round((totalOccupiedBeds / totalUnits) * 100) : 0
        const displayOccupancy = Math.min(occupancyRate, 100)

        // 4. ADR (Average Daily Rate) - Efficiency of Pricing
        const totalNightsSold = monthlyBookings.reduce((sum, b) => {
            const nights = differenceInDays(parseISO(b.checkOut), parseISO(b.checkIn))
            return sum + Math.max(1, nights)
        }, 0)
        const adr = totalNightsSold > 0 ? projectedRevenue / totalNightsSold : 0

        return {
            collectedRevenue,
            projectedRevenue,
            debtBookings,
            totalDebt,
            activeBookings,
            totalUnits,
            displayOccupancy,
            adr,
            totalOccupiedBeds
        }
    }, [bookings, rooms, monthStartStr, monthEndStr, todayStr])

    const {
        collectedRevenue,
        projectedRevenue,
        debtBookings,
        totalDebt,
        activeBookings,
        totalUnits,
        displayOccupancy,
        adr,
        totalOccupiedBeds
    } = stats

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <TooltipProvider>
                {/* 1. Cash Flow (Real Money) - Emerald Glass */}
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 dark:border-emerald-500/20 bg-white dark:bg-stone-900/40 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-5 relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-[10px] font-bold text-stone-500 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1 cursor-help">
                                            <DollarSign className="w-3 h-3" /> Cash Flow <AlertCircle className="w-2.5 h-2.5 opacity-50" />
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>Dinero realmente cobrado vs Proyección total del mes.</TooltipContent>
                                </Tooltip>
                                <h3 className="text-2xl font-light text-stone-900 dark:text-white font-heading tracking-tight">
                                    {formatMoney(collectedRevenue)}
                                </h3>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Activity className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-[9px] font-medium text-stone-400 uppercase tracking-wide">
                                <span>Meta: {formatMoney(projectedRevenue)}</span>
                                <span>{projectedRevenue > 0 ? Math.round((collectedRevenue / projectedRevenue) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${projectedRevenue > 0 ? (collectedRevenue / projectedRevenue) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Outstanding Debt - Rose Alert */}
                <div className={cn(
                    "relative overflow-hidden rounded-2xl border transition-all duration-300 group",
                    totalDebt > 0
                        ? "bg-rose-50 border-rose-100 dark:bg-rose-950/10 dark:border-rose-900/30"
                        : "bg-white border-stone-200 dark:bg-stone-900/40 dark:border-white/5"
                )}>
                    <div className="p-5 relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className={cn("text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 cursor-help", totalDebt > 0 ? "text-rose-600 dark:text-rose-400" : "text-stone-400")}>
                                            <AlertCircle className="w-3 h-3" /> Por Cobrar
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>Saldo pendiente de reservas activas o pasadas.</TooltipContent>
                                </Tooltip>
                                <h3 className={cn("text-2xl font-light font-heading tracking-tight", totalDebt > 0 ? "text-rose-700 dark:text-rose-300" : "text-stone-400")}>
                                    {formatMoney(totalDebt)}
                                </h3>
                            </div>
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                                totalDebt > 0 ? "bg-rose-200/50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400" : "bg-stone-100 dark:bg-stone-800 text-stone-400")}>
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            {totalDebt > 0 ? (
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-[9px] font-bold text-rose-600 dark:text-rose-300 uppercase tracking-wide">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    {debtBookings.length} Reservas
                                </div>
                            ) : (
                                <span className="text-[9px] text-stone-400 dark:text-stone-600 uppercase tracking-wider font-medium">Todo al día</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Occupancy - Amber/Solar */}
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 dark:border-amber-500/20 bg-white dark:bg-stone-900/40 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-5 relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-[10px] font-bold text-stone-500 dark:text-amber-500 uppercase tracking-widest flex items-center gap-1 cursor-help">
                                            <Users className="w-3 h-3" /> Ocupación
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>% de Capacidad Vendida (Privadas cuentan 100%).</TooltipContent>
                                </Tooltip>
                                <h3 className="text-2xl font-light text-stone-900 dark:text-white mt-1 font-heading">
                                    {displayOccupancy}%
                                </h3>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
                                <CalendarCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1 overflow-hidden">
                                <div
                                    className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${displayOccupancy}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[9px] font-medium text-stone-400 mt-2 uppercase tracking-wide">
                                <span>{totalOccupiedBeds}/{totalUnits} Plazas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. RevPAR / Pricing - Purple */}
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 dark:border-purple-500/20 bg-white dark:bg-stone-900/40 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="p-5 relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-[10px] font-bold text-stone-500 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1 cursor-help">
                                            <TrendingUp className="w-3 h-3" /> Pricing
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>ADR (Tarifa Promedio) y RevPAR (Ingreso por Habitación Disponible).</TooltipContent>
                                </Tooltip>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-light text-stone-900 dark:text-white font-heading">{formatMoney(adr)}</h3>
                                    <span className="text-[9px] text-stone-400 font-bold uppercase">ADR</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <BarChart3 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">RevPAR</span>
                                <span className="text-[10px] font-mono text-stone-900 dark:text-white">{formatMoney(adr * (displayOccupancy / 100))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}
