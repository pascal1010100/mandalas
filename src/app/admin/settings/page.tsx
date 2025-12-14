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
        if (rooms && rooms.length > 0) {
            setLocalRooms(rooms)
        }
    }, [rooms])

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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white font-heading">Configuración</h2>
                <p className="text-stone-500 dark:text-stone-400">Administra los precios, capacidades y ajustes del sistema.</p>
            </div>

            <Tabs defaultValue="rooms" className="space-y-6">
                <TabsList className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full justify-start overflow-x-auto no-scrollbar">
                    <TabsTrigger value="rooms" className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-800 data-[state=active]:shadow-sm flex-shrink-0">Habitaciones y Capacidad</TabsTrigger>
                    <TabsTrigger value="prices" className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-800 data-[state=active]:shadow-sm flex-shrink-0">Precios Base</TabsTrigger>
                </TabsList>

                {/* ROOMS CONTENT */}
                <TabsContent value="rooms" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* PUEBLO ROOMS */}
                        <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                                    <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
                                        <BedDouble className="w-4 h-4" />
                                    </span>
                                    Mandalas Pueblo
                                </CardTitle>
                                <CardDescription>Gestiona la capacidad máxima de cada habitación.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {localRooms.filter(r => r.location === 'pueblo').map(room => (
                                    <div key={room.id} className="grid gap-2">
                                        <div className="flex justify-between items-center px-1">
                                            <Label htmlFor={room.id} className="cursor-pointer">{room.label}</Label>
                                            <span className="text-[10px] uppercase font-bold text-stone-400">{room.type}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-center">
                                                <Label className="text-[10px] text-stone-400 mb-1">Inventario</Label>
                                                <Input
                                                    id={room.id}
                                                    type="number"
                                                    min="1"
                                                    value={room.capacity}
                                                    onChange={(e) => handleRoomCapacityChange(room.id, e.target.value)}
                                                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 w-20 text-center font-bold"
                                                />
                                            </div>

                                            {room.type !== 'dorm' && (
                                                <div className="flex flex-col items-center">
                                                    <Label className="text-[10px] text-stone-400 mb-1">Max Huéspedes</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={room.maxGuests}
                                                        onChange={(e) => handleMaxGuestsChange(room.id, e.target.value)}
                                                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 w-20 text-center font-bold text-stone-600"
                                                    />
                                                </div>
                                            )}

                                            <span className="text-xs text-stone-500 mt-5 ml-2">
                                                {room.type === 'dorm' ? 'Camas Totales' : 'Habitaciones'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* HIDEOUT ROOMS */}
                        <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                                    <span className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center text-lime-600 dark:text-lime-500">
                                        <BedDouble className="w-4 h-4" />
                                    </span>
                                    Mandalas Hideout
                                </CardTitle>
                                <CardDescription>Gestiona la capacidad máxima de cada habitación.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {localRooms.filter(r => r.location === 'hideout').map(room => (
                                    <div key={room.id} className="grid gap-2">
                                        <div className="flex justify-between items-center px-1">
                                            <Label htmlFor={room.id} className="cursor-pointer">{room.label}</Label>
                                            <span className="text-[10px] uppercase font-bold text-stone-400">{room.type}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-center">
                                                <Label className="text-[10px] text-stone-400 mb-1">Inventario</Label>
                                                <Input
                                                    id={room.id}
                                                    type="number"
                                                    min="1"
                                                    value={room.capacity}
                                                    onChange={(e) => handleRoomCapacityChange(room.id, e.target.value)}
                                                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 w-20 text-center font-bold"
                                                />
                                            </div>

                                            {room.type !== 'dorm' && (
                                                <div className="flex flex-col items-center">
                                                    <Label className="text-[10px] text-stone-400 mb-1">Max Huéspedes</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={room.maxGuests}
                                                        onChange={(e) => handleMaxGuestsChange(room.id, e.target.value)}
                                                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 w-20 text-center font-bold text-stone-600"
                                                    />
                                                </div>
                                            )}

                                            <span className="text-xs text-stone-500 mt-5 ml-2">
                                                {room.type === 'dorm' ? 'Camas Totales' : 'Habitaciones'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 min-w-[150px]"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="prices" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Pueblo Prices */}
                        <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                                    <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
                                        <DollarSign className="w-4 h-4" />
                                    </span>
                                    Mandalas Pueblo
                                </CardTitle>
                                <CardDescription>Precios base por noche (USD)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="pueblo_dorm">Dormitorio Compartido</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-stone-500">$</span>
                                        <Input
                                            id="pueblo_dorm"
                                            value={localRooms.find(r => r.id === 'pueblo_dorm')?.basePrice || 0}
                                            onChange={(e) => handlePriceChange('pueblo_dorm', e.target.value)}
                                            className="pl-7 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pueblo_private">Habitación Privada</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-stone-500">$</span>
                                        <Input
                                            id="pueblo_private"
                                            value={localRooms.find(r => r.id === 'pueblo_private')?.basePrice || 0}
                                            onChange={(e) => handlePriceChange('pueblo_private', e.target.value)}
                                            className="pl-7 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pueblo_suite">Suite con Vista</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-stone-500">$</span>
                                        <Input
                                            id="pueblo_suite"
                                            value={localRooms.find(r => r.id === 'pueblo_suite')?.basePrice || 0}
                                            onChange={(e) => handlePriceChange('pueblo_suite', e.target.value)}
                                            className="pl-7 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hideout Prices */}
                        <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                                    <span className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center text-lime-600 dark:text-lime-500">
                                        <DollarSign className="w-4 h-4" />
                                    </span>
                                    Mandalas Hideout
                                </CardTitle>
                                <CardDescription>Precios base por noche (USD)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="hideout_dorm">Bungalow (Dorm)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-stone-500">$</span>
                                        <Input
                                            id="hideout_dorm"
                                            value={localRooms.find(r => r.id === 'hideout_dorm')?.basePrice || 0}
                                            onChange={(e) => handlePriceChange('hideout_dorm', e.target.value)}
                                            className="pl-7 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="hideout_private">Glamping (Privada)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-stone-500">$</span>
                                        <Input
                                            id="hideout_private"
                                            value={localRooms.find(r => r.id === 'hideout_private')?.basePrice || 0}
                                            onChange={(e) => handlePriceChange('hideout_private', e.target.value)}
                                            className="pl-7 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="hideout_suite">Suite Lakefront</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-stone-500">$</span>
                                        <Input
                                            id="hideout_suite"
                                            value={localRooms.find(r => r.id === 'hideout_suite')?.basePrice || 0}
                                            onChange={(e) => handlePriceChange('hideout_suite', e.target.value)}
                                            className="pl-7 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 min-w-[150px]"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
