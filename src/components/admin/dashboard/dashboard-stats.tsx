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
import {
    isSameDay,
    startOfMonth,
    endOfMonth,
    differenceInDays,
    parseISO,
    format
} from "date-fns"

import { getBusinessDate, isStayNight } from '@/lib/business-date'
import { cn, formatMoney } from "@/lib/utils"

export function DashboardStats() {
    const { bookings, rooms } = useAppStore()
    const businessDate = getBusinessDate()

    // Robust String Comparison (UTC-safe)
    const monthStartStr = format(startOfMonth(businessDate), 'yyyy-MM-dd')
    const monthEndStr = format(endOfMonth(businessDate), 'yyyy-MM-dd')
    const todayStr = format(businessDate, 'yyyy-MM-dd')

    // --- Financial Logic (Elite) ---

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
        (b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'checked_out') &&
        b.paymentStatus !== 'paid'
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

    const totalUnits = rooms.reduce((sum, room) => sum + room.capacity, 0)
    const occupancyRate = totalUnits > 0 ? Math.round((activeBookings.length / totalUnits) * 100) : 0
    const displayOccupancy = Math.min(occupancyRate, 100)

    // 4. ADR (Average Daily Rate) - Efficiency of Pricing
    const totalNightsSold = monthlyBookings.reduce((sum, b) => {
        const nights = differenceInDays(parseISO(b.checkOut), parseISO(b.checkIn))
        return sum + Math.max(1, nights)
    }, 0)
    const adr = totalNightsSold > 0 ? projectedRevenue / totalNightsSold : 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* 1. Cash Flow (Real Money) - Emerald Glass */}
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-emerald-950/20 backdrop-blur-xl shadow-2xl group transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-950/30">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50 pointer-events-none" />
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-emerald-500/30 transition-colors" />

                <div className="p-6 relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <DollarSign className="w-3 h-3" /> Caja Real
                            </p>
                            <h3 className="text-2xl xl:text-3xl font-light text-white font-heading tracking-tight">
                                {formatMoney(collectedRevenue)}
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-[10px] font-medium text-emerald-300/60 uppercase tracking-wide">
                            <span>Suma Proyectada</span>
                            <span>{formatMoney(projectedRevenue)}</span>
                        </div>
                        <div className="w-full bg-emerald-950/50 rounded-full h-1.5 overflow-hidden border border-emerald-500/10">
                            <div
                                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                style={{ width: `${projectedRevenue > 0 ? (collectedRevenue / projectedRevenue) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Outstanding Debt (Critical) - Rose Glass Warning */}
            <div className={cn(
                "relative overflow-hidden rounded-3xl border backdrop-blur-xl shadow-2xl group transition-all duration-300 hover:scale-[1.02]",
                totalDebt > 0
                    ? "bg-rose-950/20 border-rose-500/30 shadow-[0_0_30px_-5px_rgba(244,63,94,0.15)]"
                    : "bg-white/5 border-white/10"
            )}>
                {totalDebt > 0 && <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-50 pointer-events-none" />}
                <div className={cn("absolute -left-10 -bottom-10 w-32 h-32 blur-[60px] rounded-full pointer-events-none transition-colors", totalDebt > 0 ? "bg-rose-500/20" : "bg-white/5")} />

                <div className="p-6 relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={cn("text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-2", totalDebt > 0 ? "text-rose-400" : "text-stone-400")}>
                                <AlertCircle className="w-3 h-3" /> Por Cobrar
                            </p>
                            <h3 className={cn("text-2xl xl:text-3xl font-light font-heading tracking-tight", totalDebt > 0 ? "text-white" : "text-stone-400")}>
                                {formatMoney(totalDebt)}
                            </h3>
                        </div>
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg",
                            totalDebt > 0 ? "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-rose-900/20" : "bg-stone-800/50 border-stone-700 text-stone-500")}>
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                            totalDebt > 0 ? "bg-rose-500/10 border-rose-500/20 text-rose-300" : "bg-stone-800/30 border-stone-700 text-stone-500")}>
                            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", totalDebt > 0 ? "bg-rose-500" : "bg-stone-500")} />
                            {debtBookings.length} Reservas Pendientes
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Occupancy - Amber/Solar Glass */}
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-stone-900/40 backdrop-blur-xl shadow-2xl group transition-all duration-300 hover:scale-[1.02] hover:bg-stone-900/60">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-50 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

                <div className="p-6 relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-2">Ocupación</p>
                            <h3 className="text-2xl xl:text-3xl font-light text-white mt-1 font-heading">
                                {displayOccupancy}%
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-6">
                        {/* Circular Progress Micro-indicator or Bar */}
                        <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden border border-white/5">
                            <div
                                className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                style={{ width: `${displayOccupancy}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-medium text-stone-500 mt-2 uppercase tracking-wide">
                            <span>{activeBookings.length} Camas</span>
                            <span>{totalUnits} Capacidad</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Pricing Power - Royal Glass */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-stone-900/20 backdrop-blur-xl shadow-2xl group transition-all duration-300 hover:scale-[1.02] hover:bg-stone-900/40">
                <div className="absolute -right-10 bottom-0 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="p-6 relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">Pricing Power</p>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl xl:text-3xl font-light text-white font-heading">{formatMoney(adr)}</span>
                                    <span className="text-[10px] text-stone-500 font-mono uppercase">ADR</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="px-3 py-1.5 rounded-lg bg-stone-800/50 border border-white/5 flex items-center gap-2">
                            <BarChart3 className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">REVPAR: <span className="text-white">{formatMoney(adr * (displayOccupancy / 100))}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
