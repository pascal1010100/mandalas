"use client"

import type { LucideIcon } from "lucide-react"

import { StaggerItem, StaggerReveal } from "@/components/animations/stagger-reveal"

type Experience = {
    title: string
    description: string
    icon: LucideIcon
}

type ExperienceSectionProps = {
    eyebrow: string
    title: string
    description: string
    items: Experience[]
    accent: "amber" | "lime"
}

const accentStyles = {
    amber: {
        section: "bg-stone-950",
        icon: "bg-amber-500/10 text-amber-300",
        border: "hover:border-amber-400/40",
        text: "text-amber-300",
    },
    lime: {
        section: "bg-stone-950",
        icon: "bg-lime-500/10 text-lime-300",
        border: "hover:border-lime-400/40",
        text: "text-lime-300",
    },
}

export function ExperienceSection({ eyebrow, title, description, items, accent }: ExperienceSectionProps) {
    const style = accentStyles[accent]

    return (
        <section className={`py-24 ${style.section}`}>
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mb-12">
                    <p className={`text-xs uppercase tracking-[0.24em] font-semibold mb-4 ${style.text}`}>
                        {eyebrow}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-light font-heading text-white uppercase tracking-[0.16em] mb-5">
                        {title}
                    </h2>
                    <p className="text-lg text-stone-400 leading-relaxed">
                        {description}
                    </p>
                </div>

                <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {items.map((item) => (
                        <StaggerItem
                            key={item.title}
                            className={`rounded-lg border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] ${style.border}`}
                        >
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-5 ${style.icon}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-3">
                                {item.title}
                            </h3>
                            <p className="text-sm text-stone-400 leading-relaxed">
                                {item.description}
                            </p>
                        </StaggerItem>
                    ))}
                </StaggerReveal>
            </div>
        </section>
    )
}
