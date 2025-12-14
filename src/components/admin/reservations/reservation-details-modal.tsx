"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    BedDouble,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    Edit2,
    Save,
    Trash2, // Keeping Trash2 as I see it used in actions
    X,
    MoreVertical,
    LogOut,
    // CreditCard, // Removing unused
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { Booking, useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ReservationDetailsModalProps {
    booking: Booking | null
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultOpenCancellation?: boolean
}

export function ReservationDetailsModal({ booking, open, onOpenChange, defaultOpenCancellation = false }: ReservationDetailsModalProps) {
    const { updateBooking, updateBookingStatus, deleteBooking, checkOutBooking } = useAppStore()

    const [isEditing, setIsEditing] = React.useState(false)
    const [formData, setFormData] = React.useState<Partial<Booking>>({})

    const [showCancellation, setShowCancellation] = React.useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false)
    const [showCheckOut, setShowCheckOut] = React.useState(false)
    const [isPaymentSettled, setIsPaymentSettled] = React.useState(true)

    const [cancellationReason, setCancellationReason] = React.useState("")
    const [refundStatus, setRefundStatus] = React.useState<"none" | "partial" | "full">("none")

    // Reset when booking opens
    React.useEffect(() => {
        if (booking && open) {
            setFormData({
                guestName: booking.guestName,
                email: booking.email,
                phone: booking.phone,
                location: booking.location,
                roomType: booking.roomType,
                guests: booking.guests,
            })
            setIsEditing(false)

            // Logic for opening in special modes
            if (defaultOpenCancellation) {
                if (booking.status === 'cancelled') {
                    // Already cancelled -> Show Delete Confirmation
                    setShowDeleteConfirmation(true)
                    setShowCancellation(false)
                } else {
                    // Active -> Show Cancellation Form
                    setShowCancellation(true)
                    setShowDeleteConfirmation(false)
                }
            } else {
                setShowCancellation(false)
                setShowDeleteConfirmation(false)
                setShowCheckOut(false)
            }

            setCancellationReason("")
            setRefundStatus("none")
            setIsPaymentSettled(true)
        }
    }, [booking, open, defaultOpenCancellation])

    if (!booking) return null

    const handleSave = () => {
        if (!booking.id) return
        updateBooking(booking.id, formData)
        setIsEditing(false)
        toast.success("Reserva actualizada")
    }

    const handleConfirmCancellation = () => {
        if (!booking.id) return
        if (!cancellationReason) {
            toast.error("Por favor indica el motivo de cancelación")
            return
        }

        updateBooking(booking.id, {
            status: 'cancelled',
            cancellationReason,
            refundStatus,
            cancelledAt: new Date().toISOString()
        })

        toast.success("Reserva cancelada correctamente")
        setShowCancellation(false)
        onOpenChange(false)
    }

    const handlePermanentDelete = () => {
        if (!booking.id) return
        deleteBooking(booking.id)
        toast.success("Reserva eliminada permanentemente")
        setShowDeleteConfirmation(false)
        onOpenChange(false)
    }

    const handleCheckOut = async () => {
        if (!booking.id) return
        await checkOutBooking(booking.id, isPaymentSettled ? 'paid' : 'pending')
        toast.success("Check-out realizado exitosamente", {
            description: isPaymentSettled ? "La cuenta ha sido marcada como pagada." : "El pago quedó pendiente."
        })
        setShowCheckOut(false)
        onOpenChange(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200"
            case "cancelled": return "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200"
            case "checked_out": return "text-stone-500 bg-stone-100 dark:bg-stone-800 border-stone-200"
            default: return "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200"
        }
    }

    if (showCheckOut) {
        return (
            <Dialog open={open} onOpenChange={(val) => {
                if (!val) setShowCheckOut(false)
                onOpenChange(val)
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <LogOut className="w-5 h-5 text-indigo-500" /> Realizar Check-Out
                        </DialogTitle>
                        <DialogDescription>
                            Confirma la salida del huésped y el estado de su cuenta.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-lg border border-stone-100 dark:border-stone-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{booking.guestName}</p>
                                <p className="text-xs text-stone-500">ID: {booking.id.slice(0, 8)}...</p>
                            </div>
                            <Badge variant="outline" className={cn("capitalize shadow-sm", getStatusColor(booking.status))}>
                                {booking.status === 'confirmed' ? 'Confirmada' : booking.status}
                            </Badge>
                        </div>

                        <div className="flex items-start space-x-3 space-y-0 rounded-md border border-stone-200 dark:border-stone-800 p-4 shadow-sm bg-white dark:bg-stone-950">
                            <Checkbox id="payment_settled" checked={isPaymentSettled} onCheckedChange={(c) => setIsPaymentSettled(!!c)} />
                            <div className="space-y-1 leading-none">
                                <Label htmlFor="payment_settled" className="font-semibold cursor-pointer">
                                    Cuenta Liquidada
                                </Label>
                                <p className="text-sm text-stone-500 dark:text-stone-400">
                                    Marcar si el huésped ha pagado el total de ${booking.totalPrice}
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowCheckOut(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCheckOut}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Confirmar Salida
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    if (showDeleteConfirmation) {
        return (
            <Dialog open={open} onOpenChange={(val) => {
                if (!val) setShowDeleteConfirmation(false)
                onOpenChange(val)
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-rose-600 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" /> Eliminar Reserva
                        </DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que quieres eliminar esta reserva permanentemente? Esta acción borrará todos los datos del historial y no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-lg border border-rose-100 dark:border-rose-900/30">
                        <p className="text-sm font-medium text-rose-800 dark:text-rose-300">
                            Reserva: {booking.guestName}
                        </p>
                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                            ID: {booking.id}
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handlePermanentDelete}
                            className="bg-rose-600 hover:bg-rose-700"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar Definitivamente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    if (showCancellation) {
        return (
            <Dialog open={open} onOpenChange={(val) => {
                if (!val) setShowCancellation(false)
                onOpenChange(val)
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-rose-600 flex items-center gap-2">
                            <XCircle className="w-5 h-5" /> Cancelar Reserva
                        </DialogTitle>
                        <DialogDescription>
                            Esta acción liberará las fechas en el calendario. Esta acción no se puede deshacer fácilmente.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Motivo de Cancelación</Label>
                            <Select value={cancellationReason} onValueChange={setCancellationReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un motivo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client_request">Petición del Huésped</SelectItem>
                                    <SelectItem value="no_show">No Show (No se presentó)</SelectItem>
                                    <SelectItem value="payment_issue">Problema de Pago</SelectItem>
                                    <SelectItem value="dates_unavailable">Fechas no Disponibles</SelectItem>
                                    <SelectItem value="mistake">Error de Registro</SelectItem>
                                    <SelectItem value="other">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Estado del Reembolso</Label>
                            <Select value={refundStatus} onValueChange={(v) => setRefundStatus(v as "none" | "partial" | "full")}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin Reembolso (Retener Depósito)</SelectItem>
                                    <SelectItem value="partial">Reembolso Parcial</SelectItem>
                                    <SelectItem value="full">Reembolso Total</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-[10px] text-stone-500">
                                * Esto es solo informativo para tu control de caja.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowCancellation(false)}>
                            Volver
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmCancellation}
                            className="bg-rose-600 hover:bg-rose-700"
                        >
                            Confirmar Cancelación
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) setIsEditing(false)
            onOpenChange(val)
        }}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-2xl">
                {/* Header with Visual Status */}
                {/* Header with Visual Status & Cover Image */}
                <div className="relative h-40 overflow-hidden">
                    {/* Dynamic Cover Image */}
                    <div className="absolute inset-0">
                        <img
                            src={booking.location === 'hideout'
                                ? "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=600"
                                : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"}
                            alt="Room Cover"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                        <div className="text-white">
                            <DialogTitle className="text-2xl font-bold font-heading flex items-center gap-2 drop-shadow-md">
                                {isEditing ? "Editar Reserva" : booking.guestName}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-mono mt-1 text-stone-200/80 flex items-center gap-2">
                                <span className="bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm text-white">ID: {booking.id.slice(0, 8)}</span>
                                <span className="flex items-center gap-1 uppercase tracking-wider"><MapPin className="w-3 h-3" /> {booking.location}</span>
                            </DialogDescription>
                        </div>

                        <div className="flex gap-2">
                            {!isEditing && (
                                <Badge variant="outline" className={cn("capitalize shadow-sm backdrop-blur-md border-white/20 text-white font-bold px-3 py-1 scale-105",
                                    booking.status === 'confirmed' ? "bg-emerald-500/80" :
                                        booking.status === 'cancelled' ? "bg-rose-500/80" :
                                            booking.status === 'checked_out' ? "bg-stone-500/80" :
                                                "bg-amber-500/80"
                                )}>
                                    {booking.status === 'confirmed' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                                        booking.status === 'cancelled' ? <XCircle className="w-3 h-3 mr-1" /> :
                                            booking.status === 'checked_out' ? <LogOut className="w-3 h-3 mr-1" /> :
                                                <Clock className="w-3 h-3 mr-1" />}
                                    {booking.status === 'cancelled' ? 'Cancelada' :
                                        booking.status === 'checked_out' ? 'Check-Out' :
                                            booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                </Badge>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                    {booking.status !== 'cancelled' && (
                                        <>
                                            <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
                                                <Edit2 className="w-4 h-4 mr-2" /> {isEditing ? "Cancelar Edición" : "Editar"}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-rose-600 focus:text-rose-700" onClick={() => setShowCancellation(true)}>
                                                <Trash2 className="w-4 h-4 mr-2" /> Cancelar Reserva
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    {booking.status === 'checked_out' && (
                                        <DropdownMenuItem disabled className="text-stone-400">
                                            <LogOut className="w-4 h-4 mr-2" /> Check-out Completado
                                        </DropdownMenuItem>
                                    )}
                                    {booking.status === 'cancelled' && (
                                        <>
                                            <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'pending')}>
                                                <Clock className="w-4 h-4 mr-2" /> Reactivar (Marcar Pendiente)
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-rose-600 focus:text-rose-700 font-bold bg-rose-50 dark:bg-rose-900/10 focus:bg-rose-100 dark:focus:bg-rose-900/30"
                                                onClick={() => setShowDeleteConfirmation(true)} // Fixed direct handler
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar Permanentemente
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Cancellation Notice */}
                    {booking.status === 'cancelled' && booking.cancellationReason && (
                        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-lg p-3 text-sm">
                            <p className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                                <XCircle className="w-4 h-4" /> Reserva Cancelada
                            </p>
                            <div className="mt-1 text-rose-600 dark:text-rose-300 grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="font-semibold block">Motivo:</span>
                                    <span className="capitalize">{booking.cancellationReason.replace('_', ' ')}</span>
                                </div>
                                <div>
                                    <span className="font-semibold block">Reembolso:</span>
                                    <span className="capitalize">
                                        {booking.refundStatus === 'none' ? 'Sin Reembolso' :
                                            booking.refundStatus === 'full' ? 'Reembolso Total' : 'Parcial'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dates Section */}
                    <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl border border-stone-100 dark:border-stone-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center shadow-sm border border-stone-100 dark:border-stone-700">
                                <Calendar className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-stone-400">Check-in</p>
                                <p className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                                    {booking.checkIn && !isNaN(new Date(booking.checkIn).getTime())
                                        ? format(new Date(booking.checkIn + 'T12:00:00'), "dd MMM yyyy", { locale: es })
                                        : "Fecha inválida"}
                                </p>
                            </div>
                        </div>
                        <div className="h-8 w-[1px] bg-stone-200 dark:bg-stone-700" />
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-stone-400">Check-out</p>
                            <p className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                                {booking.checkOut && !isNaN(new Date(booking.checkOut).getTime())
                                    ? format(new Date(booking.checkOut + 'T12:00:00'), "dd MMM yyyy", { locale: es })
                                    : "Fecha inválida"}
                            </p>
                        </div>
                    </div>

                    {/* Guest Details */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 dark:border-stone-800 pb-2 flex items-center gap-2">
                            <User className="w-4 h-4" /> Información del Huésped
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-stone-500">Nombre Completo</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.guestName}
                                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                        className="h-8"
                                    />
                                ) : (
                                    <p className="font-medium text-stone-900 dark:text-stone-100">{booking.guestName}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-stone-500">Email</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="h-8"
                                    />
                                ) : (
                                    <p className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-stone-400" /> {booking.email}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-stone-500">Teléfono</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="h-8"
                                    />
                                ) : (
                                    <p className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                        <Phone className="w-3 h-3 text-stone-400" /> {booking.phone || "---"}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-stone-500">Huéspedes</Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.guests}
                                        onValueChange={(val) => setFormData({ ...formData, guests: val })}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6].map(n => (
                                                <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="font-medium text-stone-900 dark:text-stone-100">{booking.guests} Personas</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Room Details */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 dark:border-stone-800 pb-2 flex items-center gap-2">
                            <BedDouble className="w-4 h-4" /> Alojamiento
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-stone-500">Ubicación</Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.location}
                                        onValueChange={(val) => setFormData({ ...formData, location: val as 'pueblo' | 'hideout' })}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pueblo">Pueblo</SelectItem>
                                            <SelectItem value="hideout">Hideout</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="capitalize font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-stone-400" /> {booking.location}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-stone-500">Tipo Habitacion</Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.roomType}
                                        onValueChange={(val) => setFormData({ ...formData, roomType: val })}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dorm">Dormitorio</SelectItem>
                                            <SelectItem value="private">Privada</SelectItem>
                                            <SelectItem value="suite">Suite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="capitalize font-medium text-stone-900 dark:text-stone-100">
                                        {booking.roomType === 'dorm' ? "Compartido" : booking.roomType}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financials & Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-stone-50 dark:bg-stone-800/30 p-4 rounded-xl flex justify-between items-center border border-stone-100 dark:border-stone-800">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-stone-400">Total a Pagar</p>
                                <span className="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-1">
                                    <DollarSign className="w-5 h-5 text-emerald-500" /> {booking.totalPrice}
                                </span>
                            </div>
                            {booking.status === 'confirmed' && (
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Pagado</Badge>
                            )}
                        </div>

                        {/* Quick Check-Out Button for Confirmed Bookings */}
                        {booking.status === 'confirmed' && !isEditing && (
                            <Button
                                onClick={() => setShowCheckOut(true)}
                                className="h-full py-4 px-6 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 shadow-lg hover:shadow-xl transition-all"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase opacity-70 leading-none">Acción</span>
                                    <span className="font-bold">Check-Out</span>
                                </div>
                            </Button>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <DialogFooter className="p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
                        <Button onClick={handleSave} className="bg-stone-900 text-white dark:bg-white dark:text-stone-900">
                            <Save className="w-4 h-4 mr-2" /> Guardar Cambios
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
