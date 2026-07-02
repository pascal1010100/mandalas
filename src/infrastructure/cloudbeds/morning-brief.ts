import { getCloudbedsOverview, type CloudbedsReservationPreview } from "./overview"

export type MorningBrief = {
    property: "Mandalas Hideout"
    date: string
    generatedAt: string
    occupancy: {
        rate: number
        occupied: number
        total: number
    }
    arrivals: CloudbedsReservationPreview[]
    departures: number
    inHouse: number
    upcoming: CloudbedsReservationPreview[]
    alerts: string[]
}

function dateInGuatemala(date: Date): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Guatemala",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date)
}

function addDays(date: string, days: number): string {
    const value = new Date(`${date}T12:00:00Z`)
    value.setUTCDate(value.getUTCDate() + days)
    return value.toISOString().slice(0, 10)
}

export async function generateMorningBrief(now = new Date()): Promise<MorningBrief> {
    const overview = await getCloudbedsOverview("hideout", now)
    const today = dateInGuatemala(now)
    const tomorrow = addDays(today, 1)
    const arrivals = overview.upcoming.filter((reservation) => reservation.startDate === today)
    const unassigned = overview.upcoming.filter((reservation) =>
        reservation.startDate <= tomorrow && reservation.roomNames.length === 0)

    const alerts: string[] = []
    if (unassigned.length > 0) {
        alerts.push(`${unassigned.length} reserva${unassigned.length === 1 ? "" : "s"} con llegada próxima sin habitación asignada.`)
    }
    if (overview.totalUnits === 0) {
        alerts.push("Cloudbeds no devolvió unidades físicas para la propiedad.")
    }

    return {
        property: "Mandalas Hideout",
        date: today,
        generatedAt: now.toISOString(),
        occupancy: {
            rate: overview.occupancyRate,
            occupied: overview.occupiedUnits,
            total: overview.totalUnits,
        },
        arrivals,
        departures: overview.departuresToday,
        inHouse: overview.inHouse,
        upcoming: overview.upcoming.slice(0, 5),
        alerts,
    }
}
