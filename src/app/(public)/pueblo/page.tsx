"use client"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"
import { Wifi, Coffee, Sun, MapPin, Utensils, BedDouble, DoorClosed, ShieldCheck, ShipWheel, Clock, WashingMachine, Route, LockKeyhole, Instagram } from "lucide-react"
import { ConsultationLink } from "@/components/shared/consultation-link"
import { ExperienceSection } from "@/components/shared/experience-section"
import { PracticalDetails } from "@/components/shared/practical-details"
import { PropertyGallery } from "@/components/shared/property-gallery"
import { StayOptions } from "@/components/shared/stay-options"
import { publicContact } from "@/lib/public-contact"

export default function PuebloPage() {
    return (
        <div className="bg-background min-h-screen">
            <Hero
                title="Mandalas"
                subtitle="A central base for walking San Pedro, returning to the rooftop, and letting the trip find its rhythm."
                backgroundImage="/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"
                backgroundPosition="center center"
                align="center"
            >
                <ConsultationLink
                    location="Mandalas"
                    size="lg"
                    className="h-12 border-white/25 bg-white px-8 text-stone-950 hover:bg-stone-200 gap-2"
                >
                    Book Mandalas
                </ConsultationLink>
            </Hero>

            {/* Intro Section */}
            <section className="py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em]">The pulse of town</h2>
                        <div className="mx-auto h-px w-24 bg-amber-300/40" />
                        <p className="text-lg text-muted-foreground leading-loose font-light tracking-wide max-w-2xl mx-auto">
                            Here the stay feels walkable: arrive, drop your bag, head up to see the lake, and step out into the rhythm of town.
                        </p>
                        <StaggerReveal className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8" delay={0.2}>
                            {[
                                { icon: Wifi, label: "Free WiFi" },
                                { icon: Coffee, label: "Equipped kitchen" },
                                { icon: Sun, label: "Rooftop views" },
                                { icon: LockKeyhole, label: "Free lockers" },
                                { icon: WashingMachine, label: "Laundry" },
                                { icon: MapPin, label: "Walkable center" },
                            ].map((feature, idx) => (
                                <StaggerItem key={idx} className="flex flex-col items-center gap-4 text-muted-foreground/80 group">
                                    <feature.icon className="w-6 h-6 text-orange-500/80 stroke-[1.5px] group-hover:text-orange-500 transition-colors" />
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
                                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300/60">
                                    Good to know
                                </p>
                                <h2 className="font-heading text-3xl font-light uppercase leading-tight tracking-[0.14em] text-white md:text-4xl">
                                    Central, easy, with a view
                                </h2>
                                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    Mandalas works as a social and practical base: easy arrival, simple essentials, and a rooftop to come back to when the sun drops.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { icon: Sun, title: "Rooftop", description: "Fourth-floor terrace with lake and volcanic mountain views." },
                                    { icon: Utensils, title: "Kitchen", description: "Full kitchen for preparing food during your stay." },
                                    { icon: WashingMachine, title: "Laundry", description: "Laundry service available at the hostel." },
                                    { icon: Route, title: "Tours", description: "Connection with a partner travel agency for getting around Atitlan." },
                                    { icon: Clock, title: "Hours", description: "Check-in 14:00-24:00. Check-out until 11:00." },
                                    { icon: MapPin, title: "Location", description: "About 0.3 km from the center of San Pedro." },
                                ].map((detail) => (
                                    <div key={detail.title} className="border-t border-white/10 py-5">
                                        <detail.icon className="mb-4 h-5 w-5 text-amber-300/70" />
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
                title="White architecture, warm light, and lake views"
                description="Mandalas has a more urban energy, but its charm lives in the details: plants, hammocks, quiet corners, and a view that settles the day."
                accent="amber"
                images={[
                    {
                        src: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
                        alt: "Mandalas interior courtyard with hammocks and natural light",
                        label: "Courtyard",
                    },
                    {
                        src: "/images/mandalas/hostelworld/pueblo-lake-view.jpg",
                        alt: "Lake view from Mandalas",
                        label: "Lake view",
                    },
                    {
                        src: "/images/mandalas/hostelworld/pueblo-stair-detail.jpg",
                        alt: "Stairs and architectural details at Mandalas",
                        label: "Details",
                    },
                ]}
            />

            <ExperienceSection
                eyebrow="Shared life"
                title="For staying close to everything"
                description="Mandalas is for travelers who want to feel San Pedro from the inside: a place to pass through, talk, and come back easily."
                accent="amber"
                items={[
                    {
                        icon: Sun,
                        title: "Sunset rooftop",
                        description: "The natural place to end the day before deciding what comes next.",
                    },
                    {
                        icon: Utensils,
                        title: "Practical house",
                        description: "The essentials for traveling light without turning the stay into logistics.",
                    },
                    {
                        icon: MapPin,
                        title: "Everything nearby",
                        description: "Walk out the door and San Pedro starts to appear without much planning.",
                    },
                ]}
            />

            <PracticalDetails
                eyebrow="How it feels"
                title="A stay with movement"
                description="Choose Mandalas if you want to walk out, make plans as you go, and have a social base to return to."
                accent="amber"
                details={[
                    {
                        icon: MapPin,
                        title: "Walkable center",
                        description: "About 0.3 km from the center, a good option if you want to do things on foot.",
                    },
                    {
                        icon: ShipWheel,
                        title: "Dock nearby",
                        description: "Practical for moving between towns, joining tours, or leaving early.",
                    },
                    {
                        icon: Sun,
                        title: "Rooftop and common areas",
                        description: "The value is in the view, kitchen, lounge, and natural crossings between travelers.",
                    },
                    {
                        icon: Route,
                        title: "Tours and movement",
                        description: "Use the connection with a partner agency to plan movement around the lake.",
                    },
                ]}
            />

            <StayOptions
                eyebrow="Sleep at Mandalas"
                title="Ways to stay close"
                description="Shared dorms and private rooms for traveling light, with the rooftop as a meeting point and live availability in the booking engine."
                location="Mandalas"
                accent="amber"
                options={[
                    {
                        icon: BedDouble,
                        title: "Mixed Dorm",
                        subtitle: "social",
                        description: "For traveling light, meeting people, and keeping a practical base near San Pedro's movement.",
                        details: ["Locker", "Reading light", "Power outlet"],
                        price: "By date",
                        roomName: "Mixed Dorm",
                    },
                    {
                        icon: ShieldCheck,
                        title: "Female Dorm",
                        subtitle: "shared",
                        description: "A shared option for women travelers who want a calm, well-located base.",
                        details: ["Female only", "Locker", "Common areas"],
                        price: "By date",
                        roomName: "Female Dorm",
                    },
                    {
                        icon: DoorClosed,
                        title: "Private Room",
                        subtitle: "with or without bathroom",
                        description: "More privacy without losing the kitchen, rooftop, and easy walkability.",
                        details: ["Privacy", "Bathroom by option", "Center"],
                        price: "By date",
                        roomName: "Private Room",
                    },
                ]}
            />

            {/* CTA */}
            <section className="py-24 bg-stone-900 text-white text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-light font-heading uppercase tracking-[0.12em] mb-6">Stay at Mandalas</h2>
                    <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">Choose your dates and book your stay in the center directly.</p>
                    <div className="flex flex-col items-center gap-5">
                        <ConsultationLink
                            location="Mandalas"
                            size="lg"
                            className="h-12 border-white/20 bg-white px-10 text-stone-950 hover:bg-stone-200 gap-2"
                        >
                            Book Mandalas
                        </ConsultationLink>
                        <a
                            href={publicContact.instagram.mandalas}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-stone-500 transition-colors hover:text-amber-200"
                        >
                            <Instagram className="h-4 w-4" />
                            @mandalas_hostal
                        </a>
                    </div>
                </FadeIn>
            </section>
        </div>
    )
}
