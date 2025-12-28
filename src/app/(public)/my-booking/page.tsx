"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, ArrowRight, ArrowLeft, ShieldCheck, Calendar, Users, BedDouble, MapPin, Copy, ExternalLink, MessageCircle, CheckCircle2, Clock, Wallet, Wifi, Info, Save, X, Utensils, Music, Sparkles, Bus, Waves, Shirt, QrCode, Smartphone, PartyPopper, Beer, ShoppingBag, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ParticlesBackground } from "@/components/ui/particles-background"
import { cn } from "@/lib/utils"
import { useAppStore, BookingRow, Charge, Product } from "@/lib/store"

import { supabase } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
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

// Elite Assets & Config
const LOCATION_ASSETS = {
    pueblo: {
        bg: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", // Warm/Cozy
        color: "amber",
        gradient: "from-amber-600 to-orange-600",
        mapUrl: "https://goo.gl/maps/examplePueblo",
        wifiSSID: "Mandalas_Pueblo",
        wifiPass: "mandala123",
        breakfastTime: "8:00 AM - 10:00 AM",
        breakfastLoc: "Cocina Principal"
    },
    hideout: {
        bg: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=2069&auto=format&fit=crop", // Jungle/Pool
        color: "lime",
        gradient: "from-lime-600 to-green-600",
        mapUrl: "https://goo.gl/maps/exampleHideout",
        wifiSSID: "Mandalas_Hideout",
        wifiPass: "hideout2025",
        breakfastTime: "8:30 AM - 10:30 AM",
        breakfastLoc: "Terraza del Lago"
    }
}

