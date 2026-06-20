"use client"

import { usePathname } from "next/navigation"
import { ConsultationLink } from "@/components/shared/consultation-link"

export function MobileCTA() {
    const pathname = usePathname()

    if (pathname === "/") return null

    const location = pathname.includes("/hideout")
        ? "Mandalas Hideout"
        : pathname.includes("/pueblo")
            ? "Mandalas"
            : "Mandalas Hostal"

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-stone-950/88 p-4 backdrop-blur-xl md:hidden">
            <ConsultationLink
                location={location}
                showIcon={false}
                className="h-12 w-full animate-in border-white/20 bg-white text-stone-950 duration-500 slide-in-from-bottom hover:bg-stone-200 gap-2"
            >
                Check dates
            </ConsultationLink>
        </div>
    )
}
