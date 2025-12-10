"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    Calendar as CalendarIcon,
    Plus,
    Trash2,
    MapPin,
    Clock,
    Music,
    Utensils,
    Users
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { Suspense } from "react"

// ... imports

function EventsContent() {
    const { events, addEvent, removeEvent } = useAppStore()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const searchParams = useSearchParams()

    useEffect(() => {
        const action = searchParams.get('action')
        if (action === 'new') {
            // Delay slightly to avoid React state update conflict during render phase
            setTimeout(() => setIsDialogOpen(true), 0)

            // Cleanup url
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('action')
            window.history.replaceState({}, '', newUrl)
        }
    }, [searchParams])

    // Form State
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [category, setCategory] = useState<'music' | 'food' | 'social' | 'wellness'>("music")
    const [location, setLocation] = useState<'Pueblo' | 'Hideout'>("Pueblo")

    const handleSubmit = () => {
        if (!title || !date || !description) return

        addEvent({
            title,
            description,
            date: date.toISOString(),
            category,
            location
        })

        // Reset form
        setTitle("")
        setDescription("")
        setDate(new Date())
        setCategory("music")
        setLocation("Pueblo")
        setIsDialogOpen(false)
    }

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'music': return <Music className="w-4 h-4 text-purple-500" />
            case 'food': return <Utensils className="w-4 h-4 text-orange-500" />
            case 'social': return <Users className="w-4 h-4 text-blue-500" />
            default: return <CalendarIcon className="w-4 h-4 text-stone-500" />
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white font-heading">Eventos & Actividades</h2>
                    <p className="text-stone-500 dark:text-stone-400">Programa la agenda cultural y social del hostal.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 shadow-lg shadow-stone-900/20">
                            <Plus className="w-4 h-4 mr-2" /> Nuevo Evento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Evento</DialogTitle>
                            <DialogDescription className="text-stone-500 dark:text-stone-400">
                                Agrega una actividad al calendario público del hostal.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-stone-900 dark:text-stone-200">Título del Evento</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej. Noche de Jazz"
                                    className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-stone-900 dark:text-stone-200">Categoría</Label>
                                    <Select value={category} onValueChange={(val) => setCategory(val as 'music' | 'food' | 'social' | 'wellness')}>
                                        <SelectTrigger className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100">
                                            <SelectValue placeholder="Categoría" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                                            <SelectItem value="music">Música</SelectItem>
                                            <SelectItem value="food">Comida</SelectItem>
                                            <SelectItem value="social">Social</SelectItem>
                                            <SelectItem value="wellness">Bienestar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-stone-900 dark:text-stone-200">Ubicación</Label>
                                    <Select value={location} onValueChange={(val) => setLocation(val as 'Pueblo' | 'Hideout')}>
                                        <SelectTrigger className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100">
                                            <SelectValue placeholder="Ubicación" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                                            <SelectItem value="Pueblo">Pueblo</SelectItem>
                                            <SelectItem value="Hideout">Hideout</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-stone-900 dark:text-stone-200">Fecha y Hora</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description" className="text-stone-900 dark:text-stone-200">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Detalles del evento..."
                                    className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSubmit} className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200">Guardar Evento</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.length === 0 ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-stone-400 dark:text-stone-500 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-900/30">
                        <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium text-lg">No hay eventos programados</p>
                        <p className="text-sm">Crea el primer evento para comenzar.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <Card key={event.id} className="border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                            <div className={cn("h-2 w-full",
                                event.category === 'music' ? "bg-purple-500" :
                                    event.category === 'food' ? "bg-orange-500" : "bg-blue-500"
                            )} />
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="p-2 bg-stone-50 dark:bg-stone-800 rounded-lg">
                                            {getCategoryIcon(event.category)}
                                        </span>
                                        <span className="text-xs font-medium uppercase tracking-wider text-stone-400 dark:text-stone-500">
                                            {event.category}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-stone-300 dark:text-stone-600 hover:text-red-500 dark:hover:text-red-400 -mt-2 -mr-2" onClick={() => removeEvent(event.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <CardTitle className="font-heading text-xl text-stone-900 dark:text-stone-100">{event.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1 text-stone-500 dark:text-stone-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    {format(new Date(event.date), "PPP", { locale: es })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">{event.description}</p>
                            </CardContent>
                            <CardFooter className="bg-stone-50/50 dark:bg-stone-800/20 border-t border-stone-100 dark:border-stone-800 pt-4 pb-4">
                                <div className="flex items-center text-xs font-medium text-stone-500 dark:text-stone-400">
                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                    Mandalas {event.location}
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default function EventsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-12 text-stone-400">Cargando eventos...</div>}>
            <EventsContent />
        </Suspense>
    )
}
