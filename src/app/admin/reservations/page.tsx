"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
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
    Calendar,
    MapPin
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// ... imports remain the same ...

export default function ReservationsPage() {
    const { bookings, updateBookingStatus } = useAppStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"ALL" | "confirmed" | "pending" | "cancelled">("ALL")

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1 font-medium tracking-wide">Confirmada</Badge>
            case "cancelled":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none px-3 py-1 font-medium tracking-wide">Cancelada</Badge>
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none px-3 py-1 font-medium tracking-wide">Pendiente</Badge>
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200/60 pb-8">
                <div>
                    <h2 className="text-3xl font-light font-heading tracking-[0.2em] text-stone-900 uppercase">Reservas</h2>
                    <p className="text-stone-500 font-light tracking-wide mt-2">Gestiona y administra todas las solicitudes de hospedaje.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10 px-6 border-stone-200 hover:bg-stone-50 text-stone-600 rounded-full font-medium text-xs tracking-wide">
                        EXPORTAR CSV
                    </Button>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                        placeholder="Buscar por nombre o email..."
                        className="pl-11 bg-stone-50 border-stone-200 focus-visible:ring-stone-400 rounded-xl h-10 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button
                        variant={statusFilter === "ALL" ? "default" : "outline"}
                        onClick={() => setStatusFilter("ALL")}
                        className={statusFilter === "ALL" ? "bg-stone-900 text-white" : "text-stone-500 border-stone-200"}
                        size="sm"
                    >
                        Todas
                    </Button>
                    <Button
                        variant={statusFilter === "pending" ? "default" : "outline"}
                        onClick={() => setStatusFilter("pending")}
                        className={statusFilter === "pending" ? "bg-yellow-500 hover:bg-yellow-600 border-none text-white" : "text-yellow-600 border-yellow-200 bg-yellow-50/50"}
                        size="sm"
                    >
                        Pendientes
                    </Button>
                    <Button
                        variant={statusFilter === "confirmed" ? "default" : "outline"}
                        onClick={() => setStatusFilter("confirmed")}
                        className={statusFilter === "confirmed" ? "bg-green-600 hover:bg-green-700 border-none text-white" : "text-green-600 border-green-200 bg-green-50/50"}
                        size="sm"
                    >
                        Confirmadas
                    </Button>
                    <Button
                        variant={statusFilter === "cancelled" ? "default" : "outline"}
                        onClick={() => setStatusFilter("cancelled")}
                        className={statusFilter === "cancelled" ? "bg-red-600 hover:bg-red-700 border-none text-white" : "text-red-600 border-red-200 bg-red-50/50"}
                        size="sm"
                    >
                        Canceladas
                    </Button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-stone-50/50 border-stone-100">
                            <TableHead className="pl-6 py-4 text-[10px] uppercase tracking-widest font-bold text-stone-400">Huésped</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Habitación / Lugar</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Fechas</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Contacto</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Total</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Estado</TableHead>
                            <TableHead className="text-right pr-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64 text-center text-stone-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                                            <Search className="w-8 h-8 text-stone-300" />
                                        </div>
                                        <p className="font-medium text-stone-600">No se encontraron reservas</p>
                                        <p className="text-sm text-stone-400">Intenta ajustar los filtros de búsqueda.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => (
                                <TableRow key={booking.id} className="hover:bg-stone-50/50 transition-colors border-stone-100 group">
                                    <TableCell className="font-medium pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold border border-stone-200 group-hover:bg-stone-200 transition-colors">
                                                {booking.guestName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-stone-900">{booking.guestName}</div>
                                                <div className="text-xs text-stone-400 font-mono">ID: {booking.id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium flex items-center gap-1.5 text-stone-700">
                                                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                                <span className="capitalize">{booking.location}</span>
                                            </span>
                                            <span className="text-[10px] text-stone-500 uppercase tracking-wide bg-stone-100 px-2 py-0.5 rounded-full w-fit">
                                                {booking.roomType}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm text-stone-600">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-stone-400" />
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
                                        <div className="text-sm text-stone-600">
                                            <div className="font-medium">{booking.email || "No disponible"}</div>
                                            <div className="text-stone-400 text-xs">{booking.guests} huéspedes</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold font-heading text-lg text-stone-900">
                                            ${booking.totalPrice}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(booking.status)}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-stone-400 hover:text-stone-900">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Confirmar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "cancelled")}>
                                                    <XCircle className="mr-2 h-4 w-4 text-red-600" /> Cancelar
                                                </DropdownMenuItem>
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
        </div>
    )
}
