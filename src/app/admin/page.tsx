import Link from "next/link"
import { Suspense } from "react"
import { ArrowRight, Bot, CalendarClock, Cloud, LogIn, LogOut, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { getCloudbedsOverview, type CloudbedsOverview } from "@/infrastructure/cloudbeds/overview"

export const dynamic = "force-dynamic"

export default function AdminHomePage() {
    return (
        <div className="space-y-8">
            <header className="grid gap-6 border-b border-stone-300/70 pb-8 lg:grid-cols-[1fr_auto] lg:items-end dark:border-white/10">
                <div>
                    <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
                        <Sparkles className="h-3.5 w-3.5" /> Centro operativo
                    </p>
                    <h1 className="mt-4 max-w-3xl font-heading text-4xl font-light leading-tight tracking-tight text-stone-950 dark:text-white md:text-5xl">
                        Datos que trabajan antes de que alguien tenga que preguntar.
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                        Mandalas usa Cloudbeds como PMS. Este espacio conecta ambas propiedades y convierte sus datos en alertas y resúmenes útiles.
                    </p>
                </div>
                <Link href="/admin/cloudbeds" className="inline-flex h-10 items-center gap-2 rounded-full bg-stone-950 px-5 text-xs font-medium text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950">
                    Ver datos en vivo <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </header>

            <Suspense fallback={<LiveSummarySkeleton />}>
                <LiveSummaryData />
            </Suspense>

            <section className="grid gap-5 lg:grid-cols-3">
                <AutomationCard
                    icon={CalendarClock}
                    eyebrow="Primera automatización"
                    title="Morning Brief"
                    description="Un resumen diario de ocupación, llegadas, salidas y reservas que requieren atención."
                    status="Por configurar"
                    featured
                />
                <AutomationCard
                    icon={Zap}
                    eyebrow="Alerta"
                    title="Reserva de último minuto"
                    description="Aviso inmediato cuando entra una reserva para el mismo día."
                    status="Próxima"
                />
                <AutomationCard
                    icon={Bot}
                    eyebrow="Control"
                    title="Habitación sin asignar"
                    description="Detecta reservas sin unidad asignada antes de la llegada."
                    status="Próxima"
                />
            </section>

            <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-2xl border border-stone-300/70 bg-white/70 p-6 dark:border-white/10 dark:bg-white/[0.025]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-400">Fuentes de datos</p>
                            <h2 className="mt-2 font-heading text-2xl font-light">Propiedades</h2>
                        </div>
                        <Cloud className="h-5 w-5 text-stone-300" />
                    </div>
                    <div className="mt-6 divide-y divide-stone-200 dark:divide-white/10">
                        <PropertyRow name="Mandalas Hideout" detail="Cloudbeds · lectura configurada" active />
                        <PropertyRow name="Mandalas" detail="Esperando acceso a la cuenta" />
                    </div>
                </div>

                <div className="rounded-2xl border border-stone-300/70 bg-[#e9e4d8] p-6 dark:border-white/10 dark:bg-stone-900">
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-white/70 p-3 dark:bg-white/5"><ShieldCheck className="h-5 w-5 text-stone-700 dark:text-stone-200" /></div>
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-500">Principio del sistema</p>
                            <h2 className="mt-2 font-heading text-2xl font-light">Cloudbeds sigue al mando.</h2>
                            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                Esta plataforma observa y automatiza. No duplica el trabajo del PMS ni modifica reservas sin una decisión explícita.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

async function LiveSummaryData() {
    let overview: CloudbedsOverview | null = null
    let errorMessage: string | null = null
    try {
        overview = await getCloudbedsOverview("hideout")
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : "No fue posible consultar Cloudbeds"
    }

    if (!overview) return <ConnectionError message={errorMessage || "Cloudbeds no disponible"} />
    const syncedAt = new Intl.DateTimeFormat("es-GT", { hour: "2-digit", minute: "2-digit" }).format(new Date(overview.syncedAt))
    return <LiveSummary overview={overview} syncedAt={syncedAt} />
}

function LiveSummarySkeleton() {
    return (
        <section className="overflow-hidden rounded-2xl border border-stone-300/70 bg-white/70 dark:border-white/10 dark:bg-white/[0.025]">
            <div className="flex items-center gap-2 border-b border-stone-200 px-6 py-5 text-xs text-stone-500 dark:border-white/10">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" /> Consultando Cloudbeds…
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="h-36 animate-pulse border-b border-stone-200 bg-stone-100/60 p-6 sm:border-r lg:border-b-0 dark:border-white/10 dark:bg-white/[0.025]" />
                ))}
            </div>
        </section>
    )
}

