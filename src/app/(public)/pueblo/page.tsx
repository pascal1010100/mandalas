"use client"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"
import { Wifi, Coffee, Sun, MapPin, Utensils, BedDouble, DoorClosed, ShieldCheck, ShipWheel, Clock, WashingMachine, Route, LockKeyhole } from "lucide-react"
import { BookingLink } from "@/components/shared/booking-link"
import { ExperienceSection } from "@/components/shared/experience-section"
import { PracticalDetails } from "@/components/shared/practical-details"
import { PropertyGallery } from "@/components/shared/property-gallery"
import { StayOptions } from "@/components/shared/stay-options"

export default function PuebloPage() {
    return (
        <div className="bg-background min-h-screen">
            <Hero
                title="Mandalas"
                subtitle="Una base céntrica para caminar San Pedro, volver a la terraza y dejar que el viaje encuentre su ritmo."
                backgroundImage="/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"
                backgroundPosition="center center"
                align="center"
            >
                <BookingLink
                    location="Mandalas"
                    size="lg"
                    className="h-12 border-white/25 bg-white px-8 text-stone-950 hover:bg-stone-200 gap-2"
                >
                    Consultar fechas
                </BookingLink>
            </Hero>

            {/* Intro Section */}
            <section className="py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em]">El pulso del pueblo</h2>
                        <div className="mx-auto h-px w-24 bg-amber-300/40" />
                        <p className="text-lg text-muted-foreground leading-loose font-light tracking-wide max-w-2xl mx-auto">
                            Aquí la estadía se siente caminable: llegas, dejas la mochila, subes a ver el lago y sales a encontrar el ritmo del pueblo.
                        </p>
                        <StaggerReveal className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8" delay={0.2}>
                            {[
                                { icon: Wifi, label: "WiFi Gratis" },
                                { icon: Coffee, label: "Cocina Equipada" },
                                { icon: Sun, label: "Rooftop con Vista" },
                                { icon: LockKeyhole, label: "Lockers gratis" },
                                { icon: WashingMachine, label: "Lavandería" },
                                { icon: MapPin, label: "Centro a pie" },
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
                                    Datos útiles
                                </p>
                                <h2 className="font-heading text-3xl font-light uppercase leading-tight tracking-[0.14em] text-white md:text-4xl">
                                    Céntrico, simple, con vista
                                </h2>
                                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    Mandalas funciona como base social y práctica: llegas fácil, resuelves lo básico y tienes una terraza para volver cuando baja el sol.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { icon: Sun, title: "Rooftop", description: "Terraza en el cuarto piso con vista al lago y montañas volcánicas." },
                                    { icon: Utensils, title: "Cocina", description: "Cocina completa para preparar comida durante tu estadía." },
                                    { icon: WashingMachine, title: "Lavandería", description: "Servicio de lavandería disponible en el hostal." },
                                    { icon: Route, title: "Tours", description: "Conexión con agencia de viajes asociada para moverte por Atitlán." },
                                    { icon: Clock, title: "Horarios", description: "Check-in 14:00-24:00. Check-out hasta las 11:00." },
                                    { icon: MapPin, title: "Ubicación", description: "Aproximadamente 0.3 km del centro de San Pedro." },
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
                eyebrow="El lugar"
                title="Arquitectura blanca, luz cálida y lago"
                description="Mandalas tiene una energía más urbana, pero su encanto está en los detalles: pasillos con plantas, hamacas, rincones de descanso y una vista que ordena el día."
                accent="amber"
                images={[
                    {
                        src: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
                        alt: "Patio interior de Mandalas con hamacas y luz natural",
                        label: "Patio",
                    },
                    {
                        src: "/images/mandalas/hostelworld/pueblo-lake-view.jpg",
                        alt: "Vista al lago desde Mandalas",
                        label: "Vista al lago",
                    },
                    {
                        src: "/images/mandalas/hostelworld/pueblo-stair-detail.jpg",
                        alt: "Escaleras y detalles arquitectónicos de Mandalas",
                        label: "Detalles",
                    },
                ]}
            />

            <ExperienceSection
                eyebrow="Vida compartida"
                title="Para estar cerca de todo"
                description="Mandalas es para quienes quieren sentir San Pedro desde adentro: un lugar de paso, conversación y regreso fácil."
                accent="amber"
                items={[
                    {
                        icon: Sun,
                        title: "Terraza con atardecer",
                        description: "El punto natural para cerrar el día antes de decidir qué sigue.",
                    },
                    {
                        icon: Utensils,
                        title: "Casa práctica",
                        description: "Lo necesario para viajar ligero sin convertir la estadía en logística.",
                    },
                    {
                        icon: MapPin,
                        title: "Todo queda a mano",
                        description: "Sales a caminar y San Pedro empieza a aparecer sin planear demasiado.",
                    },
                ]}
            />

            <PracticalDetails
                eyebrow="Cómo se siente"
                title="Una estadía con movimiento"
                description="Elige Mandalas si quieres salir caminando, decidir planes al momento y tener una base social donde volver."
                accent="amber"
                details={[
                    {
                        icon: MapPin,
                        title: "Centro caminable",
                        description: "Aproximadamente 0.3 km del centro, buena opción si quieres resolver todo a pie.",
                    },
                    {
                        icon: ShipWheel,
                        title: "Muelle cerca",
                        description: "Práctico para moverte entre pueblos, tomar tours o salir temprano.",
                    },
                    {
                        icon: Sun,
                        title: "Terraza y áreas comunes",
                        description: "El valor está en la vista, la cocina, la sala común y los cruces naturales entre viajeros.",
                    },
                    {
                        icon: Route,
                        title: "Tours y movimiento",
                        description: "Puedes apoyarte en la conexión con agencia asociada para organizar planes alrededor del lago.",
                    },
                ]}
            />

            <StayOptions
                eyebrow="Dormir en Mandalas"
                title="Opciones simples para quedarte cerca"
                description="Dormitorios compartidos y privadas sencillas, con la terraza como punto de encuentro y disponibilidad confirmada por WhatsApp."
                location="Mandalas"
                accent="amber"
                options={[
                    {
                        icon: BedDouble,
                        title: "Dormitorio Mixto",
                        subtitle: "social",
                        description: "Para viajar ligero, conocer gente y tener una base práctica cerca del movimiento de San Pedro.",
                        details: ["Locker", "Luz de lectura", "Enchufe"],
                        price: "Según fecha",
                        roomName: "Dormitorio Mixto",
                    },
                    {
                        icon: ShieldCheck,
                        title: "Dormitorio Solo Chicas",
                        subtitle: "compartido",
                        description: "Una opción compartida para viajeras que quieren una base simple, segura y bien ubicada.",
                        details: ["Solo chicas", "Locker", "Áreas comunes"],
                        price: "Según fecha",
                        roomName: "Dormitorio Solo Chicas",
                    },
                    {
                        icon: DoorClosed,
                        title: "Habitación Privada",
                        subtitle: "con o sin baño",
                        description: "Más privacidad sin perder la cocina, la terraza y la facilidad de moverte caminando.",
                        details: ["Privacidad", "Baño según opción", "Centro"],
                        price: "Según fecha",
                        roomName: "Habitación Privada",
                    },
                ]}
            />

            {/* CTA */}
            <section className="py-24 bg-stone-900 text-white text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-light font-heading uppercase tracking-[0.12em] mb-6">Quédate en Mandalas</h2>
                    <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">Cuéntanos tus fechas y te confirmamos qué opción tiene más sentido para tu viaje.</p>
                    <BookingLink
                        location="Mandalas"
                        size="lg"
                        className="h-12 border-white/20 bg-white px-10 text-stone-950 hover:bg-stone-200 gap-2"
                    >
                        Escribir por WhatsApp
                    </BookingLink>
                </FadeIn>
            </section>
        </div>
    )
}
