import React from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent } from "@/components/ui/card"
import {
    DollarSign,
    Users,
    Clock,
    TrendingUp,
    CalendarCheck,
    AlertCircle
} from "lucide-react"
import {
    startOfMonth,
    endOfMonth,
    isWithinInterval,
    startOfDay,
    endOfDay,
    format
} from "date-fns"
import { es } from "date-fns/locale"

export function DashboardStats() {
    const { bookings } = useAppStore()
    const now = new Date()

    // --- Metrics Calculation ---

    // 1. Total Revenue (Current Month)
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Filter: Status 'confirmed' AND (CheckIn OR CheckOut overlaps with current month)
    // Simplified: We count revenue if the booking *starts* in this month for now (or strictly falls within).
    // Let's go with "Bookings with check-in this month" for simplicity and robustness.
    const monthlyRevenue = bookings
        .filter(b =>
            b.status === 'confirmed' &&
            isWithinInterval(new Date(b.checkIn), { start: monthStart, end: monthEnd })
        )
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

    // 2. Active Occupancy (Today)
    // How many bookings include TODAY as an active day?
    const todayStart = startOfDay(now)
    const activeBookings = bookings.filter(b =>
        b.status === 'confirmed' &&
        new Date(b.checkIn) <= now &&
        new Date(b.checkOut) > now
    )

    // Approx Capacity: Pueblo (3 rooms) + Hideout (3 rooms) = 6 rooms total (simplified).
    // In reality, dorms have multiple beds, but let's count "Occupied Unit Types" for now or just raw Booking Count vs 6.
    const TOTAL_UNITS = 6
    const occupancyRate = Math.round((activeBookings.length / TOTAL_UNITS) * 100)
    // Cap at 100% just in case of overbooking/dorms counting multiple
    const displayOccupancy = Math.min(occupancyRate, 100)

    // 3. Pending Actions
    const pendingCount = bookings.filter(b => b.status === 'pending').length

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Revenue Card */}
            <Card className="bg-white dark:bg-stone-900 border-emerald-100 dark:border-emerald-900/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-emerald-50 to-transparent dark:from-emerald-900/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-mono tracking-wider uppercase">Ingresos (Mes)</p>
                            <h3 className="text-3xl font-light text-stone-900 dark:text-emerald-50 mt-2 font-heading">
                                ${monthlyRevenue.toLocaleString('es-MX')}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>{format(now, 'MMMM yyyy', { locale: es })}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Occupancy Card */}
            <Card className="bg-white dark:bg-stone-900 border-amber-100 dark:border-amber-900/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-amber-50 to-transparent dark:from-amber-900/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-mono tracking-wider uppercase">Ocupación Hoy</p>
                            <h3 className="text-3xl font-light text-stone-900 dark:text-amber-50 mt-2 font-heading">
                                {displayOccupancy}%
                            </h3>
                        </div>
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-stone-500 font-medium">
                        <CalendarCheck className="w-3 h-3 mr-1" />
                        <span>{activeBookings.length} habitaciones activas</span>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Card */}
            <Card className="bg-white dark:bg-stone-900 border-rose-100 dark:border-rose-900/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-rose-50 to-transparent dark:from-rose-900/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-mono tracking-wider uppercase">Por Confirmar</p>
                            <h3 className="text-3xl font-light text-stone-900 dark:text-rose-50 mt-2 font-heading">
                                {pendingCount}
                            </h3>
                        </div>
                        <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-rose-600 dark:text-rose-400 font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Requieren atención</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
