"use client"

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
                "relative flex items-center w-full overflow-hidden",
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
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

            {/* Content */}
            <div className={cn(
                "relative z-20 container mx-auto px-4",
                align === "center" ? "text-center" : "text-left"
            )}>
                <StaggerReveal>
                    <StaggerItem>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light font-heading text-white mb-6 tracking-[0.2em] uppercase drop-shadow-2xl">
                            {title}
                        </h1>
                    </StaggerItem>
                    {subtitle && (
                        <StaggerItem>
                            <p className="text-lg md:text-xl text-white/80 max-w-2xl font-light leading-relaxed tracking-wide drop-shadow-lg mx-auto">
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
        </div>
    )
}
