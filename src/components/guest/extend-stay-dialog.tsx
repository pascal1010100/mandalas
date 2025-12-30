"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, Loader2, PartyPopper } from "lucide-react"
import { toast } from "sonner"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"

import { APP_CONFIG } from "@/lib/config"

interface ExtendStayDialogProps {
    bookingId: string
    currentCheckOut: string
    roomPrice: number
    guestName?: string
    roomName?: string
}

export function ExtendStayDialog({ bookingId, currentCheckOut, roomPrice, guestName, roomName }: ExtendStayDialogProps) {
    const { extendBooking } = useAppStore()
    const [isOpen, setIsOpen] = useState(false)
    const [newCheckOut, setNewCheckOut] = useState<Date | undefined>(undefined)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const currentCheckOutDate = new Date(currentCheckOut)

    // Calculate costs
    const extraDays = newCheckOut ? differenceInDays(newCheckOut, currentCheckOutDate) : 0
    const extraCost = extraDays * roomPrice

    const handleExtend = async () => {
        if (!newCheckOut || extraDays <= 0) return

        setIsSubmitting(true)
        try {
            await extendBooking(bookingId, format(newCheckOut, 'yyyy-MM-dd'))
            setIsOpen(false)
            setNewCheckOut(undefined)
            toast.success("¡Excelente! Tu estadía ha sido extendida.", {
                icon: <PartyPopper className="w-4 h-4 text-emerald-500" />
            })

            // WhatsApp Notification Logic
            const adminPhone = APP_CONFIG.business.phone.replace(/\s+/g, '')
            const message = `Hola, soy ${guestName || 'Huésped'}, he extendido mi estadía en la habitación ${roomName || 'Mandalas'} por ${extraDays} noche(s) más hasta el ${format(newCheckOut, 'dd/MM/yyyy')}.`
            const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`

            // Open in new tab after short delay to let toast show
            setTimeout(() => {
                window.open(waUrl, '_blank')
            }, 1500)

        } catch (error) {
            console.error(error)
            // Error handling is done in store (toast)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Extender Estadía
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Extender tu Estadía</DialogTitle>
                    <DialogDescription>
                        Selecciona tu nueva fecha de salida.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center py-4 gap-4">
                    <div className="bg-stone-50 dark:bg-stone-800/50 p-2 rounded-lg border border-stone-100 dark:border-stone-800">
                        <Calendar
                            mode="single"
                            selected={newCheckOut}
                            onSelect={setNewCheckOut}
                            disabled={(date) => date <= currentCheckOutDate}
                            initialFocus
                        />
                    </div>

                    {newCheckOut && extraDays > 0 && (
                        <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-stone-500 dark:text-stone-400 text-sm">Noches Extra</span>
                                <span className="font-bold text-stone-900 dark:text-stone-200">+{extraDays}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-stone-500 dark:text-stone-400 text-sm">Costo Adicional</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">${extraCost}</span>
                            </div>
                            <div className="h-px bg-emerald-200 dark:bg-emerald-800 my-2" />
                            <div className="flex justify-between items-center text-xs text-stone-500">
                                <span>Nueva Salida:</span>
                                <span className="font-medium text-stone-900 dark:text-stone-200 capitalize">
                                    {format(newCheckOut, "EEEE d 'de' MMMM", { locale: es })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={handleExtend}
                        disabled={!newCheckOut || extraDays <= 0 || isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Extensión"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
