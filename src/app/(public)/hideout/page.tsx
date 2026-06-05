"use client"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"
import { Waves, Cloud, Moon, Sprout, BedDouble, DoorClosed, ShieldCheck, MapPin, Bike, Utensils, Clock, Luggage, Wifi } from "lucide-react"
import { BookingLink } from "@/components/shared/booking-link"
import { ExperienceSection } from "@/components/shared/experience-section"
import { PracticalDetails } from "@/components/shared/practical-details"
import { PropertyGallery } from "@/components/shared/property-gallery"
import { StayOptions } from "@/components/shared/stay-options"

export default function HideoutPage() {
    return (
        <div className="bg-background min-h-screen">
            <Hero
                title="Mandalas Hideout"
                subtitle="Una base más tranquila para dormir mejor, caminar al lago y bajar el volumen de San Pedro."
                backgroundImage="/images/mandalas/hostelworld/hideout-exterior-volcano.jpg"
                align="center"
            >
                <BookingLink
                    location="Mandalas Hideout"
                    size="lg"
                    className="rounded-full bg-white text-lime-800 hover:bg-stone-50 font-bold text-lg px-8 shadow-xl shadow-lime-900/10 transition-transform hover:scale-105 duration-300 gap-2"
                >
                    Consultar fechas
                </BookingLink>
            </Hero>

            {/* Intro Section */}
            <section className="py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em]">Bajar el ritmo</h2>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-lime-400 to-transparent mx-auto opacity-50" />
                        <p className="text-lg text-muted-foreground leading-loose font-light tracking-wide max-w-2xl mx-auto">
                            Hideout es para quienes quieren despertar con montaña cerca, moverse al lago sin prisa y volver a una noche más tranquila.
                        </p>
                        <StaggerReveal className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8" delay={0.2}>
                            {[
                                { icon: Waves, label: "Lago a pie" },
                                { icon: Bike, label: "Bicis gratis" },
                                { icon: Utensils, label: "Cocina equipada" },
                                { icon: Wifi, label: "WiFi gratis" },
                                { icon: Moon, label: "Noches en calma" },
                                { icon: Sprout, label: "Fuera del centro" },
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

            <section className="border-y border-stone-200/70 bg-stone-50 py-16 dark:border-stone-800 dark:bg-stone-950">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                            <div>
                                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-lime-700/70 dark:text-lime-300/60">
                                    Datos útiles
                                </p>
                                <h2 className="font-heading text-3xl font-light uppercase leading-tight tracking-[0.14em] text-stone-950 dark:text-white md:text-4xl">
                                    Tranquilo, pero resuelto
                                </h2>
                                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    Hideout funciona como refugio: más calma por la noche, acceso sencillo al lago y lo necesario para que el viaje no dependa siempre del centro.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { icon: Waves, title: "Lago cerca", description: "A pocos minutos caminando de la orilla." },
                                    { icon: Bike, title: "Bicicletas", description: "Bicis gratis para huéspedes, ideal para moverte al pueblo." },
                                    { icon: Utensils, title: "Cocina", description: "Cocina equipada para preparar algo simple durante la estadía." },
                                    { icon: Clock, title: "Horarios", description: "Check-in 15:00-24:00. Check-out hasta las 10:00." },
                                    { icon: Luggage, title: "Equipaje", description: "Consigna de equipaje gratuita disponible." },
                                    { icon: MapPin, title: "Ubicación", description: "Aproximadamente 1.7 km del centro de San Pedro." },
                                ].map((detail) => (
                                    <div key={detail.title} className="border-t border-stone-200 py-5 dark:border-stone-800">
                                        <detail.icon className="mb-4 h-5 w-5 text-lime-700/70 dark:text-lime-300/70" />
                                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-stone-950 dark:text-white">
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
                eyebrow="El lugar"
                title="Montaña cerca, noches suaves"
                description="Hideout se entiende mejor por sus contrastes: la entrada frente al volcán, una terraza para bajar revoluciones y espacios comunes que se sienten más pausados que el centro."
                accent="lime"
                images={[
                    {
                        src: "/images/mandalas/hostelworld/hideout-exterior-volcano.jpg",
                        alt: "Entrada de Mandalas Hideout con volcán al fondo",
                        label: "Entrada",
                    },
                    {
                        src: "/images/mandalas/hostelworld/hideout-terrace-dusk.jpg",
                        alt: "Terraza de Mandalas Hideout al atardecer",
                        label: "Terraza",
                    },
                    {
                        src: "/images/mandalas/hostelworld/hideout-courtyard-night.jpg",
                        alt: "Patio nocturno de Mandalas Hideout",
                        label: "Patio",
                    },
                ]}
            />

            <ExperienceSection
                eyebrow="Más calma"
                title="Cerca del lago, lejos del ruido"
                description="Hideout no intenta competir con el centro. Su valor está en darte aire, pausa y una vuelta más suave después de explorar."
                accent="lime"
                items={[
                    {
                        icon: Cloud,
                        title: "Mañanas de lago",
                        description: "Salir temprano, caminar al agua o empezar el día sin entrar directo al ruido.",
                    },
                    {
                        icon: Sprout,
                        title: "Barrio tranquilo",
                        description: "Un entorno más local para resolver lo simple y guardar energía.",
                    },
                    {
                        icon: Moon,
                        title: "Noches suaves",
                        description: "Social cuando quieres, descansado cuando lo necesitas.",
                    },
                ]}
            />

            <PracticalDetails
                eyebrow="Cómo se siente"
                title="Una estadía con pausa"
                description="Elige Hideout si prefieres dormir con más calma, moverte al lago y volver a un lugar menos cargado."
                accent="lime"
                details={[
                    {
                        icon: Sprout,
                        title: "Fuera del centro",
                        description: "Ideal si priorizas calma y prefieres no dormir en medio del movimiento.",
                    },
                    {
                        icon: Waves,
                        title: "Lago cerca",
                        description: "A pocos minutos a pie para caminar, nadar, hacer kayak o empezar el día más despacio.",
                    },
                    {
                        icon: Bike,
                        title: "Movimiento fácil",
                        description: "Las bicicletas ayudan a llegar al centro sin tener que quedarte encima de él.",
                    },
                    {
                        icon: MapPin,
                        title: "San Pedro sigue cerca",
                        description: "La sede está aproximadamente a 1.7 km del centro, suficiente para sentir otra energía.",
                    },
                ]}
            />

            <StayOptions
                eyebrow="Dormir en Hideout"
                title="Opciones simples para descansar mejor"
                description="Hideout no necesita sentirse lleno. Cada opción mantiene el foco en descansar, moverte al lago y volver a un lugar más tranquilo."
                location="Mandalas Hideout"
                accent="lime"
                options={[
                    {
                        icon: ShieldCheck,
                        title: "Dormitorio Solo Chicas",
                        subtitle: "calmado",
                        description: "Para viajeras que buscan una base compartida con una energía más suave.",
                        details: ["Solo chicas", "Más calma", "WhatsApp"],
                        price: "Desde Q16",
                        roomName: "Dormitorio Solo Chicas",
                    },
                    {
                        icon: BedDouble,
                        title: "Dormitorio Mixto",
                        subtitle: "social suave",
                        description: "Para compartir el viaje sin estar encima del ruido del centro.",
                        details: ["Compartido", "Lago cerca", "Caminatas"],
                        price: "Desde Q16",
                        roomName: "Dormitorio Mixto",
                    },
                    {
                        icon: DoorClosed,
                        title: "Habitación Privada",
                        subtitle: "pausa",
                        description: "Para parejas o viajeros lentos que quieren más privacidad para descansar.",
                        details: ["Privacidad", "Más calma", "Viaje lento"],
                        price: "Desde Q40",
                        roomName: "Habitación Privada",
                    },
                ]}
            />

            {/* CTA */}
            <section className="py-24 bg-stone-900 text-white text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-light font-heading uppercase tracking-[0.12em] mb-6">Baja el ritmo</h2>
                    <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">Cuéntanos tus fechas y te confirmamos la opción más tranquila disponible.</p>
                    <BookingLink
                        location="Mandalas Hideout"
                        size="lg"
                        className="rounded-full bg-white text-black hover:bg-stone-200 text-lg px-10 py-6 gap-2"
                    >
                        Escribir por WhatsApp
                    </BookingLink>
                </FadeIn>
            </section>
        </div>
    )
}
