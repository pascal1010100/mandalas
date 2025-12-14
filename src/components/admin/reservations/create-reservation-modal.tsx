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
import { Badge } from "@/components/ui/badge"
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


import { format, differenceInDays, subDays } from "date-fns" // Fixed import
import { es } from "date-fns/locale"
import {
    CheckCircle,
    ChevronLeft,
    Users,
    BedDouble,
    ArrowRight,
    Sparkles,
    Check
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CreateReservationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const ROOM_DETAILS: Record<string, string[]> = {
    // Pueblo
    'pueblo_dorm': ["Camas con cortinas de privacidad", "Lockers individuales", "Enchufe y luz de lectura"],
    'pueblo_private': ["Cama Matrimonial", "Baño Privado", "Ventilador de techo"],
    'pueblo_suite': ["Vista panorámica al lago", "Balcón privado", "Cama King Size"],

    // Hideout
    'hideout_dorm': ["Baño privado al aire libre", "Porche con hamaca", "Construcción de bambú"],
    'hideout_private': ["Cama Queen real", "Electricidad y WiFi", "Sonidos de la naturaleza"],
    'hideout_suite': ["Espacioso y aireado", "Vistas al jardín", "Ideal para grupos"] // Matches public page logic for 'Suite' slot
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

    const handleSelectRoom = (room: { id: string, label: string, price: number, available: boolean }) => {
        if (!room.available) return
        setSelectedRoom({ id: room.id, label: room.label, price: room.price })
    }

    const availableRooms = useMemo(() => {
        if (!dateRange.from || !dateRange.to) return []

        // Filter rooms by current location selection and map to display format
        const dynamicRooms = rooms.filter(r => r.location === location)

        // Sort by hierarchy: Dorm -> Private -> Suite
        const sortedRooms = dynamicRooms.sort((a, b) => {
            const order: Record<string, number> = { 'dorm': 1, 'private': 2, 'suite': 3 }
            return (order[a.type] || 99) - (order[b.type] || 99)
        })

        return sortedRooms.map(roomConfig => {
            // Infer type label for display
            let typeLabel = "Cama"
            if (roomConfig.type === 'private') typeLabel = "Habitación"
            if (roomConfig.type === 'suite') typeLabel = "Suite"

            const isAvailable = checkAvailability(
                location,
                roomConfig.id,
                dateRange.from!.toISOString(),
                dateRange.to!.toISOString(),
                parseInt(guests) || 1
            )
            return {
                id: roomConfig.id, // Use actual RoomConfig ID (e.g. pueblo_dorm)
                label: roomConfig.label,
                key: roomConfig.id, // redundant but kept for compatibility if needed
                price: roomConfig.basePrice,
                maxGuests: roomConfig.maxGuests,
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
            checkIn: format(dateRange.from, 'yyyy-MM-dd'),
            checkOut: format(dateRange.to, 'yyyy-MM-dd'),
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

                            {/* Room Amenities Cheat Sheet */}
                            {selectedRoom && ROOM_DETAILS[selectedRoom.id] && (
                                <div className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800/50 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 mt-4 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Sparkles className="w-12 h-12 text-amber-500" />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-600 dark:text-amber-500 mb-3 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" />
                                            Experiencia Incluida
                                        </h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {ROOM_DETAILS[selectedRoom.id].map((feature, idx) => (
                                                <li key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                                                    <div className="mt-0.5 p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                                                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                                    </div>
                                                    <span className="leading-tight">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
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
                                    const numGuests = parseInt(guests) || 1
                                    const numNights = (dateRange.from && dateRange.to) ? differenceInDays(dateRange.to, dateRange.from) : 1
                                    const totalPrice = room.price * numGuests * numNights

                                    // Define static images for admin view (reliable fallback)
                                    let roomImage = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=300"; // Dorm default
                                    if (room.id.includes('private')) roomImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=300";
                                    if (room.id.includes('suite')) roomImage = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=300";

                                    return (
                                        <div
                                            key={room.id}
                                            onClick={() => handleSelectRoom(room)}
                                            className={cn(
                                                "relative flex flex-col md:flex-row gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 group bg-white dark:bg-stone-900",
                                                isSelected
                                                    ? "border-amber-500 ring-2 ring-amber-500/20 shadow-lg bg-orange-50/10 dark:bg-orange-900/10"
                                                    : "border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-md",
                                                !room.available && "opacity-60 cursor-not-allowed grayscale-[0.5]"
                                            )}
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-full md:w-32 h-32 rounded-xl bg-stone-200 shrink-0 overflow-hidden relative shadow-inner">
                                                <img src={roomImage} alt={room.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-amber-500/20 grid place-items-center backdrop-blur-[2px]">
                                                        <div className="bg-amber-500 text-white rounded-full p-1.5 shadow-lg animate-in zoom-in-50">
                                                            <CheckCircle className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className={cn("font-bold text-base font-heading tracking-wide", isSelected ? "text-amber-700 dark:text-amber-400" : "text-stone-900 dark:text-stone-100")}>
                                                                {room.label}
                                                            </h4>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 h-6">
                                                                    <BedDouble className="w-3 h-3 mr-1.5" />
                                                                    {room.type === 'dorm' ? 'Dormitorio' : room.type === 'private' ? 'Privada' : 'Suite'}
                                                                </Badge>
                                                                <div className="text-xs text-stone-500 flex items-center gap-1">
                                                                    <Users className="w-3 h-3" />
                                                                    Máx. {room.maxGuests}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Price Block */}
                                                        <div className="text-right">
                                                            <div className="font-heading font-bold text-xl text-stone-900 dark:text-white flex items-center justify-end gap-1">
                                                                ${totalPrice.toLocaleString('es-MX')}
                                                                <span className="text-[10px] uppercase font-sans font-normal text-stone-400 translate-y-0.5">Total</span>
                                                            </div>
                                                            {/* Explicit Breakdown for Clarity */}
                                                            <div className="text-[10px] text-stone-400 font-mono mt-1 bg-stone-50 dark:bg-stone-800 px-2 py-1 rounded inline-block border border-stone-100 dark:border-stone-700">
                                                                ${room.price} x {numGuests}p x {numNights}n
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mini Amenities Line */}
                                                <div className="mt-3 flex gap-4 text-xs text-stone-500 border-t border-dashed border-stone-100 dark:border-stone-800 pt-3">
                                                    {/* Dynamic Amenities from ROOM_DETAILS could go here simply */}
                                                    {ROOM_DETAILS[room.id] && ROOM_DETAILS[room.id].slice(0, 2).map((feat, i) => (
                                                        <span key={i} className="flex items-center gap-1 opacity-80">
                                                            <div className="w-1 h-1 bg-amber-500 rounded-full" /> {feat}
                                                        </span>
                                                    ))}
                                                    {ROOM_DETAILS[room.id] && ROOM_DETAILS[room.id].length > 2 && (
                                                        <span className="opacity-60">+ más</span>
                                                    )}
                                                </div>
                                            </div>

                                            {!room.available && (
                                                <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-[2px] z-20 cursor-not-allowed rounded-2xl">
                                                    <Badge variant="destructive" className="text-xs px-3 py-1 font-bold uppercase tracking-wider shadow-xl scale-110">
                                                        No Disponible
                                                    </Badge>
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
