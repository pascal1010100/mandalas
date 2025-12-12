import React, { useState, useMemo } from "react"
import { useAppStore } from "@/lib/store"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, differenceInCalendarDays, differenceInDays, startOfDay, subDays } from "date-fns" // Fixed import
import { es } from "date-fns/locale"
import {
    Calendar as CalendarIcon,
    ArrowRight,
    CheckCircle,
    Search,
    MapPin,
    Users,
    BedDouble,
    ChevronLeft,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CreateReservationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const ROOM_OPTIONS = {
    pueblo: [
        { id: 'dorm', label: 'Dormitorio Compartido', key: 'pueblo_dorm' },
        { id: 'private', label: 'Habitación Privada', key: 'pueblo_private' },
        { id: 'suite', label: 'Suite con Baño', key: 'pueblo_suite' },
    ],
    hideout: [
        { id: 'dorm', label: 'Dormitorio Selva', key: 'hideout_dorm' },
        { id: 'private', label: 'Cabaña Privada', key: 'hideout_private' },
        { id: 'suite', label: 'Master Suite', key: 'hideout_suite' },
    ]
}

export function CreateReservationModal({ open, onOpenChange }: CreateReservationModalProps) {
    const { addBooking, checkAvailability, prices, updatePrice } = useAppStore()

    // Steps: 1 = Search, 2 = Select Room, 3 = Guest Details
    const [step, setStep] = useState(1)

    // Form State
    const [location, setLocation] = useState<"pueblo" | "hideout">("pueblo")
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    })
    const [guests, setGuests] = useState("1")
    const [selectedRoom, setSelectedRoom] = useState<{ id: string, label: string, price: number } | null>(null)

    // Guest Details
    const [guestName, setGuestName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [status, setStatus] = useState<"confirmed" | "pending">("confirmed")

    const resetForm = () => {
        setStep(1)
        setLocation("pueblo")
        setDateRange({ from: undefined, to: undefined })
        setGuests("1")
        setSelectedRoom(null)
        setGuestName("")
        setEmail("")
        setPhone("")
        setStatus("confirmed")
    }

    const availableRooms = useMemo(() => {
        if (!dateRange.from || !dateRange.to) return []

        const opts = ROOM_OPTIONS[location]
        return opts.map(room => {
            const isAvailable = checkAvailability(
                location,
                room.id,
                dateRange.from!.toISOString(),
                dateRange.to!.toISOString(),
                parseInt(guests) || 1
            )
            return {
                ...room,
                price: prices[room.key] || 0,
                available: isAvailable
            }
        })
    }, [location, dateRange, checkAvailability, prices, guests])



    const handleNextStep = () => {
        if (step === 1) {
            if (!dateRange.from || !dateRange.to) {
                toast.error("Selecciona las fechas de entrada y salida")
                return
            }
            if (differenceInDays(dateRange.to, dateRange.from) < 1) {
                toast.error("La estadía mínima es de 1 noche")
                return
            }
            setStep(2)
        } else if (step === 2) {
            if (!selectedRoom) {
                toast.error("Selecciona una habitación disponible")
                return
            }
            setStep(3)
        }
    }

    const handleCreateBooking = () => {
        if (!guestName || !email) {
            toast.error("Nombre y Email son obligatorios")
            return
        }

        if (!dateRange.from || !dateRange.to || !selectedRoom) return

        const nights = differenceInDays(dateRange.to, dateRange.from)
        const numGuests = parseInt(guests) || 1

        if (numGuests < 1) {
            toast.error("Número de huéspedes inválido")
            return
        }

        const total = selectedRoom.price * nights * numGuests


        addBooking({
            guestName,
            email,
            phone,
            location,
            roomType: selectedRoom.id,
            guests,
            checkIn: dateRange.from.toISOString(),
            checkOut: dateRange.to.toISOString(),
            status: status === 'confirmed' ? 'confirmed' : 'pending',
            cancellationReason: undefined,
            refundStatus: undefined,
            cancelledAt: undefined
        }, total)

        toast.success("Reserva creada exitosamente")
        onOpenChange(false)
        resetForm()
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) resetForm()
            onOpenChange(val)
        }}>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 transition-all duration-300">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-stone-400 text-sm font-mono mb-2">
                        <span className={cn(step >= 1 ? "text-amber-500 font-bold" : "")}>01 Buscar</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className={cn(step >= 2 ? "text-amber-500 font-bold" : "")}>02 Habitación</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className={cn(step >= 3 ? "text-amber-500 font-bold" : "")}>03 Datos</span>
                    </div>
                    <DialogTitle className="text-2xl font-light font-heading uppercase tracking-wider text-stone-900 dark:text-stone-100">
                        {step === 1 && "Verificar Disponibilidad"}
                        {step === 2 && "Seleccionar Habitación"}
                        {step === 3 && "Datos del Huésped"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1 && "Ingresa las fechas y ubicación para encontrar habitaciones libres."}
                        {step === 2 && "Elige una de las opciones disponibles para estas fechas."}
                        {step === 3 && "Completa la información para confirmar la reserva."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {/* STEP 1: SEARCH */}
                    {step === 1 && (
                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ubicación</Label>
                                    <Select value={location} onValueChange={(v: "pueblo" | "hideout") => setLocation(v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pueblo">Mandalas Pueblo</SelectItem>
                                            <SelectItem value="hideout">Mandalas Hideout</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Huéspedes</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Fechas de Estadía</Label>
                                <div className="border border-stone-200 dark:border-stone-800 rounded-lg p-2 flex justify-center bg-stone-50/50 dark:bg-stone-900/50">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={(range: { from?: Date; to?: Date } | undefined) => setDateRange(range as { from: Date | undefined; to: Date | undefined } || { from: undefined, to: undefined })}
                                        numberOfMonths={2}
                                        disabled={(date) => date < subDays(new Date(), 1)}
                                        locale={es}
                                        className="rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: ROOM SELECTION */}
                    {step === 2 && (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {availableRooms.map((room) => (
                                <div
                                    key={room.id}
                                    onClick={() => room.available && setSelectedRoom({ id: room.id, label: room.label, price: room.price })}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden",
                                        selectedRoom?.id === room.id
                                            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/10 ring-1 ring-amber-500"
                                            : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900",
                                        !room.available && "opacity-50 cursor-not-allowed grayscale bg-stone-100 dark:bg-stone-800/50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center",
                                            room.available ? "bg-stone-100 dark:bg-stone-800 text-stone-600" : "bg-stone-200 text-stone-400"
                                        )}>
                                            <BedDouble className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-stone-900 dark:text-stone-100">{room.label}</h4>
                                            <p className="text-xs text-stone-500">
                                                {room.available ? `${room.price} USD / noche` : "No disponible"}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedRoom?.id === room.id && (
                                        <div className="bg-amber-500 text-white rounded-full p-1">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                    )}

                                    {!room.available && (
                                        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                            <span className="bg-stone-900 text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Ocupada</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {availableRooms.length === 0 && (
                                <div className="text-center py-10 text-stone-500">
                                    No hay habitaciones configuradas para esta ubicación.
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: GUEST DETAILS */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-lg flex justify-between items-center text-sm border border-stone-100 dark:border-stone-800">
                                <div>
                                    <p className="font-semibold text-stone-900 dark:text-stone-100">{selectedRoom?.label}</p>
                                    <p className="text-stone-500">
                                        {format(dateRange.from!, "d MMM", { locale: es })} - {format(dateRange.to!, "d MMM", { locale: es })}
                                        <span className="mx-2">•</span>
                                        {differenceInDays(dateRange.to!, dateRange.from!)} noches
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-amber-600">
                                        ${(selectedRoom?.price || 0) * differenceInDays(dateRange.to!, dateRange.from!) * parseInt(guests)}
                                    </p>
                                    <p className="text-[10px] uppercase text-stone-400">Total Est.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Nombre Completo</Label>
                                <Input
                                    placeholder="Ej. Juan Pérez"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="juan@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Teléfono</Label>
                                    <Input
                                        placeholder="+52 123 456 7890"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Estado Inicial</Label>
                                <Select value={status} onValueChange={(v: "confirmed" | "pending") => setStatus(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="confirmed">Confirmada (Pagada)</SelectItem>
                                        <SelectItem value="pending">Pendiente (Por Pagar)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={() => setStep(step - 1)}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Atrás
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < 3 ? (
                        <Button onClick={handleNextStep} className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
                            Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleCreateBooking} className="bg-amber-500 hover:bg-amber-600 text-white font-bold">
                            <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Reserva
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
