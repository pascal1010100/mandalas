"use client"

import { BookingModal } from "@/components/shared/booking-modal"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Waves, Mountain, Flame, Cloud, Stars } from "lucide-react"

export default function HideoutPage() {
    return (
        <div className="bg-background min-h-screen">
            <Hero
                title="Mandalas Hideout"
                subtitle="Desconecta del mundo y reconecta contigo mismo en nuestro santuario natural."
                // Zen Green Gradient - Healing, Organic
                backgroundGradient="linear-gradient(135deg, #84cc16 0%, #65a30d 40%, #3f6212 100%)"
                align="center"
            >
                <Button size="lg" className="rounded-full bg-white text-lime-800 hover:bg-stone-50 font-bold text-lg px-8 shadow-xl shadow-lime-900/10">
                    Reservar Retiro
                </Button>
            </Hero>

            {/* Intro Section */}
            <section className="py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em]">Paz en la Naturaleza</h2>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-lime-400 to-transparent mx-auto opacity-50" />
                        <p className="text-lg text-muted-foreground leading-loose font-light tracking-wide max-w-2xl mx-auto">
                            Escondido entre jardines exuberantes y con acceso directo al lago, Hideout es el lugar perfecto para yoga temprano, tardes de hamaca y noches bajo las estrellas.
                        </p>
                        <StaggerReveal className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8" delay={0.2}>
                            {[
                                { icon: Leaf, label: "Jardines Tropicales" },
                                { icon: Waves, label: "Acceso al Lago" },
                                { icon: Mountain, label: "Vistas al Volcán" },
                                { icon: Flame, label: "Fogatas Nocturnas" },
                                { icon: Cloud, label: "Deck de Yoga" },
                                { icon: Stars, label: "Cielos Estrellados" },
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

            {/* Rooms Section */}
            <section className="py-24 bg-card">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em] mb-12 text-center">Alojamientos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Room 1 */}
                            <Card className="border-none shadow-lg overflow-hidden group hover-lift">
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-lime-400 to-green-500 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Bungalow Ecológico</CardTitle>
                                    <CardDescription>Rustic chic en armonía con el entorno</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        <li>• Baño privado al aire libre</li>
                                        <li>• Porche con hamaca</li>
                                        <li>• Construcción de bambú</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <BookingModal
                                        defaultLocation="hideout"
                                        defaultRoomType="dorm"
                                        roomName="Dormitorio Compartido Hideout"
                                        pricePerNight={16}
                                    >
                                        {/* Force re-render */}
                                        <Button className="w-full rounded-full" variant="outline">Reservar Ahora</Button>
                                    </BookingModal>
                                </CardFooter>
                            </Card>

                            {/* Room 2 */}
                            <Card className="border-none shadow-lg overflow-hidden group hover-lift">
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-emerald-600 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Glamping Tent</CardTitle>
                                    <CardDescription>Acampa con estilo y confort</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        <li>• Cama Queen real</li>
                                        <li>• Electricidad y WiFi</li>
                                        <li>• Sonidos de la naturaleza</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <BookingModal
                                        defaultLocation="hideout"
                                        defaultRoomType="private"
                                        roomName="Cabaña Privada"
                                        pricePerNight={40}
                                    >
                                        <Button className="w-full rounded-full" variant="outline">Reservar Ahora</Button>
                                    </BookingModal>
                                </CardFooter>
                            </Card>

                            {/* Room 3 */}
                            <Card className="border-none shadow-lg overflow-hidden group hover-lift">
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-lime-600 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Dormitorio Nature</CardTitle>
                                    <CardDescription>Comparte en un ambiente tranquilo</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        <li>• Espacioso y aireado</li>
                                        <li>• Vistas al jardín</li>
                                        <li>• Ideal para grupos</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <BookingModal
                                        defaultLocation="hideout"
                                        defaultRoomType="suite"
                                        roomName="Suite Lakefront Premium"
                                        pricePerNight={55}
                                    >
                                        <Button className="w-full rounded-full bg-gradient-to-r from-lime-600 to-green-700 hover:from-lime-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300">Reservar Ahora</Button>
                                    </BookingModal>
                                </CardFooter>
                            </Card>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-stone-900 text-white text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Tu escapada perfecta</h2>
                    <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">Reserva directamente y obtén desayuno gratis en tu primera mañana.</p>
                    <BookingModal>
                        <Button size="lg" className="rounded-full bg-white text-black hover:bg-stone-200 text-lg px-10 py-6">
                            Reservar Ahora
                        </Button>
                    </BookingModal>
                </FadeIn>
            </section>
        </div>
    )
}
