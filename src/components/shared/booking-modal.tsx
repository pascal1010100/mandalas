"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check, Users, BedDouble } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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

export function BookingModal({ children, className }: { children: React.ReactNode, className?: string }) {
    const [date, setDate] = React.useState<DateRange | undefined>()
    const [step, setStep] = React.useState(1)
    const [location, setLocation] = React.useState("pueblo")

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={className}>{children}</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-stone-50 p-0 overflow-hidden gap-0">
                <div className="bg-stone-900 p-6 text-white text-center">
                    <DialogTitle className="text-2xl font-bold font-heading tracking-wide">
                        Reserva tu Aventura
                    </DialogTitle>
                    <DialogDescription className="text-stone-400">
                        Elige tus fechas y vive la experiencia Mandalas.
                    </DialogDescription>
                </div>

                <div className="p-6">
                    <Tabs defaultValue="pueblo" onValueChange={setLocation} className="w-full mb-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pueblo">Mandalas Pueblo</TabsTrigger>
                            <TabsTrigger value="hideout">Mandalas Hideout</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {step === 1 && (
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Huéspedes</Label>
                                    <Select defaultValue="1">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 Persona</SelectItem>
                                            <SelectItem value="2">2 Personas</SelectItem>
                                            <SelectItem value="3">3 Personas</SelectItem>
                                            <SelectItem value="4">4+ Personas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipo de Habitación</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dorm">Dormitorio Compartido</SelectItem>
                                            <SelectItem value="private">Habitación Privada</SelectItem>
                                            <SelectItem value="suite">Suite con Vista</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-stone-100 p-4 rounded-lg space-y-3">
                                <h4 className="font-semibold text-stone-800 flex items-center gap-2">
                                    <BedDouble className="w-4 h-4" /> Resumen (Estimado)
                                </h4>
                                <div className="flex justify-between text-sm">
                                    <span>{location === "pueblo" ? "Mandalas Pueblo" : "Mandalas Hideout"}</span>
                                    <span className="font-bold">$25.00 / noche</span>
                                </div>
                                <div className="flex justify-between text-sm text-stone-500">
                                    <span>Impuestos y servicios</span>
                                    <span>$3.00</span>
                                </div>
                                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-lg text-stone-900">
                                    <span>Total</span>
                                    <span>$28.00</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
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

                <DialogFooter className="p-6 bg-stone-50 border-t flex justify-between sm:justify-between items-center">
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
