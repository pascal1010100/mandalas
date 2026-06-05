"use client"

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react"

import { FadeIn } from "@/components/animations/fade-in"
import { BookingLink } from "@/components/shared/booking-link"
import { Hero } from "@/components/shared/hero"
import { LocationMap } from "@/components/shared/location-map"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-stone-950 text-stone-200">
            <Hero
                title="Contacto"
                subtitle="Cuéntanos tus fechas, el ritmo de viaje que buscas y te orientamos entre Mandalas y Hideout."
                backgroundImage="/images/mandalas/pueblo-dock-boat.jpg"
                backgroundPosition="center 58%"
                height="large"
                align="center"
            >
                <BookingLink
                    location="Mandalas Hostal"
                    size="lg"
                    className="rounded-full bg-white text-stone-950 hover:bg-stone-100 font-semibold text-lg px-8 shadow-xl transition-transform hover:scale-[1.02] duration-300 gap-2"
                >
                    Consultar por WhatsApp
                </BookingLink>
            </Hero>

            <section className="container mx-auto px-4 py-20 md:py-24">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
                    <FadeIn className="lg:col-span-5">
                        <div className="space-y-8">
                            <div>
                                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                                    Reserva directa
                                </p>
                                <h2 className="mb-5 max-w-xl break-words font-heading text-[1.35rem] font-light uppercase leading-tight tracking-[0.06em] text-white [text-wrap:balance] sm:text-3xl sm:tracking-[0.1em] md:text-4xl md:tracking-[0.14em]">
                                    Una conversación, dos formas de quedarse
                                </h2>
                                <p className="max-w-xl text-base leading-relaxed text-stone-400 md:text-lg">
                                    Escríbenos por WhatsApp para confirmar disponibilidad, llegada y la sede que mejor calza con tu viaje. Mantenemos la reserva simple, humana y sin vueltas.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-white/10 p-3 text-white">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 font-semibold text-white">WhatsApp</h3>
                                            <p className="mb-4 text-sm leading-relaxed text-stone-400">
                                                El canal más rápido para fechas, precios, llegada y recomendaciones locales.
                                            </p>
                                            <BookingLink
                                                location="Mandalas Hostal"
                                                variant="outline"
                                                className="rounded-full border-white/15 bg-transparent text-white hover:bg-white hover:text-stone-950 gap-2"
                                            >
                                                Enviar mensaje
                                            </BookingLink>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-lime-500/10 p-3 text-lime-300">
                                            <MessageCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 font-semibold text-white">Elige el ritmo</h3>
                                            <p className="mb-4 text-sm leading-relaxed text-stone-400">
                                                Mandalas para estar en el centro. Hideout para dormir más tranquilo cerca del lago.
                                            </p>
                                            <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                                                <span>Mandalas</span>
                                                <span>/</span>
                                                <span>Hideout</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:col-span-2 lg:col-span-1">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-amber-500/10 p-3 text-amber-300">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 font-semibold text-white">Correo</h3>
                                            <p className="mb-4 text-sm leading-relaxed text-stone-400">
                                                Para grupos, colaboraciones o consultas que necesitan más detalle.
                                            </p>
                                            <a
                                                href="mailto:info@mandalashostal.com"
                                                className="text-sm text-stone-100 underline decoration-white/20 underline-offset-4 hover:text-amber-200"
                                            >
                                                info@mandalashostal.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2} className="lg:col-span-7">
                        <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                            <MapPin className="h-4 w-4" />
                            San Pedro La Laguna
                        </div>
                        <div className="relative h-[420px] w-full overflow-hidden rounded-lg border border-white/10 bg-stone-900 shadow-2xl shadow-black/30 sm:h-[520px]">
                            <LocationMap />
                            <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
                        </div>
                        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-stone-500">
                            Ambas sedes están en San Pedro La Laguna: una más céntrica para moverte caminando y otra más calmada, camino al lago.
                        </p>
                    </FadeIn>
                </div>
            </section>

            <section className="border-t border-white/10 bg-stone-900/60 py-16">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                ["Respuesta directa", "Consulta disponibilidad y detalles por WhatsApp."],
                                ["Llegada clara", "Te orientamos con ubicación y recomendaciones antes de llegar."],
                                ["Dos ambientes", "Centro vivo o pausa cerca del lago, según tu viaje."],
                            ].map(([title, description]) => (
                                <div key={title} className="border-t border-white/10 pt-6">
                                    <h3 className="mb-3 font-heading text-xl font-light uppercase tracking-[0.14em] text-white">
                                        {title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-stone-400">
                                        {description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    )
}
