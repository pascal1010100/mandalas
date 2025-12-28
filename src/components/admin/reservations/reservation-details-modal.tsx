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
    Shield,
    Key,
    ClipboardCheck,
    Loader2,
    Ghost,
    AlertTriangle,
    Users,
    Plus,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { supabase } from "@/lib/supabase"

interface ReservationDetailsModalProps {
    booking: Booking | null
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultOpenCancellation?: boolean
}

export function ReservationDetailsModal({ booking: initialBooking, open, onOpenChange, defaultOpenCancellation = false }: ReservationDetailsModalProps) {
    const { bookings, rooms, updateBooking, updateBookingStatus, deleteBooking, checkOutBooking } = useAppStore()

    // LIVE DATA: Find the latest version of this booking in the store
    // This allows UI to react instantly to changes (like Payment Status toggle)
    const booking = React.useMemo(() =>
        bookings.find(b => b.id === initialBooking?.id) || initialBooking,
        [bookings, initialBooking])

    const [isEditing, setIsEditing] = React.useState(false)
    const [formData, setFormData] = React.useState<Partial<Booking>>({})

    const [showCancellation, setShowCancellation] = React.useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false)
    const [showCheckOut, setShowCheckOut] = React.useState(false)
    const [showPaymentAlert, setShowPaymentAlert] = React.useState(false)
    const [cancellationNote, setCancellationNote] = React.useState("")
    const [refundAmount, setRefundAmount] = React.useState("") // New state for amount
    const [notifyGuest, setNotifyGuest] = React.useState(true)
    const [isPaymentSettled, setIsPaymentSettled] = React.useState(true)

    const [cancellationReason, setCancellationReason] = React.useState("")
    const [refundStatus, setRefundStatus] = React.useState<"none" | "partial" | "full">("none")
    // New State for Batch Cancellation
    const [isBatchCancellation, setIsBatchCancellation] = React.useState(false)

    // Elite Logic States
    const [showCheckInDialog, setShowCheckInDialog] = React.useState(false)
    const [checkInWarnings, setCheckInWarnings] = React.useState<string[]>([])
    const [idType, setIdType] = React.useState<"passport" | "dni" | "license" | "other">("passport")
    const [idNumber, setIdNumber] = React.useState("")

    // Check-out Logic

    // Check-out Logic
    const [checkOutAudit, setCheckOutAudit] = React.useState({
        keysReturned: false,
        towelReturned: false,
        noDamage: false
    })
    const [checkOutWarnings, setCheckOutWarnings] = React.useState<string[]>([])

    // Payment Collection Logic
    const [showPaymentCollectionDialog, setShowPaymentCollectionDialog] = React.useState(false)
    const [paymentMethod, setPaymentMethod] = React.useState<"cash" | "card" | "transfer" | "other">("cash")
    const [paymentReference, setPaymentReference] = React.useState("")

    // GROUP LOGIC (Elite) - Moved to top to avoid Hook Rule Violation
    const relatedBookings = React.useMemo(() => {
        if (!booking) return []
        return bookings.filter(b =>
            b.id !== booking.id &&
            b.email.toLowerCase() === booking.email.toLowerCase() &&
            b.status !== 'cancelled' &&
            new Date(b.checkOut) > new Date()
        )
    }, [booking, bookings])

    const groupBookings = React.useMemo(() => booking ? [booking, ...relatedBookings] : [], [booking, relatedBookings])
    const isGroup = relatedBookings.length > 0

    // Honesty Bar / Extras Logic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [extraCharges, setExtraCharges] = React.useState<any[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = React.useState<any[]>([])
    const [showAddCharge, setShowAddCharge] = React.useState(false)
    const [newCharge, setNewCharge] = React.useState({ productId: "", quantity: 1 })

    const fetchProducts = React.useCallback(async () => {
        const { data } = await supabase.from('products').select('*').eq('active', true).order('name')
        if (data) setProducts(data)
    }, [])


    const fetchCharges = React.useCallback(async () => {
        if (!booking) return
        const { data } = await supabase.from('charges').select('*').eq('booking_id', booking.id).order('created_at', { ascending: false })
        if (data) setExtraCharges(data)
    }, [booking])

    // Realtime Sync for Admin (Charges)
    React.useEffect(() => {
        if (!booking?.id) return

        const channel = supabase
            .channel(`admin-charges-${booking.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'charges',
                    filter: `booking_id=eq.${booking.id}`
                },
                () => {
                    fetchCharges()
                    toast.info("Cargos actualizados")
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [booking?.id, fetchCharges])

    const handleDeleteCharge = async (id: string) => {
        if (!confirm("¿Eliminar este cargo?")) return
        const { error } = await supabase.from('charges').delete().eq('id', id)
        if (!error) {
            toast.success("Cargo eliminado")
            fetchCharges()
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleToggleChargeStatus = async (charge: any) => {
        const newStatus = charge.status === 'paid' ? 'pending' : 'paid'
        const { error } = await supabase.from('charges').update({ status: newStatus }).eq('id', charge.id)
        if (error) {
            toast.error("Error al actualizar estado")
        } else {
            toast.success(`Cargo marcado como ${newStatus === 'paid' ? 'PAGADO' : 'PENDIENTE'}`)
            fetchCharges()
        }
    }

    const handleSettleAllCharges = async () => {
        if (!booking) return
        if (!confirm("¿Marcar TODOS los cargos extra como PAGADOS?")) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase.from('charges').update({ status: 'paid' }).eq('booking_id', booking.id).eq('status', 'pending')
        if (error) {
            toast.error("Error al procesar")
        } else {
            toast.success("Todos los cargos han sido saldados")
            fetchCharges()
        }
    }

    const handleAddCharge = async () => {
        if (!newCharge.productId) return

        const product = products.find(p => p.id === newCharge.productId)
        if (!product) return

        const { error } = await supabase.from('charges').insert({
            booking_id: booking?.id,
            product_id: product.id,
            item_name: product.name,
            amount: product.price * newCharge.quantity,
            quantity: newCharge.quantity,
            status: 'pending' // Usually pending until paid with room
        })

        if (error) {
            toast.error("Error al agregar cargo")
        } else {
            toast.success("Cargo agregado")
            setNewCharge({ productId: "", quantity: 1 })
            setShowAddCharge(false)
            fetchCharges() // Refresh list
        }
    }

    // Master Totals
    const groupTotal = groupBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const groupPaidCount = groupBookings.filter(b => b.paymentStatus === 'paid').length
    const groupPendingDebt = groupBookings
        .filter(b => b.paymentStatus !== 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0)

    const handleBatchCheckIn = () => {
        // Identity Guard
        if (!idNumber || idNumber.length < 3) {
            toast.error("Identificación requerida para Check-in Grupal")
            return
        }

        groupBookings.forEach(b => {
            updateBooking(b.id, {
                guestIdType: idType,
                guestIdNumber: idNumber, // Share ID for group leader
                status: 'checked_in'
            })
        })
        toast.success(`¡Check-in realizado para ${groupBookings.length} huéspedes!`)
        setShowCheckInDialog(false)
        onOpenChange(false)
    }

    const handleBatchPayment = () => {
        groupBookings.forEach(b => {
            updateBooking(b.id, {
                paymentStatus: 'paid',
                paymentMethod: paymentMethod,
                paymentReference: paymentReference
            })
        })
        toast.success(`Pago grupal de Q${groupPendingDebt} registrado`)
        setShowPaymentCollectionDialog(false)
    }

    const handleBatchCheckOut = async () => {
        // Debt Guard
        if (groupPendingDebt > 0) {
            const confirmed = window.confirm(`El grupo tiene una deuda de Q${groupPendingDebt}. ¿Confirmar salida con deuda?`)
            if (!confirmed) return
        }

        // Execute Check-out for each
        for (const b of groupBookings) {
            if (b.status === 'checked_in') {
                await checkOutBooking(b.id, b.paymentStatus === 'paid' ? 'paid' : 'pending')
            }
        }
        toast.success(`Check-out grupal realizado para ${groupBookings.length} reservas`)
        onOpenChange(false)
    }

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
            setIsBatchCancellation(false) // Reset batch mode
            // INTELLIGENT DEFAULT: Check if already paid
            setIsPaymentSettled(booking.paymentStatus === 'paid')

            // Identity Defaults
            setIdType(booking.guestIdType || 'passport')
            setIdNumber(booking.guestIdNumber || '')

            // Reset Audit
            setCheckOutAudit({ keysReturned: false, towelReturned: false, noDamage: false })
            setCheckInWarnings([])
            setCheckInWarnings([]) // Keeping duplicate as observed in original file safely
            setCheckOutWarnings([])

            // Payment Defaults
            setPaymentMethod(booking.paymentMethod || "cash")
            setPaymentReference(booking.paymentReference || "")

            // Fetch Extras
            fetchCharges()
            fetchProducts()

        }
    }, [booking, open, defaultOpenCancellation])

    if (!booking) return null

    const handleSave = () => {
        if (!booking.id) return
        updateBooking(booking.id, formData)
        setIsEditing(false)
        toast.success("Reserva actualizada")
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendEmail = async (type: 'confirmation' | 'cancellation', extraData: any = {}) => {
        const roomConfig = rooms.find(r => r.id === booking.roomType)
        const roomName = roomConfig ? roomConfig.label : booking.roomType

        // Async dispatch - Don't block UI but show toast
        const toastId = toast.loading("Enviando correo al huésped...")

        try {
            await fetch('/api/emails/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    to: booking.email,
                    data: {
                        guestName: booking.guestName,
                        bookingId: booking.id,
                        checkIn: booking.checkIn,
                        checkOut: booking.checkOut,
                        roomName: roomName,
                        totalPrice: booking.totalPrice,
                        location: booking.location,
                        ...extraData
                    }
                })
            })
            toast.success("Correo enviado correctamente", { id: toastId })
        } catch (error) {
            console.error("Email send failed", error)
            toast.error("No se pudo enviar el correo (API Key faltante o error)", { id: toastId })
        }
    }

    const handleConfirmCancellation = async () => {
        if (!booking.id) return
        if (!cancellationReason) {
            toast.error("Por favor indica el motivo de cancelación")
            return
        }

        const targets = isBatchCancellation ? groupBookings : [booking]
        const cancellationData = {
            status: 'cancelled' as const,
            cancellationReason: cancellationNote ? `${cancellationReason} - ${cancellationNote}` : cancellationReason,
            refundStatus,
            refundAmount: refundStatus === 'partial' ? Number(refundAmount) / targets.length : 0, // Split amount or 0? Usually per booking. Let's keep it simple: 0 for now unless sophisticated.
            cancelledAt: new Date().toISOString()
        }

        // Parallel update
        // Note: For refundAmount, if "Partial Refund" is typed as total 500, dividing it might be safer, 
        // but for now let's assume the user handles refund externally or per-booking. 
        // Better: Apply 0 to auto-fields and let user manage money manually. 

        for (const target of targets) {
            updateBooking(target.id, {
                ...cancellationData,
                // If it's batch, we might want to flag it? No need.
            })
            if (notifyGuest) {
                // In a real app we'd queue this. Here we await to show progress.
                await sendEmail('cancellation', {
                    refundStatus,
                    guestName: target.guestName, // Personalize
                    refundAmount: 0 // Hide amount in batch email to avoid confusion
                })
            }
        }

        toast.success(isBatchCancellation
            ? `Grupo cancelado (${targets.length} reservas)`
            : "Reserva cancelada correctamente"
        )

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

    const prepareCheckOut = () => {
        const now = new Date()
        const warnings: string[] = []

        // Late Check-out Guard (After 11:00 AM)
        if (now.getHours() >= 11 && now.getMinutes() > 0) {
            warnings.push("Late Check-out: Son pasadas las 11:00 AM.")
        }

        setCheckOutWarnings(warnings)

        // Reset Audit if opening fresh
        if (!showCheckOut) {
            setCheckOutAudit({ keysReturned: false, towelReturned: false, noDamage: false })
        }

        setShowCheckOut(true)
    }

    const handleCheckOut = async () => {
        if (!booking.id) return

        // Audit Guard
        if (!checkOutAudit.keysReturned || !checkOutAudit.towelReturned || !checkOutAudit.noDamage) {
            toast.error("Debes completar la auditoría de salida")
            return
        }

        // Payment Guard (Strict Checkout)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pendingExtras = extraCharges.some((c: any) => c.status !== 'paid')
        const pendingRoom = booking.paymentStatus !== 'paid'

        if (pendingRoom || pendingExtras) {
            toast.error("Bloqueo de Salida: Saldos Pendientes", {
                description: pendingRoom
                    ? "La habitación no ha sido pagada."
                    : "Hay extras consumidos sin pagar (Minibar)."
            })
            return
        }

        await checkOutBooking(booking.id, isPaymentSettled ? 'paid' : 'pending')
        toast.success("Check-out realizado exitosamente", {
            description: isPaymentSettled ? "La cuenta ha sido marcada como pagada." : "El pago quedó pendiente."
        })
        setShowCheckOut(false)
        onOpenChange(false)
    }

    const prepareCheckIn = () => {
        const now = new Date()
        const warnings: string[] = []

        // Early Check-in Guard (Before 15:00)
        if (now.getHours() < 15) {
            warnings.push("Early Check-in: Es antes de las 3:00 PM.")
        } else {
            // Just for demo, if it's super late (after 10pm) maybe warn? Nah.
        }

        // Sync ID data to local state if exists, else it stays empty to prompt user
        setIdType(booking.guestIdType || 'passport')
        setIdNumber(booking.guestIdNumber || '')

        setCheckInWarnings(warnings)
        setShowCheckInDialog(true)
    }


    const handleConfirmCheckIn = () => {
        // Identity Guard
        if (!idNumber || idNumber.length < 3) {
            toast.error("Identificación requerida para Check-in")
            return
        }

        // Payment Guard (Strict Check-in)
        if (booking.paymentStatus !== 'paid') {
            toast.error("Pago Requerido", {
                description: "Se debe pagar la estancia antes de ingresar (Check-in)."
            })
            return
        }

        // Update Identity + Status
        updateBooking(booking.id, {
            guestIdType: idType,
            guestIdNumber: idNumber
        })

        updateBookingStatus(booking.id, 'checked_in')
        toast.success("¡Huésped registrado en casa!", { icon: '🏠' })
        setShowCheckInDialog(false)
        onOpenChange(false)
    }

    const handleConfirmPayment = () => {
        if (!booking.id) return

        // Update Booking with Payment Details and Status
        updateBooking(booking.id, {
            paymentStatus: 'paid',
            paymentMethod: paymentMethod,
            paymentReference: paymentReference
        })

        setIsPaymentSettled(true)
        toast.success("Pago registrado exitosamente")
        setShowPaymentCollectionDialog(false)
    }

    const togglePaymentStatus = (checked: boolean) => {
        if (checked) {
            // If marking as paid, open collection dialog to get details
            // Unless it already has details? No, verify anyway.
            setShowPaymentCollectionDialog(true)
        } else {
            // If unchecking, just mark pending
            updateBooking(booking.id, { paymentStatus: 'pending' })
            setIsPaymentSettled(false)
            toast.warning("Pago marcado como PENDIENTE")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200"
            case "checked_in": return "text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200"
            case "cancelled": return "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200"
            case "checked_out": return "text-stone-500 bg-stone-100 dark:bg-stone-800 border-stone-200"
            default: return "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200"
        }
    }



    if (showCheckOut) {
        // ... (CheckOut existing logic, maybe add Batch Checkout later if requested)
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
                        {/* Warnings */}
                        {checkOutWarnings.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                                <div className="space-y-1">
                                    {checkOutWarnings.map((w, i) => (
                                        <p key={i} className="text-xs text-amber-700 font-medium">{w}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Audit Checklist */}
                        <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-lg border border-stone-100 dark:border-stone-800 space-y-3">
                            <p className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">Auditoría de Salida</p>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="keys" checked={checkOutAudit.keysReturned} onCheckedChange={(c) => setCheckOutAudit({ ...checkOutAudit, keysReturned: !!c })} />
                                <Label htmlFor="keys" className="cursor-pointer flex items-center gap-2">
                                    <Key className="w-3 h-3 text-stone-400" /> Llaves / Tarjeta Devuelta
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="towel" checked={checkOutAudit.towelReturned} onCheckedChange={(c) => setCheckOutAudit({ ...checkOutAudit, towelReturned: !!c })} />
                                <Label htmlFor="towel" className="cursor-pointer flex items-center gap-2">
                                    <ClipboardCheck className="w-3 h-3 text-stone-400" /> Toalla Recibida
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="damage" checked={checkOutAudit.noDamage} onCheckedChange={(c) => setCheckOutAudit({ ...checkOutAudit, noDamage: !!c })} />
                                <Label htmlFor="damage" className="cursor-pointer">
                                    Sin Daños / Consumos Pendientes
                                </Label>
                            </div>
                        </div>

                        <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-lg border border-stone-100 dark:border-stone-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{booking.guestName}</p>
                                <p className="text-xs text-stone-500">ID: {booking.id.slice(0, 8)}...</p>
                            </div>
                            <div className="flex gap-2">
                                {booking.guestIdNumber ? (
                                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200 flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Pre-Checkin OK
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-stone-400 border-stone-200 border-dashed">
                                        Sin Documento
                                    </Badge>
                                )}
                                <Badge variant="outline" className={cn("capitalize shadow-sm", getStatusColor(booking.status))}>
                                    {booking.status === 'confirmed' ? 'Confirmada' : booking.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Payment Status Card - HANDSHAKE & Visual Indication */}
                        {booking.paymentStatus === 'verifying' ? (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-blue-600 hover:bg-blue-700 animate-pulse">
                                            <Clock className="w-3 h-3 mr-1" /> Verificando
                                        </Badge>
                                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Pago Reportado</p>
                                    </div>
                                    <p className="text-xs font-mono text-blue-700 dark:text-blue-300">
                                        Total: Q{booking.totalPrice}
                                    </p>
                                </div>

                                <div className="text-xs text-blue-800 dark:text-blue-200 mb-4 bg-blue-100/50 dark:bg-blue-800/30 p-2 rounded">
                                    <p><strong>Referencia:</strong> {booking.paymentReference || "N/A"}</p>
                                    <p><strong>Método:</strong> {booking.paymentMethod === 'transfer' ? 'Transferencia' : booking.paymentMethod}</p>
                                </div>

                                <div className="flex gap-2">
                                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => {
                                        updateBooking(booking.id, { paymentStatus: 'paid', status: 'confirmed' })
                                        setIsPaymentSettled(true)
                                        toast.success("Pago confirmado y Reserva Confirmada")
                                        sendEmail('confirmation')
                                    }}>
                                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Confirmar Pago & Reserva
                                    </Button>
                                    <Button size="sm" variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-100" onClick={() => {
                                        if (window.confirm("¿Rechazar este pago? Volverá a estado pendiente.")) {
                                            updateBooking(booking.id, { paymentStatus: 'pending', paymentReference: null })
                                            setIsPaymentSettled(false)
                                            toast.info("Pago rechazado / devuelto a pendiente")
                                        }
                                    }}>
                                        <X className="w-3.5 h-3.5 mr-1" /> Rechazar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={cn(
                                    "flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm transition-colors duration-300",
                                    isPaymentSettled
                                        ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                                        : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                                )}
                            >
                                <Checkbox
                                    id="payment_settled"
                                    checked={isPaymentSettled}
                                    onCheckedChange={(c) => togglePaymentStatus(!!c)}
                                    className={isPaymentSettled ? "data-[state=checked]:bg-emerald-600 border-emerald-600" : "border-amber-600"}
                                />
                                <div className="space-y-1 leading-none">
                                    <Label htmlFor="payment_settled" className={cn("font-semibold cursor-pointer", isPaymentSettled ? "text-emerald-700" : "text-amber-700")}>
                                        {isPaymentSettled ? "Cuenta Liquidada (Pagado)" : "Pago Pendiente"}
                                    </Label>
                                    <p className={cn("text-sm", isPaymentSettled ? "text-emerald-600/80" : "text-amber-600/80")}>
                                        {isPaymentSettled
                                            ? "Listo para salida. Todo en orden."
                                            : `El huésped aún debe Q${booking.totalPrice}. ¿Confirmar deuda?`
                                        }
                                    </p>
                                    {booking.paymentStatus === 'paid' && booking.paymentMethod && (
                                        <p className="text-xs text-stone-500 mt-1 flex gap-2">
                                            <Badge variant="secondary" className="text-[10px] capitalize h-5 px-1.5 font-normal">
                                                {booking.paymentMethod === 'card' ? '💳 Tarjeta' : booking.paymentMethod === 'cash' ? '💵 Efectivo' : '🏦 Transf.'}
                                            </Badge>
                                            {booking.paymentReference && <span className="opacity-80 font-mono">#{booking.paymentReference}</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowCheckOut(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCheckOut}
                            className={cn(
                                "text-white transition-colors",
                                isPaymentSettled
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-amber-600 hover:bg-amber-700"
                            )}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {isPaymentSettled ? "Confirmar Salida" : "Salir con Deuda"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    // ... (Inside Payment Dialog)
    // We need to inject the "Pay Group" button here or make handleConfirmPayment smart
    const handleSmartPayment = () => {
        if (isGroup && groupPendingDebt > 0) {
            handleBatchPayment()
        } else {
            handleConfirmPayment()
        }
    }

    // ... (Inside CheckIn Dialog)
    const handleSmartCheckIn = () => {
        if (isGroup) {
            handleBatchCheckIn()
        } else {
            handleConfirmCheckIn()
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

    // PAYMENT COLLECTION DIALOG
    if (showPaymentCollectionDialog) {
        return (
            <Dialog open={open} onOpenChange={(val) => {
                if (!val) setShowPaymentCollectionDialog(false)
                onOpenChange(val)
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-emerald-600 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" /> Registrar Pago
                        </DialogTitle>
                        <DialogDescription>
                            Detalla el método de pago para propósitos contables.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {isGroup && groupPendingDebt > 0 && (
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">Deuda Total del Grupo</p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                                        Q{groupPendingDebt} ({groupBookings.filter(b => b.paymentStatus !== 'paid').length} reservas)
                                    </p>
                                </div>
                                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-[10px]">
                                    Modo Grupal Activo
                                </Badge>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Método de Pago</Label>
                            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "card" | "cash" | "transfer" | "other")}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Efectivo 💵</SelectItem>
                                    <SelectItem value="card">Tarjeta de Crédito/Débito 💳</SelectItem>
                                    <SelectItem value="transfer">Transferencia Bancaria 🏦</SelectItem>
                                    <SelectItem value="other">Otro / Cripto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Referencia / No. Boleta (Opcional)</Label>
                            <Input
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                placeholder={paymentMethod === 'card' ? "Últimos 4 dígitos..." : "No. de Transacción..."}
                            />
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded text-xs text-emerald-800">
                            Total a cobrar hoy: <strong className="text-lg">Q{isGroup ? groupPendingDebt : booking.totalPrice}</strong>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowPaymentCollectionDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSmartPayment}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {isGroup ? `Pagar Todo (Q${groupPendingDebt})` : "Confirmar Pago"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    // CHECK-IN DIALOG
    if (showCheckInDialog) {
        return (
            <Dialog open={open} onOpenChange={(val) => {
                if (!val) setShowCheckInDialog(false)
                onOpenChange(val)
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-emerald-600 flex items-center gap-2">
                            <Shield className="w-5 h-5" /> Check-in de Seguridad
                        </DialogTitle>
                        <DialogDescription>
                            Registro obligatorio de identidad y control horario.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Warnings */}
                        {checkInWarnings.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2 animate-in slide-in-from-top-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                                <div className="space-y-1">
                                    {checkInWarnings.map((w, i) => (
                                        <p key={i} className="text-sm text-amber-700 font-medium">{w}</p>
                                    ))}
                                    <p className="text-xs text-amber-600/80">¿Proceder bajo discreción de administración?</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 p-4 border border-stone-200 rounded-lg bg-stone-50/50">
                            <Label className="text-xs uppercase font-bold text-stone-500">Documento de Identidad (Obligatorio)</Label>

                            <div className="flex gap-2">
                                <Select value={idType} onValueChange={(v) => setIdType(v as "passport" | "dni" | "license" | "other")}>
                                    <SelectTrigger className="w-[110px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="passport">Pasaporte</SelectItem>
                                        <SelectItem value="dni">DPI / DNI</SelectItem>
                                        <SelectItem value="license">Licencia</SelectItem>
                                        <SelectItem value="other">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    value={idNumber}
                                    onChange={(e) => setIdNumber(e.target.value)}
                                    placeholder="Número de Documento"
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowCheckInDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSmartCheckIn}
                            className={cn(checkInWarnings.length > 0 ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700")}
                        >
                            {isGroup
                                ? `Check-in Grupal (${groupBookings.length})`
                                : checkInWarnings.length > 0 ? "Autorizar Check-in Anticipado" : "Confirmar Acceso"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    if (showCancellation) {
        // ... (Cancellation code remains same)
        return (
            <Dialog open={open} onOpenChange={(val) => {
                if (!val) setShowCancellation(false)
                onOpenChange(val)
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-rose-600 flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            {isBatchCancellation ? `Cancelar Grupo Completo (${groupBookings.length})` : "Cancelar Reserva"}
                        </DialogTitle>
                        <DialogDescription>
                            {isBatchCancellation
                                ? "Esta acción cancelará TODAS las reservas del grupo. Esto liberará camas múltiples."
                                : "Esta acción liberará las fechas en el calendario. Esta acción no se puede deshacer fácilmente."
                            }
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

                            {refundStatus === 'partial' && (
                                <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                                    <Label className="text-xs">Monto a Reembolsar</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-stone-500" />
                                        <Input
                                            type="number"
                                            value={refundAmount}
                                            onChange={(e) => setRefundAmount(e.target.value)}
                                            className="pl-8"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Notas Adicionales (Interno)</Label>
                            <Input
                                value={cancellationNote}
                                onChange={(e) => setCancellationNote(e.target.value)}
                                placeholder="Detalles específicos..."
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="notify"
                                checked={notifyGuest}
                                onCheckedChange={(c) => setNotifyGuest(!!c)}
                            />
                            <label
                                htmlFor="notify"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Enviar email de cancelación al huésped
                            </label>
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
            </Dialog >
        )
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) setIsEditing(false)
            onOpenChange(val)
        }}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-2xl">
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
                                {isGroup && <Badge className="bg-white/20 hover:bg-white/30 text-white border-none ml-2 text-[10px]">+ {groupBookings.length - 1}</Badge>}
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
                                                booking.status === 'checked_in' ? "bg-purple-500/80" :
                                                    "bg-amber-500/80"
                                )}>
                                    {booking.status === 'confirmed' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                                        booking.status === 'checked_in' ? <User className="w-3 h-3 mr-1" /> :
                                            booking.status === 'cancelled' ? <XCircle className="w-3 h-3 mr-1" /> :
                                                booking.status === 'checked_out' ? <LogOut className="w-3 h-3 mr-1" /> :
                                                    booking.status === 'no_show' ? <Ghost className="w-3 h-3 mr-1" /> :
                                                        <Clock className="w-3 h-3 mr-1" />}
                                    {booking.status === 'cancelled' ? 'Cancelada' :
                                        booking.status === 'checked_out' ? 'Check-Out' :
                                            booking.status === 'checked_in' ? 'Huésped en Casa' :
                                                booking.status === 'no_show' ? 'No Show' :
                                                    booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                </Badge>
                            )}

                            {/* ... Dropdown Actions ... */}
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
                                            {isGroup && (
                                                <DropdownMenuItem className="text-rose-600 focus:text-rose-700 font-bold" onClick={() => {
                                                    setIsBatchCancellation(true)
                                                    setShowCancellation(true)
                                                }}>
                                                    <Users className="w-4 h-4 mr-2" /> Cancelar Grupo Completo
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="text-rose-600 focus:text-rose-700" onClick={() => {
                                                setIsBatchCancellation(false) // Ensure single mode
                                                setShowCancellation(true)
                                            }}>
                                                <Trash2 className="w-4 h-4 mr-2" /> Cancelar Reserva Individual
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    {/* ... Rest of Dropdown ... */}
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
                    {/* GROUP CONTROL CENTER (Elite) */}
                    {isGroup && (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />

                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Grupo Detectado ({groupBookings.length})
                                </h4>
                                <Badge variant="secondary" className="bg-white/50 backdrop-blur text-indigo-600 border-indigo-200">
                                    Total: Q{groupTotal}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                                <div className="bg-white/60 dark:bg-stone-900/60 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                                    <p className="text-[10px] uppercase text-stone-500 mb-1">Estado Pagos</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-stone-700 dark:text-stone-300">{groupPaidCount}/{groupBookings.length} Pagados</span>
                                        {groupPendingDebt > 0 && <span className="text-xs font-bold text-amber-600">Deben Q{groupPendingDebt}</span>}
                                    </div>
                                </div>
                                <div className="bg-white/60 dark:bg-stone-900/60 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                                    <p className="text-[10px] uppercase text-stone-500 mb-1">Acciones Rápidas</p>
                                    <div className="flex gap-2">
                                        {groupPendingDebt > 0 && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 px-2 text-[10px] bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100 w-full"
                                                onClick={() => setShowPaymentCollectionDialog(true)}
                                            >
                                                Cobrar Todo
                                            </Button>
                                        )}
                                        {groupBookings.some(b => b.status === 'checked_in') && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 px-2 text-[10px] bg-stone-100/50 text-stone-700 hover:bg-stone-200 w-full"
                                                onClick={handleBatchCheckOut}
                                            >
                                                Check-out Todo
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Member List Helper */}
                            <div className="space-y-1 relative z-10 max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-200">
                                {relatedBookings.map(rel => (
                                    <div key={rel.id} className="flex items-center justify-between text-xs p-2 bg-white/40 dark:bg-stone-900/30 rounded border border-transparent hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => toast.info("Link click logic here")}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                            <span className="font-medium text-stone-700 dark:text-stone-300">{rel.guestName || "Huésped"}</span>
                                            <span className="text-stone-400 text-[10px]">({rel.roomType === 'dorm' ? `Cama ${rel.unitId}` : rel.roomType})</span>
                                        </div>
                                        <Badge variant="outline" className={cn("text-[9px] h-4 px-1", getStatusColor(rel.status))}>{rel.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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

                            {/* IDENTITY FIELD DISPLAY */}
                            {!isEditing && booking.guestIdNumber && (
                                <div className="space-y-1.5 col-span-2 md:col-span-1">
                                    <Label className="text-xs text-stone-500">Identificación ({booking.guestIdType})</Label>
                                    <p className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2 bg-stone-50 dark:bg-stone-800 px-2 py-1 rounded w-fit border border-stone-200 dark:border-stone-700">
                                        <Shield className="w-3 h-3 text-emerald-500" /> {booking.guestIdNumber}
                                    </p>
                                </div>
                            )}

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
                                    <p className="font-medium text-stone-900 dark:text-stone-100">
                                        {booking.guests} {parseInt(booking.guests) > 1 ? 'Personas' :
                                            (booking.roomType?.includes('dorm') || formData.roomType?.includes('dorm')) ? 'Persona (Cama Individual)' : 'Persona'}
                                    </p>
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

                            {/* BED ASSIGNMENT FIELD */}
                            {(booking.roomType?.includes('dorm') || formData.roomType?.includes('dorm')) && (
                                <div className="space-y-1.5 col-span-2 bg-stone-50 dark:bg-stone-900/50 p-3 rounded-lg border border-stone-200 dark:border-stone-800">
                                    <Label className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                        {isEditing ? "Asignar Cama (Requerido)" : "Cama Asignada"}
                                        {!booking.unitId && !isEditing && <Badge variant="destructive" className="h-4 text-[9px] px-1">Sin Asignar</Badge>}
                                    </Label>

                                    {isEditing ? (
                                        <Select
                                            value={formData.unitId || booking.unitId}
                                            onValueChange={(val) => setFormData({ ...formData, unitId: val })}
                                        >
                                            <SelectTrigger className="h-9 bg-white dark:bg-stone-950 border-stone-300 dark:border-stone-700">
                                                <SelectValue placeholder="Selecciona una cama..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                                                    // Determine if bed is taken
                                                    const isOccupied = bookings.some(b =>
                                                        b.id !== booking.id && // Exclude self
                                                        b.status !== 'cancelled' &&
                                                        b.roomType === booking.roomType &&
                                                        b.unitId === String(n) &&
                                                        // Date Overlap Logic
                                                        (new Date(formData.checkIn || booking.checkIn) < new Date(b.checkOut) &&
                                                            new Date(formData.checkOut || booking.checkOut) > new Date(b.checkIn))
                                                    );

                                                    return (
                                                        <SelectItem key={n} value={String(n)} disabled={isOccupied}>
                                                            Cama {n} {isOccupied && "(Ocupada)"}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <BedDouble className="w-4 h-4 text-indigo-500" />
                                            <p className="font-bold text-stone-900 dark:text-stone-100">
                                                {booking.unitId ? `Cama ${booking.unitId}` : "---"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>


                    {/* DIGITIAL HONESTY BAR / EXTRAS */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Minibar & Extras
                            </h4>
                            {isEditing && (
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" className="h-6 text-xs text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30" onClick={() => setShowAddCharge(true)}>
                                        <Plus className="w-3 h-3 mr-1" /> Agregar
                                    </Button>
                                    {extraCharges.some((c: any) => c.status !== 'paid') && (
                                        <Button size="sm" variant="ghost" className="h-6 text-xs text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30" onClick={handleSettleAllCharges}>
                                            <CheckCircle className="w-3 h-3 mr-1" /> Cobrar Todo
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {extraCharges.length > 0 ? (
                            <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg overflow-hidden border border-stone-100 dark:border-stone-800">
                                {extraCharges.map(charge => (
                                    <div key={charge.id} className="flex justify-between items-center p-3 border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-100 dark:hover:bg-stone-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-lg relative">
                                                {charge.item_name.includes('Cerveza') ? '🍺' : charge.item_name.includes('Cola') ? '🥤' : '⚡'}
                                                {charge.status === 'paid' && (
                                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white dark:border-stone-900">
                                                        <CheckCircle className="w-2 h-2" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-stone-900 dark:text-stone-100 text-sm">{charge.item_name}</p>
                                                <p className="text-[10px] text-stone-500">{format(new Date(charge.created_at), 'd MMM, HH:mm')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div
                                                onClick={() => handleToggleChargeStatus(charge)}
                                                className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer select-none transition-colors border",
                                                    charge.status === 'paid'
                                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                                                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                                                )}
                                            >
                                                {charge.status === 'paid' ? 'PAGADO' : 'PENDIENTE'}
                                            </div>
                                            <span className="font-mono font-bold text-stone-700 dark:text-stone-300">Q{charge.amount}</span>
                                            {isEditing && (
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteCharge(charge.id)}>
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="p-3 bg-stone-100 dark:bg-stone-800 flex justify-between items-center text-xs font-bold uppercase text-stone-500">
                                    <span>Total Extras</span>
                                    <span>Q{extraCharges.reduce((acc, curr) => acc + Number(curr.amount), 0)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-stone-50 dark:bg-stone-900/30 rounded-lg border border-dashed border-stone-200 dark:border-stone-800">
                                <p className="text-xs text-stone-400">Sin cargos extra registrados</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-stone-50 dark:bg-stone-800/30 p-4 rounded-xl border border-stone-100 dark:border-stone-800 flex flex-col justify-center gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Total a Pagar</p>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-1">
                                            <DollarSign className="w-5 h-5 text-emerald-500" />
                                            {booking.totalPrice + extraCharges.reduce((acc, curr) => acc + Number(curr.amount), 0)}
                                        </span>
                                        {extraCharges.length > 0 && (
                                            <span className="text-[10px] text-stone-500 font-mono">
                                                (Q{booking.totalPrice} Hab + Q{extraCharges.reduce((acc, curr) => acc + Number(curr.amount), 0)} Extras)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg border text-xs font-bold uppercase cursor-pointer transition-all select-none hover:opacity-80 active:scale-95 flex items-center gap-2",
                                        booking.paymentStatus === 'paid'
                                            ? "bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
                                            : booking.paymentStatus === 'verifying'
                                                ? "bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 animate-pulse"
                                                : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400"
                                    )}
                                    onClick={() => {
                                        // Toggle Logic: Paid -> Pending | Verifying/Pending -> Paid
                                        const newStatus = booking.paymentStatus === 'paid' ? 'pending' : 'paid'
                                        updateBooking(booking.id, { paymentStatus: newStatus })
                                        toast.success(newStatus === 'paid' ? "Pago CONFIRMADO" : "Pago marcado como PENDIENTE")
                                    }}
                                >
                                    {booking.paymentStatus === 'verifying' && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {booking.paymentStatus === 'paid' ? "Pagado" : booking.paymentStatus === 'verifying' ? "Verificar Pago" : "Pendiente"}
                                </div>
                            </div>

                            {/* Payment Method Details */}
                            <div className="pt-3 border-t border-stone-200 dark:border-stone-700/50 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <p className="text-stone-500">Método:</p>
                                    <Badge variant="secondary" className="font-normal capitalize bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                                        {booking.paymentMethod === 'card' && "💳 Tarjeta"}
                                        {booking.paymentMethod === 'cash' && "💵 Efectivo"}
                                        {booking.paymentMethod === 'transfer' && "🏦 Transferencia"}
                                        {!booking.paymentMethod && "---"}
                                    </Badge>
                                </div>
                                {booking.paymentReference && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-stone-500">Ref:</p>
                                        <span className="font-mono text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-1.5 rounded">
                                            {booking.paymentReference}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Check-In Button for Pending Bookings */}
                        {/* 1. CONFIRMATION Button (For Pending Bookings) */}
                        {booking.status === 'pending' && !isEditing && (
                            <Button
                                onClick={() => {
                                    // GUARD RAIL 1: Contact Info Check
                                    if (!booking.email && !booking.phone) {
                                        setIsEditing(true)
                                        toast.error("Falta Información de Contacto", {
                                            description: "Debes registrar Email o Teléfono antes de confirmar."
                                        })
                                        return
                                    }

                                    // GUARD RAIL 2: Bed Assignment Check
                                    if (booking.roomType.includes('dorm') && !booking.unitId && !formData.unitId) {
                                        setIsEditing(true)
                                        toast.warning("⚠️ Debes asignar una cama antes de Confirmar")
                                    } else {
                                        // GUARD RAIL 3: Payment Check
                                        // If strictly unpaid, show Alert Dialog to force conscious decision
                                        if (booking.paymentStatus !== 'paid' && booking.paymentStatus !== 'verifying') {
                                            setShowPaymentAlert(true)
                                        } else {
                                            updateBookingStatus(booking.id, 'confirmed')
                                            toast.success("Reserva Confirmada")
                                            // Send Confirmation Email automatically
                                            sendEmail('confirmation')
                                            onOpenChange(false)
                                        }
                                    }
                                }}
                                className="h-full py-4 px-6 bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase opacity-70 leading-none">Paso 1</span>
                                    <span className="font-bold">Confirmar</span>
                                </div>
                            </Button>
                        )}

                        <AlertDialog open={showPaymentAlert} onOpenChange={setShowPaymentAlert}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-amber-600 flex items-center gap-2">
                                        <div className="p-2 bg-amber-100 rounded-full"><DollarSign className="w-4 h-4" /></div>
                                        Pago Pendiente
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta reserva aún no ha sido pagada. ¿Estás seguro de que quieres confirmarla sin registrar el depósito?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                        onClick={() => {
                                            if (booking.id) {
                                                updateBookingStatus(booking.id, 'confirmed')
                                                toast.success("Reserva Confirmada (Sin Pago)")
                                                onOpenChange(false)
                                            }
                                        }}
                                    >
                                        Confirmar de todos modos
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* 2. CHECK-IN Button (For Confirmed Bookings - Guest Arrival) */}
                        {booking.status === 'confirmed' && !isEditing && (
                            <Button
                                onClick={prepareCheckIn}
                                className={cn(
                                    "h-full py-4 px-6 text-white shadow-lg hover:shadow-xl transition-all",
                                    new Date() < new Date(booking.checkIn)
                                        ? "bg-stone-400" // Neutral style if early, dialogue handles warning
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                )}
                            >
                                <User className="w-5 h-5 mr-2" />
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase opacity-70 leading-none">Paso 2</span>
                                    <span className="font-bold">Check-In</span>
                                </div>
                            </Button>
                        )}

                        {/* 3. CHECK-OUT Button (For Checked-In Bookings - Guest Departure) */}
                        {(booking.status === 'checked_in') && !isEditing && (
                            <Button
                                onClick={prepareCheckOut}
                                className="h-full py-4 px-6 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 shadow-lg hover:shadow-xl transition-all"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase opacity-70 leading-none">Paso 3</span>
                                    <span className="font-bold">Check-Out</span>
                                </div>
                            </Button>
                        )}
                    </div>
                </div>

                {
                    isEditing && (
                        <DialogFooter className="p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
                            <Button onClick={handleSave} className="bg-stone-900 text-white dark:bg-white dark:text-stone-900">
                                <Save className="w-4 h-4 mr-2" /> Guardar Cambios
                            </Button>
                        </DialogFooter>
                    )
                }
            </DialogContent >

            {/* ADD CHARGE DIALOG */}
            <Dialog open={showAddCharge} onOpenChange={setShowAddCharge}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Cargo Extra</DialogTitle>
                        <DialogDescription>Selecciona un producto del minibar o servicio extra.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Producto</Label>
                            <Select
                                value={newCharge.productId}
                                onValueChange={(val) => setNewCharge({ ...newCharge, productId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar item..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map(p => (
                                        <SelectItem key={p.id} value={p.id}>
                                            <span className="flex items-center gap-2">
                                                <span>{p.icon}</span>
                                                <span>{p.name}</span>
                                                <Badge variant="secondary" className="ml-auto text-xs">Q{p.price}</Badge>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Cantidad</Label>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={() => setNewCharge(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}>-</Button>
                                <span className="w-12 text-center font-bold">{newCharge.quantity}</span>
                                <Button variant="outline" size="icon" onClick={() => setNewCharge(prev => ({ ...prev, quantity: prev.quantity + 1 }))}>+</Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddCharge(false)}>Cancelar</Button>
                        <Button onClick={handleAddCharge} disabled={!newCharge.productId} className="bg-indigo-600 text-white hover:bg-indigo-700">Agregar Cargo</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog >
    )
}
