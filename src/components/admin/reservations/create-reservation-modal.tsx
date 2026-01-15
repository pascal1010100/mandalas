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
    Check,
    Calendar as CalendarIcon,
    X
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CreateReservationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialValues?: {
        location?: "pueblo" | "hideout"
        roomType?: string
        unitId?: string
    } | null
}

const ROOM_DETAILS: Record<string, string[]> = {
    // Pueblo
    // Pueblo
    'pueblo_dorm_mixed_8': ["8 Camas", "Lockers Grandes", "Baño Compartido"],
    'pueblo_dorm_female_6': ["6 Camas", "Espejo Tocador", "Baño Interno"],
    'pueblo_private_1': ["Vista al Jardín", "Cama Queen", "Escritorio"],
    'pueblo_private_2': ["Interior Silencioso", "Cama Matrimonial", "Smart TV"],
    'pueblo_private_family': ["2 Camas Dobles", "Mini-refri", "Mesa para 4"],
    'pueblo_suite_balcony': ["Balcón Privado", "Cama King", "Hamaca", "Vista 360°"],

    // Hideout
    'hideout_dorm_female': ["Exclusivo Chicas", "Literas cómodas", "Lockers seguros"],
    'hideout_dorm_mixed': ["Ambiente social", "Literas robustas", "Vistas al jardín"],
    'hideout_private_1': ["Cama Queen", "Baño Privado", "Vista Jardín"],
    'hideout_private_2': ["Cama Queen", "Baño Privado", "Tranquilidad"],
    'hideout_private_3': ["Cama Queen", "Baño Privado", "Cerca del Río"],
    'hideout_private_4': ["Cama Queen", "Baño Privado", "Cerca del Río"],
}



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

import { BedSelector } from "@/components/shared/bed-selector"

