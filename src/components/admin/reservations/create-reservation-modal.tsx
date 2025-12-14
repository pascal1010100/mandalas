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
    Check,
    ChevronsUpDown,
    CalendarIcon,
    AlertCircle,
    Info,
    Ban,
    Trash2,
    Users,
    BedDouble,
    CheckCircle,
    ChevronLeft,
    Loader2,
    ArrowRight
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
    const { addBooking, checkAvailability, rooms } = useAppStore()

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

    const handleSelectRoom = (room: any) => {
        if (!room.available) return
        setSelectedRoom({ id: room.id, label: room.label, price: room.price })
    }

    const availableRooms = useMemo(() => {
        if (!dateRange.from || !dateRange.to) return []

        const opts = ROOM_OPTIONS[location]
        return opts.map(room => {
            const roomConfig = rooms.find(r => r.id === room.key)
            const price = roomConfig?.basePrice || 0
            const maxGuests = roomConfig?.maxGuests || 2 // Default fallback

            // Infer type from ID for display
            let typeLabel = "Cama"
            if (room.id === 'private') typeLabel = "Habitación"
            if (room.id === 'suite') typeLabel = "Suite"

            const isAvailable = checkAvailability(
                location,
                room.id,
                dateRange.from!.toISOString(),
                dateRange.to!.toISOString(),
                parseInt(guests) || 1
            )
            return {
                ...room,
                price: price,
                maxGuests: maxGuests,
                type: typeLabel,
                available: isAvailable
            }
        })
    }, [location, dateRange, checkAvailability, rooms, guests])



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

                    {/* STEP 2: SELECT ROOM */}
                    {step === 2 && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Seleccionar Habitación</Label>
                                <span className="text-xs text-stone-500 uppercase tracking-wider font-medium bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">
                                    {location}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {availableRooms.map((room) => {
                                    const isSelected = selectedRoom?.id === room.id

                                    // Define static images for admin view (reliable fallback)
                                    let roomImage = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=300"; // Dorm default
                                    if (room.id.includes('private')) roomImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=300";
                                    if (room.id.includes('suite')) roomImage = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=300";

                                    return (
                                        <div
                                            key={room.id}
                                            onClick={() => handleSelectRoom(room)}
                                            className={cn(
                                                "relative flex gap-4 p-3 rounded-xl border cursor-pointer transition-all duration-200 group bg-white dark:bg-stone-900",
                                                isSelected
                                                    ? "border-amber-500 ring-1 ring-amber-500 shadow-md bg-amber-50/10"
                                                    : "border-stone-200 dark:border-stone-800 hover:border-amber-400/50 hover:shadow-sm",
                                                !room.available && "opacity-50 cursor-not-allowed grayscale"
                                            )}
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-24 h-20 rounded-lg bg-stone-200 shrink-0 overflow-hidden relative">
                                                <img src={roomImage} alt={room.label} className="w-full h-full object-cover" />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-amber-500/20 grid place-items-center">
                                                        <div className="bg-amber-500 text-white rounded-full p-1">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className={cn("font-bold text-sm", isSelected ? "text-amber-700 dark:text-amber-400" : "text-stone-900 dark:text-stone-100")}>
                                                            {room.label}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Users className="w-3 h-3" /> Max {room.maxGuests}
                                                            <BedDouble className="w-3 h-3" /> {room.type}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-heading font-bold text-lg text-stone-900 dark:text-white">
                                                            ${room.price}
                                                        </div>
                                                        <span className="text-[10px] text-stone-400">/ noche</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {!room.available && (
                                                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 flex items-center justify-center backdrop-blur-[1px] z-10 cursor-not-allowed">
                                                    <span className="bg-stone-900 text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider shadow-lg">Ocupada</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={() => setStep(1)} className="text-stone-500">
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Volver
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    disabled={!selectedRoom}
                                    className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                                >
                                    Continuar <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
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
