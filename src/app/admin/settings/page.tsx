"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Save, Loader2, BedDouble } from "lucide-react"

export default function SettingsPage() {
    const { rooms, updateRoomCapacity, updateRoomPrice, updateRoomMaxGuests } = useAppStore()
    const [isSaving, setIsSaving] = useState(false)

    // Local state to handle inputs before saving
    const [localRooms, setLocalRooms] = useState(rooms || [])

    // Sync local state when store loads
    useEffect(() => {
        if (rooms && rooms.length > 0 && localRooms.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocalRooms(rooms)
        }
    }, [rooms, localRooms.length])

    const handlePriceChange = (roomId: string, value: string) => {
        setLocalRooms(prev => prev.map(room =>
            room.id === roomId ? { ...room, basePrice: parseFloat(value) || 0 } : room
        ))
    }

    const handleRoomCapacityChange = (roomId: string, value: string) => {
        setLocalRooms(prev => prev.map(room =>
            room.id === roomId ? { ...room, capacity: parseInt(value) || 0 } : room
        ))
    }

    const handleMaxGuestsChange = (roomId: string, value: string) => {
        setLocalRooms(prev => prev.map(room =>
            room.id === roomId ? { ...room, maxGuests: parseInt(value) || 1 } : room
        ))
    }

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 800))

        // Update Rooms & Prices
        localRooms.forEach(room => {
            updateRoomCapacity(room.id, room.capacity)
            updateRoomPrice(room.id, room.basePrice)
            if (room.maxGuests) updateRoomMaxGuests(room.id, room.maxGuests)
        })

        setIsSaving(false)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-1">
                <h2 className="text-4xl font-light tracking-tight text-stone-900 dark:text-white font-heading">
                    Configuración
                    <span className="text-stone-400">.</span>
                </h2>
                <p className="text-stone-500 dark:text-stone-400 font-light text-lg">
                    Control maestro de inventario y precios.
                </p>
            </div>

            <Tabs defaultValue="rooms" className="space-y-8">
                <TabsList className="bg-stone-100/50 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200/50 dark:border-stone-800 p-1 h-auto rounded-full w-full md:w-auto">
                    <TabsTrigger 
                        value="rooms" 
                        className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-stone-800 data-[state=active]:text-stone-900 dark:data-[state=active]:text-stone-100 data-[state=active]:shadow-sm transition-all"
                    >
                        Habitaciones y Capacidad
                    </TabsTrigger>
                    <TabsTrigger 
                        value="prices" 
                        className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-stone-800 data-[state=active]:text-stone-900 dark:data-[state=active]:text-stone-100 data-[state=active]:shadow-sm transition-all"
                    >
                        Precios Base
                    </TabsTrigger>
                </TabsList>

                {/* ROOMS CONTENT */}
                <TabsContent value="rooms" className="space-y-8 outline-none">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* PUEBLO ROOMS - Amber Theme */}
                        <Card className="border-white/40 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl shadow-xl shadow-stone-200/20 dark:shadow-none overflow-hidden group">
                            <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-80" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl font-light font-heading text-stone-900 dark:text-stone-100">
                                    <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-inner">
                                        <BedDouble className="w-5 h-5" />
                                    </span>
                                    Mandalas Pueblo
                                </CardTitle>
                                <CardDescription className="text-stone-500 font-light">
                                    Gestión de capacidad para el área social.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {localRooms.filter(r => r.location === 'pueblo').map(room => (
                                    <div key={room.id} className="group/item relative bg-white/40 dark:bg-stone-950/40 rounded-xl p-4 border border-stone-100 dark:border-stone-800 hover:border-amber-200 dark:hover:border-amber-900 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <Label htmlFor={room.id} className="text-base font-medium text-stone-700 dark:text-stone-200 cursor-pointer">
                                                    {room.label}
                                                </Label>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600/70 mt-1">{room.type}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <Label className="text-[10px] text-stone-400 uppercase tracking-wide mb-1.5 block">Inventario Físico</Label>
                                                <div className="relative">
                                                    <Input
                                                        id={room.id}
                                                        type="number"
                                                        min="1"
                                                        value={room.capacity}
                                                        onChange={(e) => handleRoomCapacityChange(room.id, e.target.value)}
                                                        className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-center font-bold text-lg h-10 focus-visible:ring-amber-500/30"
                                                    />
                                                    <span className="absolute right-3 top-2.5 text-xs text-stone-400 pointer-events-none">
                                                        {room.type === 'dorm' ? 'Camas' : 'Units'}
                                                    </span>
                                                </div>
                                            </div>

                                            {room.type !== 'dorm' && (
                                                <div className="flex-1">
                                                    <Label className="text-[10px] text-stone-400 uppercase tracking-wide mb-1.5 block">Max. Huéspedes</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={room.maxGuests}
                                                            onChange={(e) => handleMaxGuestsChange(room.id, e.target.value)}
                                                            className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-center font-bold text-lg h-10 text-stone-600 dark:text-stone-400 focus-visible:ring-amber-500/30"
                                                        />
                                                        <span className="absolute right-3 top-2.5 text-xs text-stone-400 pointer-events-none">Pax</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* HIDEOUT ROOMS - Lime Theme */}
                        <Card className="border-white/40 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl shadow-xl shadow-stone-200/20 dark:shadow-none overflow-hidden group">
                            <div className="h-1 w-full bg-gradient-to-r from-lime-400 to-lime-600 opacity-80" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl font-light font-heading text-stone-900 dark:text-stone-100">
                                    <span className="w-10 h-10 rounded-2xl bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center text-lime-600 dark:text-lime-500 shadow-inner">
                                        <BedDouble className="w-5 h-5" />
                                    </span>
                                    Mandalas Hideout
                                </CardTitle>
                                <CardDescription className="text-stone-500 font-light">
                                    Gestión de capacidad para el área zen.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {localRooms.filter(r => r.location === 'hideout').map(room => (
                                    <div key={room.id} className="group/item relative bg-white/40 dark:bg-stone-950/40 rounded-xl p-4 border border-stone-100 dark:border-stone-800 hover:border-lime-200 dark:hover:border-lime-900 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <Label htmlFor={room.id} className="text-base font-medium text-stone-700 dark:text-stone-200 cursor-pointer">
                                                    {room.label}
                                                </Label>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-lime-600/70 mt-1">{room.type}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <Label className="text-[10px] text-stone-400 uppercase tracking-wide mb-1.5 block">Inventario Físico</Label>
                                                <div className="relative">
                                                    <Input
                                                        id={room.id}
                                                        type="number"
                                                        min="1"
                                                        value={room.capacity}
                                                        onChange={(e) => handleRoomCapacityChange(room.id, e.target.value)}
                                                        className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-center font-bold text-lg h-10 focus-visible:ring-lime-500/30"
                                                    />
                                                    <span className="absolute right-3 top-2.5 text-xs text-stone-400 pointer-events-none">
                                                        {room.type === 'dorm' ? 'Camas' : 'Units'}
                                                    </span>
                                                </div>
                                            </div>

                                            {room.type !== 'dorm' && (
                                                <div className="flex-1">
                                                    <Label className="text-[10px] text-stone-400 uppercase tracking-wide mb-1.5 block">Max. Huéspedes</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={room.maxGuests}
                                                            onChange={(e) => handleMaxGuestsChange(room.id, e.target.value)}
                                                            className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-center font-bold text-lg h-10 text-stone-600 dark:text-stone-400 focus-visible:ring-lime-500/30"
                                                        />
                                                        <span className="absolute right-3 top-2.5 text-xs text-stone-400 pointer-events-none">Pax</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="prices" className="space-y-8 outline-none">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Pueblo Prices */}
                        <Card className="border-white/40 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl shadow-xl shadow-stone-200/20 dark:shadow-none overflow-hidden">
                             <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-80" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl font-light font-heading text-stone-900 dark:text-stone-100">
                                    <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-inner">
                                        <DollarSign className="w-5 h-5" />
                                    </span>
                                    Precios Pueblo
                                </CardTitle>
                                <CardDescription className="text-stone-500 font-light">Tarifas base por noche (USD)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {localRooms.filter(r => r.location === 'pueblo').map(room => (
                                    <div key={room.id} className="grid gap-2 p-3 rounded-lg hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors">
                                        <Label htmlFor={`price-${room.id}`} className="text-sm font-medium">{room.label}</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-stone-400 font-mono">$</span>
                                            <Input
                                                id={`price-${room.id}`}
                                                type="number"
                                                min="0"
                                                value={room.basePrice}
                                                onChange={(e) => handlePriceChange(room.id, e.target.value)}
                                                className="pl-7 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 font-mono text-lg font-bold focus-visible:ring-amber-500/30"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Hideout Prices */}
                        <Card className="border-white/40 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl shadow-xl shadow-stone-200/20 dark:shadow-none overflow-hidden">
                            <div className="h-1 w-full bg-gradient-to-r from-lime-400 to-lime-600 opacity-80" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl font-light font-heading text-stone-900 dark:text-stone-100">
                                    <span className="w-10 h-10 rounded-2xl bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center text-lime-600 dark:text-lime-500 shadow-inner">
                                        <DollarSign className="w-5 h-5" />
                                    </span>
                                    Precios Hideout
                                </CardTitle>
                                <CardDescription className="text-stone-500 font-light">Tarifas base por noche (USD)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {localRooms.filter(r => r.location === 'hideout').map(room => (
                                    <div key={room.id} className="grid gap-2 p-3 rounded-lg hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors">
                                        <Label htmlFor={`price-${room.id}`} className="text-sm font-medium">{room.label}</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-stone-400 font-mono">$</span>
                                            <Input
                                                id={`price-${room.id}`}
                                                type="number"
                                                min="0"
                                                value={room.basePrice}
                                                onChange={(e) => handlePriceChange(room.id, e.target.value)}
                                                className="pl-7 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 font-mono text-lg font-bold focus-visible:ring-lime-500/30"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4 border-t border-stone-100 dark:border-stone-800/50">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="lg"
                    className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 min-w-[180px] shadow-lg shadow-stone-500/20 rounded-full font-medium"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Aplicando Cambios...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Configuración
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
