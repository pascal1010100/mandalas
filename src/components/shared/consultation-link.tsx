import Link from "next/link"
import type * as React from "react"
import { CalendarDays } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getBookingEngineUrl } from "@/lib/booking-engine"
import { cn } from "@/lib/utils"

type ConsultationLinkProps = React.ComponentProps<typeof Button> & {
    location?: string
    roomName?: string
    showIcon?: boolean
}

function getContactLocation(location?: string) {
    if (!location) return undefined
    return location.toLowerCase().includes("hideout") ? "Hideout" : "Mandalas"
}

function buildInquiryHref(location?: string, roomName?: string) {
    if (!location && !roomName) {
        return "/contact#book-directly"
    }

    const params = new URLSearchParams()
    const contactLocation = getContactLocation(location)

    if (contactLocation) {
        params.set("location", contactLocation)
    }

    if (roomName) {
        params.set("room", roomName)
    }

    const query = params.toString()

    return `/contact${query ? `?${query}` : ""}#inquiry`
}

export function ConsultationLink({
    location,
    roomName,
    showIcon = true,
    children = "Book now",
    className,
    ...props
}: ConsultationLinkProps) {
    const bookingEngineUrl = getBookingEngineUrl(location)

    return (
        <Button
            asChild
            className={cn(
                "rounded-full border border-white/15 bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-stone-950 shadow-none transition-colors hover:bg-stone-200 hover:text-stone-950",
                className
            )}
            {...props}
        >
            {bookingEngineUrl ? (
                <a href={bookingEngineUrl}>
                    {showIcon && <CalendarDays className="h-4 w-4" />}
                    {children}
                </a>
            ) : (
                <Link href={buildInquiryHref(location, roomName)}>
                    {showIcon && <CalendarDays className="h-4 w-4" />}
                    {children}
                </Link>
            )}
        </Button>
    )
}
