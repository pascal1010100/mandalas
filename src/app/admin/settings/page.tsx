"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Save, Loader2 } from "lucide-react"

export default function SettingsPage() {
    const { prices, updatePrice } = useAppStore()
    const [isSaving, setIsSaving] = useState(false)

    // Local state to handle inputs before saving
    // Initialize with current store values
    const [localPrices, setLocalPrices] = useState(prices || {})

    const handlePriceChange = (key: string, value: string) => {
        setLocalPrices(prev => ({
            ...prev,
            [key]: parseFloat(value) || 0
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 800))

        // Update store for each key
        Object.entries(localPrices).forEach(([key, value]) => {
            updatePrice(key, value)
        })

        setIsSaving(false)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white font-heading">Configuración</h2>
                <p className="text-stone-500 dark:text-stone-400">Administra los precios y ajustes generales del sistema.</p>
            </div>

            <Tabs defaultValue="prices" className="space-y-6">
                <TabsList className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <TabsTrigger value="prices" className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-800 data-[state=active]:shadow-sm">Precios de Habitaciones</TabsTrigger>
                    <TabsTrigger value="general" disabled>General (Próximamente)</TabsTrigger>
                </TabsList>

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
                                            value={localPrices['pueblo_dorm']}
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
                                            value={localPrices['pueblo_private']}
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
                                            value={localPrices['pueblo_suite']}
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
                                            value={localPrices['hideout_dorm']}
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
                                            value={localPrices['hideout_private']}
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
                                            value={localPrices['hideout_suite']}
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
