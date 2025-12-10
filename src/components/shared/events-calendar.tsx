"use client"

import { CalendarDays, Music, Utensils, Zap } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"
import { cn } from "@/lib/utils"

export function EventsCalendar() {
    const { events } = useAppStore()

    // Helper to map category to Elite Pueblo UI props
    const getEventProps = (category: string) => {
        switch (category) {
            case 'food': return {
                icon: Utensils,
                style: "text-orange-600 bg-orange-100/50 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800"
            }
            case 'music': return {
                icon: Music,
                style: "text-amber-600 bg-amber-100/50 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800"
            }
            case 'social': return {
                icon: Zap,
                style: "text-yellow-600 bg-yellow-100/50 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
            }
            case 'wellness': return {
                icon: CalendarDays,
                style: "text-stone-600 bg-stone-100/50 dark:bg-stone-800/50 dark:text-stone-400 border-stone-200 dark:border-stone-700"
            }
            default: return {
                icon: CalendarDays,
                style: "text-amber-600 bg-amber-100/50 dark:bg-amber-900/20"
            }
        }
    }

    return (
        <section className="py-24 bg-stone-50 dark:bg-stone-950 relative overflow-hidden">
            {/* Simple Gradient Background */}
            <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10"
                style={{ background: 'radial-gradient(circle at 0% 0%, var(--pueblo-gradient-linear) 0%, transparent 50%)' }} />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4 font-heading tracking-tight">
                        Agenda Semanal
                    </h2>
                    <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
                        No todo es descanso. Únete a nuestras actividades y conoce viajeros de todo el mundo.
                    </p>
                </div>

                <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map((event) => {
                        const { icon: Icon, style } = getEventProps(event.category)
                        const dateObj = new Date(event.date)

                        return (
                            <StaggerItem
                                key={event.id}
                                className="group relative bg-white dark:bg-stone-900/50 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 border border-stone-100 dark:border-stone-800 hover:border-amber-500/30 dark:hover:border-amber-500/30 shadow-sm hover:shadow-[0_0_30px_-10px_rgba(217,119,6,0.15)]"
                            >
                                <div className="relative z-10">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 border", style)}>
                                        <Icon className="w-5 h-5 stroke-[1.5px]" />
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500">
                                            {format(dateObj, "EEEE", { locale: es })}
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
                                        <span className="text-[10px] font-bold tracking-[0.1em] text-stone-400 dark:text-stone-500">
                                            {format(dateObj, "h:mm a")}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2 font-heading group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed font-light">
                                        {event.description}
                                    </p>
                                </div>
                            </StaggerItem>
                        )
                    })}
                </StaggerReveal>
            </div>
        </section>
    )
}
