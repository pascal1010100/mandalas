"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Music, Utensils, Zap } from "lucide-react"

const events = [
    { day: "Lunes", title: "Cena Familiar", time: "7:00 PM", icon: Utensils, color: "bg-orange-500", desc: "Pasta casera y vino para compartir." },
    { day: "Martes", title: "Noche de Salsa", time: "8:00 PM", icon: Music, color: "bg-red-500", desc: "Clases gratis para principiantes." },
    { day: "Miércoles", title: "Trivia Night", time: "7:30 PM", icon: Zap, color: "bg-yellow-500", desc: "Premios en tragos para los ganadores." },
    { day: "Jueves", title: "BBQ Sunset", time: "5:00 PM", icon: Utensils, color: "bg-orange-600", desc: "Hamburguesas y atardecer en la terraza." },
    { day: "Viernes", title: "Fiesta en el Bar", time: "9:00 PM", icon: Music, color: "bg-purple-600", desc: "DJ invitado y happy hour extendido." },
    { day: "Sábado", title: "Pool Party", time: "2:00 PM", icon: Zap, color: "bg-blue-500", desc: "Música, sol y cócteles." },
    { day: "Domingo", title: "Yoga & Brunch", time: "10:00 AM", icon: CalendarDays, color: "bg-green-500", desc: "Recupera tu energía." },
]

export function EventsCalendar() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {events.map((event, idx) => (
                <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-all hover:scale-105 group overflow-hidden">
                    <div className={`h-2 w-full ${event.color}`} />
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="font-mono uppercase text-xs tracking-wider mb-2">{event.day}</Badge>
                            <event.icon className={`w-5 h-5 ${event.color.replace('bg-', 'text-')}`} />
                        </div>
                        <CardTitle className="text-xl font-heading">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-bold text-stone-600 mb-1">{event.time}</p>
                        <p className="text-sm text-stone-500 leading-snug">{event.desc}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
