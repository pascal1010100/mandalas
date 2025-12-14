"use client"

import { BookingModal } from "@/components/shared/booking-modal"
import { useAppStore } from "@/lib/store"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Waves, Mountain, Flame, Cloud, Stars } from "lucide-react"
import { EventsCalendar } from "@/components/shared/events-calendar"

export default function HideoutPage() {
    const { rooms } = useAppStore()

    return (
        <div className="bg-background min-h-screen">
            <Hero
                title="Mandalas Hideout"
                subtitle="Desconecta del mundo y reconecta contigo mismo en nuestro santuario natural."
                // Zen Green Gradient - Healing, Organic
                backgroundGradient="linear-gradient(135deg, #84cc16 0%, #65a30d 40%, #3f6212 100%)"
                align="center"
            >
                <BookingModal defaultLocation="hideout">
                    <Button size="lg" className="rounded-full bg-white text-lime-800 hover:bg-stone-50 font-bold text-lg px-8 shadow-xl shadow-lime-900/10 transition-transform hover:scale-105 duration-300">
                        Reservar Retiro
                    </Button>
                </BookingModal>
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

            {/* Events Section - Added for consistency */}
            <div className="bg-stone-950/5">
                <EventsCalendar filterLocation="Hideout" />
            </div>

            {/* Rooms Section */}
            <section className="py-24 bg-stone-50 dark:bg-stone-950/50">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em] mb-12 text-center">Alojamientos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Room 1 */}
                            {/* Room 1 */}
                            <Card className="border-stone-200 dark:border-stone-800 shadow-lg overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out bg-white dark:bg-stone-900 border hover:border-lime-500/30">
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-lime-500 to-lime-700 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Bungalow Ecológico</CardTitle>
                                    <CardDescription>Rustic chic en armonía con el entorno</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                                        <li>• Baño privado al aire libre</li>
                                        <li>• Porche con hamaca</li>
                                        <li>• Construcción de bambú</li>
                                    </ul>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-lime-600">${rooms?.find(r => r.id === 'hideout_dorm')?.basePrice || 16}</span>
                                        <span className="text-sm text-stone-500">/ noche</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <BookingModal
                                        defaultLocation="hideout"
                                        defaultRoomType="dorm"
                                        roomName="Dormitorio Compartido Hideout"
                                        pricePerNight={rooms?.find(r => r.id === 'hideout_dorm')?.basePrice || 16}
                                    >
                                        {/* Force re-render */}
                                        <Button
                                            className="w-full rounded-full hover:brightness-110 text-white font-semibold shadow-md hover:shadow-lg hover:shadow-lime-900/20 transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-lime-500 to-lime-700"
                                        >
                                            Reservar Ahora
                                        </Button>
                                    </BookingModal>
                                </CardFooter>
                            </Card>

                            {/* Room 2 */}
                            {/* Room 2 */}
                            <Card className="border-stone-200 dark:border-stone-800 shadow-lg overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out bg-white dark:bg-stone-900 border hover:border-lime-500/30">
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div
                                        className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 bg-gradient-to-r from-lime-500 to-lime-700"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle>Glamping Tent</CardTitle>
                                    <CardDescription>Acampa con estilo y confort</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                                        <li>• Cama Queen real</li>
                                        <li>• Electricidad y WiFi</li>
                                        <li>• Sonidos de la naturaleza</li>
                                    </ul>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-lime-600">${rooms?.find(r => r.id === 'hideout_private')?.basePrice || 40}</span>
                                        <span className="text-sm text-stone-500">/ noche</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <BookingModal
                                        defaultLocation="hideout"
                                        defaultRoomType="private"
                                        roomName="Cabaña Privada"
                                        pricePerNight={rooms?.find(r => r.id === 'hideout_private')?.basePrice || 40}
                                    >
                                        <Button
                                            className="w-full rounded-full hover:brightness-110 text-white font-semibold shadow-md hover:shadow-lg hover:shadow-lime-900/20 transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-lime-500 to-lime-700"
                                        >
                                            Reservar Ahora
                                        </Button>
                                    </BookingModal>
                                </CardFooter>
                            </Card>

                            {/* Room 3 */}
                            {/* Room 3 */}
                            <Card className="border-stone-200 dark:border-stone-800 shadow-lg overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out bg-white dark:bg-stone-900 border hover:border-lime-500/30">
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div
                                        className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 bg-gradient-to-r from-lime-500 to-lime-700"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle>Dormitorio Nature</CardTitle>
                                    <CardDescription>Comparte en un ambiente tranquilo</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                                        <li>• Espacioso y aireado</li>
                                        <li>• Vistas al jardín</li>
                                        <li>• Ideal para grupos</li>
                                    </ul>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-lime-600">${rooms?.find(r => r.id === 'hideout_suite')?.basePrice || 55}</span>
                                        <span className="text-sm text-stone-500">/ noche</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <BookingModal
                                        defaultLocation="hideout"
                                        defaultRoomType="suite"
                                        roomName="Suite Lakefront Premium"
                                        pricePerNight={rooms?.find(r => r.id === 'hideout_suite')?.basePrice || 55}
                                    >
                                        <Button
                                            className="w-full rounded-full hover:brightness-110 text-white font-semibold shadow-md hover:shadow-lg hover:shadow-lime-900/20 transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-lime-500 to-lime-700"
                                        >
                                            Reservar Ahora
                                        </Button>
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
                    <BookingModal defaultLocation="hideout">
                        <Button size="lg" className="rounded-full bg-white text-black hover:bg-stone-200 text-lg px-10 py-6">
                            Reservar Ahora
                        </Button>
                    </BookingModal>
                </FadeIn>
            </section>
        </div>
    )
}
