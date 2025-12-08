"use client"

import { cn } from "@/lib/utils"
import { FadeIn } from "@/components/animations/fade-in"

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
    backgroundGradient = "linear-gradient(to right, #4c1d95, #c026d3)", // Default gradient
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
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : backgroundGradient
                }}
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className={cn(
                "relative z-10 container mx-auto px-4",
                align === "center" ? "text-center" : "text-left"
            )}>
                <FadeIn>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tighter drop-shadow-lg">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed drop-shadow-md mx-auto">
                            {subtitle}
                        </p>
                    )}
                    {children && <div className="mt-8">{children}</div>}
                </FadeIn>
            </div>
        </div>
    )
}
