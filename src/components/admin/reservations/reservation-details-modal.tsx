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
    Trash2,
    X,
    MoreVertical
} from "lucide-react"

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
    const { updateBooking, updateBookingStatus, deleteBooking } = useAppStore() // Assuming deleteBooking might be needed later, for now we just status change

    const [isEditing, setIsEditing] = React.useState(false)
    const [formData, setFormData] = React.useState<Partial<Booking>>({})

    const [showCancellation, setShowCancellation] = React.useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false)
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
            }

            setCancellationReason("")
            setRefundStatus("none")
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200"
            case "cancelled": return "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200"
            default: return "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200"
        }
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
                <div className={cn("px-6 py-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-start",
                    booking.status === 'confirmed' ? "bg-emerald-50/30 dark:bg-emerald-900/5" :
                        booking.status === 'cancelled' ? "bg-rose-50/30 dark:bg-rose-900/5" : "bg-amber-50/30 dark:bg-amber-900/5"
                )}>
                    <div>
                        <DialogTitle className="text-xl font-bold font-heading flex items-center gap-2">
                            {isEditing ? "Editar Reserva" : "Detalles de Reserva"}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-mono mt-1 text-stone-500">
                            ID: {booking.id}
                        </DialogDescription>
                    </div>

                    <div className="flex gap-2">
                        {!isEditing && (
                            <Badge variant="outline" className={cn("capitalize shadow-sm", getStatusColor(booking.status))}>
                                {booking.status === 'confirmed' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                                    booking.status === 'cancelled' ? <XCircle className="w-3 h-3 mr-1" /> :
                                        <Clock className="w-3 h-3 mr-1" />}
                                {booking.status === 'cancelled' ? 'Cancelada' :
                                    booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                            </Badge>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 text-stone-400">
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
                                {booking.status === 'cancelled' && (
                                    <>
                                        <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'pending')}>
                                            <Clock className="w-4 h-4 mr-2" /> Reactivar (Marcar Pendiente)
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-rose-600 focus:text-rose-700 font-bold bg-rose-50 dark:bg-rose-900/10 focus:bg-rose-100 dark:focus:bg-rose-900/30"
                                            onClick={() => {
                                                if (confirm("¿Estás seguro de ELIMINAR permanentemente esta reserva? Esta acción no se puede deshacer.")) {
                                                    deleteBooking(booking.id)
                                                    toast.success("Reserva eliminada permanentemente")
                                                    onOpenChange(false)
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar Permanentemente
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                                        ? format(new Date(booking.checkIn), "dd MMM yyyy", { locale: es })
                                        : "Fecha inválida"}
                                </p>
                            </div>
                        </div>
                        <div className="h-8 w-[1px] bg-stone-200 dark:bg-stone-700" />
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-stone-400">Check-out</p>
                            <p className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                                {booking.checkOut && !isNaN(new Date(booking.checkOut).getTime())
                                    ? format(new Date(booking.checkOut), "dd MMM yyyy", { locale: es })
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

                    {/* Financials */}
                    <div className="bg-stone-50 dark:bg-stone-800/30 p-4 rounded-xl flex justify-between items-center">
                        <span className="text-sm font-medium text-stone-600 dark:text-stone-400 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Total Estimado
                        </span>
                        <span className="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100">
                            ${booking.totalPrice}
                        </span>
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
