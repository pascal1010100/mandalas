"use client"

import { MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"

interface HeroProps {
    title: string
    subtitle?: string
    backgroundImage?: string
    backgroundGradient?: string
    align?: "center" | "left"
    height?: "full" | "large"
    children?: React.ReactNode
}

export function Hero({
    title,
    subtitle,
    backgroundImage,
    backgroundGradient = "var(--pueblo-gradient)", // Default to Pueblo Living Light
    align = "center",
    height = "full",
    children
}: HeroProps) {
    return (
        <div
            className={cn(
                "relative flex items-center w-full overflow-hidden bg-stone-950",
                height === "full" ? "h-screen" : "h-[70vh]"
            )}
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] scale-105"
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : backgroundGradient
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

            {/* Content */}
            <div className={cn(
                "relative z-20 container mx-auto px-4 pt-16",
                align === "center" ? "text-center" : "text-left"
            )}>
                <StaggerReveal>
                    <StaggerItem>
                        <div className={cn(
                            "mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-md",
                            align === "left" && "mx-0"
                        )}>
                            <MapPin className="h-3.5 w-3.5" />
                            San Pedro La Laguna
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-heading text-white mb-6 tracking-[0.16em] uppercase drop-shadow-2xl">
                            {title}
                        </h1>
                    </StaggerItem>
                    {subtitle && (
                        <StaggerItem>
                            <p className={cn(
                                "text-lg md:text-xl text-white/85 max-w-2xl font-light leading-relaxed tracking-wide drop-shadow-lg",
                                align === "center" ? "mx-auto" : "mx-0"
                            )}>
                                {subtitle}
                            </p>
                        </StaggerItem>
                    )}
                    {children && (
                        <StaggerItem className="mt-12">
                            {children}
                        </StaggerItem>
                    )}
                </StaggerReveal>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 hidden md:block">
                <div className="container mx-auto px-4 pb-8">
                    <div className="flex items-center justify-between border-t border-white/15 pt-5 text-xs uppercase tracking-[0.22em] text-white/65">
                        <span>Lago Atitlan</span>
                        <span>Hostal Mandalas</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
