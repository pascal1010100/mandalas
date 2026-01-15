"use client"

import { useAppStore, Booking } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatMoney } from "@/lib/currency"
import { CheckCircle, Clock, CreditCard, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function DailyCheckinPayments() {
    const { bookings, registerPayment } = useAppStore()

    // Filter Logic:
    // 1. Check-in Date is TODAY
    // 2. Status is NOT Cancelled
    const todayStr = format(new Date(), 'yyyy-MM-dd')

    // We want to show everyone arriving today, regardless of current status (pending/confirmed/checked_in)
    // But we focus on PAYMENT status.
    const todaysCheckIns = bookings.filter(b =>
        b.checkIn.startsWith(todayStr) &&
        b.status !== 'cancelled'
    )

    const handlePayment = async (booking: Booking, method: 'cash' | 'card') => {
        // Removed 'if paid return' to allow Audit/Verification

        const loadingId = toast.loading('Procesando pago...')

        try {
            await registerPayment(booking.id, booking.totalPrice || 0, method)
            toast.dismiss(loadingId)
            // Success toast is handled in registerPayment
        } catch (error) {
            console.error(error)
            toast.dismiss(loadingId)
            toast.error('Error registrando pago')
        }
    }

    if (todaysCheckIns.length === 0) {
        return (
            <div className="text-center py-8 text-stone-500">
                <p className="text-sm">No hay entradas (check-ins) programadas para hoy.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest">
                    Llegadas de Hoy ({todaysCheckIns.length})
                </h3>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {todaysCheckIns.map(booking => {
                    const isPaid = booking.paymentStatus === 'paid'

                    return (
                        <div
                            key={booking.id}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-all",
                                isPaid
                                    ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30"
                                    : "bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800"
                            )}
                        >
                            <div className="flex flex-col gap-1 min-w-0 flex-1 mr-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-stone-800 dark:text-stone-200 truncate">
                                        {booking.guestName}
                                    </span>
                                    {isPaid && (
                                        <Badge variant="secondary" className="h-5 px-1.5 bg-emerald-100 text-emerald-700 text-[10px]">
                                            Pagado
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                    <span className="uppercase tracking-wide">{booking.roomType.replace(/_/g, ' ')}</span>
                                    <span>•</span>
                                    <span className="font-mono text-stone-600 dark:text-stone-400">
                                        Total: {formatMoney(booking.totalPrice)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {!isPaid ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 w-8 p-0 border-stone-200 text-stone-500 hover:text-indigo-600 hover:border-indigo-200"
                                            onClick={() => handlePayment(booking, 'card')}
                                            title="Pagar con Tarjeta"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm"
                                            onClick={() => handlePayment(booking, 'cash')}
                                            title="Pagar en Efectivo (Caja Chica)"
                                        >
                                            <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                                            Cobrar
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold px-3 py-1 bg-emerald-100 rounded-full dark:bg-emerald-900/30 cursor-help" title="Pago registrado">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            <span>{booking.paymentMethod === 'card' ? 'Tarjeta' : 'Efec.'}</span>
                                        </div>
                                        {/* Verification Action (Ghost Money Fix) */}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 px-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-[10px]"
                                            onClick={() => {
                                                if (confirm("¿Re-ingresar pago a CAJA? (Úsalo solo si el dinero no se registró)")) {
                                                    handlePayment(booking, 'cash')
                                                }
                                            }}
                                        >
                                            Verificar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
