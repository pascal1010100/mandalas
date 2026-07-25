"use client"

import Link from "next/link"
import type * as React from "react"
import { CalendarDays } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    normalizePublicProperty,
    trackBookingIntent,
    type AnalyticsSource,
} from "@/lib/analytics"
import { getBookingEngineUrl } from "@/lib/booking-engine"
import { cn } from "@/lib/utils"

type ConsultationLinkProps = React.ComponentProps<typeof Button> & {
    location?: string
    roomName?: string
    showIcon?: boolean
    href?: string
    trackingSource?: AnalyticsSource
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
    href,
    trackingSource = "consultation_link",
    children,
    className,
    ...props
}: ConsultationLinkProps) {
    const bookingEngineUrl = getBookingEngineUrl(location)
    const destination = href || bookingEngineUrl || buildInquiryHref(location, roomName)
    const useNativeAnchor = destination.startsWith("http") || destination.startsWith("#")
    const label = children ?? (
        location?.toLowerCase().includes("hideout")
            ? "Book Hideout"
            : location
                ? "Book Mandalas"
                : "Choose your stay"
    )
    const handleClick = () => {
        if (destination.startsWith("http")) {
            trackBookingIntent(normalizePublicProperty(location), trackingSource)
        }
    }

    return (
        <Button
            asChild
            className={cn(
                "rounded-full border border-white/15 bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-stone-950 shadow-none transition-colors hover:bg-stone-200 hover:text-stone-950",
                className
            )}
            {...props}
        >
            {useNativeAnchor ? (
                <a href={destination} onClick={handleClick}>
                    {showIcon && <CalendarDays className="h-4 w-4" />}
                    {label}
                </a>
            ) : (
                <Link href={destination}>
                    {showIcon && <CalendarDays className="h-4 w-4" />}
                    {label}
                </Link>
            )}
        </Button>
    )
}
