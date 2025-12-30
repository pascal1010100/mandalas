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
import { Textarea } from "@/components/ui/textarea"
import { SprayCan, Hammer, Bath, GlassWater, Send, CheckCircle2, CloudFog } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface ServiceRequestGridProps {
    bookingId: string
    guestName: string
}

export function ServiceRequestGrid({ bookingId, guestName }: ServiceRequestGridProps) {
    const { createServiceRequest, serviceRequests } = useAppStore()
    const [selectedType, setSelectedType] = useState<"cleaning" | "maintenance" | "amenity" | "other" | null>(null)
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    // Filter requests for this booking
    // Note: In a real app, RLS would filter this, but client-side filtering adds safety if store has all
    const myRequests = serviceRequests.filter(r => r.booking_id === bookingId)

    const handleRequest = async () => {
        if (!selectedType) return

        setIsSubmitting(true)
        try {
            await createServiceRequest(bookingId, selectedType, description)
            setIsOpen(false)
            setDescription("")
            setSelectedType(null)
            toast.success("Solicitud enviada con éxito", {
                description: "El equipo ha sido notificado."
            })
        } catch (error) {
            console.error(error)
            toast.error("Error al enviar solicitud")
        } finally {
            setIsSubmitting(false)
        }
    }

    const requestTypes = [
        {
            id: "cleaning",
            label: "Limpieza",
            icon: SprayCan,
            color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
            desc: "Solicitar limpieza de cuarto o cambio de sábanas."
        },
        {
            id: "amenity",
            label: "Amenidades",
            icon: Bath,
            color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
            desc: "Jabón, papel, toallas extra."
        },
        {
            id: "maintenance",
            label: "Mantenimiento",
            icon: Hammer,
            color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
            desc: "Reportar algo roto o que no funciona."
        },
        {
            id: "other",
            label: "Otro",
            icon: CloudFog,
            color: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
            desc: "Cualquier otra consulta o pedido."
        }
    ] as const

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                {requestTypes.map((type) => (
                    <Dialog key={type.id} open={isOpen && selectedType === type.id} onOpenChange={(open) => {
                        setIsOpen(open)
                        if (open) setSelectedType(type.id)
                    }}>
                        <DialogTrigger asChild>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex flex-col items-start p-4 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all h-32 relative overflow-hidden group bg-white dark:bg-stone-900/50 backdrop-blur-sm`}
                            >
                                <div className={`p-2.5 rounded-full mb-auto ${type.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <type.icon className="w-5 h-5" />
                                </div>
                                <div className="text-left z-10">
                                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{type.label}</h3>
                                    <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight mt-1">{type.desc}</p>
                                </div>
                                {/* Ambient Glow */}
                                <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity ${type.color.split(' ')[0]}`} />
                            </motion.button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg ${type.color}`}>
                                        <type.icon className="w-4 h-4" />
                                    </div>
                                    Solicitar {type.label}
                                </DialogTitle>
                                <DialogDescription>
                                    Describe brevemente lo que necesitas para ayudarte mejor.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Textarea
                                    placeholder={type.id === 'amenity' ? "Ej: Necesito 2 toallas extra..." : "Escribe aquí los detalles..."}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="resize-none min-h-[100px]"
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                <Button onClick={handleRequest} disabled={!description || isSubmitting} className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
                                    {isSubmitting ? "Enviando..." : <><Send className="w-4 h-4 mr-2" /> Enviar Solicitud</>}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>

            {/* Active Requests List */}
            {myRequests.length > 0 && (
                <div className="bg-stone-50 dark:bg-stone-900/30 rounded-xl p-4 border border-stone-100 dark:border-stone-800/50">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3 ml-1">Mis Solicitudes</h4>
                    <div className="space-y-2">
                        {myRequests.map((req) => (
                            <div key={req.id} className="bg-white dark:bg-stone-900 p-3 rounded-lg border border-stone-100 dark:border-stone-800 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    {req.status === 'completed' ? (
                                        <div className="text-emerald-500"><CheckCircle2 className="w-4 h-4" /></div>
                                    ) : (
                                        <div className="text-amber-500 animate-pulse"><CloudFog className="w-4 h-4" /></div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-stone-900 dark:text-stone-200 capitalize">{req.type === 'amenity' ? 'Amenidades' : req.type === 'cleaning' ? 'Limpieza' : req.type}</p>
                                        <p className="text-xs text-stone-500 truncate max-w-[200px]">{req.description}</p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500">
                                    {req.status === 'pending' ? 'Recibido' : req.status === 'in_progress' ? 'En Curso' : 'Listo'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
