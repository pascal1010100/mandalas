"use client"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"
import { Waves, Cloud, Moon, Sprout, BedDouble, DoorClosed, ShieldCheck, MapPin, Bike, Utensils, Clock, Luggage, Wifi, Instagram } from "lucide-react"
import { ConsultationLink } from "@/components/shared/consultation-link"
import { ExperienceSection } from "@/components/shared/experience-section"
import { PracticalDetails } from "@/components/shared/practical-details"
import { PropertyGallery } from "@/components/shared/property-gallery"
import { StayOptions } from "@/components/shared/stay-options"
import { publicContact } from "@/lib/public-contact"

export default function HideoutPage() {
    return (
        <div className="bg-background min-h-screen">
            <Hero
                title="Hideout"
                subtitle="A quieter base for better sleep, lake walks, and turning down the volume of San Pedro."
                backgroundImage="/images/mandalas/hostelworld/hideout-terrace-dusk.jpg"
                backgroundPosition="32% 50%"
                align="left"
            >
                <ConsultationLink
                    location="Mandalas Hideout"
                    size="lg"
                    className="h-12 border-white/25 bg-white px-8 text-stone-950 hover:bg-stone-200 gap-2"
                >
                    Check dates
                </ConsultationLink>
            </Hero>

            {/* Intro Section */}
            <section className="py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em]">Slow the rhythm</h2>
                        <div className="mx-auto h-px w-24 bg-lime-300/40" />
                        <p className="text-lg text-muted-foreground leading-loose font-light tracking-wide max-w-2xl mx-auto">
                            Hideout is for travelers who want to wake up near the mountains, move toward the lake slowly, and return to a quieter night.
                        </p>
                        <StaggerReveal className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8" delay={0.2}>
                            {[
                                { icon: Waves, label: "Walk to lake" },
                                { icon: Bike, label: "Free bikes" },
                                { icon: Utensils, label: "Equipped kitchen" },
                                { icon: Wifi, label: "Free WiFi" },
                                { icon: Moon, label: "Quiet nights" },
                                { icon: Sprout, label: "Outside center" },
                            ].map((feature, idx) => (
                                <StaggerItem key={idx} className="flex flex-col items-center gap-4 text-muted-foreground/80 group">
                                    <feature.icon className="w-6 h-6 text-lime-600/80 stroke-[1.5px] group-hover:text-lime-500 transition-colors" />
                                    <span className="text-sm uppercase tracking-widest font-light">{feature.label}</span>
                                </StaggerItem>
                            ))}
                        </StaggerReveal>
                    </div>
                </FadeIn>
            </section>

            <section className="border-y border-white/10 bg-stone-950 py-16">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                            <div>
                                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-lime-300/60">
                                    Good to know
                                </p>
                                <h2 className="font-heading text-3xl font-light uppercase leading-tight tracking-[0.14em] text-white md:text-4xl">
                                    Quiet, but practical
                                </h2>
                                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    Hideout works like a refuge: calmer nights, simple lake access, and what you need so the trip does not always depend on the center.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { icon: Waves, title: "Lake nearby", description: "A few minutes walking from the shore." },
                                    { icon: Bike, title: "Bikes", description: "Free bikes for guests, useful for moving into town." },
                                    { icon: Utensils, title: "Kitchen", description: "Equipped kitchen for preparing something light during your stay." },
                                    { icon: Clock, title: "Hours", description: "Check-in 15:00-24:00. Check-out until 10:00." },
                                    { icon: Luggage, title: "Luggage", description: "Free luggage storage available." },
                                    { icon: MapPin, title: "Location", description: "About 1.7 km from the center of San Pedro." },
                                ].map((detail) => (
                                    <div key={detail.title} className="border-t border-white/10 py-5">
                                        <detail.icon className="mb-4 h-5 w-5 text-lime-300/70" />
                                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-white">
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

            <PropertyGallery
                id="galeria"
                eyebrow="The place"
                title="Mountains nearby, softer nights"
                description="Hideout is best understood by its contrasts: a volcano-facing entrance, a terrace for slowing down, and common spaces that feel gentler than the center."
                accent="lime"
                images={[
                    {
                        src: "/images/mandalas/hostelworld/hideout-terrace-dusk.jpg",
                        alt: "Mandalas Hideout terrace at dusk",
                        label: "Terrace",
                    },
                    {
                        src: "/images/mandalas/hostelworld/hideout-courtyard-night.jpg",
                        alt: "Mandalas Hideout courtyard at night",
                        label: "Courtyard",
                    },
                    {
                        src: "/images/mandalas/hostelworld/hideout-exterior-volcano.jpg",
                        alt: "Mandalas Hideout entrance with volcano in the background",
                        label: "Entrance",
                    },
                ]}
            />

            <ExperienceSection
                eyebrow="More quiet"
                title="Near the lake, away from the noise"
                description="Hideout does not try to compete with the center. Its value is giving you air, pause, and a softer return after exploring."
                accent="lime"
                items={[
                    {
                        icon: Cloud,
                        title: "Lake mornings",
                        description: "Go out early, walk to the water, or start the day without stepping straight into the noise.",
                    },
                    {
                        icon: Sprout,
                        title: "Quiet neighborhood",
                        description: "A more local setting for handling the essentials and saving energy.",
                    },
                    {
                        icon: Moon,
                        title: "Soft nights",
                        description: "Social when you want it, restful when you need it.",
                    },
                ]}
            />

            <PracticalDetails
                eyebrow="How it feels"
                title="A stay with pause"
                description="Choose Hideout if you prefer calmer sleep, lake movement, and returning to a less crowded place."
                accent="lime"
                details={[
                    {
                        icon: Sprout,
                        title: "Outside the center",
                        description: "Ideal if you prioritize calm and prefer not to sleep in the middle of the movement.",
                    },
                    {
                        icon: Waves,
                        title: "Lake nearby",
                        description: "A few minutes on foot for walking, swimming, kayaking, or starting the day more slowly.",
                    },
                    {
                        icon: Bike,
                        title: "Easy movement",
                        description: "The bikes help you reach the center without having to sleep right on top of it.",
                    },
                    {
                        icon: MapPin,
                        title: "San Pedro stays close",
                        description: "The stay is about 1.7 km from the center, enough to feel a different energy.",
                    },
                ]}
            />

            <StayOptions
                eyebrow="Sleep at Hideout"
                title="Ways to sleep with more quiet"
                description="Shared and private options for slowing down, with final rates and availability confirmed by message."
                location="Mandalas Hideout"
                accent="lime"
                options={[
                    {
                        icon: ShieldCheck,
                        title: "Female Dorm",
                        subtitle: "calm",
                        description: "For women travelers looking for a shared base with softer energy.",
                        details: ["Female only", "More quiet", "Lake nearby"],
                        price: "By date",
                        roomName: "Female Dorm",
                    },
                    {
                        icon: BedDouble,
                        title: "Mixed Dorm",
                        subtitle: "soft social",
                        description: "For sharing the trip without sleeping on top of the center's noise.",
                        details: ["Shared", "Lake nearby", "Walks"],
                        price: "By date",
                        roomName: "Mixed Dorm",
                    },
                    {
                        icon: DoorClosed,
                        title: "Private Room",
                        subtitle: "pause",
                        description: "For couples or slower travelers who want more privacy to rest.",
                        details: ["Privacy", "More quiet", "Slow travel"],
                        price: "By date",
                        roomName: "Private Room",
                    },
                ]}
            />

            {/* CTA */}
            <section className="py-24 bg-stone-900 text-white text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-light font-heading uppercase tracking-[0.12em] mb-6">Slow down</h2>
                    <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">Share your dates and we will guide you toward the quietest available option.</p>
                    <ConsultationLink
                        location="Mandalas Hideout"
                        size="lg"
                        className="h-12 border-white/20 bg-white px-10 text-stone-950 hover:bg-stone-200 gap-2"
                    >
                        Check availability
                    </ConsultationLink>
                    <a
                        href={publicContact.instagram.hideout}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-lime-200"
                    >
                        <Instagram className="h-4 w-4" />
                        View Hideout on Instagram
                    </a>
                </FadeIn>
            </section>
        </div>
    )
}
