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
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200/60 pb-8">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-stone-900 font-heading">
                        Dashboard
                    </h2>
                    <p className="text-stone-500 text-lg mt-1">Bienvenido de nuevo, Jefe.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/">
                        <Button variant="outline" className="h-11 px-6 border-stone-200 hover:bg-stone-50 text-stone-600">
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            Ver Sitio Público
                        </Button>
                    </Link>
                    <Button className="bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/20 rounded-xl h-11 px-6">
                        Descargar Reporte
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Revenue Card - Gradient */}
                <Card
                    className="border-none shadow-xl relative overflow-hidden group"
                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
                >
                    <div className="absolute right-0 top-0 h-32 w-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:scale-110" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-white/90">Ingresos Totales</CardTitle>
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <DollarSign className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold font-heading tracking-tight mt-2 text-white">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-white/80 flex items-center mt-1 font-medium bg-white/10 w-fit px-2 py-1 rounded-full">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +20.1% este mes
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">Reservas Activas</CardTitle>
                        <CalendarDays className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-heading text-stone-900">{activeBookings}</div>
                        <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
                            <span className="text-blue-600 font-medium">{confirmedBookings} confirmadas</span>
                            <span className="text-stone-400">•</span>
                            <span className="text-yellow-600 font-medium">{pendingBookings} pendientes</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Card 3: Upcoming Check-ins */}
                <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">Próximas Llegadas</CardTitle>
                        <Users className="h-5 w-5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-heading text-stone-900">{upcomingCheckIns}</div>
                        <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
                            <span className="text-stone-600">Próximos 7 días</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Card 4: Occupancy Rate */}
                <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">Ocupación</CardTitle>
                        <Activity className="h-5 w-5 text-teal-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-heading text-stone-900">{occupancyRate}%</div>
                        <div className="mt-2 w-full bg-stone-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${occupancyRate}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-stone-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-500">Salud del Sistema</CardTitle>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <Activity className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-heading text-stone-900 mt-2">100%</div>
                        <p className="text-sm text-stone-400 mt-1">
                            Todos los sistemas nominales
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Recent Bookings Table */}
                <Card className="col-span-2 border-stone-100 shadow-xl overflow-hidden">
                    <CardHeader className="bg-stone-50/50 border-b border-stone-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="font-heading text-xl">Reservas Recientes</CardTitle>
                                <CardDescription>Últimas solicitudes recibidas en tiempo real.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="hidden sm:flex">Ver Todas</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-transparent hover:bg-transparent border-stone-100">
                                    <TableHead className="pl-6">Huésped</TableHead>
                                    <TableHead>Ubicación</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead className="text-center pr-6">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-stone-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="w-8 h-8 text-stone-300" />
                                                <p>Sin reservas recientes.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bookings.slice(0, 5).map((booking) => (
                                        <TableRow key={booking.id} className="hover:bg-purple-50/30 transition-colors border-stone-100 cursor-pointer">
                                            <TableCell className="font-medium pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                                                        {booking.guestName.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-stone-900">{booking.guestName}</span>
                                                        <span className="text-xs text-stone-400">{booking.roomType}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize text-stone-600">{booking.location}</TableCell>
                                            <TableCell className="font-bold text-stone-900">${booking.totalPrice}</TableCell>
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
                    <div className="bg-stone-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <h3 className="text-lg font-bold font-heading mb-1 relative z-10">Acciones Rápidas</h3>
                        <p className="text-stone-400 text-sm mb-6 relative z-10">Gestión eficiente del hostal.</p>

                        <div className="space-y-3 relative z-10">
                            <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group flex items-center justify-between">
                                <span className="font-medium text-sm">Nuevo Evento</span>
                                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group flex items-center justify-between">
                                <span className="font-medium text-sm">Bloquear Fecha</span>
                                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group flex items-center justify-between">
                                <span className="font-medium text-sm">Contactar Huésped</span>
                                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
