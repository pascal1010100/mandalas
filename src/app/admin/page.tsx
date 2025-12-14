"use client"

import Link from "next/link"
import { useAppStore, Booking } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Users, CalendarDays, Activity, ArrowRight, ArrowUpRight } from "lucide-react"
import { format, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"
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
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { CreateReservationModal } from "@/components/admin/reservations/create-reservation-modal"
import { ReservationDetailsModal } from "@/components/admin/reservations/reservation-details-modal"
import { RoomStatusGrid } from "@/components/admin/dashboard/room-status-grid"
import { MiniCalendarWidget } from "@/components/admin/dashboard/mini-calendar"
import { useState } from "react"

import { Suspense } from "react"

function AdminContent() {
    const { bookings } = useAppStore()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

    const handleBookingClick = (booking: Booking) => {
        setSelectedBooking(booking)
        setIsDetailsModalOpen(true)
    }



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

    const handleExport = () => {
        const headers = ["ID", "Huesped", "Email", "Telefono", "Ubicacion", "Habitacion", "Pax", "CheckIn", "CheckOut", "Estado", "Total"]
        const csvContent = [
            headers.join(","),
            ...bookings.map(b => [
                b.id,
                `"${b.guestName}"`,
                b.email,
                b.phone || "",
                b.location,
                b.roomType,
                b.guests,
                b.checkIn,
                b.checkOut,
                b.status,
                b.totalPrice
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `reservas_mandalas_${format(new Date(), 'yyyy-MM-dd')}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-stone-900 dark:text-stone-100">
                        Panel de Control
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 max-w-2xl mt-2">
                        Bienvenido de nuevo. Tienes <span className="font-semibold text-emerald-600 dark:text-emerald-400">{bookings.filter(b => b.status === 'confirmed').length} reservas activas</span> este mes.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="border-stone-200 dark:border-stone-800" onClick={handleExport}>
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Descargar Reporte
                    </Button>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900"
                    >
                        <CalendarDays className="w-4 h-4 mr-2" />
                        Nueva Reserva
                    </Button>
                </div>
            </div>

            {/* Main Content Grid: Stats, Room Grid, Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Stats & Grid) takes 2/3 */}
                <StaggerReveal className="lg:col-span-2 space-y-8">
                    <DashboardStats />
                    <RoomStatusGrid onSelectBooking={handleBookingClick} />
                </StaggerReveal>



                {/* Right Column (Calendar & Operations) takes 1/3 */}
                <div className="lg:col-span-1 space-y-8">
                    <StaggerReveal delay={0.2} className="h-full flex flex-col gap-8">
                        <div className="h-[300px]">
                            <MiniCalendarWidget />
                        </div>

                        {/* Daily Operations Feed */}
                        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold font-heading text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-emerald-500" />
                                    Operaciones del Día
                                </h3>
                                <span className="text-xs font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">
                                    {format(new Date(), 'dd MMM', { locale: es })}
                                </span>
                            </div>

                            <div className="space-y-8">
                                {/* Check-ins */}
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                        Llegadas (Check-in)
                                    </h4>
                                    <div className="space-y-3">
                                        {bookings.filter(b => isSameDay(parseISO(b.checkIn), new Date()) && b.status !== 'cancelled').length === 0 ? (
                                            <div className="flex flex-col items-center justify-center p-6 border border-dashed border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-900/50">
                                                <p className="text-xs text-stone-400 italic">No hay llegadas programadas para hoy.</p>
                                            </div>
                                        ) : (
                                            bookings.filter(b => isSameDay(parseISO(b.checkIn), new Date()) && b.status !== 'cancelled').map(b => (
                                                <div
                                                    key={b.id}
                                                    onClick={() => handleBookingClick(b as Booking)}
                                                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-900"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-sm text-stone-800 dark:text-stone-200 truncate group-hover:text-amber-600 transition-colors">{b.guestName}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal border-stone-200 text-stone-500 rounded-md bg-stone-50 dark:bg-stone-800 dark:border-stone-700">
                                                                {b.roomType.replace(/_/g, ' ')}
                                                            </Badge>
                                                            <span className="text-[10px] text-stone-400 uppercase tracking-wide">• {b.guests} pax</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <Badge className={b.status === 'confirmed'
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                                                            : "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100"
                                                        }>
                                                            {b.status === 'confirmed' ? 'Conf.' : 'Pend.'}
                                                        </Badge>
                                                        {b.paymentStatus === 'pending' && (
                                                            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-1.5 py-0.5 rounded">
                                                                Pago Pend.
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="h-px bg-stone-100 dark:bg-stone-800 w-full" />

                                {/* Check-outs */}
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-600" />
                                        Salidas (Check-out)
                                    </h4>
                                    <div className="space-y-3">
                                        {bookings.filter(b => isSameDay(parseISO(b.checkOut), new Date()) && b.status !== 'cancelled').length === 0 ? (
                                            <div className="flex flex-col items-center justify-center p-6 border border-dashed border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-900/50">
                                                <p className="text-xs text-stone-400 italic">No hay salidas programadas para hoy.</p>
                                            </div>
                                        ) : (
                                            bookings.filter(b => isSameDay(parseISO(b.checkOut), new Date()) && b.status !== 'cancelled').map(b => (
                                                <div
                                                    key={b.id}
                                                    onClick={() => handleBookingClick(b as Booking)}
                                                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-stone-50/50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-white dark:hover:bg-stone-900 group"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-sm text-stone-600 dark:text-stone-300 line-through decoration-stone-300 truncate group-hover:no-underline group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">{b.guestName}</p>
                                                        <p className="text-[10px] text-stone-400 uppercase tracking-wide truncate mt-0.5">{b.location}</p>
                                                    </div>
                                                    <div className="text-[10px] font-mono text-stone-400 shrink-0 bg-white dark:bg-stone-800 px-2 py-1 rounded border border-stone-100 dark:border-stone-700">
                                                        #{b.id.substring(0, 4)}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </StaggerReveal>
                </div>
            </div>

            {/* Recent Reservations Table (Moved below) */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
                    <div>
                        <h3 className="font-bold font-heading text-lg text-stone-900 dark:text-stone-100">Reservas Recientes</h3>
                        <p className="text-sm text-stone-500">Últimos movimientos registrados</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/reservations">
                            Ver todas <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-stone-100 dark:border-stone-800">
                                <TableHead className="pl-6">Huésped / Habitación</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4" /> Fechas
                                    </div>
                                </TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right pr-6">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.slice(0, 5).map((booking) => (
                                <TableRow
                                    key={booking.id}
                                    onClick={() => handleBookingClick(booking as Booking)}
                                    className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors border-stone-100 dark:border-stone-800 cursor-pointer group"
                                >
                                    <TableCell className="font-medium pl-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-10 rounded bg-stone-100 dark:bg-stone-800 overflow-hidden shadow-sm shrink-0">
                                                {/* Placeholder for room image */}
                                                <div className={`w-full h-full ${booking.location === 'pueblo' ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-emerald-100 dark:bg-emerald-900/20'}`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-stone-700 dark:text-stone-200">{booking.guestName}</p>
                                                <p className="text-xs text-stone-400 capitalize">{booking.roomType} • {booking.location}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p className="font-medium text-stone-600 dark:text-stone-300">
                                                {format(new Date(booking.checkIn), 'dd MMM', { locale: es })} - {format(new Date(booking.checkOut), 'dd MMM', { locale: es })}
                                            </p>
                                            <p className="text-xs text-stone-400">{booking.guests} Adultos</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={
                                            booking.status === 'confirmed' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                                booking.status === 'pending' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                    "bg-stone-100 text-stone-700 border-stone-200"
                                        }>
                                            {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-medium pr-6">
                                        ${booking.totalPrice}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <CreateReservationModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <ReservationDetailsModal
                open={isDetailsModalOpen}
                onOpenChange={setIsDetailsModalOpen}
                booking={selectedBooking}
            />
        </div >
    )
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-12 text-stone-400">Cargando dashboard...</div>}>
            <AdminContent />
        </Suspense>
    )
}
