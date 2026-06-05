"use client"

import { Mail, MapPin, Phone } from "lucide-react"

import { FadeIn } from "@/components/animations/fade-in"
import { BookingLink } from "@/components/shared/booking-link"
import { Hero } from "@/components/shared/hero"
import { LocationMap } from "@/components/shared/location-map"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-stone-950 text-stone-200">
            <Hero
                title="Contacto"
                subtitle="Escríbenos para consultar disponibilidad, ubicación o detalles antes de tu llegada a San Pedro La Laguna."
                backgroundGradient="linear-gradient(135deg, #1c1917 0%, #78350f 48%, #365314 100%)"
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

            <section className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <FadeIn className="lg:col-span-5">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-heading font-light uppercase tracking-[0.18em] text-white mb-5">
                                    Hablemos de tu estadía
                                </h2>
                                <p className="text-stone-400 leading-relaxed text-lg max-w-xl">
                                    La forma más rápida de reservar o resolver dudas es WhatsApp. También puedes escribir por correo para grupos, eventos o estancias largas.
                                </p>
                            </div>

                            <div className="grid gap-4">
                                <div className="border border-white/10 bg-white/[0.04] p-6 rounded-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-amber-500/10 p-3 text-amber-300">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-2">WhatsApp</h3>
                                            <p className="text-sm text-stone-400 mb-4">
                                                Ideal para confirmar disponibilidad, precios y llegada.
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

                                <div className="border border-white/10 bg-white/[0.04] p-6 rounded-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-lime-500/10 p-3 text-lime-300">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-2">Correo</h3>
                                            <p className="text-sm text-stone-400 mb-4">
                                                Para consultas con más detalle o propuestas de colaboración.
                                            </p>
                                            <a
                                                href="mailto:info@mandalashostal.com"
                                                className="text-stone-100 hover:text-lime-200 underline underline-offset-4 decoration-white/20"
                                            >
                                                info@mandalashostal.com
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-white/10 bg-white/[0.04] p-6 rounded-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-white/10 p-3 text-stone-200">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-2">Ubicación</h3>
                                            <p className="text-sm text-stone-400">
                                                San Pedro La Laguna, Sololá, Guatemala.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2} className="lg:col-span-7">
                        <div className="relative h-[520px] w-full overflow-hidden rounded-lg border border-white/10 bg-stone-900 shadow-2xl shadow-black/30">
                            <LocationMap />
                            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-lg" />
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    )
}
