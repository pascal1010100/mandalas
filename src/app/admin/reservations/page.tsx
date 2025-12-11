"use client"

import { useState } from "react"
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
    LayoutGrid
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { ReservationCalendar } from "@/components/admin/reservations/reservation-calendar"
import { ReservationDetailsModal } from "@/components/admin/reservations/reservation-details-modal"

export default function ReservationsPage() {
    const { bookings, updateBookingStatus } = useAppStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"ALL" | "confirmed" | "pending" | "cancelled">("ALL")

    // View State
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCancellationMode, setIsCancellationMode] = useState(false)

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleSelectBooking = (booking: Booking, cancelMode = false) => {
        setSelectedBooking(booking)
        setIsCancellationMode(cancelMode)
        setIsModalOpen(true)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return (
                    <Badge className="bg-emerald-100/50 text-emerald-700 hover:bg-emerald-200/50 border border-emerald-200 px-3 py-1 font-medium tracking-wide shadow-sm">
                        <CheckCircle className="w-3 h-3 mr-1.5" /> Confirmada
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge className="bg-rose-100/50 text-rose-700 hover:bg-rose-200/50 border border-rose-200 px-3 py-1 font-medium tracking-wide shadow-sm">
                        <XCircle className="w-3 h-3 mr-1.5" /> Cancelada
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-amber-100/50 text-amber-700 hover:bg-amber-200/50 border border-amber-200 px-3 py-1 font-medium tracking-wide shadow-sm">
                        <Clock className="w-3 h-3 mr-1.5" /> Pendiente
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200/60 pb-8">
                <div>
                    <h2 className="text-3xl font-light font-heading tracking-[0.2em] text-stone-900 dark:text-white uppercase">Reservas</h2>
                    <p className="text-stone-500 dark:text-stone-400 font-light tracking-wide mt-2">Gestiona y administra todas las solicitudes de hospedaje.</p>
                </div>
                <div className="flex gap-3">
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
                            <LayoutGrid className="w-3.5 h-3.5 mr-2" /> Calendario
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-stone-900/50 p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 backdrop-blur-sm transition-colors duration-300">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                        placeholder="Buscar por nombre o email..."
                        className="pl-11 bg-white dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus-visible:ring-amber-500/50 rounded-full h-10 text-sm shadow-sm transition-all hover:shadow-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button
                        variant={statusFilter === "ALL" ? "default" : "outline"}
                        onClick={() => setStatusFilter("ALL")}
                        className={statusFilter === "ALL" ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full shadow-lg" : "text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800"}
                        size="sm"
                    >
                        Todas
                    </Button>
                    <Button
                        variant={statusFilter === "pending" ? "default" : "outline"}
                        onClick={() => setStatusFilter("pending")}
                        className={statusFilter === "pending" ? "bg-amber-500 hover:bg-amber-600 border-none text-white rounded-full shadow-md shadow-amber-900/10" : "text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/20"}
                        size="sm"
                    >
                        Pendientes
                    </Button>
                    <Button
                        variant={statusFilter === "confirmed" ? "default" : "outline"}
                        onClick={() => setStatusFilter("confirmed")}
                        className={statusFilter === "confirmed" ? "bg-emerald-600 hover:bg-emerald-700 border-none text-white rounded-full shadow-md shadow-emerald-900/10" : "text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/20"}
                        size="sm"
                    >
                        Confirmadas
                    </Button>
                    <Button
                        variant={statusFilter === "cancelled" ? "default" : "outline"}
                        onClick={() => setStatusFilter("cancelled")}
                        className={statusFilter === "cancelled" ? "bg-rose-600 hover:bg-rose-700 border-none text-white rounded-full shadow-md shadow-rose-900/10" : "text-rose-600 dark:text-rose-500 border-rose-200 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/20"}
                        size="sm"
                    >
                        Canceladas
                    </Button>
                </div>
            </div>

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
                                filteredBookings.map((booking) => (
                                    <TableRow
                                        key={booking.id}
                                        className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors border-stone-100 dark:border-stone-800 group cursor-pointer"
                                        onClick={() => handleSelectBooking(booking)}
                                    >
                                        <TableCell className="font-medium pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 flex items-center justify-center font-bold border border-stone-200 dark:border-stone-700 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
                                                    {booking.guestName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-stone-900 dark:text-stone-100">{booking.guestName}</div>
                                                    <div className="text-xs text-stone-400 dark:text-stone-500 font-mono">ID: {booking.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                                                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                                    <span className="capitalize">{booking.location}</span>
                                                </span>
                                                <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wide bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full w-fit">
                                                    {booking.roomType}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm text-stone-600 dark:text-stone-400">
                                                <span className="flex items-center gap-2">
                                                    <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                                                    {booking.checkIn && !isNaN(new Date(booking.checkIn).getTime())
                                                        ? format(new Date(booking.checkIn), "MMM dd, yyyy", { locale: es })
                                                        : "Fecha no disponible"}
                                                </span>
                                                <span className="text-xs text-stone-400 pl-5">
                                                    al {booking.checkOut && !isNaN(new Date(booking.checkOut).getTime())
                                                        ? format(new Date(booking.checkOut), "MMM dd, yyyy", { locale: es })
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-stone-600 dark:text-stone-400">
                                                <div className="font-medium">{booking.email || "No disponible"}</div>
                                                <div className="text-stone-400 dark:text-stone-500 text-xs">{booking.guests} huéspedes</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold font-heading text-lg text-stone-900 dark:text-stone-100">
                                                ${booking.totalPrice}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(booking.status)}
                                        </TableCell>
                                        <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleSelectBooking(booking)}>
                                                        Ver Detalles
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Confirmar
                                                    </DropdownMenuItem>
                                                    {booking.status === 'cancelled' ? (
                                                        <DropdownMenuItem onClick={() => handleSelectBooking(booking, true)}>
                                                            <XCircle className="mr-2 h-4 w-4 text-red-600" /> Eliminar
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleSelectBooking(booking, true)}>
                                                            <XCircle className="mr-2 h-4 w-4 text-red-600" /> Cancelar
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "pending")}>
                                                        <Clock className="mr-2 h-4 w-4 text-yellow-600" /> Marcar Pendiente
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <ReservationCalendar
                    bookings={filteredBookings}
                    onSelectBooking={(b) => handleSelectBooking(b)}
                />
            )}

            <ReservationDetailsModal
                booking={selectedBooking}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                defaultOpenCancellation={isCancellationMode}
            />
        </div>
    )
}
