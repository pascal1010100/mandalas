"use client"

import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { useBookings } from "@/domains/bookings"
import type { Booking } from "@/domains/bookings/types/types"
import { formatMoney } from "@/lib/currency"
import { DollarSign, Users, CalendarDays, Activity, ArrowRight, ArrowUpRight, Home, LogOut, CheckCircle, XCircle, Clock } from "lucide-react"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StaggerReveal } from "@/components/animations/stagger-reveal"
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { CashManagementWidget } from "@/components/admin/finance/cash-management" // New Import
import { CreateReservationModal } from "@/components/admin/reservations/create-reservation-modal"
import { ReservationDetailsModal } from "@/components/admin/reservations/reservation-details-modal"
import { RoomStatusGrid } from "@/components/admin/dashboard/room-status-grid"
import { MiniCalendarWidget } from "@/components/admin/dashboard/mini-calendar"
import { ServiceRequestFeed } from "@/components/admin/dashboard/service-request-feed"
import { useState, Suspense } from "react"
import { cn } from "@/lib/utils"

import { useEffect } from "react" // Add useEffect import

function AdminContent() {
    const {
        serviceRequests,
        fetchServiceRequests,
        updateServiceRequestStatus,
        subscribeToServiceRequests
    } = useAppStore()
    const { bookings } = useBookings()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [createModalInitialValues, setCreateModalInitialValues] = useState<{ location: "pueblo" | "hideout", roomType: string, unitId: string } | null>(null)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

    // Service Requests: Realtime Sync
    useEffect(() => {
        fetchServiceRequests()
        const unsubscribe = subscribeToServiceRequests()
        return () => unsubscribe()
    }, [])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "checked_in":
                return (
                    <Badge className="bg-violet-100/50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20 border border-violet-200 dark:border-violet-500/20 px-3 py-1 font-medium tracking-wide shadow-sm">
                        <Home className="w-3 h-3 mr-1.5" /> En Casa
                    </Badge>
                )
            case "checked_out":
                return (
                    <Badge variant="outline" className="bg-stone-100/50 text-stone-600 dark:bg-stone-800/50 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 border-dashed px-3 py-1 font-medium tracking-wide shadow-sm">
                        <LogOut className="w-3 h-3 mr-1.5" /> Historial
                    </Badge>
                )
            case "confirmed":
                return (
                    <Badge className="bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-200/50 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 font-medium tracking-wide shadow-sm">
                        <CheckCircle className="w-3 h-3 mr-1.5" /> Confirmada
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge className="bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-200/50 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 px-3 py-1 font-medium tracking-wide shadow-sm">
                        <XCircle className="w-3 h-3 mr-1.5" /> Cancelada
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-200/50 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/20 px-3 py-1 font-medium tracking-wide shadow-sm">
                        <Clock className="w-3 h-3 mr-1.5" /> Pendiente
                    </Badge>
                )
        }
    }

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

    const activeBookingsCount = bookings.filter(b =>
        b.status === 'confirmed' || b.status === 'checked_in'
    ).length

    // Robust local date comparison (avoids timezone vs UTC shifts)
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const checkInsToday = bookings.filter(b => b.checkIn.startsWith(todayStr) && b.status !== 'cancelled')
    const checkOutsToday = bookings.filter(b => b.checkOut.startsWith(todayStr) && b.status !== 'cancelled')

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

            {/* ACTION CENTER: SERVICE REQUESTS & PAYMENTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceRequests.filter(r => r.status === 'pending').length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4 flex flex-col justify-between gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                <Activity className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-amber-900 dark:text-amber-100 flex items-center justify-between">
                                    Solicitudes de Huéspedes
                                    <Badge variant="secondary" className="bg-amber-200 text-amber-900">{serviceRequests.filter(r => r.status === 'pending').length}</Badge>
                                </h3>
                                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {serviceRequests.filter(r => r.status === 'pending').map(req => {
                                        const guestName = bookings.find(b => b.id === req.booking_id)?.guestName || "Huésped"
                                        const roomName = bookings.find(b => b.id === req.booking_id)?.roomType || "Habitación"
                                        return (
                                            <div key={req.id} className="text-sm bg-white/50 dark:bg-black/20 p-2 rounded border border-amber-200/50 flex justify-between items-center">
                                                <div>
                                                    <span className="font-bold text-amber-900 dark:text-amber-200 block text-xs">{req.type === 'cleaning' ? '✨ Limpieza' : '🔧 Mantenimiento'}</span>
                                                    <span className="text-xs text-stone-600 dark:text-stone-400">{guestName} ({roomName})</span>
                                                </div>
                                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-emerald-200 text-emerald-700" onClick={() => updateServiceRequestStatus(req.id, 'completed')}>
                                                    ✅
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PENDING RESERVATIONS (e.g. Pay at Hotel / Manual) */}
                {bookings.some(b => b.status === 'pending' && b.paymentStatus !== 'verifying') && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 flex flex-col justify-between gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Activity className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Reservas Pendientes</h3>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    Hay {bookings.filter(b => b.status === 'pending' && b.paymentStatus !== 'verifying').length} reservas por confirmar.
                                </p>
                            </div>
                        </div>

                        {bookings.filter(b => b.status === 'pending' && b.paymentStatus !== 'verifying').length > 1 ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-md shadow-emerald-900/20 whitespace-nowrap"
                                    >
                                        Gestionar {bookings.filter(b => b.status === 'pending' && b.paymentStatus !== 'verifying').length} Reservas
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {bookings.filter(b => b.status === 'pending' && b.paymentStatus !== 'verifying').map(b => (
                                        <DropdownMenuItem key={b.id} onClick={() => handleBookingClick(b)}>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{b.guestName}</span>
                                                <span className="text-xs opacity-70">{new Date(b.checkIn).toLocaleDateString()} - {b.roomType}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-md shadow-emerald-900/20 whitespace-nowrap"
                                onClick={() => handleBookingClick(bookings.find(b => b.status === 'pending' && b.paymentStatus !== 'verifying')!)}
                            >
                                Ver Reserva Pendiente
                            </Button>
                        )}
                    </div>
                )}


                {bookings.some(b => b.paymentStatus === 'verifying') && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 flex flex-col justify-between gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Activity className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Pagos por Verificar</h3>
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                    Hay {bookings.filter(b => b.paymentStatus === 'verifying').length} pagos reportados.
                                </p>
                            </div>
                        </div>

                        {bookings.filter(b => b.paymentStatus === 'verifying').length > 1 ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-md shadow-indigo-900/20 whitespace-nowrap"
                                    >
                                        Revisar {bookings.filter(b => b.paymentStatus === 'verifying').length} Pagos
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {bookings.filter(b => b.paymentStatus === 'verifying').map(b => (
                                        <DropdownMenuItem key={b.id} onClick={() => handleBookingClick(b)}>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{b.guestName}</span>
                                                <span className="text-xs opacity-70">Ref: {b.paymentReference || 'N/A'} - Q{b.totalPrice}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-md shadow-indigo-900/20 whitespace-nowrap"
                                onClick={() => {
                                    const firstVerifying = bookings.find(b => b.paymentStatus === 'verifying')
                                    if (firstVerifying) handleBookingClick(firstVerifying)
                                }}
                            >
                                Revisar Pago
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* CASH MANAGEMENT WIDGET (New) */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <CashManagementWidget />
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
                        <div className="h-auto">
                            <ServiceRequestFeed />
                        </div>
                        <div className="h-auto">
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
                                                        {getStatusBadge(b.status)}
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
                                        {getStatusBadge(booking.status)}
                                    </TableCell>
                                    <TableCell className="text-right font-heading font-light text-lg pr-8 py-5 text-stone-900 dark:text-white">
                                        {/* Fixed: Use formatMoney for Q currency */}
                                        {formatMoney(booking.totalPrice)}
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
