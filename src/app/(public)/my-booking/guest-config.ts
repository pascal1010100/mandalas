import type { BookingRow } from "@/domains/bookings/types/types"

export const LOCATION_ASSETS = {
    pueblo: {
        bg: "/images/mandalas/pueblo-dock-boat.jpg",
        color: "amber",
        gradient: "from-amber-600 to-orange-600",
        mapUrl: "https://goo.gl/maps/examplePueblo",
        wifiSSID: "Mandalas_Pueblo",
        wifiPass: "mandala123",
        breakfastTime: "8:00 AM - 10:00 AM",
        breakfastLoc: "Cocina Principal",
    },
    hideout: {
        bg: "/images/mandalas/volcan-san-pedro-panorama.jpg",
        color: "lime",
        gradient: "from-lime-600 to-green-600",
        mapUrl: "https://goo.gl/maps/exampleHideout",
        wifiSSID: "Mandalas_Hideout",
        wifiPass: "hideout2025",
        breakfastTime: "8:30 AM - 10:30 AM",
        breakfastLoc: "Terraza del Lago",
    },
} as const

export type GuestLocationKey = keyof typeof LOCATION_ASSETS

export function getGuestLocationKey(location?: string | null): GuestLocationKey {
    return location === "hideout" ? "hideout" : "pueblo"
}

export function getGuestGreeting(date = new Date()) {
    const hour = date.getHours()
    if (hour < 12) return "Buenos dias"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
}

export function getBookingProgressStep(booking: BookingRow | null) {
    if (!booking) return 0
    if (booking.status === "checked_out") return 4
    if (booking.status === "checked_in") return 3
    if (booking.payment_status === "paid") return 2
    return 1
}
