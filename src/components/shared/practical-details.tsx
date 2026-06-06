"use client"

import type { LucideIcon } from "lucide-react"

import { FadeIn } from "@/components/animations/fade-in"

type Detail = {
    icon: LucideIcon
    title: string
    description: string
}

type PracticalDetailsProps = {
    eyebrow: string
    title: string
    description: string
    details: Detail[]
    accent: "amber" | "lime"
}

const accentStyles = {
    amber: {
        text: "text-amber-300",
        icon: "text-amber-300",
        line: "bg-amber-500/30",
    },
    lime: {
        text: "text-lime-300",
        icon: "text-lime-300",
        line: "bg-lime-500/30",
    },
}

export function PracticalDetails({ eyebrow, title, description, details, accent }: PracticalDetailsProps) {
    const style = accentStyles[accent]

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div className="max-w-xl">
                            <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.24em] ${style.text}`}>
                                {eyebrow}
                            </p>
                            <h2 className="mb-5 font-heading text-3xl font-light uppercase tracking-[0.16em] text-foreground md:text-4xl">
                                {title}
                            </h2>
                            <div className={`mb-6 h-px w-20 ${style.line}`} />
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
                            {details.map((detail) => (
                                <div key={detail.title} className="border-t border-white/10 pt-5">
                                    <detail.icon className={`mb-4 h-5 w-5 stroke-[1.8px] ${style.icon}`} />
                                    <h3 className="mb-2 text-base font-semibold text-foreground">
                                        {detail.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {detail.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
