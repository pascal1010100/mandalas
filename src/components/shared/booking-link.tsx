"use client"

import * as React from "react"
import { MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { buildContactHref } from "@/lib/public-contact"

type BookingLinkProps = React.ComponentProps<typeof Button> & {
    location?: string
    roomName?: string
    showIcon?: boolean
}

export function BookingLink({
    location,
    roomName,
    showIcon = true,
    children = "Consultar disponibilidad",
    className,
    ...props
}: BookingLinkProps) {
    const message = [
        "Hola Mandalas, quiero consultar disponibilidad",
        roomName ? `para ${roomName}` : "",
        location ? `en ${location}` : "",
    ].filter(Boolean).join(" ")

    const href = buildContactHref(message)

    return (
        <Button
            asChild
            className={cn(
                "rounded-full border border-white/15 bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-stone-950 shadow-none transition-colors hover:bg-stone-200 hover:text-stone-950",
                "bg-white/95 hover:bg-white",
                className
            )}
            {...props}
        >
            <a href={href} target="_blank" rel="noreferrer">
                {showIcon && <MessageCircle className="h-4 w-4" />}
                {children}
            </a>
        </Button>
    )
}
