"use client"

import * as React from "react"
import { Check, Users, BedDouble } from "lucide-react"
import { DateRange } from "react-day-picker"

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

    // Store Action
    const { bookings, addBooking, prices, checkAvailability } = useAppStore()

    // Determine Price dynamically
    const priceKey = `${location}_${roomType}`
    const currentPrice = prices?.[priceKey] || pricePerNight // Fallback to prop if not found


    // Dynamic styling based on location - Updated for Dark Mode support
    // Dynamic styling based on location - Elite "Quiet Luxury" Refinement
    const theme = location === "pueblo" ? {
        gradient: "bg-[image:var(--pueblo-gradient-linear)]",
        lightGradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-l-4 border-l-[#D97706]",
        border: "border-orange-100 dark:border-orange-900/50",
        text: "text-[#B45309] dark:text-[#F59E0B]",
        button: "bg-[image:var(--pueblo-gradient-linear)] hover:brightness-110 shadow-[0_0_20px_-5px_rgba(217,119,6,0.4)] transition-all duration-300",
        icon: "bg-amber-100/50 text-[#D97706] dark:bg-amber-900/20 dark:text-[#fbbf24] ring-1 ring-amber-200 dark:ring-amber-800"
    } : {
        gradient: "bg-[image:var(--hideout-gradient-linear)]",
        lightGradient: "from-lime-50 to-green-50 dark:from-lime-950/20 dark:to-green-950/20 border-l-4 border-l-[#65a30d]",
        border: "border-lime-100 dark:border-lime-900/50",
        text: "text-[#3f6212] dark:text-[#a3e635]",
        button: "bg-[image:var(--hideout-gradient-linear)] hover:brightness-110 shadow-[0_0_20px_-5px_rgba(101,163,13,0.4)] transition-all duration-300",
        icon: "bg-lime-100/50 text-[#65a30d] dark:bg-lime-900/20 dark:text-[#a3e635] ring-1 ring-lime-200 dark:ring-lime-800"
    }

    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleNext = async () => {
        if (step === 2) {
            // Validation
            if (!guestName.trim() || !email.trim()) {
                alert("Por favor completa tu nombre y email")
                return
            }

            if (date?.from && date?.to) {
                // Final Availability Check
                // Iterate through all days in range to ensure no gaps are blocked
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
                    alert("Lo sentimos, algunas fechas seleccionadas ya no están disponibles. Por favor verifica el calendario.");
                    setStep(1); // Go back to calendar
                    setIsSubmitting(false);
                    return;
                }

                setIsSubmitting(true)
                // Simulate network delay for "Elite" feel
                await new Promise(resolve => setTimeout(resolve, 1500))

                const nights = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
                const totalPrice = currentPrice * nights * 1.1 // Include 10% tax

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
            }
        }
        setStep(step + 1)
    }

    const handleBack = () => setStep(step - 1)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={className} suppressHydrationWarning>{children}</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-stone-50 dark:bg-stone-900 dark:border-stone-800 p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col">
                <DialogHeader className="p-6 pb-4 border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
                    <DialogTitle className="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        Reservar en <span className={cn("capitalize", theme.text)}>{location}</span>
                    </DialogTitle>
                    <DialogDescription className="text-stone-600 dark:text-stone-400">
                        Completa los pasos para confirmar tu reserva en Mandalas
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 overflow-y-auto flex-1">
                    <Tabs
                        defaultValue={defaultLocation}
                        onValueChange={(value) => setLocation(value as 'pueblo' | 'hideout')}
                        className="w-full mb-6"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-stone-100 dark:bg-stone-800">
                            <TabsTrigger value="pueblo" className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700 dark:data-[state=active]:text-stone-100">Mandalas Pueblo</TabsTrigger>
                            <TabsTrigger value="hideout" className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700 dark:data-[state=active]:text-stone-100">Mandalas Hideout</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {step === 1 && (
                        // ... Date Step ...
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label className="text-stone-900 dark:text-stone-100">Fechas de Estancia</Label>
                                <div className="flex justify-center border dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 p-4">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={1}
                                        disabled={(day) => {
                                            // Disable past dates
                                            if (day < new Date()) return true;

                                            // Availability Logic: Check against store bookings
                                            const isAvailable = checkAvailability(
                                                location,
                                                roomType,
                                                day.toISOString(),
                                                new Date(day.getTime() + 86400000).toISOString() // Check next day for overlap logic
                                            );
                                            // The store function returns true if AVAILABLE (not blocked).
                                            // react-day-picker 'disabled' prop expects true if DISABLED (blocked).
                                            return !isAvailable;
                                        }}
                                        className={cn("p-3 pointer-events-auto")}
                                        classNames={{
                                            day_selected: cn("bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200", theme.button),
                                            day_range_middle: "bg-stone-100 text-stone-900 dark:bg-stone-700 dark:text-stone-100",
                                            day: "text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 data-[disabled]:text-stone-300 dark:data-[disabled]:text-stone-700 data-[disabled]:hover:bg-transparent",
                                            caption_label: "text-stone-900 dark:text-stone-100 font-bold",
                                            head_cell: "text-stone-500 dark:text-stone-400",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            {/* Room Selection Display */}
                            <div className={cn("p-4 rounded-lg border", theme.lightGradient, theme.border)}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", theme.text)}>Habitación Seleccionada</p>
                                        <p className="font-bold text-stone-900 dark:text-stone-100">
                                            {roomName || (roomType === "dorm" ? "Dormitorio Compartido" : roomType === "private" ? "Habitación Privada" : "Suite con Vista")}
                                        </p>
                                        <p className="text-sm text-stone-600 dark:text-stone-400">${currentPrice} / noche</p>
                                    </div>
                                    <Select value={roomType} onValueChange={setRoomType}>
                                        <SelectTrigger className="w-[140px] bg-white/50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-stone-900 dark:border-stone-800">
                                            <SelectItem value="dorm">Dormitorio</SelectItem>
                                            <SelectItem value="private">Privada</SelectItem>
                                            <SelectItem value="suite">Suite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Información de Contacto
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="guestName" className="text-stone-900 dark:text-stone-100">Nombre Completo *</Label>
                                    <Input
                                        id="guestName"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        placeholder="Juan Pérez"
                                        className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-stone-900 dark:text-stone-100">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="juan@email.com"
                                            className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-stone-900 dark:text-stone-100">Teléfono</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+502 1234-5678"
                                            className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guests" className="text-stone-900 dark:text-stone-100">Número de Huéspedes</Label>
                                    <Select value={guests} onValueChange={setGuests}>
                                        <SelectTrigger id="guests" className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-stone-900 dark:border-stone-800">
                                            <SelectItem value="1">1 Persona</SelectItem>
                                            <SelectItem value="2">2 Personas</SelectItem>
                                            <SelectItem value="3">3 Personas</SelectItem>
                                            <SelectItem value="4">4+ Personas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-lg space-y-3">
                                <h4 className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                                    <BedDouble className="w-4 h-4" /> Resumen de Reserva
                                </h4>
                                <div className="flex justify-between text-sm text-stone-700 dark:text-stone-300">
                                    <span>{location === "pueblo" ? "Mandalas Pueblo" : "Mandalas Hideout"}</span>
                                    <span className="font-bold">${currentPrice} / noche</span>
                                </div>
                                {date?.from && date?.to && (
                                    <>
                                        <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                                            <span>{Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))} noches</span>
                                            <span>${currentPrice * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                                            <span>Impuestos y servicios (10%)</span>
                                            <span>${(currentPrice * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) * 0.1).toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-stone-200 dark:border-stone-700 pt-2 flex justify-between font-bold text-lg text-stone-900 dark:text-stone-100">
                                            <span>Total</span>
                                            <span>${(currentPrice * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) * 1.1).toFixed(2)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        // ... Success Step ...
                        <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto", theme.icon)}>
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-heading">¡Solicitud Enviada!</h3>
                            <p className="text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                                El universo conspira para tu llegada a <span className="font-bold capitalize text-stone-900 dark:text-stone-200">{location}</span>. Revisa tu correo, pronto te contactaremos para confirmar tu espacio.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex justify-between sm:justify-between items-center flex-shrink-0">
                    {step > 1 && step < 3 && (
                        <Button variant="outline" onClick={handleBack} className="hover:bg-stone-100 dark:hover:bg-stone-800 dark:border-stone-700 dark:text-stone-200">
                            Atrás
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button onClick={handleNext} className={cn("ml-auto w-full sm:w-auto text-white shadow-md transition-all", theme.button)} disabled={(step === 1 && !date) || isSubmitting}>
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Procesando...
                                </span>
                            ) : (
                                step === 1 ? "Continuar" : "Confirmar Reserva"
                            )}
                        </Button>
                    ) : (
                        <DialogTrigger asChild>
                            <Button className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-white">Cerrar</Button>
                        </DialogTrigger>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