export function CreateReservationModal({ open, onOpenChange, initialValues }: CreateReservationModalProps) {
    const { addBooking, checkAvailability, rooms } = useAppStore()

    // Steps: 1 = Search, 2 = Select Room, 3 = Guest Details
    const [step, setStep] = useState(1)

    // Form State
    // DOGFOODING: Default to 'hideout' for this shift
    const [location, setLocation] = useState<"pueblo" | "hideout">("hideout")
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    })
    const [guests, setGuests] = useState("1")
    // FIXED: Added maxGuests to state type
    const [selectedRoom, setSelectedRoom] = useState<{ id: string, label: string, price: number, maxGuests: number, capacity: number, type: 'dorm' | 'private' | 'suite' } | null>(null)
    const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]) // For specific bed selection

    // Guest Details
    const [guestName, setGuestName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash")

    const [status, setStatus] = useState<"confirmed" | "pending">("confirmed")

    // Confirmation State
    const [showConfirmation, setShowConfirmation] = useState(false)

    // Handle Initial Values
    React.useEffect(() => {
        if (open) {
            if (initialValues) {
                // 1. Set Location
                if (initialValues.location) setLocation(initialValues.location)

                // 2. Set Default Dates (Today + 1 Night)
                const today = new Date()
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)
                setDateRange({ from: today, to: tomorrow })

                // 3. Find and Select Room
                if (initialValues.roomType) {
                    const room = rooms.find(r => r.id === initialValues.roomType)
                    if (room) {
                        setSelectedRoom({
                            id: room.id,
                            label: room.label,
                            price: room.basePrice,
                            maxGuests: room.maxGuests,
                            capacity: room.capacity,
                            type: room.type
                        })

                        // 4. Set Unit if provided
                        if (initialValues.unitId) {
                            setSelectedUnitIds([initialValues.unitId])
                        }

                        // 5. Jump to appropriate step
                        if (initialValues.unitId) {
                            setGuests("1")
                            setStep(4)
                        } else if (room.type === 'dorm') {
                            setStep(3)
                        } else {
                            setStep(4)
                        }
                    }
                }
            } else {
                // Hard Reset if no initial values (Ensure fresh state)
                setStep(1)
                setLocation("pueblo") // Default or keep previous? Default is safer.
                setDateRange({ from: undefined, to: undefined })
                setGuests("1")
                setSelectedRoom(null)
                setSelectedUnitIds([])
                setGuestName("")
                setEmail("")
                setPhone("")
                setStatus("confirmed")
                setPaymentMethod("cash")
                setShowConfirmation(false)
            }
        }
    }, [open, initialValues, rooms])

    const resetForm = () => {
        if (!initialValues) { // Only reset completely if no initial values context
            setStep(1)
            setLocation("pueblo")
            setDateRange({ from: undefined, to: undefined })
            setGuests("1")
            setSelectedRoom(null)
            setSelectedUnitIds([])
        }
        setGuestName("")
        setEmail("")
        setPhone("")
        setStatus("confirmed")
        setPaymentMethod("cash")
        setShowConfirmation(false)
    }

    const handleSelectRoom = (room: { id: string, label: string, price: number, maxGuests: number, capacity: number, type: string, typeVal: 'dorm' | 'private' | 'suite', available: boolean, image?: string }) => {
        if (!room.available) return
        // FIXED: Saving maxGuests to state
        setSelectedRoom({
            id: room.id,
            label: room.label,
            price: room.price,
            maxGuests: room.maxGuests,
            capacity: room.capacity,
            type: room.typeVal // We need type to know if we show bed selector
        })
        setSelectedUnitIds([]) // Reset unit selection
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
                available: isAvailable,
                capacity: roomConfig.capacity,
                typeVal: roomConfig.type, // Pass raw type for logic
                image: roomConfig.image // Pass image from store
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
            if (!selectedRoom) {
                toast.error("Selecciona una habitación disponible")
                return
            }
            // If Dorm, go to Step 3 (Bed Selection) logic internally handled or extra step?
            // Let's make Bed Selection part of Step 3 if needed, or intermediate.
            // Simplified: If Dorm, Step 3 is Bed Selection. Step 4 is Details.
            // But to keep it simple, let's insert a step if it's a Dorm.

            if (selectedRoom.type === 'dorm') {
                setStep(3) // Bed Selection
            } else {
                setStep(4) // Skip to Details
            }
        } else if (step === 3) {
            // Validate Bed Selection for Dorms
            if (selectedRoom?.type === 'dorm') {
                if (selectedUnitIds.length !== parseInt(guests)) {
                    // Try to auto-select or warn?
                    // Verify count matches guests
                    if (selectedUnitIds.length === 0) {
                        toast.error("Selecciona las camas para tus huéspedes")
                        return
                    }
                    if (selectedUnitIds.length !== parseInt(guests)) {
                        toast.warning(`Has seleccionado ${selectedUnitIds.length} camas para ${guests} huéspedes. Ajustando número de huéspedes...`)
                        setGuests(selectedUnitIds.length.toString())
                    }
                }
            }
            setStep(4)
        }
    }

    const validateAndAskConfirmation = () => {
        if (!guestName || !email) {
            toast.error("Nombre y Email son obligatorios")
            return
        }
        if (!dateRange.from || !dateRange.to || !selectedRoom) return

        const numGuests = parseInt(guests) || 1
        if (numGuests < 1) {
            toast.error("Número de huéspedes inválido")
            return
        }

        setShowConfirmation(true)
    }

    const handleCreateBooking = async () => {
        if (!dateRange.from || !dateRange.to || !selectedRoom) return

        const nights = differenceInDays(dateRange.to, dateRange.from)
        const totalGuests = parseInt(guests) || 1

        // Calculate price per person/bed
        // Total presented in UI was: Price * Nights * Guests
        // Price per booking (per bed) = Price * Nights * 1
        const pricePerBooking = selectedRoom.price * nights
        const checkInDate = format(dateRange.from, 'yyyy-MM-dd')
        const checkOutDate = format(dateRange.to, 'yyyy-MM-dd')

        try {
            // SCENARIO A: Specific Units Selected (Dorms or specific private rooms)
            if (selectedUnitIds.length > 0) {
                // Create one booking per selected unit
                const promises = selectedUnitIds.map((unitId, index) => {
                    const isPrincipal = index === 0 // Logic to flag primary guest if needed?
                    return addBooking({
                        guestName: isPrincipal ? guestName : `${guestName} (${index + 1})`, // Differentiate names? Or same name.
                        // Let's keep same name for now, or append clone suffix logic if desired. 
                        // Usually hotel PMS uses "Guest (2)" or requires names list.
                        // For simplicity: Same name, maybe unique ID internally handle.
                        // Better: "Juan Perez" for all.
                        email: email,
                        phone: phone,
                        location: location,
                        roomType: selectedRoom.id,
                        guests: selectedRoom.type === 'dorm' ? "1" : guests, // For Dorms, 1 guest per bed. For Private, use total guests.
                        checkIn: checkInDate,
                        checkOut: checkOutDate,
                        status: status === 'confirmed' ? 'confirmed' : 'pending',
                        cancellationReason: undefined,
                        refundStatus: undefined,
                        unitId: unitId,
                        paymentMethod: status === 'confirmed' ? paymentMethod : undefined
                    }, pricePerBooking)
                })

                await Promise.all(promises)

            } else {
                // SCENARIO B: No specific units (Legacy or "Run of House" Private)
                // Just create one booking for the whole party
                // NOTE: If this is a private room for 2 people, we usually treat it as 1 unit occupied.
                await addBooking({
                    guestName,
                    email,
                    phone,
                    location,
                    roomType: selectedRoom.id,
                    guests: guests, // Keep total guests
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    status: status === 'confirmed' ? 'confirmed' : 'pending',
                    cancellationReason: undefined,
                    refundStatus: undefined,
                    unitId: undefined,
                    paymentMethod: status === 'confirmed' ? paymentMethod : undefined
                }, pricePerBooking * totalGuests) // Full price
            }

            toast.success("Reserva(s) creada(s) exitosamente")
            setShowConfirmation(false)
            onOpenChange(false)
            resetForm()

        } catch (error) {
            console.error("Error creating booking:", error)
            // Error handling is inside store, but we catch here to stop modal close if needed? 
            // Store throws? Yes.
            // Toast already shown in store.
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) resetForm()
            onOpenChange(val)
        }}>
            {/* ELITE ADMIN MODAL */}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-2xl border-white/20 dark:border-stone-800/50 transition-all duration-300 overflow-hidden shadow-[0_0_50px_-10px_rgba(0,0,0,0.2)] rounded-3xl ring-1 ring-white/20">
                {/* Manual Close Button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-stone-500 dark:text-stone-400 rounded-full transition-all z-[60]"
                >
                    <X className="w-5 h-5" />
                </button>
                <DialogHeader className="p-8 pb-4 border-b border-stone-200/50 dark:border-stone-800/50 bg-white/40 dark:bg-black/20 z-10 sticky top-0 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-xl font-light font-heading uppercase tracking-[0.2em] text-stone-800 dark:text-stone-200 flex items-center gap-3">
                            <span className="p-2 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg">
                                {step === 1 && <CalendarIcon className="w-4 h-4" />}
                                {step === 2 && <BedDouble className="w-4 h-4" />}
                                {step === 3 && <BedDouble className="w-4 h-4" />}
                                {step === 4 && <CheckCircle className="w-4 h-4" />}
                            </span>
                            {step === 1 && "Disponibilidad"}
                            {step === 2 && "Selección"}
                            {step === 3 && "Camas"}
                            {step === 4 && "Confirmación"}
                        </DialogTitle>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-100 dark:bg-stone-900 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-800">
                                Paso {step} <span className="opacity-50">/ {selectedRoom?.type === 'dorm' ? 4 : 4}</span>
                            </span>
                        </div>
                    </div>

                    {/* Elite Progress Scroll */}
                    <div className="relative h-1 bg-stone-200/50 dark:bg-stone-800/50 w-full overflow-hidden rounded-full">
                        <div
                            className="absolute top-0 left-0 h-full bg-stone-900 dark:bg-stone-100 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-8 pt-2 scrollbar-hide">
                    {/* STEP 1: SEARCH */}
                    {step === 1 && (
                        <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-stone-500">Ubicación</Label>
                                    <Select
                                        value={location}
                                        onValueChange={(v: "pueblo" | "hideout") => {
                                            setLocation(v)
                                            setSelectedRoom(null)
                                        }}
                                    >
                                        <SelectTrigger className="h-12 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-xl focus:ring-0 focus:border-stone-400">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pueblo">Mandalas Pueblo</SelectItem>
                                            <SelectItem value="hideout">Mandalas Hideout</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-stone-400">Huéspedes</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                        <Input
                                            type="number"
                                            min="1"
                                            value={guests}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value)
                                                if (val > 0) setGuests(e.target.value)
                                            }}
                                            className="pl-10 h-12 bg-stone-100 dark:bg-stone-900 border-transparent focus:bg-white dark:focus:bg-stone-800 transition-all font-heading font-bold text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-stone-500">Fechas de Estadía</Label>
                                <div className="border border-stone-100 dark:border-stone-800 rounded-2xl p-6 flex justify-center bg-white dark:bg-stone-900 shadow-sm">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={(range: { from?: Date; to?: Date } | undefined) => setDateRange(range as { from: Date | undefined; to: Date | undefined } || { from: undefined, to: undefined })}
                                        numberOfMonths={2}
                                        // disabled={(date) => date < subDays(new Date(), 1)}
                                        locale={es}
                                        className="rounded-md pointer-events-auto"
                                        classNames={{
                                            day_selected: "bg-stone-900 text-white hover:bg-stone-700 focus:bg-stone-900 dark:bg-white dark:text-stone-900",
                                            day_today: "bg-stone-100 text-stone-900 font-bold",
                                            day_range_middle: "!bg-stone-100 dark:!bg-stone-800 !text-stone-900 dark:!text-stone-100 rounded-none",
                                            head_cell: "text-stone-400 font-normal text-[10px] uppercase tracking-wider",
                                            caption_label: "text-sm font-medium text-stone-800 dark:text-stone-200"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: SELECT ROOM */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center justify-between sticky top-0 bg-stone-50/95 dark:bg-stone-950/95 z-20 py-4 backdrop-blur-md">
                                <Label className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">Habitaciones Disponibles</Label>
                                <Badge variant="secondary" className="bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono text-[10px] uppercase tracking-wider">
                                    {location}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {availableRooms.map((room) => {
                                    const isSelected = selectedRoom?.id === room.id

                                    // Define image source
                                    let roomImage = room.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=300";
                                    if (!room.image) {
                                        if (room.id.includes('private')) roomImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=300";
                                        if (room.id.includes('suite')) roomImage = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=300";
                                    }

                                    return (
                                        <div
                                            key={room.id}
                                            onClick={() => handleSelectRoom(room)}
                                            className={cn(
                                                "group relative flex flex-col sm:flex-row gap-6 p-4 rounded-3xl cursor-pointer transition-all duration-500 border overflow-hidden",
                                                isSelected
                                                    ? "bg-white dark:bg-stone-900 border-stone-800 dark:border-stone-100 ring-2 ring-stone-900 dark:ring-stone-100 shadow-2xl scale-[1.01] z-10"
                                                    : "bg-white/60 dark:bg-stone-900/40 border-stone-200/50 dark:border-stone-800/50 shadow-sm hover:shadow-xl hover:border-stone-300 dark:hover:border-stone-700 hover:-translate-y-1 backdrop-blur-sm",
                                                !room.available && "opacity-40 pointer-events-none grayscale"
                                            )}
                                        >
                                            {/* Glowing Background for Selected */}
                                            {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-stone-100/50 to-transparent dark:from-stone-800/20 pointer-events-none" />}

                                            {/* Thumbnail with Parallax Scale */}
                                            <div className="w-full sm:w-36 h-28 rounded-2xl bg-stone-100 shrink-0 overflow-hidden relative shadow-inner">
                                                <img
                                                    src={roomImage}
                                                    alt={room.label}
                                                    className={cn(
                                                        "w-full h-full object-cover transition-transform duration-700 ease-out",
                                                        isSelected ? "scale-110" : "group-hover:scale-110"
                                                    )}
                                                />
                                                {/* Price Badge Overlay */}
                                                <div className="absolute bottom-2 right-2 bg-stone-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-stone-900 text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                                                    Q{room.price}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-center relative">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={cn(
                                                                "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                                room.type === 'dorm' ? "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/30 dark:border-orange-900/50 dark:text-orange-400" :
                                                                    room.type === 'suite' ? "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:border-purple-900/50 dark:text-purple-400" :
                                                                        "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400"
                                                            )}>
                                                                {room.type === 'dorm' ? 'Dormitorio' : room.type === 'private' ? 'Privada' : 'Suite'}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-heading font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                                                            {room.label}
                                                        </h4>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-stone-500 mt-1">
                                                    <div className="flex items-center gap-1.5 bg-stone-100/50 dark:bg-stone-800/50 px-2 py-1 rounded-md border border-stone-200 dark:border-stone-800">
                                                        <Users className="w-3.5 h-3.5" />
                                                        <span>Máx. {room.maxGuests}</span>
                                                    </div>
                                                    {isSelected && (
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/50">
                                                            <CheckCircle className="w-3.5 h-3.5" /> Seleccionada
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: BED SELECTION (DORMS ONLY) */}
                    {step === 3 && selectedRoom?.type === 'dorm' && (
                        <div className="py-2">
                            <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-xl flex items-center gap-3 border border-blue-100 dark:border-blue-900/30">
                                <Sparkles className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">
                                    Selecciona las camas que desees. El número de huéspedes se actualizará automáticamente.
                                </p>
                            </div>
                            <BedSelector
                                room={rooms.find(r => r.id === selectedRoom.id)!} // Pass full config
                                dateRange={dateRange}
                                selectedUnits={selectedUnitIds}
                                maxSelections={99} // Unlimited selection
                                onToggleUnit={(unitId) => {
                                    // Toggle logic
                                    let newSelection = []
                                    if (selectedUnitIds.includes(unitId)) {
                                        newSelection = selectedUnitIds.filter(id => id !== unitId)
                                    } else {
                                        newSelection = [...selectedUnitIds, unitId]
                                    }

                                    setSelectedUnitIds(newSelection)

                                    // Auto-sync guests count
                                    // If selection is 0, keep guests as 1 (minimum) or let it be 0? 
                                    // Lets keep it at least 1 for the form sake, but specific beds count is what matters.
                                    // Ideally, match selection count. If 0 selected, user needs to select.
                                    if (newSelection.length > 0) {
                                        setGuests(newSelection.length.toString())
                                    }
                                }}
                            />
                            <div className="flex items-center justify-center gap-2 mt-4 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 py-2 px-4 rounded-full border border-emerald-100 dark:border-emerald-900/30 w-fit mx-auto transition-all duration-300">
                                {selectedUnitIds.length === 0 ? (
                                    <span className="font-medium text-amber-600 dark:text-amber-400">Selecciona al menos 1 cama para continuar</span>
                                ) : (
                                    <>
                                        <span className="font-bold text-lg">{selectedUnitIds.length}</span> Cama{selectedUnitIds.length > 1 ? 's' : ''} = <span className="font-bold text-lg">{guests}</span> Huésped{parseInt(guests) > 1 ? 'es' : ''}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: GUEST DETAILS */}
                    {step === 4 && (
                        <div className="space-y-8 animate-in mt-4 fade-in slide-in-from-right-8 duration-500">
                            {/* Summary Card */}
                            <div className="bg-stone-100/50 dark:bg-stone-900/50 p-6 rounded-3xl border border-stone-200/50 dark:border-stone-800/50 flex items-center gap-6">
                                <div className="h-16 w-16 rounded-2xl bg-white dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 shadow-sm shrink-0">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-heading font-medium text-lg text-stone-900 dark:text-stone-100 tracking-wide">
                                        {selectedRoom?.label}
                                        {selectedUnitIds.length > 0 && selectedRoom?.type === 'dorm' && (
                                            <span className="ml-2 font-normal text-stone-500 text-sm">
                                                (Cama{selectedUnitIds.length > 1 ? 's' : ''}: {selectedUnitIds.join(', ')})
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mt-1">
                                        {format(dateRange.from!, "d MMM", { locale: es })} - {format(dateRange.to!, "d MMM", { locale: es })} • {differenceInDays(dateRange.to!, dateRange.from!)} noches
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-light text-3xl text-stone-900 dark:text-white">
                                        Q{(selectedRoom?.price || 0) * differenceInDays(dateRange.to!, dateRange.from!) * parseInt(guests)}
                                    </p>
                                    <Badge variant="outline" className="text-[9px] border-stone-300 text-stone-500 bg-white dark:bg-stone-950 dark:border-stone-800 mt-1">TOTAL ESTIMADO</Badge>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Huésped Principal</Label>
                                    <Input
                                        placeholder="Nombre Completo"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        className="h-12 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-xl px-4 focus:ring-1 focus:ring-stone-400"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Contacto</Label>
                                        <Input
                                            type="email"
                                            placeholder="Correo Electrónico"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-xl px-4"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Teléfono</Label>
                                        <Input
                                            placeholder="+52..."
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="h-12 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-xl px-4"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Total Huéspedes</Label>
                                        <div className="relative">
                                            <Users className="absolute left-4 top-4 h-4 w-4 text-stone-400" />
                                            <Input
                                                type="number"
                                                min="1"
                                                max={selectedRoom ? selectedRoom.maxGuests : 10}
                                                value={guests}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 1
                                                    if (selectedRoom && val > selectedRoom.maxGuests) {
                                                        toast.warning(`Máximo ${selectedRoom.maxGuests} personas para esta habitación`)
                                                        setGuests(selectedRoom.maxGuests.toString())
                                                    } else {
                                                        setGuests(e.target.value)
                                                    }
                                                }}
                                                className="pl-12 h-12 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-xl font-bold text-stone-700"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Estado de Pago</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Select value={status} onValueChange={(v: "confirmed" | "pending") => setStatus(v)}>
                                                <SelectTrigger className="h-12 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-xl px-4">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="confirmed">Confirmada (Pagada)</SelectItem>
                                                    <SelectItem value="pending">Pendiente (Por Pagar)</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {/* New: Payment Method (Only if confirmed) */}
                                            {status === 'confirmed' && (
                                                <Select
                                                    value={paymentMethod}
                                                    onValueChange={(v: "cash" | "card" | "transfer") => setPaymentMethod(v)}
                                                >
                                                    <SelectTrigger className="h-12 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-xl px-4">
                                                        <SelectValue placeholder="Método de Pago" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="cash">Efectivo (Cash)</SelectItem>
                                                        <SelectItem value="card">Tarjeta (Card)</SelectItem>
                                                        <SelectItem value="transfer">Transferencia</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* STICKY FOOTER */}
                <DialogFooter className="p-6 border-t border-stone-200/50 dark:border-stone-800/50 bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl flex items-center justify-between sm:justify-between w-full mt-auto z-50">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={() => setStep(step - 1)} className="hover:bg-stone-100 text-stone-500 rounded-full h-11 px-6">
                            <ChevronLeft className="w-4 h-4 mr-2" /> Atrás
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < 4 ? (
                        <Button
                            onClick={() => {
                                if (step === 2) {
                                    if (selectedRoom?.type === 'dorm') setStep(3)
                                    else {
                                        setSelectedUnitIds(["1"])
                                        setStep(4)
                                    }
                                } else if (step === 3) {
                                    if (selectedUnitIds.length === 0) {
                                        toast.error("Selecciona al menos una cama")
                                        return
                                    }
                                    setStep(4)
                                } else {
                                    handleNextStep()
                                }
                            }}
                            disabled={
                                (step === 1 && (!dateRange.from || !dateRange.to)) ||
                                (step === 2 && !selectedRoom)
                            }
                            className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:scale-105 transition-all duration-300 shadow-xl rounded-full h-12 px-8 font-medium tracking-wide text-sm"
                        >
                            Continuar <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleCreateBooking} className="bg-stone-900 hover:bg-black text-white rounded-full h-12 px-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm font-bold tracking-widest uppercase">
                            <CheckCircle className="w-4 h-4 mr-2" /> Confirmar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
