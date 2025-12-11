"use client"

import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Users, CalendarDays, Activity, ArrowRight, ArrowUpRight } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"

import { Suspense } from "react"

function AdminContent() {
    const { bookings } = useAppStore()

    // Calculate real metrics
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const activeBookings = bookings.filter(b => b.status !== 'cancelled').length
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
    const pendingBookings = bookings.filter(b => b.status === 'pending').length

    // Calculate upcoming check-ins (next 7 days)
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const upcomingCheckIns = bookings.filter(b => {
        if (!b.checkIn) return false
        const checkInDate = new Date(b.checkIn)
        return checkInDate >= now && checkInDate <= nextWeek && b.status !== 'cancelled'
    }).length

    // Calculate occupancy rate (simplified)
    const totalRooms = 20 // Pueblo (12) + Hideout (8)
    const occupancyRate = Math.min(100, Math.round((activeBookings / totalRooms) * 100))

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1">Confirmada</Badge>
            case "cancelled":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none px-3 py-1">Cancelada</Badge>
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none px-3 py-1">Pendiente</Badge>
        }
    }

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-light font-heading tracking-[0.2em] text-stone-900 dark:text-white uppercase">
                        Dashboard
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400 font-light tracking-wide mt-2">Visión general del estado de Mandalas.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/" target="_blank">
                        <Button variant="outline" className="h-10 px-6 border-stone-200 hover:bg-stone-50 text-stone-600 rounded-full font-medium text-xs tracking-wide">
                            <ArrowUpRight className="w-3 h-3 mr-2" />
                            SITIO PÚBLICO
                        </Button>
                    </Link>
                    {/* Placeholder for future Report generation functionality */}
                    <Button disabled className="bg-stone-900/50 text-white hover:bg-stone-800 shadow-xl shadow-stone-900/10 rounded-full h-10 px-6 font-medium text-xs tracking-wide cursor-not-allowed opacity-50">
                        DESCARGAR REPORTE
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            {/* Metrics Grid */}
            <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Revenue Card (Amber/Pueblo Theme) */}
                <StaggerItem>
                    <Card className="border-none shadow-lg relative overflow-hidden group bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-amber-100">Ingresos Totales</CardTitle>
                            <DollarSign className="h-4 w-4 text-white" />
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-light font-heading tracking-wide mt-2">${totalRevenue.toFixed(2)}</div>
                            <p className="text-xs text-amber-100 flex items-center mt-2 font-medium">
                                <span className="text-white flex items-center mr-1 bg-white/20 px-1.5 py-0.5 rounded-full"><ArrowUpRight className="w-3 h-3 mr-0.5" /> +20.1%</span> vs mes anterior
                            </p>
                        </CardContent>
                    </Card>
                </StaggerItem>

                {/* Active Bookings (Glass Style) */}
                <StaggerItem>
                    <Card className="border border-stone-100 dark:border-stone-800 shadow-sm bg-white/80 dark:bg-stone-900/60 backdrop-blur-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">Reservas Activas</CardTitle>
                            <CalendarDays className="h-4 w-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-light font-heading tracking-wide text-stone-900 dark:text-stone-100 mt-2">{activeBookings}</div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-light">
                                <span className="font-semibold text-stone-700 dark:text-stone-300">{confirmedBookings}</span> confirmadas <span className="text-stone-300">|</span> <span className="font-semibold text-stone-700 dark:text-stone-300">{pendingBookings}</span> pendientes
                            </p>
                        </CardContent>
                    </Card>
                </StaggerItem>

                {/* Upcoming (Glass Style) */}
                <StaggerItem>
                    <Card className="border border-stone-100 dark:border-stone-800 shadow-sm bg-white/80 dark:bg-stone-900/60 backdrop-blur-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">Próximas Llegadas</CardTitle>
                            <Users className="h-4 w-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-light font-heading tracking-wide text-stone-900 dark:text-stone-100 mt-2">{upcomingCheckIns}</div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-light">
                                Check-ins en los próximos 7 días
                            </p>
                        </CardContent>
                    </Card>
                </StaggerItem>

                {/* Occupancy (Hideout Theme Accent) */}
                <StaggerItem>
                    <Card className="border border-stone-100 dark:border-stone-800 shadow-sm bg-white/80 dark:bg-stone-900/60 backdrop-blur-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">Ocupación</CardTitle>
                            <Activity className="h-4 w-4 text-lime-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-light font-heading tracking-wide text-stone-900 dark:text-stone-100 mt-2">{occupancyRate}%</div>
                            <div className="mt-3 w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-lime-500 to-emerald-600 h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_10px_rgba(132,204,22,0.5)]"
                                    style={{ width: `${occupancyRate}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </StaggerItem>
            </StaggerReveal>

            {/* Main Content Grid */}
            <div className="grid gap-8 md:grid-cols-3">
                {/* Recent Bookings Table */}
                <Card className="md:col-span-2 border-stone-100 dark:border-stone-800 shadow-lg overflow-hidden bg-white dark:bg-stone-900/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-stone-100/50 dark:border-stone-800 p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="font-heading font-light text-lg tracking-wide uppercase text-stone-900 dark:text-stone-100">Reservas Recientes</CardTitle>
                                <CardDescription className="text-xs mt-1 text-stone-500 dark:text-stone-400">Últimas solicitudes recibidas.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 text-xs uppercase tracking-wider">
                                <Link href="/admin/reservations">Ver Todas</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-stone-50/30 dark:bg-stone-800/30 hover:bg-stone-50/30 dark:hover:bg-stone-800/30 border-stone-100 dark:border-stone-800">
                                    <TableHead className="pl-6 text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500 py-3">Huésped</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Ubicación</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Monto</TableHead>
                                    <TableHead className="text-center pr-6 text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-stone-400 text-sm">
                                            Sin reservas recientes.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bookings.slice(0, 5).map((booking) => (
                                        <TableRow key={booking.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors border-stone-100 dark:border-stone-800 cursor-pointer group">
                                            <TableCell className="font-medium pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center text-xs font-bold border border-stone-200 dark:border-stone-700 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
                                                        {booking.guestName.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-stone-700 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">{booking.guestName}</span>
                                                        <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-wide">{booking.roomType}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize text-stone-500 dark:text-stone-400 text-sm">{booking.location}</TableCell>
                                            <TableCell className="font-medium text-stone-900 dark:text-stone-100 text-sm">${booking.totalPrice}</TableCell>
                                            <TableCell className="text-center pr-6">
                                                {getStatusBadge(booking.status)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Quick Actions Panel */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-stone-900/50 rounded-2xl p-6 shadow-lg border border-stone-100 dark:border-stone-800 h-full backdrop-blur-sm">
                        <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-6">Acciones Rápidas</h3>
                        <div className="space-y-3">
                            <Link href="/admin/events?action=new" className="block">
                                <div className="w-full text-left p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-100 dark:border-stone-700 transition-all group flex items-center justify-between shadow-sm cursor-pointer">
                                    <span className="font-medium text-sm text-stone-600 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white">Nuevo Evento</span>
                                    <ArrowRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-stone-500 dark:group-hover:text-stone-400 transform group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>

                            {/* Actions below are placeholders for Phase 7 */}
                            <button disabled className="w-full text-left p-4 rounded-xl bg-stone-50/50 dark:bg-stone-800/30 border border-stone-100 dark:border-stone-700/50 opacity-60 cursor-not-allowed flex items-center justify-between">
                                <span className="font-medium text-sm text-stone-400 dark:text-stone-500">Bloquear Fecha (Próx)</span>
                                <ArrowRight className="w-4 h-4 text-stone-300/50 dark:text-stone-600/50" />
                            </button>
                            <button disabled className="w-full text-left p-4 rounded-xl bg-stone-50/50 dark:bg-stone-800/30 border border-stone-100 dark:border-stone-700/50 opacity-60 cursor-not-allowed flex items-center justify-between">
                                <span className="font-medium text-sm text-stone-400 dark:text-stone-500">Contactar Huésped (Próx)</span>
                                <ArrowRight className="w-4 h-4 text-stone-300/50 dark:text-stone-600/50" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-12 text-stone-400">Cargando dashboard...</div>}>
            <AdminContent />
        </Suspense>
    )
}
