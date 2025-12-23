"use client"

import Link from "next/link"
import { useAppStore, Booking } from "@/lib/store"
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
import { StaggerReveal } from "@/components/animations/stagger-reveal"
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { CreateReservationModal } from "@/components/admin/reservations/create-reservation-modal"
import { ReservationDetailsModal } from "@/components/admin/reservations/reservation-details-modal"
import { RoomStatusGrid } from "@/components/admin/dashboard/room-status-grid"
import { MiniCalendarWidget } from "@/components/admin/dashboard/mini-calendar"
import { useState, Suspense } from "react"
import { cn } from "@/lib/utils"

function AdminContent() {
    const { bookings } = useAppStore()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [createModalInitialValues, setCreateModalInitialValues] = useState<{ location: "pueblo" | "hideout", roomType: string, unitId: string } | null>(null)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

    const handleBookingClick = (booking: Booking) => {
        setSelectedBooking(booking)
        setIsDetailsModalOpen(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNewBookingFromGrid = (room: any, unitId: string) => {
        setCreateModalInitialValues({
            location: room.location,
            roomType: room.id,
            unitId: unitId
        })
        setIsCreateModalOpen(true)
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

    const activeBookingsCount = bookings.filter(b => b.status === 'confirmed').length
    const checkInsToday = bookings.filter(b => isSameDay(parseISO(b.checkIn), new Date()) && b.status !== 'cancelled')
    const checkOutsToday = bookings.filter(b => isSameDay(parseISO(b.checkOut), new Date()) && b.status !== 'cancelled')

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-stone-900 dark:text-stone-100 notranslate" translate="no" suppressHydrationWarning>
                        Panel de Control
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 max-w-2xl mt-2">
                        Bienvenido de nuevo. Tienes <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeBookingsCount} reservas activas</span> este mes.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="border-stone-200 dark:border-stone-800" onClick={handleExport}>
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Descargar Reporte
                    </Button>
                    <Button
                        onClick={() => {
                            setCreateModalInitialValues(null)
                            setIsCreateModalOpen(true)
                        }}
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
                    <RoomStatusGrid onSelectBooking={handleBookingClick} onNewBooking={handleNewBookingFromGrid} />
                </StaggerReveal>

                {/* Right Column (Calendar & Operations) takes 1/3 */}
                <div className="lg:col-span-1 space-y-8">
                    <StaggerReveal delay={0.2} className="h-full flex flex-col gap-8">
                        <div className="h-[300px]">
                            <MiniCalendarWidget />
                        </div>

                        {/* Daily Operations Feed - Elite Timeline */}
                        <div className="bg-stone-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl h-fit relative overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <h3 className="font-bold font-heading text-lg text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-emerald-500" />
                                    Operaciones
                                </h3>
                                <span className="text-[10px] font-mono text-stone-400 bg-stone-800/50 px-2 py-1 rounded border border-white/5">
                                    {format(new Date(), 'dd MMM', { locale: es })}
                                </span>
                            </div>

                            <div className="space-y-0 relative pl-4">
                                {/* Timeline Line */}
                                <div className="absolute left-[19px] top-2 bottom-4 w-px bg-gradient-to-b from-stone-700 via-stone-800 to-transparent" />

                                {/* Check-ins Section */}
                                <div className="relative pb-8">
                                    <div className="absolute left-[-5px] top-0 w-12 h-12 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 border-4 border-stone-900 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-20 relative" />
                                    </div>
                                    <div className="pl-8">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-4 pt-1">
                                            Llegadas (Check-in)
                                        </h4>
                                        <div className="space-y-3">
                                            {checkInsToday.length === 0 ? (
                                                <div className="p-4 border border-dashed border-stone-800 rounded-xl bg-stone-900/30">
                                                    <p className="text-xs text-stone-500 italic">Todo tranquilo por ahora.</p>
                                                </div>
                                            ) : (
                                                checkInsToday.map(b => (
                                                    <div
                                                        key={b.id}
                                                        onClick={() => handleBookingClick(b as Booking)}
                                                        className="group relative flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-800/40 border border-white/5 hover:bg-stone-800 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
                                                    >
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-sm text-stone-200 group-hover:text-white transition-colors truncate">{b.guestName}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[10px] text-stone-400 uppercase tracking-wider">{b.roomType.replace(/_/g, ' ')}</span>
                                                            </div>
                                                        </div>
                                                        <Badge className={
                                                            b.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-400 border-none" : "bg-amber-500/10 text-amber-400 border-none"
                                                        }>
                                                            {b.status === 'confirmed' ? 'Conf.' : 'Pend.'}
                                                        </Badge>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Check-outs Section */}
                                <div className="relative">
                                    <div className="absolute left-[-5px] top-0 w-12 h-12 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-stone-500 border-4 border-stone-900 z-20 relative" />
                                    </div>
                                    <div className="pl-8">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4 pt-1">
                                            Salidas (Check-out)
                                        </h4>
                                        <div className="space-y-3">
                                            {checkOutsToday.length === 0 ? (
                                                <div className="p-4 border border-dashed border-stone-800 rounded-xl bg-stone-900/30">
                                                    <p className="text-xs text-stone-500 italic">No hay salidas hoy.</p>
                                                </div>
                                            ) : (
                                                checkOutsToday.map(b => (
                                                    <div
                                                        key={b.id}
                                                        onClick={() => handleBookingClick(b as Booking)}
                                                        className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-900/30 border border-white/5 opacity-60 hover:opacity-100 hover:bg-stone-800 transition-all duration-300 cursor-pointer"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-sm text-stone-400 line-through decoration-stone-600 group-hover:no-underline group-hover:text-stone-200 transition-colors truncate">{b.guestName}</p>
                                                        </div>
                                                        <div className="text-[10px] font-mono text-stone-600">
                                                            #{b.id.substring(0, 4)}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </StaggerReveal>
                </div>
            </div>

            {/* Recent Reservations Table - Elite Data Grid */}
            <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-stone-200/50 dark:border-white/5 shadow-2xl overflow-hidden relative">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="p-8 flex items-center justify-between border-b border-stone-100 dark:border-white/5 relative z-10">
                    <div>
                        <h3 className="font-bold font-heading text-xl text-stone-900 dark:text-white tracking-tight">Reservas Recientes</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Últimos movimientos registrados en el sistema</p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="rounded-full px-6 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-300">
                        <Link href="/admin/reservations">
                            Ver todas <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-white/[0.02]">
                                <TableHead className="pl-8 py-5 text-xs font-bold uppercase tracking-widest text-stone-400">Huésped / Habitación</TableHead>
                                <TableHead className="py-5 text-xs font-bold uppercase tracking-widest text-stone-400">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-3 h-3" /> Fechas
                                    </div>
                                </TableHead>
                                <TableHead className="py-5 text-xs font-bold uppercase tracking-widest text-stone-400">Estado</TableHead>
                                <TableHead className="text-right pr-8 py-5 text-xs font-bold uppercase tracking-widest text-stone-400">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.slice(0, 5).map((booking) => (
                                <TableRow
                                    key={booking.id}
                                    onClick={() => handleBookingClick(booking as Booking)}
                                    className="group transition-all duration-300 hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.05] border-stone-50 dark:border-white/5 cursor-pointer"
                                >
                                    <TableCell className="font-medium pl-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110",
                                                booking.location === 'pueblo'
                                                    ? 'bg-amber-100/50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500'
                                                    : 'bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500'
                                            )}>
                                                <span className="font-heading font-bold text-lg">{booking.guestName.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-stone-800 dark:text-stone-200 text-base group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">{booking.guestName}</p>
                                                <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mt-0.5">{booking.roomType.replace(/_/g, ' ')}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="text-sm">
                                            <p className="font-medium text-stone-600 dark:text-stone-300">
                                                {format(new Date(booking.checkIn), 'dd MMM', { locale: es })} - {format(new Date(booking.checkOut), 'dd MMM', { locale: es })}
                                            </p>
                                            <p className="text-xs text-stone-400 mt-0.5">{booking.guests} Adultos</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <Badge className={
                                            booking.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/20 hover:bg-emerald-500/20" :
                                                booking.status === 'pending' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/20 hover:bg-amber-500/20" :
                                                    "bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
                                        }>
                                            {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-heading font-light text-lg pr-8 py-5 text-stone-900 dark:text-white">
                                        ${booking.totalPrice.toLocaleString()}
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
                initialValues={createModalInitialValues}
            />

            <ReservationDetailsModal
                open={isDetailsModalOpen}
                onOpenChange={setIsDetailsModalOpen}
                booking={selectedBooking}
            />
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