function LiveSummary({ overview, syncedAt }: { overview: CloudbedsOverview; syncedAt: string }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-stone-300/70 bg-white/70 dark:border-white/10 dark:bg-white/[0.025]">
            <div className="flex flex-col gap-2 border-b border-stone-200 px-6 py-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Hideout está conectado
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">Última lectura {syncedAt}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                <TodayMetric icon={Cloud} label="Ocupación" value={`${overview.occupancyRate}%`} detail={`${overview.occupiedUnits}/${overview.totalUnits} unidades`} />
                <TodayMetric icon={LogIn} label="Llegadas" value={String(overview.arrivalsToday)} detail="hoy" />
                <TodayMetric icon={LogOut} label="Salidas" value={String(overview.departuresToday)} detail="hoy" />
                <TodayMetric icon={CalendarClock} label="Próximas" value={String(overview.upcoming.length)} detail="reservas visibles" />
            </div>
        </section>
    )
}

function TodayMetric({ icon: Icon, label, value, detail }: { icon: typeof Cloud; label: string; value: string; detail: string }) {
    return (
        <article className="border-b border-stone-200 p-6 last:border-0 sm:border-r lg:border-b-0 dark:border-white/10">
            <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-400">{label}</p>
                <Icon className="h-4 w-4 text-stone-300" />
            </div>
            <p className="mt-4 font-heading text-4xl font-light text-stone-950 dark:text-white">{value}</p>
            <p className="mt-2 text-xs text-stone-400">{detail}</p>
        </article>
    )
}

function AutomationCard({ icon: Icon, eyebrow, title, description, status, featured = false }: {
    icon: typeof Zap
    eyebrow: string
    title: string
    description: string
    status: string
    featured?: boolean
}) {
    return (
        <article className={featured ? "rounded-2xl bg-[#183f36] p-6 text-white" : "rounded-2xl border border-stone-300/70 bg-white/60 p-6 dark:border-white/10 dark:bg-white/[0.025]"}>
            <div className="flex items-start justify-between">
                <Icon className={featured ? "h-5 w-5 text-emerald-200" : "h-5 w-5 text-stone-400"} />
                <span className={featured ? "rounded-full bg-white/10 px-2.5 py-1 text-[9px] uppercase tracking-wider text-white/65" : "rounded-full bg-stone-200/70 px-2.5 py-1 text-[9px] uppercase tracking-wider text-stone-500 dark:bg-white/5"}>{status}</span>
            </div>
            <p className={featured ? "mt-8 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-200/60" : "mt-8 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-400"}>{eyebrow}</p>
            <h3 className="mt-2 font-heading text-2xl font-light">{title}</h3>
            <p className={featured ? "mt-3 text-sm leading-relaxed text-white/60" : "mt-3 text-sm leading-relaxed text-stone-500 dark:text-stone-400"}>{description}</p>
        </article>
    )
}

function PropertyRow({ name, detail, active = false }: { name: string; detail: string; active?: boolean }) {
    return (
        <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="mt-1 text-xs text-stone-400">{detail}</p>
            </div>
            <span className={active ? "text-xs text-emerald-700 dark:text-emerald-300" : "text-xs text-stone-400"}>{active ? "Activa" : "Pendiente"}</span>
        </div>
    )
}

function ConnectionError({ message }: { message: string }) {
    return (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-500/20 dark:bg-rose-500/10">
            <p className="text-sm font-medium text-rose-800 dark:text-rose-200">Cloudbeds no respondió</p>
            <p className="mt-2 text-xs text-rose-600 dark:text-rose-300">{message}</p>
        </section>
    )
}
