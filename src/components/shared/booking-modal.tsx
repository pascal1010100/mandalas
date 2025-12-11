"use client"

import * as React from "react"
import { Check, Users, BedDouble, Calendar as CalendarIcon, Loader2, PartyPopper, Copy } from "lucide-react"
import { DateRange } from "react-day-picker"
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

// ... imports remain the same ...

interface BookingModalProps {
    children: React.ReactNode
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
    roomName,
    pricePerNight = 25
}: BookingModalProps) {
    const [date, setDate] = React.useState<DateRange | undefined>()
    const [step, setStep] = React.useState(1)
    const [location, setLocation] = React.useState(defaultLocation)

    // Form State
    const [guests, setGuests] = React.useState("1")
    const [roomType, setRoomType] = React.useState(defaultRoomType)

    // Contact Form State (NEW)
    const [guestName, setGuestName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")

    // Receipt State
    const [bookingId, setBookingId] = React.useState("")

    // Scroll Container
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)

    // Reset scroll when step changes
    React.useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0
        }
    }, [step])

    // Store Action
    const { bookings, addBooking, prices, checkAvailability } = useAppStore()

    // Determine Price dynamically
    const priceKey = `${location}_${roomType}`
    const currentPrice = prices?.[priceKey] || pricePerNight // Fallback to prop if not found


    // Dynamic styling based on location - Elite "Quiet Luxury" Refinement
    const theme = location === "pueblo" ? {
        gradient: "bg-gradient-to-r from-amber-500 to-orange-600",
        lightGradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-l-4 border-l-[#D97706]",
        border: "border-orange-100 dark:border-orange-900/50",
        text: "text-[#B45309] dark:text-[#F59E0B]",
        button: "bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 shadow-[0_0_20px_-5px_rgba(217,119,6,0.4)] transition-all duration-300",
        icon: "bg-amber-100/50 text-[#D97706] dark:bg-amber-900/20 dark:text-[#fbbf24] ring-1 ring-amber-200 dark:ring-amber-800"
    } : {
        gradient: "bg-gradient-to-r from-lime-500 to-lime-700",
        lightGradient: "from-lime-50 to-green-50 dark:from-lime-950/20 dark:to-green-950/20 border-l-4 border-l-[#65a30d]",
        border: "border-lime-100 dark:border-lime-900/50",
        text: "text-[#3f6212] dark:text-[#a3e635]",
        button: "bg-gradient-to-r from-lime-500 to-lime-700 hover:brightness-110 shadow-[0_0_20px_-5px_rgba(101,163,13,0.4)] transition-all duration-300",
        icon: "bg-lime-100/50 text-[#65a30d] dark:bg-lime-900/20 dark:text-[#a3e635] ring-1 ring-lime-200 dark:ring-lime-800"
    }

    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleNext = async () => {
        if (step === 2) {
            // Validation
            if (!guestName.trim() || !email.trim()) {
                toast.error("Faltan datos", {
                    description: "Por favor completa tu nombre y email para continuar."
                })
                return
            }

            if (date?.from && date?.to) {
                // Final Availability Check
                const curr = new Date(date.from);
                const end = new Date(date.to);
                let isBlocked = false;

                while (curr < end) {
                    if (!checkAvailability(location, roomType, curr.toISOString(), new Date(curr.getTime() + 86400000).toISOString())) {
                        isBlocked = true;
                        break;
                    }
                    curr.setDate(curr.getDate() + 1);
                }

                if (isBlocked) {
                    toast.error("Fechas no disponibles", {
                        description: "Alguien acaba de reservar estas fechas. Por favor selecciona otras."
                    })
                    setStep(1); // Go back to calendar
                    setIsSubmitting(false);
                    return;
                }

                setIsSubmitting(true)
                // Simulate network delay for "Elite" feel
                await new Promise(resolve => setTimeout(resolve, 2000))

                const nights = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
                const totalPrice = currentPrice * nights * 1.1 // Include 10% tax
                const newId = Math.random().toString(36).substring(7).toUpperCase();
                setBookingId(newId);

                // Save to store
                addBooking({
                    guestName: guestName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    location: location as 'pueblo' | 'hideout',
                    roomType,
                    guests,
                    checkIn: date.from.toISOString(),
                    checkOut: date.to.toISOString(),
                    totalPrice: Math.round(totalPrice * 100) / 100
                })

                setIsSubmitting(false)
                setStep(3) // Go to success view
                toast.success("¡Reserva Confirmada!", {
                    description: "Hemos enviado los detalles a tu correo."
                })
                return; // Early return to avoid step increment
            }
        }
        setStep(step + 1)
    }

    const handleBack = () => setStep(step - 1)

    // Reset modal when closed/opened
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Optional: Reset state after delay?
            // For now, keep state so they don't lose progress if accidental close
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

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className={className} suppressHydrationWarning>{children}</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-stone-50 dark:bg-stone-900 dark:border-stone-800 p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col shadow-2xl">
                <DialogHeader className="p-6 pb-2 border-b border-stone-200 dark:border-stone-800 flex-shrink-0 z-10 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md">
                    <DialogTitle className="text-xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        {step === 3 ? (
                            <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <PartyPopper className="w-5 h-5" /> Reserva Exitosa
                            </span>
                        ) : (
                            <>
                                Reservar en <span className={cn("capitalize underline decoration-2 underline-offset-4", theme.text, "decoration-[color:var(--current-color)]")}>{location}</span>
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-widest mt-1">
                        Paso {step} de 3
                    </DialogDescription>
                </DialogHeader>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden relative"> {/* Parent scroll container */}
                    <AnimatePresence mode="wait" initial={false} custom={step}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={step}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="p-6 space-y-6" // Removed h-full overflow-y-auto
                            >
                                <Tabs
                                    defaultValue={defaultLocation}
                                    onValueChange={(value) => setLocation(value as 'pueblo' | 'hideout')}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2 bg-stone-200/50 dark:bg-stone-800/50 p-1 rounded-xl">
                                        <TabsTrigger value="pueblo" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700 dark:data-[state=active]:text-stone-100 shadow-sm transition-all duration-300">Mandalas Pueblo</TabsTrigger>
                                        <TabsTrigger value="hideout" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700 dark:data-[state=active]:text-stone-100 shadow-sm transition-all duration-300">Mandalas Hideout</TabsTrigger>
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
                                            disabled={(day) => {
                                                if (day < new Date()) return true;
                                                const isAvailable = checkAvailability(
                                                    location,
                                                    roomType,
                                                    day.toISOString(),
                                                    new Date(day.getTime() + 86400000).toISOString()
                                                );
                                                return !isAvailable;
                                            }}
                                            className={cn("p-0 pointer-events-auto")}
                                            classNames={{
                                                day_selected: cn("bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-md", theme.button),
                                                day_range_middle: "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 rounded-none",
                                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors",
                                                day_today: "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold",
                                                caption_label: "text-stone-900 dark:text-stone-100 font-bold text-sm",
                                                head_cell: "text-stone-400 dark:text-stone-500 text-[0.8rem] font-medium w-9",
                                                nav_button: "border border-stone-100 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg p-1 opacity-50 hover:opacity-100 transition-opacity"
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
                                className="p-6 pb-24 space-y-4" // Removed h-full overflow-y-auto. Keeping padding.
                            >
                                {/* Room Selection Display - Compacted */}
                                <div className={cn("p-3 rounded-xl border relative overflow-hidden group", theme.lightGradient, theme.border)}>
                                    <div className="absolute top-0 right-0 p-3 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                        <BedDouble className={cn("w-12 h-12", theme.text)} />
                                    </div>
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-0.5", theme.text)}>Habitación</p>
                                            <Select value={roomType} onValueChange={setRoomType}>
                                                <SelectTrigger className="h-8 p-0 border-none bg-transparent hover:bg-transparent shadow-none focus:ring-0 text-base font-bold text-stone-900 dark:text-stone-100 gap-2">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="dark:bg-stone-900 dark:border-stone-800">
                                                    <SelectItem value="dorm">Dormitorio Compartido</SelectItem>
                                                    <SelectItem value="private">Habitación Privada</SelectItem>
                                                    <SelectItem value="suite">Suite con Vista</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">${currentPrice} <span className="text-[10px] font-normal opacity-70">/ noche</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information - Compacted */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-1">
                                        <Users className="w-3 h-3 text-stone-400" /> Tus Datos
                                    </h3>

                                    <div className="grid gap-3">
                                        <div className="space-y-1 focus-within:text-stone-900 dark:focus-within:text-stone-100 transition-colors">
                                            <Label htmlFor="guestName" className="text-[10px] font-medium text-stone-500 dark:text-stone-400 uppercase">Nombre Completo</Label>
                                            <Input
                                                id="guestName"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                placeholder="Ej. Juan Pérez"
                                                className="bg-stone-50/50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 h-9 text-sm transition-all focus:bg-white dark:focus:bg-stone-800 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1 focus-within:text-stone-900 dark:focus-within:text-stone-100 transition-colors">
                                                <Label htmlFor="email" className="text-[10px] font-medium text-stone-500 dark:text-stone-400 uppercase">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="juan@mail.com"
                                                    className="bg-stone-50/50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 h-9 text-sm transition-all focus:bg-white dark:focus:bg-stone-800 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="space-y-1 focus-within:text-stone-900 dark:focus-within:text-stone-100 transition-colors">
                                                <Label htmlFor="phone" className="text-[10px] font-medium text-stone-500 dark:text-stone-400 uppercase">Teléfono</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+502..."
                                                    className="bg-stone-50/50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 h-9 text-sm transition-all focus:bg-white dark:focus:bg-stone-800 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="guests" className="text-[10px] font-medium text-stone-500 dark:text-stone-400 uppercase">Huéspedes</Label>
                                        <Select value={guests} onValueChange={setGuests}>
                                            <SelectTrigger id="guests" className="bg-stone-50/50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 h-9 text-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-stone-900 dark:border-stone-800">
                                                {[1, 2, 3, 4, 5, 6].map(num => (
                                                    <SelectItem key={num} value={num.toString()}>{num} Persona{num > 1 ? 's' : ''}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                {date?.from && date?.to && (
                                    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm p-3 space-y-2">
                                        <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-800">
                                            <span className="text-xs font-medium text-stone-600 dark:text-stone-300">Estancia</span>
                                            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))} noches</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-stone-500 dark:text-stone-400">
                                                <span>Subtotal</span>
                                                <span>${currentPrice * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-stone-500 dark:text-stone-400">
                                                <span>Servicio (10%)</span>
                                                <span>${(currentPrice * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) * 0.1).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-stone-100 dark:border-stone-800 pt-2 mt-1 flex justify-between items-end">
                                            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">Total</span>
                                            <span className="text-xl font-bold font-heading text-stone-900 dark:text-stone-100">
                                                ${(currentPrice * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) * 1.1).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="h-24 shrink-0" /> {/* Explicit spacer for scroll */}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={step}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="p-6 flex flex-col items-center justify-center text-center space-y-6 min-h-full" // Removed h-full overflow-y-auto
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
                                    <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-heading">¡Reserva Confirmada!</h3>
                                    <p className="text-stone-500 dark:text-stone-400 max-w-[280px] mx-auto text-sm leading-relaxed">
                                        Hemos enviado un correo a <span className="font-semibold text-stone-900 dark:text-stone-200">{email}</span> con todos los detalles.
                                    </p>
                                </div>

                                <Card className="w-full bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(bookingId)
                                        toast.success("ID copiado al portapapeles")
                                    }}
                                >
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">ID de Reserva</p>
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

                <DialogFooter className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex justify-between sm:justify-between items-center z-10">
                    {step > 1 && step < 3 ? (
                        <Button variant="ghost" onClick={handleBack} className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-transparent px-0">
                            Atrás
                        </Button>
                    ) : <div />}

                    {step < 3 ? (
                        <Button
                            onClick={handleNext}
                            className={cn("w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 px-8 rounded-full font-semibold", theme.button)}
                            disabled={(step === 1 && !date) || isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Procesando...
                                </span>
                            ) : (
                                step === 1 ? "Continuar" : "Confirmar Reserva"
                            )}
                        </Button>
                    ) : (
                        <DialogTrigger asChild>
                            <Button className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-white font-semibold rounded-full shadow-lg">
                                Entendido, gracias
                            </Button>
                        </DialogTrigger>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
