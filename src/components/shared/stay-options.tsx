"use client"

import type { LucideIcon } from "lucide-react"

import { FadeIn } from "@/components/animations/fade-in"
import { BookingLink } from "@/components/shared/booking-link"

type StayOption = {
    icon: LucideIcon
    title: string
    subtitle: string
    description: string
    details: string[]
    price: string
    roomName: string
}

type StayOptionsProps = {
    eyebrow: string
    title: string
    description: string
    location: string
    accent: "amber" | "lime"
    options: StayOption[]
}

const accentStyles = {
    amber: {
        eyebrow: "text-amber-700 dark:text-amber-300",
        icon: "text-amber-600 dark:text-amber-300",
        button: "bg-amber-600 text-white hover:bg-amber-700",
        price: "text-amber-700 dark:text-amber-300",
    },
    lime: {
        eyebrow: "text-lime-700 dark:text-lime-300",
        icon: "text-lime-600 dark:text-lime-300",
        button: "bg-lime-700 text-white hover:bg-lime-800",
        price: "text-lime-700 dark:text-lime-300",
    },
}

export function StayOptions({ eyebrow, title, description, location, accent, options }: StayOptionsProps) {
    const style = accentStyles[accent]

    return (
        <section className="bg-stone-50 py-24 dark:bg-stone-950/50">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div className="max-w-xl">
                            <p className={`mb-5 text-xs font-semibold uppercase tracking-[0.24em] ${style.eyebrow}`}>
                                {eyebrow}
                            </p>
                            <h2 className="mb-6 font-heading text-3xl font-light uppercase tracking-[0.16em] text-foreground md:text-5xl">
                                {title}
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        <div className="border-y border-border">
                            {options.map((option) => (
                                <div
                                    key={option.title}
                                    className="grid gap-6 border-b border-border py-8 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center"
                                >
                                    <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-background ${style.icon}`}>
                                            <option.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                                <h3 className="text-xl font-semibold text-foreground">
                                                    {option.title}
                                                </h3>
                                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                                    {option.subtitle}
                                                </span>
                                            </div>
                                            <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                                {option.description}
                                            </p>
                                            <div className="flex flex-wrap gap-x-5 gap-y-2">
                                                {option.details.map((detail) => (
                                                    <span key={detail} className="text-xs uppercase tracking-[0.16em] text-muted-foreground/80">
                                                        {detail}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 md:min-w-44 md:flex-col md:items-end">
                                        <div className="text-left md:text-right">
                                            <p className={`text-2xl font-semibold ${style.price}`}>
                                                {option.price}
                                            </p>
                                            <p className="text-xs text-muted-foreground">por noche</p>
                                        </div>
                                        <BookingLink
                                            location={location}
                                            roomName={option.roomName}
                                            className={`rounded-full px-6 ${style.button}`}
                                        >
                                            Preguntar
                                        </BookingLink>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
