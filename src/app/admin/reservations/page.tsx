"use client"

import { useState, useMemo } from "react"
import { useAppStore, Booking } from "@/lib/store"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Search,
    MoreHorizontal,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    Calendar as CalendarIcon,
    MapPin,
    List,
    LayoutGrid,
    Plus
} from "lucide-react"
import { format, isSameDay, parseISO, isWithinInterval, areIntervalsOverlapping } from "date-fns"
import { es } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { ReservationCalendar } from "@/components/admin/reservations/reservation-calendar"
import { TimelineView } from "@/components/admin/reservations/timeline-view"
import { ReservationDetailsModal } from "@/components/admin/reservations/reservation-details-modal"
import { CreateReservationModal } from "@/components/admin/reservations/create-reservation-modal"
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import { ReservationFilters } from "@/components/admin/reservations/reservation-filters"
import { BedDouble, DoorOpen, CalendarClock, Users, Home, LogOut } from "lucide-react"


export default function ReservationsPage() {
    const { bookings, updateBookingStatus } = useAppStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"ALL" | "confirmed" | "pending" | "cancelled" | "checked_in" | "checked_out">("ALL")
    const [dateRange, setDateRange] = useState<DateRange | undefined>()

    // View State
    const [viewMode, setViewMode] = useState<"list" | "calendar" | "timeline">("list")
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCancellationMode, setIsCancellationMode] = useState(false)

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                booking.id.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter

            let matchesDate = true
            if (dateRange?.from && dateRange?.to) {
                const bookingStart = parseISO(booking.checkIn)
                const bookingEnd = parseISO(booking.checkOut)
                // Check for Overlap (Inclusive)
                matchesDate = areIntervalsOverlapping(
                    { start: bookingStart, end: bookingEnd },
                    { start: dateRange.from, end: dateRange.to },
                    { inclusive: true }
                )
            } else if (dateRange?.from) {
                const bookingStart = parseISO(booking.checkIn)
                matchesDate = isSameDay(bookingStart, dateRange.from)
            }

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [bookings, searchTerm, statusFilter, dateRange])

    const handleSelectBooking = (booking: Booking, cancelMode = false) => {
        setSelectedBooking(booking)
        setIsCancellationMode(cancelMode)
        setIsModalOpen(true)
    }

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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200/60 pb-8">
                <div>
                    <h2 className="text-3xl font-light font-heading tracking-[0.2em] text-stone-900 dark:text-white uppercase">Reservas</h2>
                    <p className="text-stone-500 dark:text-stone-400 font-light tracking-wide mt-2">Gestiona y administra todas las solicitudes de hospedaje.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full shadow-lg hover:shadow-xl transition-all notranslate"
                        onClick={() => setIsCreateModalOpen(true)}
                        translate="no"
                        suppressHydrationWarning
                    >
                        <Plus className="w-4 h-4 mr-2" /> Nueva Reserva
                    </Button>

                    <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-full flex gap-1">
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-full px-4 text-xs font-medium"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="w-3.5 h-3.5 mr-2" /> Lista
                        </Button>
                        <Button
                            variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-full px-4 text-xs font-medium"
                            onClick={() => setViewMode('calendar')}
                        >
                            <CalendarIcon className="w-3.5 h-3.5 mr-2" /> Mes
                        </Button>
                        <Button
                            variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-full px-4 text-xs font-medium"
                            onClick={() => setViewMode('timeline')}
                        >
                            <LayoutGrid className="w-3.5 h-3.5 mr-2" /> Timeline
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dashboard Stats */}
            <DashboardStats />

            {/* Filters Toolbar */}
            <ReservationFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
            />

            {/* Content Area */}
            {viewMode === 'list' ? (
                <div className="bg-white dark:bg-stone-900/50 rounded-2xl shadow-lg border border-stone-100 dark:border-stone-800 overflow-hidden backdrop-blur-sm transition-colors duration-300">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-stone-50/50 dark:bg-stone-800/50 border-stone-100 dark:border-stone-800">
                                <TableHead className="pl-6 py-4 text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Huésped</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Habitación / Lugar</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Fechas</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Contacto</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Total</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Estado</TableHead>
                                <TableHead className="text-right pr-6 text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBookings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center text-stone-500 dark:text-stone-400">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                                                <Search className="w-8 h-8 text-stone-300 dark:text-stone-600" />
                                            </div>
                                            <p className="font-medium text-stone-600 dark:text-stone-300">No se encontraron reservas</p>
                                            <p className="text-sm text-stone-400 dark:text-stone-500">Intenta ajustar los filtros de búsqueda.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBookings.map((booking) => {
                                    // Logic: Find Room Config for Label & Image
                                    const roomConfig = useAppStore.getState().rooms.find(r => r.id === booking.roomType)
                                    const roomLabel = roomConfig?.label || booking.roomType

                                    // Dynamic Image Logic
                                    let roomImage = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=200" // Default Dorm
                                    if (booking.roomType.includes('private')) roomImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=200"
                                    if (booking.roomType.includes('suite')) roomImage = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=200"
                                    if (booking.roomType.includes('female')) roomImage = "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&q=80&w=200"

                                    // Quick Action Logic
                                    const isToday = isSameDay(parseISO(booking.checkIn), new Date())
                                    // Show Check-In if Pending or Confirmed AND it's today
                                    const showQuickCheckIn = (booking.status === 'pending' || booking.status === 'confirmed') && isToday

                                    return (
                                        <TableRow
                                            key={booking.id}
                                            className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors border-stone-100 dark:border-stone-800 group cursor-pointer relative"
                                            onClick={() => handleSelectBooking(booking)}
                                        >
                                            <TableCell className="font-medium pl-6 py-4">
                                                {/* Clean Avatar Only */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center font-bold border border-stone-200 dark:border-stone-700 shadow-sm">
                                                        {booking.guestName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-stone-900 dark:text-stone-100 font-heading text-sm">{booking.guestName}</div>
                                                        <div className="text-[10px] text-stone-500 dark:text-stone-400 font-medium truncate max-w-[140px]">{booking.email}</div>
                                                    </div>
                                                </div>

                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                                                        {booking.roomType.includes('private') ? <DoorOpen className="w-3.5 h-3.5 text-amber-500" /> : <BedDouble className="w-3.5 h-3.5 text-stone-400" />}
                                                        {roomLabel}
                                                    </span>
                                                    <div className="flex items-center gap-2 pl-5">
                                                        {booking.unitId ? (
                                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-mono">
                                                                #{booking.unitId}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-[9px] text-stone-400 italic">Sin asignar</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm text-stone-600 dark:text-stone-400 gap-0.5">
                                                    <div className="flex items-center gap-1.5 font-medium text-stone-900 dark:text-stone-200 text-xs">
                                                        {booking.checkIn && !isNaN(new Date(booking.checkIn).getTime())
                                                            ? format(new Date(booking.checkIn), "d MMM", { locale: es })
                                                            : "--"}
                                                        <span className="text-stone-400">→</span>
                                                        {booking.checkOut && !isNaN(new Date(booking.checkOut).getTime())
                                                            ? format(new Date(booking.checkOut), "d MMM", { locale: es })
                                                            : "--"}
                                                    </div>
                                                    {booking.checkIn && booking.checkOut && (
                                                        <span className="text-[10px] text-stone-400 font-mono">
                                                            {((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} Noches
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-stone-600 dark:text-stone-400">
                                                    <a href={`tel:${booking.phone || ''}`} className="text-xs hover:text-stone-900 dark:hover:text-stone-100 block">{booking.phone || "-"}</a>
                                                    <div className="text-stone-400 dark:text-stone-500 text-[10px] mt-0.5 flex items-center gap-1">
                                                        <Users className="w-3 h-3" /> {booking.guests} Pax
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold font-heading text-sm text-stone-900 dark:text-stone-100 tabular-nums">
                                                    ${booking.totalPrice?.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(booking.status)}
                                            </TableCell>
                                            <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    {showQuickCheckIn && (
                                                        <Button
                                                            size="sm"
                                                            className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm px-3 rounded-full animate-in fade-in zoom-in duration-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                updateBookingStatus(booking.id, "checked_in")
                                                            }}
                                                        >
                                                            Check In (En Casa)
                                                        </Button>
                                                    )}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full">
                                                                <span className="sr-only">Abrir menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xl rounded-xl p-1">
                                                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-stone-400 px-2 py-1.5">Acciones</DropdownMenuLabel>
                                                            <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-stone-100 dark:focus:bg-stone-800" onClick={() => handleSelectBooking(booking)}>
                                                                <List className="mr-2 h-3.5 w-3.5" /> Ver Detalles
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-stone-100 dark:focus:bg-stone-800 text-violet-600 focus:text-violet-700" onClick={() => updateBookingStatus(booking.id, "checked_in")}>
                                                                <Home className="mr-2 h-3.5 w-3.5" /> Marcar En Casa (Check-in)
                                                            </DropdownMenuItem>
                                                            {booking.status !== 'confirmed' && (
                                                                <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-stone-100 dark:focus:bg-stone-800 text-emerald-600 focus:text-emerald-700" onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                                                                    <CheckCircle className="mr-2 h-3.5 w-3.5" /> Solo Confirmar
                                                                </DropdownMenuItem>
                                                            )}
                                                            {booking.status === 'checked_in' && (
                                                                <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-stone-100 dark:focus:bg-stone-800 text-stone-600 focus:text-stone-700" onClick={() => updateBookingStatus(booking.id, "checked_out")}>
                                                                    <LogOut className="mr-2 h-3.5 w-3.5" /> Check-Out
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-stone-100 dark:focus:bg-stone-800 text-amber-600 focus:text-amber-700" onClick={() => updateBookingStatus(booking.id, "pending")}>
                                                                <Clock className="mr-2 h-3.5 w-3.5" /> Marcar Pendiente
                                                            </DropdownMenuItem>
                                                            <div className="h-px bg-stone-100 dark:bg-stone-800 my-1" />
                                                            {booking.status === 'cancelled' ? (
                                                                <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-stone-100 dark:focus:bg-stone-800 text-rose-600 focus:text-rose-700" onClick={() => handleSelectBooking(booking, true)}>
                                                                    <XCircle className="mr-2 h-3.5 w-3.5" /> Eliminar Definitivamente
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-stone-100 dark:focus:bg-stone-800 text-rose-600 focus:text-rose-700" onClick={() => handleSelectBooking(booking, true)}>
                                                                    <XCircle className="mr-2 h-3.5 w-3.5" /> Cancelar Reserva
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : viewMode === 'calendar' ? (
                <ReservationCalendar
                    bookings={filteredBookings}
                    onSelectBooking={(b) => handleSelectBooking(b)}
                />
            ) : (
                <TimelineView
                    bookings={filteredBookings}
                    onSelectBooking={(b) => handleSelectBooking(b)}
                />
            )
            }

            <ReservationDetailsModal
                booking={selectedBooking}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                defaultOpenCancellation={isCancellationMode}
            />

            <CreateReservationModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />
        </div >
    )
}
