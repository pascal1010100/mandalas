import Link from "next/link"
import { Cloud, ArrowUpRight, BedDouble, CalendarCheck, LogIn, LogOut, RefreshCw, ShieldCheck } from "lucide-react"
import { getCloudbedsOverview, type CloudbedsReservationPreview } from "@/infrastructure/cloudbeds/overview"

export const dynamic = "force-dynamic"

const dateFormatter = new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
})

function shortDate(value: string): string {
    const [year, month, day] = value.split("-").map(Number)
    return dateFormatter.format(new Date(year, month - 1, day))
}

function reservationRoom(reservation: CloudbedsReservationPreview): string {
    if (reservation.roomNames.length > 0) return reservation.roomNames.join(", ")
    if (reservation.roomTypeNames.length > 0) return reservation.roomTypeNames.join(", ")
    return "Sin asignar"
}

export default async function CloudbedsDashboardPage() {
    let overview
    try {
        overview = await getCloudbedsOverview("hideout")
    } catch (error) {
        const message = error instanceof Error ? error.message : "No fue posible consultar Cloudbeds"
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 dark:border-rose-500/20 dark:bg-rose-500/10">
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">Cloudbeds no disponible</p>
                <h1 className="mt-3 font-heading text-3xl text-stone-900 dark:text-white">No pudimos cargar Hideout</h1>
                <p className="mt-3 text-sm text-stone-600 dark:text-stone-300">{message}</p>
            </div>
        )
    }

    const syncedAt = new Intl.DateTimeFormat("es-GT", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(overview.syncedAt))

    return (
            <div className="space-y-8">
                <header className="flex flex-col gap-5 border-b border-stone-200 pb-8 dark:border-white/10 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-400">
                            <Cloud className="h-3.5 w-3.5" /> Cloudbeds · Solo lectura
                        </div>
                        <h1 className="font-heading text-4xl font-light tracking-tight text-stone-950 dark:text-white md:text-5xl">
                            Hideout, hoy
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                            Una vista compacta de la operación. Cloudbeds continúa siendo la fuente oficial.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Conectado
                        </span>
                        <Link href="/admin/cloudbeds" className="inline-flex h-9 items-center gap-2 rounded-full border border-stone-200 px-4 text-xs font-medium text-stone-600 transition hover:bg-stone-100 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/5">
                            <RefreshCw className="h-3.5 w-3.5" /> Actualizar
                        </Link>
                    </div>
                </header>

                <section className="grid gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
                    <Metric label="Ocupación hoy" value={`${overview.occupancyRate}%`} detail={`${overview.occupiedUnits} de ${overview.totalUnits} unidades`} icon={BedDouble} />
                    <Metric label="En casa" value={String(overview.inHouse)} detail="reservas activas" icon={CalendarCheck} />
                    <Metric label="Llegadas" value={String(overview.arrivalsToday)} detail="para hoy" icon={LogIn} />
                    <Metric label="Salidas" value={String(overview.departuresToday)} detail="para hoy" icon={LogOut} />
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
                    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-white/10 dark:bg-stone-900/50">
                        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5 dark:border-white/10">
                            <div>
                                <h2 className="font-heading text-xl font-medium text-stone-900 dark:text-white">Próximas llegadas</h2>
                                <p className="mt-1 text-xs text-stone-400">Hasta 10 reservas confirmadas</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-stone-300" />
                        </div>
                        {overview.upcoming.length > 0 ? (
                            <div className="divide-y divide-stone-100 dark:divide-white/10">
                                {overview.upcoming.map((reservation) => (
                                    <div key={reservation.id} className="grid gap-3 px-6 py-4 transition hover:bg-stone-50 dark:hover:bg-white/[0.025] md:grid-cols-[1fr_auto_auto] md:items-center">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-100">{reservation.guestName}</p>
                                            <p className="mt-1 truncate text-xs text-stone-400">{reservationRoom(reservation)} · {reservation.source}</p>
                                        </div>
                                        <p className="text-xs font-medium text-stone-600 dark:text-stone-300">{shortDate(reservation.startDate)} → {shortDate(reservation.endDate)}</p>
                                        <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                            {reservation.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="px-6 py-12 text-center text-sm text-stone-400">No hay próximas llegadas en el período.</p>
                        )}
                    </section>

                    <aside className="rounded-2xl border border-stone-200 bg-stone-950 p-6 text-white dark:border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">Inventario</p>
                                <h2 className="mt-2 font-heading text-2xl font-light">{overview.totalUnits} unidades</h2>
                            </div>
                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="mt-7 space-y-4">
                            {overview.roomTypes.map((roomType) => (
                                <div key={roomType.id} className="flex items-center justify-between border-b border-white/10 pb-3 text-sm last:border-0">
                                    <span className="text-white/65">{roomType.name}</span>
                                    <span className="font-medium text-white">{roomType.units}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.18em] text-white/30">
                            Sincronizado a las {syncedAt}
                        </div>
                    </aside>
                </div>
            </div>
    )
}

function Metric({ label, value, detail, icon: Icon }: {
    label: string
    value: string
    detail: string
    icon: typeof BedDouble
}) {
    return (
        <article className="bg-white p-6 dark:bg-stone-900/70">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">{label}</p>
                    <p className="mt-3 font-heading text-4xl font-light text-stone-950 dark:text-white">{value}</p>
                    <p className="mt-2 text-xs text-stone-400">{detail}</p>
                </div>
                <div className="rounded-full bg-stone-100 p-2.5 text-stone-500 dark:bg-white/5 dark:text-stone-300">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
        </article>
    )
}
