"use client"

import { useState } from "react"
import { AlertTriangle, CalendarDays, CheckCircle2, LoaderCircle, LogIn, LogOut, Play, Users } from "lucide-react"
import type { MorningBrief } from "@/infrastructure/cloudbeds/morning-brief"

type ApiResponse = {
    success: boolean
    data?: MorningBrief
    message?: string
}

export function MorningBriefStudio() {
    const [brief, setBrief] = useState<MorningBrief | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function generate() {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/admin/cloudbeds/morning-brief", { cache: "no-store" })
            const payload = await response.json() as ApiResponse
            if (!response.ok || !payload.success || !payload.data) {
                throw new Error(payload.message || "No fue posible generar el reporte")
            }
            setBrief(payload.data)
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "No fue posible generar el reporte")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-stone-300/70 bg-white/70 dark:border-white/10 dark:bg-white/[0.025]">
            <div className="grid gap-6 bg-[#183f36] p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-200/65">Primera automatización</p>
                    <h2 className="mt-3 font-heading text-3xl font-light">Morning Brief</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
                        Una lectura en vivo de Hideout para comenzar el día con llegadas, salidas, ocupación y excepciones claras.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={generate}
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-[#183f36] transition hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-70"
                >
                    {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                    {loading ? "Consultando Cloudbeds…" : brief ? "Actualizar reporte" : "Generar reporte de hoy"}
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-3 border-t border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                    <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
                </div>
            )}

            {!brief && !error && (
                <div className="px-6 py-10 text-center text-sm text-stone-400">
                    El reporte se genera únicamente cuando tú lo solicitas. Todavía no hay envíos automáticos.
                </div>
            )}

            {brief && <BriefResult brief={brief} />}
        </section>
    )
}

function BriefResult({ brief }: { brief: MorningBrief }) {
    const generatedAt = new Intl.DateTimeFormat("es-GT", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Guatemala",
    }).format(new Date(brief.generatedAt))

    return (
        <div className="p-6 md:p-8">
            <div className="flex flex-col gap-2 border-b border-stone-200 pb-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Reporte de {brief.property}
                </div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-stone-400">Generado {generatedAt}</p>
            </div>

            <div className="grid border-b border-stone-200 py-6 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
                <Metric icon={CalendarDays} label="Ocupación" value={`${brief.occupancy.rate}%`} detail={`${brief.occupancy.occupied}/${brief.occupancy.total} unidades`} />
                <Metric icon={LogIn} label="Llegadas" value={String(brief.arrivals.length)} detail="hoy" />
                <Metric icon={LogOut} label="Salidas" value={String(brief.departures)} detail="hoy" />
                <Metric icon={Users} label="En casa" value={String(brief.inHouse)} detail="reservas" />
            </div>

            <div className="grid gap-8 pt-6 lg:grid-cols-2">
                <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Llegadas de hoy</h3>
                    {brief.arrivals.length === 0 ? (
                        <p className="mt-4 text-sm text-stone-500">No hay llegadas programadas.</p>
                    ) : (
                        <div className="mt-3 divide-y divide-stone-200 dark:divide-white/10">
                            {brief.arrivals.map((reservation) => (
                                <div key={reservation.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                                    <div><p className="font-medium">{reservation.guestName}</p><p className="mt-1 text-xs text-stone-400">{reservation.source}</p></div>
                                    <p className="text-xs text-stone-500">{reservation.roomNames.join(", ") || "Sin asignar"}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Atención requerida</h3>
                    {brief.alerts.length === 0 ? (
                        <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
                            <CheckCircle2 className="h-4 w-4 shrink-0" /> Sin excepciones críticas para hoy.
                        </div>
                    ) : (
                        <div className="mt-4 space-y-2">
                            {brief.alerts.map((alert) => (
                                <div key={alert} className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {alert}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof CalendarDays; label: string; value: string; detail: string }) {
    return (
        <div className="border-b border-stone-200 py-4 last:border-0 sm:border-r sm:px-5 sm:first:pl-0 lg:border-b-0 dark:border-white/10">
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-400"><Icon className="h-3.5 w-3.5" /> {label}</div>
            <p className="mt-3 font-heading text-3xl font-light">{value}</p>
            <p className="mt-1 text-xs text-stone-400">{detail}</p>
        </div>
    )
}
