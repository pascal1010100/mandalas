"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { Check, CheckCircle, Users, BedDouble, Calendar as CalendarIcon, Loader2, PartyPopper, Copy, CreditCard, Banknote, ShieldCheck, X } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format, addDays, subDays, differenceInDays, differenceInCalendarDays } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BedSelector } from "@/components/shared/bed-selector"

// ... imports remain the same ...

const APP_CONFIG = {
    payment: {
        bankName: "Banco Industrial",
        accountNumber: "000-000000-0"
    }
}

interface BookingModalProps {
    children: ReactNode
    className?: string
    defaultLocation?: 'pueblo' | 'hideout'
    defaultRoomType?: string
    roomName?: string
    pricePerNight?: number
}

export function BookingModal({
    children,
    className,
    defaultLocation = "pueblo",
    defaultRoomType = "dorm",
    // roomName, // Removed unused prop to fix lint
    pricePerNight = 25
}: BookingModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [date, setDate] = useState<DateRange | undefined>()
    // ... rest of state ...
    const [step, setStep] = useState(1)
    const [location, setLocation] = useState(defaultLocation)

    // Form State
    const [guests, setGuests] = useState("1")
    const [roomType, setRoomType] = useState(defaultRoomType)

    // Bed Selection State
    const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([])

    // Contact Form State (NEW)
    const [guestName, setGuestName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [paymentPreference, setPaymentPreference] = useState<'card' | 'transfer' | undefined>(undefined)

    // Receipt State
    const [bookingId, setBookingId] = useState("")

    // ...

    // Scroll Container
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Reset scroll when step changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0
        }
    }, [step])

    // Store Action
    const { addBooking, createGroupBooking, rooms, checkAvailability, getRemainingCapacity } = useAppStore()

    // Determine Price & Max Guests dynamically
    // NOTE: rooms in store utilize IDs like "pueblo_dorm", "hideout_private" etc.
    // We filter by location first, then find the selected roomType within that location.
    // IF roomType is just "dorm" we need to find the matching room config ID.
    // Ideally user selects a specific ROOM CARD which sets the specific room ID.

    const selectedRoomConfig = rooms.find(r => r.id === roomType)
    // Fallback logic if roomType is generic like 'dorm' but we have specific IDs.
    // Ideally we should rely on the Room Card selection to set the exact ID.

    const currentPrice = selectedRoomConfig?.basePrice || pricePerNight
    const maxGuests = selectedRoomConfig?.maxGuests || 6
    const isDorm = selectedRoomConfig?.type === 'dorm'

    // Dynamic styling based on location - Elite "Quiet Luxury" Refinement
    const theme = location === "pueblo" ? {
        gradient: "bg-gradient-to-r from-amber-500 to-orange-600",
        lightGradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-l-4 border-l-[#D97706]",
        glass: "bg-amber-50/90 dark:bg-amber-950/20 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/30",
        border: "border-orange-100 dark:border-orange-900/50",
        text: "text-[#B45309] dark:text-[#F59E0B]",
        accentText: "text-amber-600 dark:text-amber-400",
        button: "bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 shadow-[0_0_20px_-5px_rgba(217,119,6,0.5)] hover:shadow-[0_0_25px_-5px_rgba(217,119,6,0.7)] transition-all duration-300",
        icon: "bg-amber-100/50 text-[#D97706] dark:bg-amber-900/20 dark:text-[#fbbf24] ring-1 ring-amber-200 dark:ring-amber-800",
        glow: "shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)] dark:shadow-[0_0_30px_-10px_rgba(245,158,11,0.1)]"
    } : {
        gradient: "bg-gradient-to-r from-lime-500 to-lime-700",
        lightGradient: "from-lime-50 to-green-50 dark:from-lime-950/20 dark:to-green-950/20 border-l-4 border-l-[#65a30d]",
        glass: "bg-lime-50/90 dark:bg-stone-900/40 backdrop-blur-xl border-lime-200/50 dark:border-lime-700/30",
        border: "border-lime-100 dark:border-lime-900/50",
        text: "text-[#3f6212] dark:text-[#a3e635]",
        accentText: "text-lime-700 dark:text-lime-400",
        button: "bg-gradient-to-r from-lime-500 to-lime-700 hover:brightness-110 shadow-[0_0_20px_-5px_rgba(101,163,13,0.5)] hover:shadow-[0_0_25px_-5px_rgba(101,163,13,0.7)] transition-all duration-300",
        icon: "bg-lime-100/50 text-[#65a30d] dark:bg-lime-900/20 dark:text-[#a3e635] ring-1 ring-lime-200 dark:ring-lime-800",
        glow: "shadow-[0_0_30px_-10px_rgba(132,204,22,0.3)] dark:shadow-[0_0_30px_-10px_rgba(132,204,22,0.1)]"
    }

    const [isSubmitting, setIsSubmitting] = useState(false)



    const handleNext = async () => {
        // STEP 1 -> 2 (or Skip)
        if (step === 1) {
            if (!date?.from || !date?.to) {
                toast.error("Selecciona las fechas para continuar")
                return
            }

            // SMART SKIP LOGIC:
            // If we have a specific defaultRoomType (from specific "Book" button), try to auto-select it.
            // Check if defaultRoomType matches a valid room ID in our list
            const preSelectedRoom = rooms.find(r => r.id === defaultRoomType)

            if (preSelectedRoom && preSelectedRoom.location === location) {
                // Check specific availability
                const isAvailable = checkAvailability(
                    preSelectedRoom.location,
                    preSelectedRoom.id,
                    date.from.toISOString(),
                    date.to.toISOString()
                )

                if (isAvailable) {
                    setRoomType(preSelectedRoom.id)
                    toast.success(`¡${preSelectedRoom.label} está disponible!`)

                    // Skip to next relevant step
                    if (preSelectedRoom.type === 'dorm') {
                        setStep(3)
                    } else {
                        setSelectedUnitIds(["1"])
                        setStep(4)
                    }
                    return
                } else {
                    // If pre-selected room is NOT available, warn user and go to list
                    toast.warning(`${preSelectedRoom.label} no está disponible en estas fechas.`, {
                        description: "Por favor selecciona otra opción de la lista."
                    })
                }
            }

            // Standard fallback: Go to Room Selection
            setStep(2)
            return
        }

        if (step === 2) {
            if (!selectedRoomConfig) {
                toast.error("Selecciona una habitación")
                return
            }
            // If Dorm, go to Bed Selection (Step 3)
            if (selectedRoomConfig.type === 'dorm') {
                setStep(3)
                return
            }
            // If Private, skip to Details (Step 4)
            // Allow '1' unit ID for simplified logic if needed, or leave empty
            setSelectedUnitIds(["1"]) // Dummy unit for private
            setStep(4)
            return
        }

        if (step === 3) {
            // Validate Bed Selection
            if (selectedUnitIds.length === 0) {
                toast.error("Selecciona al menos una cama", {
                    description: "Toca las camas disponibles para reservarlas."
                })
                return
            }
            // Go to Details
            setStep(4)
            return
        }

        if (step === 4) {
            // Validation
            if (!guestName.trim() || !email.trim()) {
                toast.error("Faltan datos", {
                    description: "Por favor completa tu nombre y email para continuar."
                })
                return
            }

            if (!paymentPreference) {
                toast.error("Método de Garantía Requerido", {
                    description: "Por favor selecciona cómo prefieres garantizar tu reserva (Pago en Hotel o Transferencia)."
                })
                return
            }

            if (date?.from && date?.to) {
                // Final Availability Check (Optimistic)
                setIsSubmitting(true)
                // Simulate network delay for "Elite" feel
                await new Promise(resolve => setTimeout(resolve, 2000))

                const nights = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
                const guestMultiplier = isDorm ? (parseInt(guests) || 1) : 1
                const baseTotal = currentPrice * nights * guestMultiplier
                const totalPrice = baseTotal * 1.1 // Include 10% tax
                const newId = Math.random().toString(36).substring(7).toUpperCase();
                setBookingId(newId);

                // Add bookings for EACH selected unit if Dorm
                if (isDorm) {
                    // ELITE LOGIC: Batch Insert + Auto-Naming
                    const bookingPayloads = selectedUnitIds.map((unitId, idx) => ({
                        guestName: selectedUnitIds.length > 1 ? `${guestName.trim()} (${idx + 1}/${selectedUnitIds.length})` : guestName.trim(), // Auto-numbering
                        email: email.trim(),
                        phone: phone.trim(),
                        location: location as 'pueblo' | 'hideout',
                        roomType,
                        guests: "1", // Each bed is 1 guest
                        unitId: unitId,
                        checkIn: date.from!.toISOString(),
                        checkOut: date.to!.toISOString(),
                        totalPrice: Math.round((totalPrice / selectedUnitIds.length) * 100) / 100, // Split price per bed
                        status: 'pending' as const,
                        paymentMethod: paymentPreference,
                        paymentStatus: 'pending' as const
                    }));

                    await createGroupBooking(bookingPayloads); // AWAIT THE BATCH!
                } else {
                    addBooking({
                        guestName: guestName.trim(),
                        email: email.trim(),
                        phone: phone.trim(),
                        location: location as 'pueblo' | 'hideout',
                        roomType,
                        guests,
                        checkIn: date.from.toISOString(),
                        checkOut: date.to.toISOString(),
                        totalPrice: Math.round(totalPrice * 100) / 100,
                        status: 'pending',
                        paymentMethod: paymentPreference
                    })
                }

                setIsSubmitting(false)
                setStep(5) // Success
                toast.success("¡Solicitud Recibida!", {
                    description: "Por favor confirma tu reserva vía WhatsApp."
                })
                return;
            }
        }
        setStep(step + 1)
    }

    const handleBack = () => {
        if (step === 4 && !isDorm) {
            setStep(2) // Skip Bed Selection for private
        } else {
            setStep(step - 1)
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            // Optional: Reset steps if needed when closing
            // setStep(1) 
        }
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                stiffness: 300,
                damping: 30
            }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 }
        })
    };

    const availableRooms = rooms.filter(r => r.location === location)

    // Confetti Effect
    useEffect(() => {
        if (step === 5) {
            import('canvas-confetti').then((module) => {
                const confetti = module.default
                if (typeof confetti !== 'function') return

                const duration = 3000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

                const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

                const interval = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();

                    if (timeLeft <= 0) {
                        return clearInterval(interval);
                    }

                    const particleCount = 50 * (timeLeft / duration);
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                }, 250);
            })
        }
    }, [step])

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className={className} suppressHydrationWarning>{children}</div>
            </DialogTrigger>
            {/* ELITE GLASS CONTAINER */}
            <DialogContent className={cn(
                "sm:max-w-[600px] p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col shadow-2xl transition-all duration-500 border-0 ring-1 ring-white/20",
                theme.glass,
                theme.glow
            )}>
                {/* Manual Close Button (Fixed) */}
                <button
                    onClick={() => handleOpenChange(false)}
                    className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-stone-500 dark:text-stone-400 rounded-full transition-all z-[60]"
                >
                    <X className="w-5 h-5" />
                </button>
                {/* Header with Glass Effect */}
                <DialogHeader className={cn(
                    "p-6 pb-4 flex-shrink-0 z-20 backdrop-blur-md border-b bg-white/40 dark:bg-black/20",
                    theme.border
                )}>
                    {/* ... (Header remains mostly same, just ensuring correct close button visibility which DialogHeader handles) ... */}
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2 drop-shadow-sm">
                            {step === 5 ? (
                                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                    <PartyPopper className="w-6 h-6 animate-bounce" /> Solicitud Enviada
                                </span>
                            ) : (
                                <>
                                    Reservar en <span className={cn("capitalize relative", theme.text)}>
                                        {location}
                                        <span className={cn("absolute -bottom-1 left-0 w-full h-1 rounded-full opacity-40", theme.gradient)}></span>
                                    </span>
                                </>
                            )}
                        </DialogTitle>
                        <div className={cn("text-xs font-bold px-3 py-1 rounded-full border bg-white/50 dark:bg-black/20 backdrop-blur-md", theme.border, theme.text)}>
                            Paso {step} <span className="opacity-60">/ {isDorm ? 4 : 3}</span>
                        </div>
                    </div>

                    {/* Elite Progress Indicator */}
                    <div className="mt-4 h-1 w-full bg-stone-200/50 dark:bg-stone-800/50 rounded-full overflow-hidden">
                        <motion.div
                            className={cn("h-full", theme.gradient)}
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / (isDorm ? 4 : 3)) * 100}%` }}
                            transition={{ ease: "easeInOut", duration: 0.5 }}
                        />
                    </div>
                </DialogHeader>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
                    {/* Background Ambient Glow */}
                    <div className={cn("absolute top-0 right-0 w-64 h-64 opacity-20 blur-[80px] rounded-full pointer-events-none -z-10", theme.gradient)}></div>
                    <div className={cn("absolute bottom-0 left-0 w-64 h-64 opacity-10 blur-[80px] rounded-full pointer-events-none -z-10", theme.gradient)}></div>
                    <AnimatePresence mode="wait" initial={false} custom={step}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={step}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="p-6 space-y-6"
                            >
                                <Tabs
                                    defaultValue={defaultLocation}
                                    onValueChange={(value) => setLocation(value as 'pueblo' | 'hideout')}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2 bg-stone-200/50 dark:bg-stone-800/50 p-1 rounded-xl">
                                        <TabsTrigger value="pueblo" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-stone-800 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400">Mandalas Pueblo</TabsTrigger>
                                        <TabsTrigger value="hideout" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-stone-800 data-[state=active]:text-lime-600 dark:data-[state=active]:text-lime-400">Mandalas Hideout</TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <div className="space-y-3">
                                    <Label className="text-stone-900 dark:text-stone-100 flex items-center gap-2 text-sm font-semibold">
                                        <CalendarIcon className="w-4 h-4 text-stone-400" /> Fechas de Estancia
                                    </Label>
                                    <div className="flex justify-center border border-stone-100 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-950/50 p-4 shadow-sm">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={1}
                                            disabled={(day) => day < subDays(new Date(), 1)}
                                            className={cn("p-0 pointer-events-auto")}
                                            classNames={{
                                                day_selected: cn("bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-md", theme.button),
                                                day_range_middle: "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 rounded-none",
                                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors",
                                                day_today: "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold",
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={step}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="p-6 space-y-4"
                            >
                                <div className="space-y-3">
                                    <Label className="text-stone-900 dark:text-stone-100 flex items-center gap-2 text-sm font-semibold">
                                        <BedDouble className="w-4 h-4 text-stone-400" /> Elige tu Habitación
                                    </Label>
                                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                                        {availableRooms.map((room) => {
                                            const isSelected = roomType === room.id;

                                            // ELITE LOGIC: Check Real-Time Availability
                                            // Must have date selected to be here (Step 2 requires Date from Step 1)
                                            let isRoomAvailable = true;
                                            if (date?.from && date?.to) {
                                                const fromStr = date.from.toISOString();
                                                const toStr = date.to.toISOString();
                                                // Check generally for the room type. 
                                                // If it's a private room, we need ANY unit free.
                                                // If it's a dorm, we need ANY bed free.
                                                // The existing checkAvailability function does this logic.
                                                isRoomAvailable = checkAvailability(
                                                    location as 'pueblo' | 'hideout',
                                                    room.id,
                                                    fromStr,
                                                    toStr
                                                );
                                            }

                                            return (
                                                <div
                                                    key={room.id}
                                                    onClick={() => {
                                                        if (!isRoomAvailable) return;
                                                        setRoomType(room.id)
                                                        setGuests("1")
                                                        setSelectedUnitIds([]) // Reset beds
                                                    }}
                                                    className={cn(
                                                        "relative overflow-hidden rounded-xl border transition-all duration-300 group",
                                                        !isRoomAvailable
                                                            ? "opacity-60 grayscale cursor-not-allowed border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/50"
                                                            : "cursor-pointer",
                                                        isRoomAvailable && isSelected
                                                            ? cn("ring-2 shadow-lg scale-[1.02]", location === 'pueblo' ? "border-amber-500 ring-amber-500/20" : "border-lime-500 ring-lime-500/20")
                                                            : isRoomAvailable
                                                                ? "border-stone-200 dark:border-stone-800 hover:border-stone-300 hover:shadow-md"
                                                                : ""
                                                    )}
                                                >
                                                    <div className="h-28 w-full relative">
                                                        <div className={cn("absolute inset-0 transition-colors z-10", !isRoomAvailable ? "bg-stone-900/40" : "bg-stone-900/20 group-hover:bg-stone-900/10")} />
                                                        <div className={cn("absolute inset-0 bg-gradient-to-t from-stone-900/90 to-transparent z-20", isSelected ? "opacity-90" : "opacity-80")} />
                                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                        <img src={(room as any).image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=300"} alt={room.label} className="w-full h-full object-cover" />

                                                        {isSelected && isRoomAvailable && (
                                                            <div className={cn("absolute top-2 right-2 z-30 text-white rounded-full p-0.5 shadow-sm", location === 'pueblo' ? "bg-amber-500" : "bg-lime-600")}>
                                                                <CheckCircle className="w-3 h-3" />
                                                            </div>
                                                        )}

                                                        {!isRoomAvailable && (
                                                            <div className="absolute top-2 right-2 z-30 bg-stone-900/80 text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-white/10 backdrop-blur-sm">
                                                                Agotado
                                                            </div>
                                                        )}

                                                        <div className="absolute bottom-2 left-3 right-3 z-30">
                                                            <h4 className={cn("font-bold text-sm leading-tight", isSelected && isRoomAvailable ? (location === 'pueblo' ? "text-amber-400" : "text-lime-400") : "text-white")}>
                                                                {room.label}
                                                            </h4>
                                                            <p className="text-[10px] text-stone-300 line-clamp-1">{room.description || "Confort & Estilo"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-2 bg-white dark:bg-stone-900 flex justify-between items-center">
                                                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100">${room.basePrice}</span>
                                                        <div className="text-[10px] text-stone-500 flex items-center gap-1">
                                                            <Users className="w-3 h-3" /> max {room.maxGuests}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="h-24 shrink-0" />
                            </motion.div>
                        )}

                        {step === 3 && isDorm && selectedRoomConfig && (
                            <motion.div
                                key="step3"
                                custom={step}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="p-6 space-y-4"
                            >
                                <Card className={cn("p-4 border", location === 'pueblo' ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20" : "border-lime-200 bg-lime-50/50 dark:bg-lime-950/20")}>
                                    <BedSelector
                                        room={selectedRoomConfig}
                                        dateRange={{ from: date?.from, to: date?.to }}
                                        selectedUnits={selectedUnitIds}
                                        onToggleUnit={(unitId) => {
                                            setSelectedUnitIds(prev => {
                                                const newSelection = prev.includes(unitId)
                                                    ? prev.filter(id => id !== unitId)
                                                    : [...prev, unitId]

                                                // Sync guests count
                                                if (isDorm && newSelection.length > 0) {
                                                    setGuests(newSelection.length.toString())
                                                }
                                                return newSelection
                                            })
                                        }}
                                        maxSelections={selectedRoomConfig.capacity}
                                        activeColorClass={theme.button}
                                    />
                                    <div className="mt-4 text-xs text-center text-stone-500">
                                        Has seleccionado {selectedUnitIds.length} cama{selectedUnitIds.length !== 1 ? 's' : ''}
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                custom={step}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="p-6 space-y-4"
                            >
                                {/* Summary of Selection */}
                                <div className="bg-stone-100 dark:bg-stone-800/50 p-4 rounded-xl flex flex-col gap-3 text-xs">
                                    <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-700 pb-3">
                                        <div>
                                            <p className="font-bold text-sm text-stone-800 dark:text-stone-200">{selectedRoomConfig?.label}</p>
                                            <p className="text-stone-500 font-medium">
                                                {date?.from?.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} - {date?.to?.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="bg-white dark:bg-stone-900 text-stone-500 border-stone-200 dark:border-stone-700">
                                                {differenceInCalendarDays(date?.to || new Date(), date?.from || new Date())} Noches
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-1 pt-1">
                                        <div className="flex justify-between text-stone-500">
                                            <span>Precio por noche</span>
                                            <span>${currentPrice}</span>
                                        </div>
                                        {isDorm && (
                                            <div className="flex justify-between text-stone-500">
                                                <span>Huéspedes ({guests})</span>
                                                <span>x{guests}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-stone-200/50 dark:border-stone-700/50">
                                            <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">Total Estimado</span>
                                            <span className={cn("font-heading font-bold text-xl", theme.accentText)}>
                                                ${(currentPrice * differenceInCalendarDays(date?.to || new Date(), date?.from || new Date()) * (isDorm ? (parseInt(guests) || 1) : 1)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-1">
                                        <Users className="w-3 h-3 text-stone-400" /> Tus Datos
                                    </h3>

                                    <div className="grid gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="guestName" className="text-[10px] font-medium text-stone-500 dark:text-stone-400 uppercase">Nombre Completo</Label>
                                            <Input
                                                id="guestName"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                placeholder="Ej. Juan Pérez"
                                                className="bg-stone-50/50 dark:bg-stone-800/50 h-9 text-sm focus-visible:ring-1 focus-visible:ring-stone-400"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label htmlFor="email" className="text-[10px] font-medium text-stone-500 dark:text-stone-400 uppercase">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="juan@mail.com"
                                                    className="bg-stone-50/50 dark:bg-stone-800/50 h-9 text-sm focus-visible:ring-1 focus-visible:ring-stone-400"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="phone" className="text-[10px] font-medium text-stone-500 dark:text-stone-400 uppercase">Teléfono</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+502..."
                                                    className="bg-stone-50/50 dark:bg-stone-800/50 h-9 text-sm focus-visible:ring-1 focus-visible:ring-stone-400"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {!isDorm && (
                                        <div className="space-y-1">
                                            <Label htmlFor="guests" className="text-[10px] font-medium text-stone-500 dark:text-stone-400 uppercase">Huéspedes</Label>
                                            <Select value={guests} onValueChange={setGuests}>
                                                <SelectTrigger id="guests" className="h-9 text-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                                                        <SelectItem key={num} value={num.toString()}>{num} Persona{num > 1 ? 's' : ''}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* NEW: Payment Preference - Elite Cards */}
                                    <div className="pt-4 border-t border-stone-200/50 dark:border-stone-800/50">
                                        <Label className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" /> Método de Garantía
                                        </Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Pay at Hotel Option */}
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setPaymentPreference('card')}
                                                className={cn(
                                                    "cursor-pointer relative overflow-hidden rounded-xl border p-4 flex flex-col items-center justify-center gap-3 transition-colors duration-300",
                                                    paymentPreference === 'card'
                                                        ? cn("bg-white dark:bg-stone-800 ring-2 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-900 shadow-md", theme.icon.split(" ")[5])
                                                        : "bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-md"
                                                )}
                                            >
                                                {paymentPreference === 'card' && (
                                                    <div className={cn("absolute top-2 right-2 w-2 h-2 rounded-full", theme.gradient)} />
                                                )}
                                                <div className={cn(
                                                    "p-3 rounded-full transition-colors",
                                                    paymentPreference === 'card' ? theme.icon : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                                                )}>
                                                    <CreditCard className="w-6 h-6" />
                                                </div>
                                                <div className="text-center">
                                                    <span className={cn("block text-sm font-bold mb-1", paymentPreference === 'card' ? "text-stone-900 dark:text-stone-100" : "text-stone-500")}>
                                                        Pagar en Hotel
                                                    </span>
                                                    <span className="text-[10px] text-stone-400 dark:text-stone-500 leading-tight block">
                                                        Efectivo o Tarjeta al llegar
                                                    </span>
                                                </div>
                                            </motion.div>

                                            {/* Transfer Option */}
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setPaymentPreference('transfer')}
                                                className={cn(
                                                    "cursor-pointer relative overflow-hidden rounded-xl border p-4 flex flex-col items-center justify-center gap-3 transition-colors duration-300",
                                                    paymentPreference === 'transfer'
                                                        ? cn("bg-white dark:bg-stone-800 ring-2 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-900 shadow-md", theme.icon.split(" ")[5])
                                                        : "bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-md"
                                                )}
                                            >
                                                {paymentPreference === 'transfer' && (
                                                    <div className={cn("absolute top-2 right-2 w-2 h-2 rounded-full", theme.gradient)} />
                                                )}
                                                <div className={cn(
                                                    "p-3 rounded-full transition-colors",
                                                    paymentPreference === 'transfer' ? theme.icon : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                                                )}>
                                                    <Banknote className="w-6 h-6" />
                                                </div>
                                                <div className="text-center">
                                                    <span className={cn("block text-sm font-bold mb-1", paymentPreference === 'transfer' ? "text-stone-900 dark:text-stone-100" : "text-stone-500")}>
                                                        Transferencia
                                                    </span>
                                                    <span className="text-[10px] text-stone-400 dark:text-stone-500 leading-tight block">
                                                        Adelanta tu pago ahora
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-24 shrink-0" />
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                custom={step}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="p-6 flex flex-col items-center justify-center text-center space-y-6 min-h-full"
                            >
                                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center shadow-xl mb-4 relative", theme.icon)}>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    >
                                        <Check className="w-10 h-10 stroke-[3px]" />
                                    </motion.div>
                                    <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", theme.icon)} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-heading">¡Solicitud Recibida!</h3>
                                    <p className="text-stone-500 dark:text-stone-400 max-w-[280px] mx-auto text-sm leading-relaxed">
                                        {paymentPreference === 'transfer' ? (
                                            <>
                                                Para confirmar, por favor realiza tu transferencia. Te enviaremos los datos bancarios a <span className="font-semibold text-stone-900 dark:text-stone-200">{email}</span>.
                                            </>
                                        ) : (
                                            <>
                                                Tu solicitud está registrada. El pago se realizará al llegar al hotel. Confirmación enviada a <span className="font-semibold text-stone-900 dark:text-stone-200">{email}</span>.
                                            </>
                                        )}
                                    </p>
                                </div>

                                {paymentPreference === 'transfer' ? (
                                    <div className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-lg p-3 text-xs text-center text-amber-800 dark:text-amber-400">
                                        <p className="font-bold mb-1">Cuenta {APP_CONFIG.payment.bankName}</p>
                                        <p className="font-mono">{APP_CONFIG.payment.accountNumber}</p>
                                        <p className="opacity-70 text-[10px] mt-1">Envía comprobante a WhatsApp</p>
                                    </div>
                                ) : (
                                    <div className="w-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-lg p-3 text-xs text-center text-emerald-800 dark:text-emerald-400">
                                        <p className="font-bold mb-1">Pago en Recepción</p>
                                        <p className="opacity-70 text-[10px]">Presenta tu ID #{bookingId} al llegar.</p>
                                    </div>
                                )}

                                {/* ELITE: WhatsApp Action Button */}
                                <Button
                                    onClick={() => {
                                        const message = `Hola Mandalas! 🌿 Acabo de reservar en la web.\n\n🆔 ID: ${bookingId}\n👤 Nombre: ${guestName}\n📅 Fechas: ${date?.from?.toLocaleDateString()} - ${date?.to?.toLocaleDateString()}\n🏨 Lugar: ${location === 'pueblo' ? 'Pueblo' : 'Hideout'}\n\nQuedo atento a la confirmación!`;
                                        window.open(`https://wa.me/50212345678?text=${encodeURIComponent(message)}`, '_blank');
                                    }}
                                    className="w-full rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold shadow-lg shadow-emerald-900/20 py-6 text-base transition-transform hover:scale-105"
                                >
                                    Enviar Comprobante por WhatsApp
                                </Button>

                                <Card className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(bookingId)
                                        toast.success("ID copiado al portapapeles")
                                    }}
                                >
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">ID de Solicitud</p>
                                        <p className="font-mono text-lg font-bold text-stone-900 dark:text-stone-100 tracking-wider">#{bookingId}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300">
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex justify-between sm:justify-between items-center z-50 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    {step > 1 && step < 5 ? (
                        <Button variant="ghost" onClick={handleBack} className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-transparent px-0">
                            Atrás
                        </Button>
                    ) : <div />}

                    {step < 5 ? (
                        <MButton
                            onClick={handleNext}
                            className={cn("w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 px-8 rounded-full font-semibold", theme.button)}
                            disabled={(step === 1 && !date) || isSubmitting}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Procesando...
                                </span>
                            ) : (
                                step === 1 ? "Buscar" : step === 4 ? "Confirmar Reserva" : "Continuar"
                            )}
                        </MButton>
                    ) : (
                        <DialogTrigger asChild>
                            <Button className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-white font-semibold rounded-full shadow-lg">
                                Entendido, gracias
                            </Button>
                        </DialogTrigger>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

// Convert Button to Motion Button for animation
const MButton = motion(Button)

