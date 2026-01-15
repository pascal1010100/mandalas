"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SprayCan, Hammer, Bath, CloudFog, CheckCircle2, Clock, Trash2, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export function ServiceRequestFeed() {
    const { serviceRequests, updateServiceRequestStatus, bookings } = useAppStore()

    // Filter for active requests (not cancelled)
    const activeRequests = serviceRequests
        .filter(r => r.status !== 'cancelled')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Helper to get guest name
    const getGuestName = (bookingId: string) => {
        const booking = bookings.find(b => b.id === bookingId)
        return booking ? booking.guestName : "Huésped Desconocido"
    }

    // Helper to get Room Name
    const getRoomName = (bookingId: string) => {
        const booking = bookings.find(b => b.id === bookingId)
        return booking ? (booking.roomType.replace(/_/g, ' ')) : ""
    }

    const handleStatusUpdate = async (id: string, newStatus: 'in_progress' | 'completed') => {
        try {
            await updateServiceRequestStatus(id, newStatus)
            toast.success(newStatus === 'completed' ? "Solicitud completada" : "Solicitud en proceso")
        } catch (error) {
            toast.error("Error al actualizar")
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'cleaning': return <SprayCan className="w-4 h-4 text-emerald-500" />
            case 'maintenance': return <Hammer className="w-4 h-4 text-amber-500" />
            case 'amenity': return <Bath className="w-4 h-4 text-blue-500" />
            default: return <CloudFog className="w-4 h-4 text-stone-500" />
        }
    }

    return (
        <Card className="col-span-1 shadow-sm border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 h-[400px] flex flex-col">
            <CardHeader className="pb-3 border-b border-stone-100 dark:border-stone-800">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                    <span>Solicitudes en Vivo</span>
                    <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        {activeRequests.filter(r => r.status !== 'completed').length} Pendientes
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    {activeRequests.length > 0 ? (
                        <div className="divide-y divide-stone-100 dark:divide-stone-800">
                            <AnimatePresence initial={false}>
                                {activeRequests.map((req) => (
                                    <motion.div
                                        key={req.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors ${req.status === 'completed' ? 'opacity-50 grayscale' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            {/* Icon & Details */}
                                            <div className="flex gap-3">
                                                <div className="mt-1 p-2 rounded-full bg-stone-100 dark:bg-stone-800 h-fit">
                                                    {getIcon(req.type)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-sm text-stone-800 dark:text-stone-200 capitalize">
                                                            {req.type === 'amenity' ? 'Amenidades' : req.type === 'cleaning' ? 'Limpieza' : req.type === 'maintenance' ? 'Mantenimiento' : 'Otro'}
                                                        </span>
                                                        <span className="text-[10px] text-stone-400 font-mono">
                                                            {formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: es })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mb-1">
                                                        {getGuestName(req.booking_id)} • <span className="text-stone-400">{getRoomName(req.booking_id)}</span>
                                                    </p>
                                                    {req.description && (
                                                        <p className="text-xs text-stone-500 italic bg-stone-50 dark:bg-stone-900/50 p-1.5 rounded border border-stone-100 dark:border-stone-800 inline-block">
                                                            &quot;{req.description}&quot;
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-1">
                                                {req.status === 'pending' && (
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => handleStatusUpdate(req.id, 'in_progress')} title="Marcar en proceso">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {req.status !== 'completed' && (
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => handleStatusUpdate(req.id, 'completed')} title="Marcar completado">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8 text-center">
                            <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs">Todo tranquilo por ahora.</p>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
