"use client"

import * as React from "react"
import { MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

type BookingLinkProps = React.ComponentProps<typeof Button> & {
    location?: string
    roomName?: string
    showIcon?: boolean
}

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50212345678").replace(/\D/g, "")

export function BookingLink({
    location,
    roomName,
    showIcon = true,
    children = "Consultar disponibilidad",
    ...props
}: BookingLinkProps) {
    const message = [
        "Hola Mandalas, quiero consultar disponibilidad",
        roomName ? `para ${roomName}` : "",
        location ? `en ${location}` : "",
    ].filter(Boolean).join(" ")

    const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    return (
        <Button asChild {...props}>
            <a href={href} target="_blank" rel="noreferrer">
                {showIcon && <MessageCircle className="h-4 w-4" />}
                {children}
            </a>
        </Button>
    )
}
