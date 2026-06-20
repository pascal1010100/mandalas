"use client"

import { MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"

interface HeroProps {
    title: string
    subtitle?: string
    backgroundImage?: string
    backgroundGradient?: string
    backgroundPosition?: string
    align?: "center" | "left"
    height?: "full" | "large"
    children?: React.ReactNode
}

export function Hero({
    title,
    subtitle,
    backgroundImage,
    backgroundGradient = "var(--pueblo-gradient)", // Default to Pueblo Living Light
    backgroundPosition = "center",
    align = "center",
    height = "full",
    children
}: HeroProps) {
    return (
        <div
            className={cn(
                "relative flex w-full items-center overflow-hidden bg-stone-950",
                height === "full"
                    ? "min-h-[100svh] py-28 md:min-h-screen md:py-32"
                    : "min-h-[72svh] py-24 md:min-h-[70vh] md:py-28"
            )}
        >
            {/* Background */}
            <div
                className="absolute inset-0 scale-105 bg-cover transition-transform duration-[1.5s]"
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : backgroundGradient,
                    backgroundPosition
                }}
            />
            {/* Cinematic Noise & Overlay */}
            <div
                className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIxIi8+PC9zdmc+")`
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/75" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.72)_100%)]" />
            {align === "left" && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/38 to-transparent" />
            )}

            {/* Content */}
            <div className={cn(
                "container relative z-20 mx-auto px-4 pt-10 md:pt-16",
                align === "center" ? "text-center" : "text-left"
            )}>
                <StaggerReveal>
                    <StaggerItem>
                        <div className={cn(
                            "mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md sm:px-4 sm:text-[11px] sm:tracking-[0.24em] md:mb-7",
                            align === "left" && "mx-0"
                        )}>
                            <MapPin className="h-3.5 w-3.5" />
                            San Pedro La Laguna
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <h1 className={cn(
                            "mb-6 max-w-[21rem] break-words font-heading text-[2.35rem] font-light uppercase leading-[0.98] tracking-[0.06em] text-white drop-shadow-2xl [text-wrap:balance] sm:max-w-5xl sm:text-6xl sm:tracking-[0.1em] md:text-7xl md:tracking-[0.14em] lg:text-8xl lg:tracking-[0.16em]",
                            align === "center" ? "mx-auto" : "mx-0"
                        )}>
                            {title}
                        </h1>
                    </StaggerItem>
                    {subtitle && (
                        <StaggerItem>
                            <p className={cn(
                                "max-w-[20rem] text-base font-light leading-relaxed tracking-wide text-white/85 drop-shadow-lg [text-wrap:balance] sm:max-w-2xl sm:text-lg md:text-xl",
                                align === "center" ? "mx-auto" : "mx-0"
                            )}>
                                {subtitle}
                            </p>
                        </StaggerItem>
                    )}
                    {children && (
                        <StaggerItem className="mt-8 md:mt-12">
                            {children}
                        </StaggerItem>
                    )}
                </StaggerReveal>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 hidden md:block">
                <div className="container mx-auto px-4 pb-8">
                    <div className="flex items-center justify-between border-t border-white/15 pt-5 text-xs uppercase tracking-[0.22em] text-white/65">
                        <span>Lake Atitlan</span>
                        <span>Hostal Mandalas</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
