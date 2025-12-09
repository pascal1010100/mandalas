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

export default function AdminDashboard() {
    const { bookings, events } = useAppStore()

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
                    <h2 className="text-3xl font-light font-heading tracking-[0.2em] text-stone-900 uppercase">
                        Dashboard
                    </h2>
                    <p className="text-stone-500 font-light tracking-wide mt-2">Visión general del estado de Mandalas.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/" target="_blank">
                        <Button variant="outline" className="h-10 px-6 border-stone-200 hover:bg-stone-50 text-stone-600 rounded-full font-medium text-xs tracking-wide">
                            <ArrowUpRight className="w-3 h-3 mr-2" />
                            SITIO PÚBLICO
                        </Button>
                    </Link>
                    <Button className="bg-stone-900 text-white hover:bg-stone-800 shadow-xl shadow-stone-900/10 rounded-full h-10 px-6 font-medium text-xs tracking-wide">
                        DESCARGAR REPORTE
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Revenue Card */}
                <Card className="border-none shadow-lg bg-stone-900 text-white relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-32 w-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:scale-110" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-2xl font-light font-heading tracking-wide mt-2">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-stone-400 flex items-center mt-2">
                            <span className="text-emerald-400 flex items-center mr-1"><ArrowUpRight className="w-3 h-3 mr-0.5" /> +20.1%</span> vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                {/* Active Bookings */}
                <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Reservas Activas</CardTitle>
                        <CalendarDays className="h-4 w-4 text-stone-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-light font-heading tracking-wide text-stone-900 mt-2">{activeBookings}</div>
                        <p className="text-xs text-stone-500 mt-2">
                            {confirmedBookings} confirmadas · {pendingBookings} pendientes
                        </p>
                    </CardContent>
                </Card>

                {/* Upcoming */}
                <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Próximas Llegadas</CardTitle>
                        <Users className="h-4 w-4 text-stone-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-light font-heading tracking-wide text-stone-900 mt-2">{upcomingCheckIns}</div>
                        <p className="text-xs text-stone-500 mt-2">
                            Check-ins en los próximos 7 días
                        </p>
                    </CardContent>
                </Card>

                {/* Occupancy */}
                <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Ocupación</CardTitle>
                        <Activity className="h-4 w-4 text-lime-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-light font-heading tracking-wide text-stone-900 mt-2">{occupancyRate}%</div>
                        <div className="mt-3 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-lime-600 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${occupancyRate}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 md:grid-cols-3">
                {/* Recent Bookings Table */}
                <Card className="md:col-span-2 border-stone-100 shadow-lg overflow-hidden bg-white">
                    <CardHeader className="border-b border-stone-100/50 p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="font-heading font-light text-lg tracking-wide uppercase text-stone-900">Reservas Recientes</CardTitle>
                                <CardDescription className="text-xs mt-1">Últimas solicitudes recibidas.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="hidden sm:flex text-stone-400 hover:text-stone-900 text-xs uppercase tracking-wider">Ver Todas</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-stone-50/30 hover:bg-stone-50/30 border-stone-100">
                                    <TableHead className="pl-6 text-[10px] uppercase tracking-widest font-bold text-stone-400 py-3">Huésped</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Ubicación</TableHead>
                                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Monto</TableHead>
                                    <TableHead className="text-center pr-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Estado</TableHead>
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
                                        <TableRow key={booking.id} className="hover:bg-stone-50/50 transition-colors border-stone-100 cursor-pointer group">
                                            <TableCell className="font-medium pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-bold border border-stone-200 group-hover:bg-stone-200 transition-colors">
                                                        {booking.guestName.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">{booking.guestName}</span>
                                                        <span className="text-[10px] text-stone-400 uppercase tracking-wide">{booking.roomType}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize text-stone-500 text-sm">{booking.location}</TableCell>
                                            <TableCell className="font-medium text-stone-900 text-sm">${booking.totalPrice}</TableCell>
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
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100 h-full">
                        <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-stone-400 mb-6">Acciones Rápidas</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition-all group flex items-center justify-between">
                                <span className="font-medium text-sm text-stone-600 group-hover:text-stone-900">Nuevo Evento</span>
                                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transform group-hover:translate-x-1 transition-all" />
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition-all group flex items-center justify-between">
                                <span className="font-medium text-sm text-stone-600 group-hover:text-stone-900">Bloquear Fecha</span>
                                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transform group-hover:translate-x-1 transition-all" />
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition-all group flex items-center justify-between">
                                <span className="font-medium text-sm text-stone-600 group-hover:text-stone-900">Contactar Huésped</span>
                                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transform group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