export default function MyBookingPage() {
    // Search State
    // Search State
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [booking, setBooking] = useState<BookingRow | null>(null)
    const [allBookings, setAllBookings] = useState<BookingRow[]>([])
    const [viewMode, setViewMode] = useState<'search' | 'list' | 'details'>('search')

    // Honesty Bar State
    const [showHonestyModal, setShowHonestyModal] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [confirmProduct, setConfirmProduct] = useState<Product | null>(null)
    // Account / Charges State
    const [myCharges, setMyCharges] = useState<Charge[]>([])

    // Realtime Sync for Guest
    useEffect(() => {
        // ... (existing realtime logic) ...
        const savedEmail = localStorage.getItem('guest_session_email')
        if (savedEmail && !searchQuery) {
            setSearchQuery(savedEmail)
            handleAutoLoad(savedEmail)
        }
    }, [])

    const handleAutoLoad = async (email: string) => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .ilike('email', email)
                .order('check_in', { ascending: false })

            if (data && data.length > 0) {
                setAllBookings(data)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const active = data.find((b: any) => new Date(b.check_out) >= new Date()) || data[0]
                if (active) {
                    setBooking(active)
                    setViewMode('details')
                }
            }
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    // Realtime Sync for Guest (Booking & Charges)
    useEffect(() => {
        if (!booking?.id) return

        // 1. Fetch initial charges
        const fetchCharges = async () => {
            const { data } = await supabase
                .from('charges')
                .select('*')
                .eq('booking_id', booking.id)
                .order('created_at', { ascending: false })
            if (data) setMyCharges(data)
        }
        fetchCharges()

        console.log("Subscribing to realtime updates for booking:", booking.id)

        // 2. Subscribe to Booking Updates
        const bookingChannel = supabase
            .channel(`guest-booking-${booking.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'bookings',
                    filter: `id=eq.${booking.id}`
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (payload: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setBooking((prev: any) => {
                        if (!prev) return null
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return { ...prev, ...(payload.new as any) }
                    })
                    toast.info("Tu reserva ha sido actualizada")
                }
            )
            .subscribe()

        // 3. Subscribe to Charges Updates (New Items)
        const chargesChannel = supabase
            .channel(`guest-charges-${booking.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'charges',
                    filter: `booking_id=eq.${booking.id}`
                },
                () => {
                    fetchCharges()
                    toast.info("Nueva actualización en tu cuenta")
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(bookingChannel)
            supabase.removeChannel(chargesChannel)
        }
    }, [booking?.id])

    // Identity State
    const [isEditingIdentity, setIsEditingIdentity] = useState(false)
    const [idType, setIdType] = useState<string>("passport")
    const [idNumber, setIdNumber] = useState("")
    const [savingIdentity, setSavingIdentity] = useState(false)

    // Store Access (Rooms & Events)
    const { rooms, events } = useAppStore()

    // Handlers
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) {
            toast.error("Por favor ingresa tu email o número de reserva")
            return
        }

        setLoading(true)
        setBooking(null)
        setAllBookings([])
        setIsEditingIdentity(false)

        try {
            const query = searchQuery.trim()
            let initialData = []

            // 1. Determine Search Type & Execute Initial Query
            if (query.includes('@')) {
                // Email Search: Direct lookup
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .ilike('email', query)
                    .order('check_in', { ascending: false })

                if (error) throw error
                initialData = data || []
            } else {
                // ID Search: Find specific booking first
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .or(`id.eq.${query},id.ilike.${query}%`)
                    .limit(1) // Just find the target first

                if (error) throw error
                initialData = data || []
            }

            // 2. "Expand" to find all related bookings if we found a match
            let finalBookings = [...initialData]

            if (initialData.length > 0) {
                const primaryEmail = initialData[0].email

                // Save to Session (Persistence)
                if (typeof window !== 'undefined') {
                    localStorage.setItem('guest_session_email', primaryEmail)
                }

                if (primaryEmail) {
                    const { data: relatedData, error: relatedError } = await supabase
                        .from('bookings')
                        .select('*')
                        .ilike('email', primaryEmail) // Fetch all siblings
                        .order('check_in', { ascending: false })

                    if (!relatedError && relatedData) {
                        finalBookings = relatedData
                    }
                }
            } else {
                if (typeof window !== 'undefined') localStorage.removeItem('guest_session_email')
            }

            setAllBookings(finalBookings)

            // Auto-select latest active booking
            const active = finalBookings.find(b => new Date(b.check_out) >= new Date()) || finalBookings[0]
            if (active) {
                setBooking(active)
                setViewMode('details')
            } else {
                toast.error("No encontramos reservas activas con esos datos")
            }

        } catch (error) {
            console.error(error)
            toast.error("Error al buscar reserva")
        } finally {
            setLoading(false)
        }
    }

    // Auto-Restore Session
    useEffect(() => {
        const savedEmail = localStorage.getItem('guest_session_email')
        if (savedEmail && !searchQuery) {
            setSearchQuery(savedEmail)
            autoLoadSession(savedEmail)
        }
    }, [])

    const autoLoadSession = async (email: string) => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .ilike('email', email)
                .order('check_in', { ascending: false })

            if (data && data.length > 0) {
                setAllBookings(data)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const active = data.find((b: any) => new Date(b.check_out) >= new Date()) || data[0]
                if (active) {
                    setBooking(active)
                    setViewMode('details')
                }
            }
        } catch (e) {
            console.error("Auto-load failed", e)
        } finally {
            setLoading(false)
        }
    }



    const handleUpdateIdentity = async () => {
        if (!booking) return
        setSavingIdentity(true)
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ guest_id_type: idType, guest_id_number: idNumber })
                .eq('id', booking.id)

            if (error) throw error
            toast.success("Información actualizada")
            setIsEditingIdentity(false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setBooking((prev: any) => ({ ...prev, guest_id_type: idType, guest_id_number: idNumber }))
        } catch (e) {
            toast.error("Error al guardar información")
        } finally {
            setSavingIdentity(false)
        }
    }

    // Derived State for UI
    const locationKey = booking?.location as keyof typeof LOCATION_ASSETS || 'pueblo'
    const theme = LOCATION_ASSETS[locationKey]
    const roomConfig = booking ? rooms.find(r => r.id === booking.room_type) : null
    const backgroundImage = roomConfig?.image || theme.bg
    const daysUntil = booking ? differenceInDays(new Date(booking.check_in), new Date()) : 0

    // Filter relevant events
    const relevantEvents = booking
        ? events.filter(e => e.location.toLowerCase() === booking.location.toLowerCase()).slice(0, 3)
        : []

    // Progress Step
    const getProgressStep = () => {
        if (!booking) return 0
        if (booking.status === 'checked_out') return 4
        if (booking.status === 'checked_in') return 3
        if (booking.payment_status === 'paid') return 2
        return 1
    }
    const currentStep = getProgressStep()
    const canCheckIn = booking && booking.payment_status === 'paid' && booking.guest_id_number && daysUntil <= 0 && booking.status === 'confirmed'

    // Interactive Handlers
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showCheckInModal, setShowCheckInModal] = useState(false)

    const handleUpsell = (service: string, price: string) => {
        if (!booking) return
        const text = `Hola, soy ${booking.guest_name}. Me gustaría reservar el servicio: ${service} (${service}). Mi reserva es: ${booking.id.slice(0, 6)}...`
        window.open(`https://wa.me/50212345678?text=${encodeURIComponent(text)}`, '_blank')
    }

    const handleSelfCheckIn = async () => {
        if (!booking) return

        // Elite Hardening: Verify conditions before execution
        const isPaid = booking.payment_status === 'paid'
        const hasId = !!booking.guest_id_number
        const isTime = daysUntil <= 0
        const isConfirmed = booking.status === 'confirmed'

        if (!isPaid || !hasId || !isTime || !isConfirmed) {
            toast.error("No es posible hacer check-in aún. Verifica tu pago o identidad.")
            console.error("Check-in attempt failed: Rules violation", { isPaid, hasId, isTime, isConfirmed })
            return
        }

        try {
            const { error } = await supabase.from('bookings').update({ status: 'checked_in' }).eq('id', booking.id)
            if (error) throw error

            toast.success("¡Bienvenido a Casa! Check-in exitoso.")
            setShowCheckInModal(false)
            toast.success("¡Bienvenido a Casa! Check-in exitoso.")
            setShowCheckInModal(false)
            setBooking(prev => prev ? ({ ...prev, status: 'checked_in' }) : null)

            // Trigger Confetti
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const jsConfetti = (window as any).confetti
            if (jsConfetti) jsConfetti()
        } catch (e) {
            toast.error("Error al procesar Check-in")
        }
    }

    const fetchProducts = async () => {
        if (products.length > 0) return
        setLoadingProducts(true)
        const { data } = await supabase.from('products').select('*').eq('active', true).order('category')
        if (data) setProducts(data)
        setLoadingProducts(false)
    }

    const handleAddCharge = async (product: { id: string, name: string, price: number }) => {
        if (!booking) return
        try {
            toast.loading("Agregando a tu cuenta...", { id: "add-charge" })
            const { error } = await supabase.from('charges').insert({
                booking_id: booking.id,
                product_id: product.id,
                item_name: product.name,
                amount: product.price,
                status: 'pending'
            })
            if (error) throw error
            toast.success(`+ ${product.name} agregado`, { id: "add-charge" })

            // Optional: Update booking total locally if we were tracking it, 
            // but usually total_price in booking is room price. 
            // We might want to show "Extras" separately.
        } catch (e) {
            toast.error("Error al agregar", { id: "add-charge" })
        }
    }

    const handleCheckout = async () => {
        if (!booking) return
        try {
            // In a real scenario, this might trigger a 'checkout_pending' status for staff review
            // For this flow, we mark it as checked_out to close the loop
            const { error } = await supabase.from('bookings').update({ status: 'checked_out' }).eq('id', booking.id)
            if (error) throw error

            toast.success("¡Gracias por tu visita! Esperamos verte pronto.")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setBooking((prev: any) => prev ? ({ ...prev, status: 'checked_out' }) : null)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const jsConfetti = (window as any).confetti
            if (jsConfetti) jsConfetti()
        } catch (e) {
            toast.error("Error al procesar Check-out")
        }
    }

    // 2. BOOKING SELECTION LIST (New Lobby)
    if (viewMode === 'list') {
        return (
            <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
                {/* <ParticlesBackground /> */}
                <div className="relative z-10 w-full max-w-2xl space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-stone-900 dark:text-white tracking-tight">Tus Reservas</h1>
                        <p className="text-stone-500 dark:text-stone-400">Hemos encontrado múltiples estancias. Selecciona una para continuar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allBookings.map((b) => (
                            <motion.div
                                key={b.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setBooking(b)
                                    setIdType(b.guest_id_type || "passport")
                                    setIdNumber(b.guest_id_number || "")
                                    setViewMode('details')
                                }}
                                className="cursor-pointer bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-white/10 p-6 rounded-xl hover:border-emerald-500/50 hover:bg-white dark:hover:bg-stone-900 transition-all group shadow-sm dark:shadow-none"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="outline" className={cn("capitalize", b.location === 'hideout' ? "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900 dark:text-lime-100 dark:border-lime-800" : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-800")}>
                                        {b.location}
                                    </Badge>
                                    <Badge variant="outline" className="border-stone-200 dark:border-white/20 text-stone-600 dark:text-stone-300">
                                        {b.status === 'confirmed' ? 'Confirmada' : b.status}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {b.room_type}
                                </h3>
                                <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 font-mono">
                                    {format(new Date(b.check_in), 'dd MMM')} - {format(new Date(b.check_out), 'dd MMM')}
                                </p>
                                <div className="flex items-center text-xs text-stone-400 dark:text-stone-500 gap-2 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                                    Click para gestionar <ArrowRight className="w-3 h-3" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <Button variant="ghost" className="w-full text-stone-500 hover:text-stone-900 dark:hover:text-white" onClick={() => {
                        setViewMode('search')
                        setBooking(null)
                    }}>
                        <span className="mr-2">←</span> Volver al inicio
                    </Button>
                </div>
            </div>
        )

    }

    // Calculated Totals
    const totalConsumed = Number(booking?.total_price || 0) + myCharges.reduce((acc, c) => acc + (Number(c.amount) || 0), 0)
    const totalPending = (booking?.payment_status === 'paid' ? 0 : Number(booking?.total_price || 0)) + myCharges.filter(c => c.status !== 'paid').reduce((acc, c) => acc + Number(c.amount), 0)

    return (
        <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center justify-start bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 selection:bg-amber-500/30 transition-colors duration-500">

            {/* Dynamic Background with Overlay */}
            <div className="fixed inset-0 z-0">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={booking ? booking.id : "empty"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={booking ? backgroundImage : theme.bg}
                            className="w-full h-full object-cover brightness-[0.8] dark:brightness-[0.3] blur-sm scale-105 transition-all duration-700"
                            alt="Background"
                        />
                    </motion.div>
                </AnimatePresence>
                {/* Light Mode Overlay (White/Transparent) vs Dark Mode Overlay (Black) */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-50/90 via-stone-50/60 to-white/30 dark:from-stone-950 dark:via-stone-950/80 dark:to-stone-900/40" />
            </div>

            {/* MAIN CONTAINER - Increased Padding for Navbar */}
            <div className="w-full max-w-6xl mx-auto relative z-10 pt-32 md:pt-40 pb-20 px-6">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            {booking && (
                                <Badge variant="outline" className={cn("uppercase tracking-widest text-[10px] bg-white/40 dark:bg-white/5 border-stone-200 dark:border-white/20 text-stone-800 dark:text-white backdrop-blur-md shadow-sm dark:shadow-none")}>
                                    {booking.location === 'hideout' ? 'The Hideout' : 'Pueblo'}
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-heading text-stone-900 dark:text-white drop-shadow-sm dark:drop-shadow-2xl tracking-tight">
                            {booking ? `Hola, ${booking.guest_name.split(' ')[0]}` : "Bienvenido"}
                        </h1>
                        <p className="text-lg text-stone-600 dark:text-stone-300 font-light max-w-lg">
                            {booking
                                ? "Aquí tienes todo lo necesario para tu aventura. Disfruta tu estancia."
                                : "Ingresa tus datos para acceder a tu panel de viaje exclusivo."}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className={cn("transition-all duration-700 w-full md:w-auto", booking ? "w-full md:w-96" : "w-full md:w-[500px]")}>
                        <Card className="border-stone-200 dark:border-white/10 shadow-xl dark:shadow-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                            <CardContent className="p-2 flex gap-2">
                                <Input
                                    placeholder="Email o ID de Reserva..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none text-stone-800 dark:text-white placeholder:text-stone-500 dark:placeholder:text-white/40 h-10 md:h-12 focus-visible:ring-0 text-base md:text-lg"
                                />
                                <Button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="bg-stone-900 dark:bg-white text-white dark:text-black hover:bg-stone-800 dark:hover:bg-stone-200 h-10 md:h-12 w-12 md:w-auto px-4 shadow-lg shadow-stone-900/10 dark:shadow-none"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>


                {/* DASHBOARD GRID */}
                <AnimatePresence mode="wait">
                    {booking && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-4 gap-6"
                        >

                            {/* --- COL 1: TRIP DETAILS & IDENTITY --- */}
                            <div className="md:col-span-1 space-y-6">
                                {/* Room Card */}
                                <Card className="bg-white/70 dark:bg-black/20 border-stone-200 dark:border-white/10 backdrop-blur-md overflow-hidden shadow-sm dark:shadow-none">
                                    <div className={cn("h-1 w-full bg-gradient-to-r", theme.gradient)} />
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-bold">Alojamiento</p>
                                                <p className="text-lg font-bold text-stone-900 dark:text-white mt-1 leading-tight">{roomConfig?.label || booking.room_type}</p>
                                            </div>
                                            {booking.room_type.includes('dorm') ? <BedDouble className="text-stone-400" /> : <ShieldCheck className="text-stone-400" />}
                                        </div>
                                        <div className="space-y-2 text-sm text-stone-600 dark:text-stone-300">
                                            <div className="flex justify-between">
                                                <span>Entrada</span>
                                                <span className="text-stone-900 dark:text-white">{format(new Date(booking.check_in), 'd MMM')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Salida</span>
                                                <span className="text-stone-900 dark:text-white">{format(new Date(booking.check_out), 'd MMM')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Estancia</span>
                                                <span className="text-stone-900 dark:text-white">{differenceInDays(new Date(booking.check_out), new Date(booking.check_in))} noches</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Guest Identity */}
                                <Card className="bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-white/5 backdrop-blur-md shadow-sm dark:shadow-none">
                                    <CardHeader className="pb-2 pt-4 px-4">
                                        <CardTitle className="text-xs uppercase tracking-widest text-stone-500 flex items-center gap-2">
                                            <Users className="w-3 h-3" /> Pre-Checkin
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4">
                                        {!isEditingIdentity ? (
                                            <div className="space-y-3">
                                                <div className="p-3 rounded-lg bg-white/40 dark:bg-white/5 border border-stone-200 dark:border-white/5 flex justify-between items-center group cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 transition-colors" onClick={() => setIsEditingIdentity(true)}>
                                                    <div>
                                                        <p className="text-[10px] text-stone-500 dark:text-stone-400">Documento</p>
                                                        <p className="font-mono text-stone-800 dark:text-stone-200">{booking.guest_id_number || "Pendiente"}</p>
                                                    </div>
                                                    <Badge variant={booking.guest_id_number ? "secondary" : "destructive"} className="text-[10px] h-5">
                                                        {booking.guest_id_number ? "OK" : "!"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase text-stone-500">Tipo</Label>
                                                    <Select value={idType} onValueChange={setIdType}>
                                                        <SelectTrigger className="h-8 text-xs bg-white dark:bg-black/20 border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200"><SelectValue /></SelectTrigger>
                                                        <SelectContent><SelectItem value="passport">Pasaporte</SelectItem><SelectItem value="dni">DNI</SelectItem></SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase text-stone-500">Número</Label>
                                                    <Input value={idNumber} onChange={e => setIdNumber(e.target.value)} className="h-8 bg-white dark:bg-black/20 border-stone-200 dark:border-white/10 font-mono text-xs text-stone-800 dark:text-stone-200" />
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button variant="outline" size="sm" className="flex-1 bg-transparent border-stone-200 dark:border-white/10 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 h-8" onClick={() => setIsEditingIdentity(false)}>
                                                        Cancelar
                                                    </Button>
                                                    <Button size="sm" className="flex-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 font-bold h-8" onClick={handleUpdateIdentity} disabled={savingIdentity}>
                                                        {savingIdentity ? <Loader2 className="w-3 h-3 animate-spin" /> : "Guardar"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* --- COL 2 & 3: MAIN HUB (Timeline, WiFi, Events) --- */}
                            <div className="md:col-span-2 space-y-6">

                                {/* Countdown / Status Hero */}
                                <Card className="border-0 bg-gradient-to-br from-white/40 to-white/20 dark:from-white/10 dark:to-white/5 overflow-hidden relative min-h-[160px] flex items-center shadow-lg dark:shadow-none">
                                    <div className={cn("absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-gradient-to-l", theme.gradient)} />
                                    <CardContent className="p-8 w-full flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                        <div className="text-center md:text-left">
                                            {/* MULTI-BOOKING SWITCHER (Back to List) */}
                                            {allBookings.length > 1 && (
                                                <div className="mb-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-white/40 dark:bg-white/10 border-white/20 text-stone-800 dark:text-white backdrop-blur-md hover:bg-white/50 dark:hover:bg-white/20"
                                                        onClick={() => setViewMode('list')}
                                                    >
                                                        <ArrowLeft className="w-3 h-3 mr-2" /> Mis Reservas ({allBookings.length})
                                                    </Button>
                                                </div>
                                            )}

                                            <p className="text-sm text-stone-600 dark:text-stone-300 uppercase tracking-widest font-medium mb-1">
                                                {daysUntil > 0 ? "Tu viaje comienza en" : "¡Bienvenido!"}
                                            </p>

                                            {daysUntil > 0 ? (
                                                <div className="text-6xl md:text-7xl font-light tracking-tighter text-stone-900 dark:text-white drop-shadow-md dark:drop-shadow-lg leading-none">
                                                    {daysUntil} <span className="text-2xl text-stone-500 dark:text-stone-400 align-baseline ml-[-10px]">días</span>
                                                </div>

                                            ) : (
                                                <>
                                                    <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-1 drop-shadow-md dark:drop-shadow-lg">
                                                        Hola, {booking.guest_name.split(" ")[0]}
                                                    </h1>

                                                    {!booking.guest_id_number && (
                                                        <p className="text-amber-300 text-xs font-bold animate-pulse flex items-center gap-1">
                                                            <ShieldCheck className="w-3 h-3" /> Acción Requerida: Validar Identidad
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Status Badge */}
                                        {/* Status Badge - CLICKABLE FOR PAYMENT */}
                                        <div
                                            className={cn("flex flex-col items-center gap-2 transition-transform hover:scale-105",
                                                booking.payment_status !== 'paid' && booking.payment_status !== 'verifying' ? "cursor-pointer group" : ""
                                            )}
                                            onClick={() => {
                                                if (booking.payment_status === 'pending') setShowPaymentModal(true)
                                                if (booking.payment_status === 'verifying') toast.info("Tu pago está siendo verificado por nuestro equipo.")
                                            }}
                                        >
                                            {/* BADGE LOGIC */}
                                            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-xl translation-all duration-300",
                                                booking.payment_status === 'paid'
                                                    ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-emerald-500/20"
                                                    : booking.payment_status === 'verifying'
                                                        ? "border-indigo-500 text-indigo-400 bg-indigo-500/10 shadow-indigo-500/20 animate-pulse"
                                                        : "border-amber-500 text-amber-500 bg-amber-500/10 shadow-amber-500/20 group-hover:border-amber-400"
                                            )}>
                                                {booking.payment_status === 'paid' && <CheckCircle2 className="w-8 h-8" />}
                                                {booking.payment_status === 'verifying' && <Loader2 className="w-8 h-8 animate-spin" />}
                                                {booking.payment_status === 'pending' && <Clock className="w-8 h-8 group-hover:animate-pulse" />}
                                                {/* Fallback for verifying if TS issue in switch */}
                                                {booking.payment_status === 'verifying' && <Loader2 className="w-8 h-8 animate-spin" />}
                                            </div>

                                            <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 text-center">
                                                {booking.payment_status === 'paid' && "Confirmada"}
                                                {booking.payment_status === 'verifying' && "Verificando"}
                                                {booking.payment_status === 'pending' && "Abono Pendiente"}

                                                {booking.payment_status === 'pending' && <ExternalLink className="w-3 h-3 opacity-50" />}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Visual Timeline */}
                                {/* Visual Timeline & Action Center */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-4 gap-2 relative">
                                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-stone-200 dark:bg-white/10 -z-10" />
                                        {[
                                            { label: "Reserva", icon: Calendar, done: true, action: null },
                                            { label: "Pago", icon: Wallet, done: booking.payment_status === 'paid', action: () => setShowPaymentModal(true) },
                                            { label: "Check-in", icon: CheckCircle2, done: booking.status === 'checked_in' || booking.status === 'checked_out', action: handleSelfCheckIn },
                                            { label: "Check-out", icon: ArrowRight, done: booking.status === 'checked_out', action: handleCheckout }
                                        ].map((step, i) => (
                                            <div
                                                key={i}
                                                className={cn("flex flex-col items-center gap-2 relative group",
                                                    !step.done && step.action && (
                                                        (step.label === 'Pago' && booking.payment_status !== 'paid') ||
                                                        (step.label === 'Check-in' && canCheckIn && booking.status !== 'checked_in' && booking.status !== 'checked_out') ||
                                                        (step.label === 'Check-out' && booking.status === 'checked_in')
                                                    ) ? "cursor-pointer" : ""
                                                )}
                                                onClick={() => {
                                                    if (!step.done && step.action) {
                                                        if (step.label === 'Pago' && booking.payment_status !== 'paid') step.action()
                                                        if (step.label === 'Check-in' && canCheckIn && booking.status !== 'checked_in') step.action()
                                                        if (step.label === 'Check-out' && booking.status === 'checked_in') step.action()
                                                    }
                                                }}
                                            >
                                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10",
                                                    step.done ? "border-emerald-500 text-emerald-500 bg-white dark:bg-stone-950" :
                                                        (!step.done && step.action && (
                                                            (step.label === 'Pago' && booking.payment_status !== 'paid') ||
                                                            (step.label === 'Check-in' && canCheckIn && booking.status !== 'checked_in' && booking.status !== 'checked_out') ||
                                                            (step.label === 'Check-out' && booking.status === 'checked_in')
                                                        )) ? "border-amber-500 text-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)] bg-white dark:bg-stone-950" : "border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-700 bg-stone-100 dark:bg-stone-950"
                                                )}>
                                                    <step.icon className="w-3.5 h-3.5" />
                                                </div>
                                                <p className={cn("text-[10px] uppercase font-bold tracking-wider transition-colors",
                                                    step.done ? "text-stone-400 dark:text-stone-300" :
                                                        (!step.done && step.action && (step.label === 'Pago' || (step.label === 'Check-in' && canCheckIn))) ? "text-amber-600 dark:text-amber-400" : "text-stone-400 dark:text-stone-600"
                                                )}>{step.label}</p>

                                                {/* Tooltip for Action */}
                                                {!step.done && step.action && (step.label === 'Pago' || (step.label === 'Check-in' && canCheckIn)) && (
                                                    <div className="absolute -bottom-8 bg-amber-500/10 text-amber-400 text-[9px] px-2 py-1 rounded border border-amber-500/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Click para {step.label}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* ACCOUNT SUMMARY (BILLING) */}
                                    <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-white/10 p-4 mb-6 space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-white/5">
                                            <span className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                                                <ShoppingBag className="w-4 h-4" /> Estado de Cuenta
                                            </span>
                                            <Badge variant={booking.payment_status === 'paid' ? 'default' : 'outline'} className={cn(booking.payment_status === 'paid' ? "bg-emerald-500 hover:bg-emerald-600" : "text-stone-500 border-stone-200 dark:border-stone-700")}>
                                                {booking.payment_status === 'paid' ? "Pagado" : booking.payment_status === 'verifying' ? "Verificando" : "Pendiente"}
                                            </Badge>
                                        </div>

                                        {/* Base Rate */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                                <BedDouble className="w-3 h-3" /> Alojamiento ({differenceInDays(new Date(booking.check_out), new Date(booking.check_in))} noches)
                                            </span>
                                            <span className="font-mono text-stone-900 dark:text-stone-100 font-bold">Q{booking.total_price}</span>
                                        </div>

                                        {/* Extras List */}
                                        {myCharges.length > 0 && (
                                            <div className="space-y-2 pt-2">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[10px] uppercase font-bold text-stone-400">Extras / Minibar</p>
                                                    {myCharges.some(c => c.status !== 'paid') && (
                                                        <Badge variant="outline" className="text-[10px] h-5 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-500">
                                                            Por pagar: Q{myCharges.filter(c => c.status !== 'paid').reduce((acc, c) => acc + Number(c.amount), 0)}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {myCharges.map(charge => (
                                                    <div key={charge.id} className="flex justify-between items-start text-sm pl-2 border-l-2 border-stone-200 dark:border-stone-800">
                                                        <span className="text-stone-500 dark:text-stone-400 flex flex-col">
                                                            <span className="flex items-center gap-2 font-medium">
                                                                {charge.item_name}
                                                                {charge.status === 'paid' ? (
                                                                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-1.5 py-0.5 rounded-sm flex items-center leading-none">
                                                                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Pagado
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-600 px-1.5 py-0.5 rounded-sm leading-none">Pendiente</span>
                                                                )}
                                                            </span>
                                                            <span className="text-[10px] opacity-50">
                                                                {format(new Date(charge.created_at), "d MMM, HH:mm", { locale: es })}
                                                            </span>
                                                        </span>
                                                        <span className={cn(
                                                            "font-mono transition-all",
                                                            charge.status === 'paid'
                                                                ? "text-stone-400 line-through decoration-stone-300 text-xs"
                                                                : "text-stone-900 dark:text-stone-100 font-bold"
                                                        )}>
                                                            Q{charge.amount}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Grand Total */}
                                        <div className="pt-4 border-t border-stone-200 dark:border-white/5 mt-2 space-y-1">
                                            <div className="flex justify-between items-center text-xs text-stone-400">
                                                <span>Total Consumido</span>
                                                <span className="font-mono">
                                                    Q{totalConsumed.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm font-bold text-stone-500 dark:text-stone-300">Total Pendiente</span>
                                                <div className="text-right">
                                                    <span className={cn(
                                                        "text-2xl font-bold font-heading",
                                                        totalPending > 0
                                                            ? "text-amber-600 dark:text-amber-500"
                                                            : "text-emerald-600 dark:text-emerald-500"
                                                    )}>
                                                        Q{totalPending.toFixed(2)}
                                                    </span>
                                                    {totalPending > 0 && (
                                                        <p className="text-[10px] text-amber-600 dark:text-amber-500 font-bold animate-pulse">
                                                            Pagar en Recepción
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Primary Action Button - Dynamic based on state */}
                                    {booking.payment_status === 'pending' && (
                                        <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold h-12 shadow-lg shadow-amber-900/20" onClick={() => setShowPaymentModal(true)}>
                                            <Wallet className="w-4 h-4 mr-2" /> Confirmar Reserva (Pagar)
                                        </Button>
                                    )}

                                    {booking.payment_status === 'verifying' && (
                                        <div className="w-full bg-blue-600/20 border border-blue-500/30 text-blue-200 font-bold h-12 flex items-center justify-center rounded-md animate-pulse">
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verificando Pago...
                                        </div>
                                    )}

                                    {booking.payment_status === 'paid' && booking.status !== 'checked_in' && canCheckIn && (
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-900/20" onClick={handleSelfCheckIn}>
                                            <Smartphone className="w-4 h-4 mr-2" /> Realizar Check-in
                                        </Button>
                                    )}

                                    {booking.status === 'checked_in' && (
                                        <Button className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold h-12 border border-white/10" onClick={handleCheckout}>
                                            <ArrowRight className="w-4 h-4 mr-2" /> Finalizar Estadía (Check-out)
                                        </Button>
                                    )}

                                    {booking.status === 'checked_out' && (
                                        <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                            <p className="text-emerald-400 font-bold">¡Estadía Completada!</p>
                                            <p className="text-stone-400 text-xs mt-1">Gracias por elegir Mandalas.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Digital Guidebook Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* WiFi Card */}
                                    <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-stone-200 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer group shadow-sm dark:shadow-none"
                                        onClick={() => { navigator.clipboard.writeText(theme.wifiPass); toast.success("Contraseña WiFi copiada") }}>
                                        <Wifi className="w-5 h-5 text-stone-400 dark:text-stone-400 mb-3 group-hover:text-stone-800 dark:group-hover:text-white transition-colors" />
                                        <p className="font-bold text-stone-800 dark:text-stone-200">WiFi</p>
                                        <p className="text-xs text-stone-500 font-mono mt-1 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">{theme.wifiSSID}</p>
                                    </div>

                                    {/* Location Card */}
                                    <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-stone-200 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer group shadow-sm dark:shadow-none"
                                        onClick={() => window.open(theme.mapUrl, "_blank")}>
                                        <MapPin className="w-5 h-5 text-stone-400 dark:text-stone-400 mb-3 group-hover:text-stone-800 dark:group-hover:text-white transition-colors" />
                                        <p className="font-bold text-stone-800 dark:text-stone-200">Ubicación</p>
                                        <p className="text-xs text-stone-500 mt-1">Ver en Mapa</p>
                                    </div>

                                    {/* Breakfast Info */}
                                    <div className="col-span-2 p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-stone-200 dark:border-white/5 flex items-center gap-4 shadow-sm dark:shadow-none">
                                        <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800"><Utensils className="w-4 h-4 text-stone-500 dark:text-stone-300" /></div>
                                        <div>
                                            <p className="font-bold text-stone-800 dark:text-stone-200 text-sm">Desayuno</p>
                                            <p className="text-xs text-stone-500 dark:text-stone-400">{theme.breakfastTime} • {theme.breakfastLoc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- COL 4: EVENTS & UPSELLS (Right Sidebar) --- */}
                            <div className="md:col-span-1 space-y-6">

                                {/* Events Feed */}
                                <Card className="bg-transparent border-0 shadow-none">
                                    <CardHeader className="px-0 pt-0 pb-3">
                                        <CardTitle className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                            <Music className="w-3 h-3" /> Agenda Semanal
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-0 space-y-3">
                                        {relevantEvents.length > 0 ? relevantEvents.map(evt => (
                                            <div key={evt.id} className="p-3 rounded-lg bg-white/40 dark:bg-white/5 border border-stone-200 dark:border-white/5 hover:border-stone-300 dark:hover:border-white/20 transition-all cursor-pointer shadow-sm dark:shadow-none">
                                                <div className="flex justify-between items-start mb-1">
                                                    <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-white/60 dark:bg-white/10 text-stone-600 dark:text-stone-300 shadow-none">{format(new Date(evt.date), 'EEE d, HH:mm')}</Badge>
                                                </div>
                                                <p className="font-bold text-sm text-stone-800 dark:text-stone-200 leading-tight mb-1">{evt.title}</p>
                                                <p className="text-xs text-stone-500 line-clamp-2">{evt.description}</p>
                                            </div>
                                        )) : (
                                            <div className="text-center py-6 border border-dashed border-stone-300 dark:border-white/10 rounded-lg">
                                                <p className="text-xs text-stone-500">No hay eventos programados</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Service Upsells */}
                                {/* Honesty Bar / Minibar Digital */}
                                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 shadow-lg shadow-amber-900/10 overflow-hidden relative group cursor-pointer"
                                    onClick={() => { setShowHonestyModal(true); fetchProducts() }}>
                                    <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
                                    <CardContent className="p-4 flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-amber-500 text-white dark:text-stone-900 flex items-center justify-center shadow-lg">
                                                <Beer className="w-5 h-5 fill-current" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-stone-900 dark:text-white leading-tight">Minibar Digital</h3>
                                                <p className="text-[10px] text-stone-500 dark:text-stone-400">¿Tomaste algo? Anótalo aquí.</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/10">
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                    {/* Decoration */}
                                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/20 blur-2xl rounded-full" />
                                </Card>

                                <div className="space-y-3">
                                    <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 px-1">Mejora tu viaje</p>

                                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 border-stone-200 dark:border-white/5 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 hover:border-amber-500/30 group text-left block shadow-sm dark:shadow-none" onClick={() => handleUpsell("Shuttle Privado", "$35")}>
                                        <div className="flex items-center gap-3 mb-1">
                                            <Bus className="w-4 h-4 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-stone-800 dark:text-stone-200">Shuttle Privado</span>
                                        </div>
                                        <p className="text-[10px] text-stone-500 pl-7 group-hover:text-stone-600 dark:group-hover:text-stone-400">Transporte seguro desde el aeropuerto.</p>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 border-stone-200 dark:border-white/5 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 hover:border-lime-500/30 group text-left block shadow-sm dark:shadow-none" onClick={() => handleUpsell("Lake Tour", "$25")}>
                                        <div className="flex items-center gap-3 mb-1">
                                            <Waves className="w-4 h-4 text-lime-600 dark:text-lime-500 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-stone-800 dark:text-stone-200">Lake Tour</span>
                                        </div>
                                        <p className="text-[10px] text-stone-500 pl-7 group-hover:text-stone-600 dark:group-hover:text-stone-400">Visita los pueblos del lago en lancha.</p>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 border-stone-200 dark:border-white/5 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 hover:border-cyan-500/30 group text-left block shadow-sm dark:shadow-none" onClick={() => handleUpsell("Lavandería", "$5")}>
                                        <div className="flex items-center gap-3 mb-1">
                                            <Shirt className="w-4 h-4 text-cyan-600 dark:text-cyan-500 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-stone-800 dark:text-stone-200">Lavandería</span>
                                        </div>
                                        <p className="text-[10px] text-stone-500 pl-7 group-hover:text-stone-600 dark:group-hover:text-stone-400">Recogida y entrega en tu habitación.</p>
                                    </Button>
                                </div>

                                <div className="pt-4 border-t border-stone-200 dark:border-white/5">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-900/20" onClick={() => window.open("https://wa.me/50212345678", "_blank")}>
                                        <MessageCircle className="w-4 h-4 mr-2" /> Chat Concierge
                                    </Button>
                                </div>

                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>


            {/* MODALS */}
            <AnimatePresence>
                {/* Payment Modal */}
                {/* Payment Modal - Report Payment Flow */}
                {/* Payment Modal - Report Payment Flow */}
                {showPaymentModal && booking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                            <div className="p-6 text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-500"><QrCode /></div>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white">Reportar Pago</h3>
                                <p className="text-sm text-stone-500 dark:text-stone-400">
                                    Realiza tu transferencia y repórtala aquí para que validemos tu reserva.
                                </p>

                                <div className="bg-stone-50 dark:bg-white p-4 rounded-xl inline-block w-full">
                                    {/* Bank Details */}
                                    <div className="bg-stone-50 p-3 rounded border border-stone-200 text-left space-y-2 mb-4">
                                        <p className="text-xs text-stone-500 font-bold uppercase">Datos Bancarios</p>
                                        <p className="text-sm text-stone-800 font-mono">Banco Industrial</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-stone-800 font-mono font-bold">123-456-789</p>
                                            <Copy className="w-3 h-3 text-stone-400 cursor-pointer hover:text-stone-600" onClick={() => { navigator.clipboard.writeText("123456789"); toast.success("Cuenta copiada") }} />
                                        </div>
                                        <p className="text-xs text-stone-600">Mandalas Hostal S.A.</p>
                                    </div>

                                    {/* Input Fields */}
                                    <div className="space-y-3 text-left">
                                        <div>
                                            <Label className="text-xs text-stone-500">Monto Total</Label>
                                            <div className="text-xl font-bold text-emerald-600">Q{booking.total_price}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-stone-500">No. de Boleta / Referencia</Label>
                                            <Input
                                                id="paymentRef"
                                                placeholder="Ej. 883210..."
                                                className="bg-stone-100 border-stone-200 text-stone-900 h-9"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={async () => {
                                        if (!booking) return
                                        const refInput = document.getElementById('paymentRef') as HTMLInputElement
                                        const ref = refInput?.value || "Sin referencia"

                                        try {
                                            const { error } = await supabase.from('bookings').update({
                                                payment_status: 'verifying',
                                                payment_method: 'transfer',
                                                payment_reference: ref
                                            }).eq('id', booking.id)

                                            if (error) throw error

                                            toast.success("Pago reportado. Estamos verificando.")
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            setBooking((prev: any) => ({ ...prev, payment_status: 'verifying', payment_reference: ref }))
                                            setShowPaymentModal(false)

                                            // Hybrid Flow: Offer WhatsApp Proof
                                            setTimeout(() => {
                                                const wantProof = window.confirm("¿Deseas enviar foto del comprobante por WhatsApp para agilizar?")
                                                if (wantProof) {
                                                    window.open(`https://wa.me/50212345678?text=Hola, reporté mi pago de Q${booking.total_price} (Ref: ${ref}) para reserva ${booking.id}. Adjunto foto.`, '_blank')
                                                }
                                            }, 500)

                                        } catch (e) {
                                            toast.error("Error al reportar pago")
                                        }
                                    }}>
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Reportar Pago Realizado
                                    </Button>
                                    <Button variant="ghost" onClick={() => setShowPaymentModal(false)}>Cancelar</Button>

                                    <p className="text-[10px] text-stone-500 mt-2">
                                        * Tu reserva cambiará a estado &quot;Verificando&quot; hasta que confirmemos la transacción.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Self Check-in Modal */}
                {showCheckInModal && booking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                            <div className="p-6 text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-500">
                                    <Smartphone className="w-6 h-6 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white">¿Estás en la Recepción?</h3>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">
                                    Confirma que has llegado al hostal. Esto notificará a nuestro staff y activará tu estadía.
                                </p>

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between gap-3 bg-stone-50 dark:bg-white/5 p-3 rounded-lg border border-stone-200 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-100 dark:bg-emerald-500/10 p-1.5 rounded-full text-emerald-600 dark:text-emerald-500"><CheckCircle2 className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold">Identidad</p>
                                                <p className="text-sm text-stone-800 dark:text-stone-200 font-mono">{booking.guest_id_type?.toUpperCase()} • {booking.guest_id_number}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 bg-stone-50 dark:bg-white/5 p-3 rounded-lg border border-stone-200 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-100 dark:bg-emerald-500/10 p-1.5 rounded-full text-emerald-600 dark:text-emerald-500"><CheckCircle2 className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold">Pago</p>
                                                <p className="text-sm text-stone-800 dark:text-stone-200 font-mono">Q{booking.total_price} • {booking.payment_reference || 'Pagado'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mt-4">
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg" onClick={handleSelfCheckIn}>
                                        <PartyPopper className="w-5 h-5 mr-2" /> ¡Estoy aquí! (Check-in)
                                    </Button>
                                    <Button variant="ghost" onClick={() => setShowCheckInModal(false)}>Cancelar</Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Honesty Bar Modal */}
                {showHonestyModal && booking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                            className="bg-white dark:bg-stone-900 border-t md:border border-stone-200 dark:border-white/10 rounded-t-3xl md:rounded-2xl w-full max-w-lg h-[85vh] md:h-[800px] md:max-h-[85vh] shadow-xl flex flex-col"
                        >
                            <div className="p-4 border-b border-stone-200 dark:border-white/5 flex justify-between items-center bg-white/90 dark:bg-stone-900/50 backdrop-blur-xl sticky top-0 z-10 rounded-t-3xl md:rounded-t-2xl shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-full text-amber-600 dark:text-amber-500"><Beer className="w-5 h-5" /></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-stone-900 dark:text-white">Minibar Digital</h3>
                                        <p className="text-xs text-stone-500 dark:text-stone-400">Confianza total.</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowHonestyModal(false)}><X className="w-5 h-5" /></Button>
                            </div>

                            <div className="flex-1 overflow-hidden flex flex-col">
                                {loadingProducts ? (
                                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500 w-8 h-8" /></div>
                                ) : (
                                    <Tabs defaultValue="beer" className="flex-1 flex flex-col h-full">
                                        {/* Horizontal Scrollable Tabs */}
                                        <div className="px-4 pt-2 pb-2">
                                            <ScrollArea className="w-full whitespace-nowrap">
                                                <TabsList className="bg-stone-100 dark:bg-stone-800/50 p-1 h-auto inline-flex w-auto rounded-xl">
                                                    <TabsTrigger value="beer" className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide">Cervezas</TabsTrigger>
                                                    <TabsTrigger value="soda" className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide">Refrescos</TabsTrigger>
                                                    <TabsTrigger value="water" className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide">Agua</TabsTrigger>
                                                    <TabsTrigger value="snack" className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide">Snacks</TabsTrigger>
                                                </TabsList>
                                            </ScrollArea>
                                        </div>

                                        {/* Content Areas */}
                                        {['beer', 'soda', 'water', 'snack'].map(category => (
                                            <TabsContent key={category} value={category} className="flex-1 overflow-y-auto p-4 pt-2 m-0 h-full max-h-full">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {products.filter(p => p.category === category).map((item, idx) => (
                                                        <motion.button
                                                            key={item.id}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="relative group bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 border border-stone-200 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center justify-between gap-3 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/10 active:scale-95 text-center"
                                                            onClick={() => setConfirmProduct(item)}
                                                        >
                                                            <div className="text-4xl filter drop-shadow-sm mb-1 group-hover:scale-110 transition-transform text-center w-full">{item.icon}</div>
                                                            <div className="w-full">
                                                                <h4 className="font-bold text-stone-800 dark:text-stone-100 text-sm leading-tight text-center">{item.name}</h4>
                                                                <p className="text-stone-500 text-[10px] mt-1 text-center">Disponible</p>
                                                            </div>
                                                            <div className="w-full pt-2 border-t border-stone-100 dark:border-white/5 flex items-center justify-between">
                                                                <span className="font-mono font-bold text-amber-600 dark:text-amber-500 text-sm">Q{item.price}</span>
                                                                <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                                                    <Plus className="w-3.5 h-3.5" />
                                                                </div>
                                                            </div>
                                                        </motion.button>
                                                    ))}
                                                    {products.filter(p => p.category === category).length === 0 && (
                                                        <div className="col-span-2 py-10 text-center text-stone-400">
                                                            <p className="text-sm">No hay productos en esta categoría</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                )}
                            </div>

                            {/* Custom Confirmation Modal */}
                            <AlertDialog open={!!confirmProduct} onOpenChange={(open) => !open && setConfirmProduct(null)}>
                                <AlertDialogContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-white/10 rounded-2xl max-w-xs md:max-w-md">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-stone-900 dark:text-white flex items-center gap-2">
                                            <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-full text-amber-600 dark:text-amber-500">
                                                <Beer className="w-4 h-4" />
                                            </div>
                                            Confirmar Compra
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-stone-600 dark:text-stone-400 pt-2">
                                            ¿Deseas agregar <b className="text-stone-900 dark:text-stone-200">{confirmProduct?.name}</b> a tu cuenta por <span className="font-mono font-bold text-stone-900 dark:text-stone-200">Q{confirmProduct?.price}</span>?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-xl border-stone-200 dark:border-white/10" onClick={() => setConfirmProduct(null)}>
                                            Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
                                            onClick={() => {
                                                if (confirmProduct) handleAddCharge(confirmProduct)
                                                setConfirmProduct(null)
                                            }}
                                        >
                                            Confirmar +1
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <div className="p-4 border-t border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/90 text-center">
                                <p className="text-xs text-stone-500">
                                    Los cargos se sumarán a tu cuenta final. <br /> Puedes pagar todo al hacer Check-out.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
