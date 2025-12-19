import { startOfDay, addDays, parseISO, format } from 'date-fns'
import { es } from 'date-fns/locale'

// Hotel Configuration
// "Business Day" starts at 6:00 AM (for revenue purposes, early check-ins count to prev night?)
// Actually, standard hotel logic:
// Check-in: 15:00
// Check-out: 11:00
// A "Stay" for date X means sleeping on the night of date X, checking out on X+1.

export const HOTEL_TIMEZONE = 'America/Guatemala' // UTC-6

/**
 * Returns the current "Business Date" for the hotel.
 * If it's 2:00 AM on Jan 2nd, the "Business Date" is still Jan 1st (night audit hasn't happened).
 * We'll use a simple cutoff: 6:00 AM.
 * Anything before 6:00 AM belongs to the previous calendar day.
 */
export function getBusinessDate(now = new Date()): Date {
    // If we want to support timezone strictly without date-fns-tz, we rely on the server/client local time
    // assuming the deployment matches the hotel location or we accept the browser's perspective for Admin.
    // For now, we trust the input `now` but adjust for the cutoff.

    const hour = now.getHours()
    if (hour < 6) {
        return startOfDay(addDays(now, -1))
    }
    return startOfDay(now)
}

/**
 * Checks if a booking includes a specific report date.
 * A booking with check-in Jan 1 and check-out Jan 3 includes nights of: Jan 1, Jan 2.
 * It is "active" on the Business Date of Jan 1 and Jan 2.
 * On Jan 3 (Business Date), it is a check-out, so it is NOT "occupied" night, but is a "departure".
 */
export function isStayNight(businessDate: Date, checkIn: Date | string, checkOut: Date | string): boolean {
    const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn
    const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut
    const current = startOfDay(businessDate)

    // Interval is [start, end)
    // We use isWithinInterval which is inclusive [start, end], so we sub 1 second from end?
    // Or just simple comparison: start <= current < end

    return current >= startOfDay(start) && current < startOfDay(end)
}

/**
 * Formats a date for display in the reservation system
 */
export function formatBusinessDate(date: Date): string {
    return format(date, "d 'de' MMMM", { locale: es })
}

/**
 * Returns formatted range string "10 - 12 de Octubre"
 */
export function formatStayRange(checkIn: Date | string, checkOut: Date | string): string {
    const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn
    const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut

    return `${format(start, 'd', { locale: es })} - ${format(end, "d 'de' MMMM", { locale: es })}`
}

/**
 * Standardize ISO string for storage (YYYY-MM-DD) representing a business date
 */
export function toISODate(date: Date): string {
    return format(date, 'yyyy-MM-dd')
}
