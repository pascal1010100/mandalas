"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check, Users, BedDouble } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
    const addBooking = useAppStore(state => state.addBooking)

    const handleNext = () => {
        if (step === 2) {
            // Validation
            if (!guestName.trim() || !email.trim()) {
                alert("Por favor completa tu nombre y email")
                return
            }

            if (date?.from && date?.to) {
                const nights = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
                const totalPrice = pricePerNight * nights * 1.1 // Include 10% tax

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
            <DialogContent className="sm:max-w-[600px] bg-stone-50 p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col">
                <DialogHeader className="p-6 pb-4 border-b border-stone-200 flex-shrink-0">
                    <DialogTitle className="text-2xl font-bold font-heading text-stone-900">
                        Reserva tu Estadía
                    </DialogTitle>
                    <DialogDescription className="text-stone-600">
                        Completa los pasos para confirmar tu reserva en Mandalas
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 overflow-y-auto flex-1">
                    <Tabs
                        defaultValue={defaultLocation}
                        onValueChange={(value) => setLocation(value as 'pueblo' | 'hideout')}
                        className="w-full mb-6"
                    >
                        {/* ... Tabs ... */}
                    </Tabs>

                    {step === 1 && (
                        // ... Date Step ...
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label>Fechas de Estancia</Label>
                                <div className="flex justify-center border rounded-lg bg-white p-4">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={1}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            {/* Room Selection Display */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-purple-600 font-medium uppercase tracking-wider mb-1">Habitación Seleccionada</p>
                                        <p className="font-bold text-stone-900">
                                            {roomName || (roomType === "dorm" ? "Dormitorio Compartido" : roomType === "private" ? "Habitación Privada" : "Suite con Vista")}
                                        </p>
                                        <p className="text-sm text-stone-600">${pricePerNight} / noche</p>
                                    </div>
                                    <Select value={roomType} onValueChange={setRoomType}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dorm">Dormitorio</SelectItem>
                                            <SelectItem value="private">Privada</SelectItem>
                                            <SelectItem value="suite">Suite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Información de Contacto
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="guestName">Nombre Completo *</Label>
                                    <Input
                                        id="guestName"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        placeholder="Juan Pérez"
                                        className="bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="juan@email.com"
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+502 1234-5678"
                                            className="bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guests">Número de Huéspedes</Label>
                                    <Select value={guests} onValueChange={setGuests}>
                                        <SelectTrigger id="guests" className="bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 Persona</SelectItem>
                                            <SelectItem value="2">2 Personas</SelectItem>
                                            <SelectItem value="3">3 Personas</SelectItem>
                                            <SelectItem value="4">4+ Personas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-stone-100 p-4 rounded-lg space-y-3">
                                <h4 className="font-semibold text-stone-800 flex items-center gap-2">
                                    <BedDouble className="w-4 h-4" /> Resumen de Reserva
                                </h4>
                                <div className="flex justify-between text-sm">
                                    <span>{location === "pueblo" ? "Mandalas Pueblo" : "Mandalas Hideout"}</span>
                                    <span className="font-bold">${pricePerNight} / noche</span>
                                </div>
                                {date?.from && date?.to && (
                                    <>
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>{Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))} noches</span>
                                            <span>${pricePerNight * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>Impuestos y servicios (10%)</span>
                                            <span>${(pricePerNight * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) * 0.1).toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-lg text-stone-900">
                                            <span>Total</span>
                                            <span>${(pricePerNight * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) * 1.1).toFixed(2)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        // ... Success Step ...
                        <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-stone-800">¡Solicitud Recibida!</h3>
                            <p className="text-stone-600 max-w-xs mx-auto">
                                Hemos recibido tu solicitud. Te enviaremos un correo de confirmación en breve a tu email.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-stone-50 border-t flex justify-between sm:justify-between items-center flex-shrink-0">
                    {step > 1 && step < 3 && (
                        <Button variant="outline" onClick={handleBack}>
                            Atrás
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button onClick={handleNext} className="ml-auto w-full sm:w-auto" disabled={step === 1 && !date}>
                            {step === 1 ? "Continuar" : "Confirmar Reserva"}
                        </Button>
                    ) : (
                        <DialogTrigger asChild>
                            <Button className="w-full">Cerrar</Button>
                        </DialogTrigger>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
