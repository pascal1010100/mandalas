import type { CloudbedsWebhookEvent } from "./webhook-event"

export type CloudbedsAlert = {
    priority: "info" | "attention" | "urgent"
    title: string
    message: string
}

function dateInGuatemala(date: Date): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Guatemala",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date)
}

function reservationLine(event: CloudbedsWebhookEvent): string {
    return event.reservationId ? `Reserva: ${event.reservationId}` : "Reserva sin identificador"
}

export function buildCloudbedsAlert(event: CloudbedsWebhookEvent, now = new Date()): CloudbedsAlert {
    const today = dateInGuatemala(now)
    const isToday = event.details.startDate === today
    const stay = event.details.startDate
        ? `Estadía: ${event.details.startDate}${event.details.endDate ? ` → ${event.details.endDate}` : ""}`
        : null
    const details = [reservationLine(event), stay].filter(Boolean).join("\n")

    switch (event.eventName) {
        case "reservation/created":
            return {
                priority: isToday ? "urgent" : "info",
                title: isToday ? "Reserva nueva para hoy" : "Nueva reserva",
                message: `${details}\nRevisar la nueva reserva en Cloudbeds.`,
            }
        case "reservation/status_changed": {
            const status = String(event.details.status || "desconocido")
            return {
                priority: status === "canceled" || status === "cancelled" ? "attention" : "info",
                title: status === "canceled" || status === "cancelled" ? "Reserva cancelada" : "Estado de reserva modificado",
                message: `${reservationLine(event)}\nNuevo estado: ${status}\nVerificar el cambio en Cloudbeds.`,
            }
        }
        case "reservation/dates_changed":
            return {
                priority: "attention",
                title: "Fechas de reserva modificadas",
                message: `${details}\nConfirmar que la operación esté preparada para las nuevas fechas.`,
            }
        case "reservation/accommodation_removed":
            return {
                priority: "urgent",
                title: "Habitación removida de una reserva",
                message: `${reservationLine(event)}\nRevisar la asignación de habitación en Cloudbeds.`,
            }
        case "reservation/accommodation_changed":
        case "reservation/accommodation_type_changed":
            return {
                priority: "attention",
                title: "Asignación de habitación modificada",
                message: `${reservationLine(event)}\nRevisar la nueva asignación en Cloudbeds.`,
            }
        case "reservation/accommodation_status_changed":
            return {
                priority: "info",
                title: "Estado de habitación modificado",
                message: `${reservationLine(event)}\nEstado: ${event.details.status || "actualizado"}.`,
            }
        case "reservation/deleted":
            return {
                priority: "urgent",
                title: "Reserva eliminada",
                message: `${reservationLine(event)}\nConfirmar que el cambio sea correcto en Cloudbeds.`,
            }
        default:
            return {
                priority: "info",
                title: "Cambio recibido desde Cloudbeds",
                message: reservationLine(event),
            }
    }
}

function alertIcon(priority: CloudbedsAlert["priority"]): string {
    if (priority === "urgent") return "🚨"
    if (priority === "attention") return "⚠️"
    return "🟢"
}

export async function sendCloudbedsAlert(
    alert: CloudbedsAlert,
    fetcher: typeof fetch = fetch,
): Promise<void> {
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim()
    if (!token || !chatId) throw new Error("Telegram alert channel is not configured")

    const text = `${alertIcon(alert.priority)} Mandalas Hideout · ${alert.title}\n\n${alert.message}`
    let response: Response
    try {
        response = await fetcher(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                disable_web_page_preview: true,
            }),
        })
    } catch {
        throw new Error("Telegram could not be reached")
    }

    if (!response.ok) throw new Error(`Telegram rejected the alert with status ${response.status}`)
    const result = await response.json().catch(() => null) as { ok?: boolean } | null
    if (!result?.ok) throw new Error("Telegram returned an unsuccessful response")
}
