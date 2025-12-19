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
    parseISO
} from "date-fns"

import { getBusinessDate, isStayNight } from '@/lib/business-date'

export function DashboardStats() {
    const { bookings, rooms } = useAppStore()
    const businessDate = getBusinessDate() // Centralized "Hotel Today"

    // --- Metrics Calculation ---

    // 1. Revenue & ADR (Average Daily Rate)
    const monthStart = startOfMonth(businessDate)
    const monthEnd = endOfMonth(businessDate)

    // Filter: Confirmed bookings overlapping current month
    const monthlyBookings = bookings.filter(b =>
        b.status === 'confirmed' &&
        new Date(b.checkIn) >= monthStart && new Date(b.checkIn) <= monthEnd
    )

    const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)

    // ADR = Revenue / Rooms Sold
    // Simplified: Total Price / Total Nights of all bookings in month
    const totalNightsSold = monthlyBookings.reduce((sum, b) => {
        const nights = differenceInDays(new Date(b.checkOut), new Date(b.checkIn))
        return sum + Math.max(1, nights)
    }, 0)

    const adr = totalNightsSold > 0 ? monthlyRevenue / totalNightsSold : 0

    // 2. Occupancy & RevPAR
    // Robust Fix: Use centralized logic for "Active Stay Night"
    const activeBookings = bookings.filter(b =>
        (b.status === 'confirmed' || b.status === 'pending' || b.status === 'maintenance') &&
        isStayNight(businessDate, b.checkIn, b.checkOut)
    )

    // Total Capacity (Sum of room capacities from config)
    // capacity field represents Inventory (Beds for Dorms, Quantity for Privates)
    const totalUnits = rooms.reduce((sum, room) => sum + room.capacity, 0)
    // const dynamicUnits = rooms.length // This works if rooms array has one entry per unit type.

    const occupancyRate = Math.round((activeBookings.length / totalUnits) * 100)
    const displayOccupancy = Math.min(occupancyRate, 100)

    // RevPAR = ADR * Occupancy Rate
    const revPar = adr * (displayOccupancy / 100)


    // 3. Pending Actions
    const pendingCount = bookings.filter(b => b.status === 'pending').length

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Revenue Card - Primary Metric */}
            <Card className="bg-white dark:bg-stone-900 border-none shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-950 text-white" />
                <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ingresos (Mes)</p>
                            <h3 className="text-2xl font-light text-white mt-1 font-heading tracking-wide">
                                ${monthlyRevenue.toLocaleString('es-MX')}
                            </h3>
                        </div>
                        <div className="p-2 bg-white/10 rounded-lg text-white">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-400 font-medium mt-4">
                        <div className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            <span>ADR: ${adr.toFixed(0)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>RevPAR: ${revPar.toFixed(0)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Occupancy Card */}
            <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Ocupación Hoy</p>
                            <h3 className="text-3xl font-light text-stone-900 dark:text-stone-100 mt-1 font-heading">
                                {displayOccupancy}%
                            </h3>
                        </div>
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-500">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden mt-2">
                        <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${displayOccupancy}%` }}
                        />
                    </div>
                    <p className="text-xs text-stone-400 mt-2 text-right">{activeBookings.length} / {totalUnits} Unidades</p>
                </CardContent>
            </Card>

            {/* Arrivals Card */}
            <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Llegadas Hoy</p>
                            <h3 className="text-3xl font-light text-stone-900 dark:text-stone-100 mt-1 font-heading">
                                {bookings.filter(b => b.status !== 'cancelled' && isSameDay(parseISO(b.checkIn), businessDate)).length}
                            </h3>
                        </div >
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-500">
                            <Users className="w-5 h-5" />
                        </div>
                    </div >
                    <div className="flex items-center text-xs text-stone-500 font-medium">
                        <CalendarCheck className="w-3 h-3 mr-1" />
                        <span>Check-ins pendientes</span>
                    </div>
                </CardContent >
            </Card >

            {/* Pending Actions */}
            < Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300" >
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Acciones</p>
                            <h3 className="text-3xl font-light text-stone-900 dark:text-stone-100 mt-1 font-heading">
                                {pendingCount}
                            </h3>
                        </div>
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-500">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-rose-600 dark:text-rose-400 font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Solicitudes nuevas</span>
                    </div>
                </CardContent>
            </Card >
        </div >
    )
}
