"use client"

import { CalendarDays, Music, Utensils, Zap } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const icons = {
    Utensils,
    Music,
    Zap,
    CalendarDays
}

export function EventsCalendar() {
    const { events } = useAppStore()

    // Helper to map category to legacy UI props
    const getEventProps = (category: string) => {
        switch (category) {
            case 'food': return { icon: Utensils, color: 'bg-orange-500' }
            case 'music': return { icon: Music, color: 'bg-red-500' }
            case 'social': return { icon: Zap, color: 'bg-yellow-500' }
            case 'wellness': return { icon: CalendarDays, color: 'bg-green-500' }
            default: return { icon: CalendarDays, color: 'bg-blue-500' }
        }
    }

    return (
        <section className="py-24 bg-stone-50 relative overflow-hidden">
            {/* Background elements omitted for brevity, keeping existing structure */}
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 font-heading tracking-tight">
                        Agenda Semanal
                    </h2>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
                        No todo es descanso. Únete a nuestras actividades y conoce viajeros de todo el mundo.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map((event) => {
                        const { icon: Icon, color } = getEventProps(event.category)
                        const dateObj = new Date(event.date)

                        return (
                            <div
                                key={event.id}
                                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-stone-100"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

                                <div className="relative z-10">
                                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-bold tracking-wider uppercase text-stone-400 bg-stone-50 px-2 py-1 rounded-md">
                                            {format(dateObj, "EEEE", { locale: es })}
                                        </span>
                                        <span className="text-xs font-medium text-stone-400">
                                            {format(dateObj, "h:mm a")}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-stone-900 mb-2 font-heading group-hover:text-purple-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-stone-600 text-sm leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
