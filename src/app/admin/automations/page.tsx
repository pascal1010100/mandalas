import { BellRing, Bot, CalendarClock, Clock3, MessageCircle, ShieldAlert, Zap } from "lucide-react"
import { MorningBriefStudio } from "./morning-brief-studio"
import { RealtimeRadar } from "./realtime-radar"

const automations = [
    {
        icon: BellRing,
        title: "Reserva de último minuto",
        description: "Alerta cuando Cloudbeds recibe una reserva con llegada para el mismo día.",
        trigger: "Al crear una reserva",
        state: "Propuesta",
    },
    {
        icon: ShieldAlert,
        title: "Habitación sin asignar",
        description: "Detecta reservas próximas que todavía no tienen una unidad física asignada.",
        trigger: "24 horas antes de llegada",
        state: "Propuesta",
    },
]

export default function AutomationsPage() {
    return (
        <div className="space-y-8">
            <header className="border-b border-stone-300/70 pb-8 dark:border-white/10">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
                    <Bot className="h-3.5 w-3.5" /> Automation Studio
                </p>
                <h1 className="mt-4 font-heading text-4xl font-light tracking-tight text-stone-950 dark:text-white md:text-5xl">Automatizaciones</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                    Reglas pequeñas y claras que convierten eventos de Cloudbeds en acciones útiles para el equipo.
                </p>
            </header>

            <MorningBriefStudio />

            <RealtimeRadar />

            <section>
                <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                    <CalendarClock className="h-3.5 w-3.5" /> Siguientes automatizaciones
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                {automations.map((automation) => {
                    const Icon = automation.icon
                    return (
                        <article key={automation.title} className="flex min-h-72 flex-col rounded-2xl border border-stone-300/70 bg-white/70 p-6 dark:border-white/10 dark:bg-white/[0.025]">
                            <div className="flex items-center justify-between">
                                <div className="rounded-full bg-stone-100 p-3 dark:bg-white/5"><Icon className="h-5 w-5 text-stone-500 dark:text-stone-300" /></div>
                                <span className="rounded-full bg-stone-200/70 px-2.5 py-1 text-[9px] uppercase tracking-wider text-stone-500 dark:bg-white/5">{automation.state}</span>
                            </div>
                            <h2 className="mt-8 font-heading text-2xl font-light">{automation.title}</h2>
                            <p className="mt-3 text-sm leading-relaxed text-stone-500 dark:text-stone-400">{automation.description}</p>
                            <div className="mt-auto flex items-center gap-2 border-t border-stone-200 pt-4 text-[10px] uppercase tracking-[0.14em] text-stone-400 dark:border-white/10">
                                <Clock3 className="h-3.5 w-3.5" /> {automation.trigger}
                            </div>
                        </article>
                    )
                })}
                </div>
            </section>

            <section className="grid gap-5 rounded-2xl bg-[#171815] p-6 text-white md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex items-start gap-4">
                    <div className="rounded-full bg-white/5 p-3"><MessageCircle className="h-5 w-5 text-emerald-300" /></div>
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">Canal de entrega</p>
                        <h2 className="mt-2 font-heading text-2xl font-light">Todavía no configurado</h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/45">Antes de activar el Morning Brief elegiremos WhatsApp, Telegram o correo y definiremos quién debe recibirlo.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/35"><Zap className="h-4 w-4" /> Sin envíos activos</div>
            </section>
        </div>
    )
}
