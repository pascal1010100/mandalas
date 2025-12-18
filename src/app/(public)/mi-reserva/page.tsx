"use client"

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { Search, Calendar, User, CheckCircle, Clock, MapPin, BedDouble, Phone, Navigation, ArrowRight, Share2, Copy } from 'lucide-react'
import { format, parseISO, differenceInDays, isPast, isFuture, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Skeleton } from "@/components/ui/skeleton"

// Minimal Booking Interface for this view
interface BookingDetails {
    id: string
    guest_name: string
    check_in: string
    check_out: string
    status: string
    room_type: string
    guests: string
    total_price: number
    location: string
    unit_id?: string
}

export default function MyReservationPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState<BookingDetails[]>([])
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error("Por favor ingresa tu Email")
            return
        }

        setIsLoading(true)
        setBookings([])
        setHasSearched(true)

        try {
            // Fetch ALL bookings for this email
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .ilike('email', email.trim())
                .order('check_in', { ascending: false }) // Newest first

            if (error) throw error

            if (data && data.length > 0) {
                setBookings(data)
                toast.success(`${data.length} reserva(s) encontrada(s)`)
            } else {
                toast.warning("No se encontraron reservas con este email")
            }
        } catch (error) {
            console.error("Search error:", JSON.stringify(error, null, 2))
            toast.error("Error al buscar reservas.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleShare = async (booking: BookingDetails) => {
        const shareData = {
            title: `Reserva en Nómada Fantasma`,
            text: `¡Nos vemos en Nómada Fantasma! Tengo una reserva confirmada en ${booking.room_type.replace(/_/g, ' ')}.`,
            url: window.location.href // Or a specific link if available
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
                toast.success("¡Compartido con éxito!")
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(`¡Tengo una reserva en Nómada Fantasma! ${booking.check_in} - ${booking.room_type} `)
            toast.success("Info copiada al portapapeles")
        }
    }

    const LoadingSkeletons = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="border-stone-800/60 bg-stone-900/40">
                    <div className="h-32 w-full p-0">
                        <Skeleton className="h-full w-full rounded-t-lg rounded-b-none bg-stone-800/50" />
                    </div>
                    <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-3/4 bg-stone-800/50" />
                            <Skeleton className="h-4 w-1/2 bg-stone-800/50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full bg-stone-800/50" />
                            <Skeleton className="h-10 w-full bg-stone-800/50" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    // Categorize bookings
    const upcoming = bookings.filter(b => isFuture(parseISO(b.check_in)) && !isToday(parseISO(b.check_in)) && b.status !== 'cancelled')
    const active = bookings.filter(b => (isToday(parseISO(b.check_in)) || isPast(parseISO(b.check_in))) && isFuture(parseISO(b.check_out)) && b.status !== 'cancelled')
    const past = bookings.filter(b => (isPast(parseISO(b.check_out)) || isToday(parseISO(b.check_out))) || b.status === 'cancelled')

    const getRoomImage = (type: string, location: string) => {
        const t = type.toLowerCase()
        const l = location.toLowerCase()

        // Hideout Specifics
        if (l === 'hideout' || t.includes('hideout')) {
            if (t.includes('female') || t.includes('chicas')) return "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?q=80&w=800&auto=format&fit=crop" // Interior Bunks
            if (t.includes('mixed') || t.includes('mixto')) return "https://images.unsplash.com/photo-1555854743-e3c2f6a5fc6c?q=80&w=800&auto=format&fit=crop" // Definitive Bunks
            if (t.includes('private') || t.includes('privada')) return "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?q=80&w=800&auto=format&fit=crop" // Cozy Cabin Interior
            if (t.includes('suite')) return "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop"

            // Fallback
            return "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?q=80&w=800&auto=format&fit=crop"
        }

        // Pueblo Specifics (default)
        if (t.includes('dorm')) return "https://images.unsplash.com/photo-1555854743-e3c2f6a5fc6c?q=80&w=800&auto=format&fit=crop"
        if (t.includes('private')) return "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop"
        if (t.includes('suite')) return "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800"

        // Ultimate Fallback
        return "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop"
    }

    const BookingCard = ({ booking }: { booking: BookingDetails }) => {
        const daysUntil = differenceInDays(parseISO(booking.check_in), new Date())

        return (
            <Card className="group overflow-hidden border-stone-800/60 bg-stone-900/40 backdrop-blur-md transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-900/10">
                <div className="relative h-32 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent z-10" />
                    <img
                        src={getRoomImage(booking.room_type, booking.location)}
                        alt="Room"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 z-20">
                        <Badge className={cn(
                            "uppercase text-[10px] font-bold tracking-wider",
                            booking.status === 'confirmed' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                                booking.status === 'pending' ? "bg-amber-500/20 text-amber-400 border-amber-500/20" :
                                    "bg-rose-500/20 text-rose-400 border-rose-500/20"
                        )}>
                            {booking.status === 'confirmed' ? 'Confirmada' :
                                booking.status === 'pending' ? 'Pendiente' : booking.status}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-heading tracking-wide text-stone-100 group-hover:text-amber-400 transition-colors">
                                {booking.room_type.replace(/_/g, ' ').toUpperCase()}
                            </h3>
                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {booking.location}
                            </p>
                        </div>
                        {daysUntil > 0 && booking.status !== 'cancelled' && (
                            <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5 font-mono text-xs">
                                -{daysUntil}D
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-stone-800/50 border-b">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase text-stone-500 font-bold">Llegada</span>
                            <div className="flex items-center gap-2 text-sm text-stone-200">
                                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                <span>{format(parseISO(booking.check_in), 'd MMM', { locale: es })}</span>
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-[10px] uppercase text-stone-500 font-bold">Salida</span>
                            <div className="flex items-center justify-end gap-2 text-sm text-stone-200">
                                <span>{format(parseISO(booking.check_out), 'd MMM', { locale: es })}</span>
                                <Calendar className="w-3.5 h-3.5 text-stone-600" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-400">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-stone-800 text-stone-400">
                                <BedDouble className="w-3.5 h-3.5" />
                            </div>
                            <span>{booking.unit_id ? `Unit ${booking.unit_id} ` : 'Asignación auto'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-stone-800 text-stone-400">
                                <User className="w-3.5 h-3.5" />
                            </div>
                            <span>{booking.guests} Pax</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-2 bg-stone-950/30 border-t border-stone-800/50 flex gap-1">
                    <Button variant="ghost" className="flex-1 h-9 text-xs text-stone-400 hover:text-stone-100 hover:bg-stone-800">
                        <Navigation className="w-3.5 h-3.5 mr-2" />
                        Mapa
                    </Button>
                    <div className="w-px h-6 bg-stone-800 my-auto" />
                    <Button
                        variant="ghost"
                        onClick={() => handleShare(booking)}
                        className="flex-1 h-9 text-xs text-stone-400 hover:text-amber-500 hover:bg-stone-800"
                    >
                        <Share2 className="w-3.5 h-3.5 mr-2" />
                        Compartir
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-amber-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-5 blur-sm " />
            <div className="fixed inset-0 bg-gradient-to-b from-stone-950 via-stone-950/90 to-stone-900/90 " />

            {/* Animated Particles/Fog could go here */}

            <div className="relative z-10 w-full max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-stone-800 pb-6">
                    <div className="text-center md:text-left space-y-1">
                        <h1 className="text-4xl md:text-5xl font-extralight tracking-widest font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">
                            MIS ESTADÍAS
                        </h1>
                        <p className="text-stone-500 text-sm tracking-wide">
                            Gestiona tus aventuras en Nómada Fantasma
                        </p>
                    </div>

                    {hasSearched && !isLoading && bookings.length > 0 && (
                        <Button
                            onClick={() => { setHasSearched(false); setBookings([]); setEmail('') }}
                            variant="outline"
                            size="sm"
                            className="border-stone-700 hover:border-amber-500 hover:bg-amber-950/30 text-stone-400 hover:text-amber-400 transition-all"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Buscar otra
                        </Button>
                    )}
                </div>

                {/* Search State */}
                {!hasSearched && (
                    <div className="max-w-md mx-auto mt-12 animate-in zoom-in-95 duration-700 delay-300">
                        <Card className="bg-stone-900/60 border-stone-800 backdrop-blur-xl shadow-2xl overflow-visible ring-1 ring-white/5">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-stone-950 p-4 rounded-full border border-stone-800 ring-4 ring-stone-950 shadow-xl">
                                <User className="w-8 h-8 text-amber-500" />
                            </div>
                            <CardContent className="pt-12 pb-8 px-8 space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-semibold text-stone-200">Bienvenido de nuevo</h2>
                                    <p className="text-sm text-stone-500">Ingresa tu correo para acceder a tu bitácora de viaje.</p>
                                </div>
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-stone-300 text-xs uppercase font-bold tracking-wider">Email</Label>
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-700 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="tu@email.com"
                                                className="relative bg-stone-900 border-stone-700 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-500 h-11"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-11 bg-amber-600 hover:bg-amber-500 text-white font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-amber-900/20"
                                    >
                                        {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : "Ver Mis Reservas"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Skeletons while loading */}
                {isLoading && <LoadingSkeletons />}

                {/* Empty State */}
                {!isLoading && hasSearched && bookings.length === 0 && (
                    <div className="text-center py-20 animate-in fade-in zoom-in-95">
                        <div className="inline-flex p-4 rounded-full bg-stone-900/50 mb-4 border border-stone-800">
                            <Search className="w-8 h-8 text-stone-600" />
                        </div>
                        <h3 className="text-xl text-stone-300 mb-2">No encontramos reservas</h3>
                        <p className="text-stone-500 max-w-sm mx-auto mb-6">
                            No hay registros asociados a <span className="text-amber-500">{email}</span>. Verifica que sea el correo con el que reservaste.
                        </p>
                        <Button
                            onClick={() => { setHasSearched(false); setEmail('') }}
                            variant="outline"
                            className="border-stone-700"
                        >
                            Intentar con otro correo
                        </Button>
                    </div>
                )}

                {!isLoading && hasSearched && bookings.length > 0 && (
                    <Tabs defaultValue={active.length > 0 ? "ongoing" : "upcoming"} className="space-y-8 animate-in fade-in slide-in-from-bottom-10">
                        {/* Scrollable Tabs List for Mobile */}
                        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                            <TabsList className="bg-stone-900/80 border border-stone-800 p-1 h-auto rounded-full mx-auto flex w-fit min-w-max">
                                <TabsTrigger value="upcoming" className="rounded-full px-6 py-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                                    Próximas ({upcoming.length})
                                </TabsTrigger>
                                <TabsTrigger value="ongoing" className="rounded-full px-6 py-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                                    En Curso ({active.length})
                                </TabsTrigger>
                                <TabsTrigger value="past" className="rounded-full px-6 py-2 data-[state=active]:bg-stone-800 data-[state=active]:text-stone-300">
                                    Pasadas ({past.length})
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Content sections remain same but filtered */}
                        <TabsContent value="upcoming" className="space-y-6">
                            {upcoming.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-stone-800 rounded-lg bg-stone-900/20">
                                    <Calendar className="w-12 h-12 text-stone-700 mb-4" />
                                    <p className="text-stone-500">No tienes viajes próximos agendados.</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="ongoing" className="space-y-6">
                            {active.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {active.map(b => <BookingCard key={b.id} booking={b} />)}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-stone-800 rounded-lg bg-stone-900/20">
                                    <BedDouble className="w-12 h-12 text-stone-700 mb-4" />
                                    <p className="text-stone-500">No estás hospedado actualmente.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="past" className="space-y-6">
                            {past.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
                                    {past.map(b => <BookingCard key={b.id} booking={b} />)}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-stone-800 rounded-lg bg-stone-900/20">
                                    <Clock className="w-12 h-12 text-stone-700 mb-4" />
                                    <p className="text-stone-500">Tu historial de viajes está vacío.</p>
                                </div>
                            )}
                        </TabsContent>

                    </Tabs>
                )}
            </div>
        </div>
    )
}

