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
    locale?: "en" | "es"
}

function getContactLocation(location?: string) {
    if (!location) return undefined
    return location.toLowerCase().includes("hideout") ? "Hideout" : "Mandalas"
}

function buildInquiryHref(location?: string, roomName?: string, locale: "en" | "es" = "en") {
    const contactPath = locale === "es" ? "/es/contacto" : "/contact"
    if (!location && !roomName) {
        return `${contactPath}#book-directly`
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

    return `${contactPath}${query ? `?${query}` : ""}#inquiry`
}

export function ConsultationLink({
    location,
    roomName,
    showIcon = true,
    href,
    trackingSource = "consultation_link",
    locale = "en",
    children,
    className,
    ...props
}: ConsultationLinkProps) {
    const bookingEngineUrl = getBookingEngineUrl(location)
    const destination = href || bookingEngineUrl || buildInquiryHref(location, roomName, locale)
    const useNativeAnchor = destination.startsWith("http") || destination.startsWith("#")
    const label = children ?? (
        location?.toLowerCase().includes("hideout")
            ? locale === "es" ? "Reservar Hideout" : "Book Hideout"
            : location
                ? locale === "es" ? "Reservar Mandalas" : "Book Mandalas"
                : locale === "es" ? "Elige tu hospedaje" : "Choose your stay"
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
