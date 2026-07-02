"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Cloud, LoaderCircle, Radio, RefreshCw, Send } from "lucide-react"

type RealtimeStatus = {
    receiverConfigured: boolean
    channelConfigured: boolean
    publicUrlConfigured: boolean
    ready: boolean
}

type StatusResponse = {
    success: boolean
    data?: RealtimeStatus
    message?: string
}

export function RealtimeRadar() {
    const [status, setStatus] = useState<RealtimeStatus | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const loadStatus = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/admin/cloudbeds/realtime-status", { cache: "no-store" })
            const payload = await response.json() as StatusResponse
            if (!response.ok || !payload.success || !payload.data) {
                throw new Error(payload.message || "No fue posible revisar la automatización")
            }
            setStatus(payload.data)
            setError(null)
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "No fue posible revisar la automatización")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadStatus()
    }, [loadStatus])

    return (
        <section className="overflow-hidden rounded-2xl border border-stone-300/70 bg-[#171815] text-white dark:border-white/10">
            <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-300/60">
                        <Radio className="h-3.5 w-3.5" /> Tiempo real sin base de datos
                    </p>
                    <h2 className="mt-3 font-heading text-3xl font-light">Cloudbeds → alerta inmediata</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
                        Cada cambio se valida, se convierte en una regla operativa y se envía. No guardamos reservas ni datos del huésped.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${status?.ready ? "animate-pulse bg-emerald-400" : "bg-amber-400"}`} />
                    <span className="text-xs text-white/55">{status?.ready ? "Automatización activa" : "Configuración pendiente"}</span>
                    <button type="button" onClick={() => void loadStatus()} aria-label="Actualizar estado" className="rounded-full bg-white/5 p-2 text-white/50 transition hover:bg-white/10 hover:text-white">
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {error ? (
                <div className="flex items-center gap-3 p-6 text-sm text-rose-200"><AlertTriangle className="h-4 w-4" /> {error}</div>
            ) : loading || !status ? (
                <div className="flex items-center gap-3 p-6 text-sm text-white/40"><LoaderCircle className="h-4 w-4 animate-spin" /> Revisando configuración…</div>
            ) : (
                <div className="grid md:grid-cols-3">
                    <StatusStep icon={Radio} label="Receptor protegido" detail="Secreto independiente" complete={status.receiverConfigured} />
                    <StatusStep icon={Cloud} label="URL pública" detail="Despliegue HTTPS" complete={status.publicUrlConfigured} />
                    <StatusStep icon={Send} label="Canal Telegram" detail="Bot y conversación" complete={status.channelConfigured} />
                </div>
            )}

            <div className="border-t border-white/10 px-6 py-4 text-xs text-white/30">
                Sin historial local · Cloudbeds continúa siendo la fuente de verdad · Los duplicados se reducen temporalmente en memoria
            </div>
        </section>
    )
}

function StatusStep({ icon: Icon, label, detail, complete }: {
    icon: typeof Radio
    label: string
    detail: string
    complete: boolean
}) {
    return (
        <div className="flex items-start gap-3 border-b border-white/10 p-6 last:border-0 md:border-b-0 md:border-r">
            <div className={`rounded-full p-2 ${complete ? "bg-emerald-400/10 text-emerald-300" : "bg-white/5 text-white/30"}`}>
                {complete ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            </div>
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-1 text-xs text-white/35">{complete ? "Configurado" : detail}</p>
            </div>
        </div>
    )
}
