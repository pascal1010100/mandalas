"use client"

import { MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { BookingLink } from "@/components/shared/booking-link"

export function MobileCTA() {
    const pathname = usePathname()

    if (pathname === "/") return null

    const location = pathname.includes("/hideout")
        ? "Mandalas Hideout"
        : pathname.includes("/pueblo")
            ? "Mandalas"
            : "Mandalas Hostal"

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/85 backdrop-blur-md border-t border-stone-200 z-50 md:hidden">
            <BookingLink
                location={location}
                showIcon={false}
                className="w-full rounded-full text-base h-12 shadow-lg gap-2 font-bold animate-in slide-in-from-bottom duration-500"
            >
                <MessageCircle className="w-5 h-5" />
                Consultar por WhatsApp
            </BookingLink>
        </div>
    )
}
