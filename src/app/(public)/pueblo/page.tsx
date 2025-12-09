"use client"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wifi, Beer, Coffee, Music, Users, Sun } from "lucide-react"
import { EventsCalendar } from "@/components/shared/events-calendar"
import { BookingModal } from "@/components/shared/booking-modal"

export default function PuebloPage() {
    return (
        <div className="bg-background min-h-screen">
            <Hero
                title="Mandalas"
                subtitle="Tu hogar social en el corazón de San Pedro. Conecta, celebra y vive la magia del lago."
                backgroundGradient="linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)"
                align="center"
            >
                <BookingModal>
                    <Button size="lg" className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-orange-900/20 hover:shadow-2xl hover:shadow-orange-900/30 transition-all duration-500 ease-out hover:scale-[1.02] text-lg px-8 border border-white/20 backdrop-blur-sm">
                        Reservar Estadía
                    </Button>
                </BookingModal>
            </Hero>

            {/* Intro Section */}
            <section className="py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em]">La Esencia del Pueblo</h2>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto opacity-50" />
                        <p className="text-lg text-muted-foreground leading-loose font-light tracking-wide max-w-2xl mx-auto">
                            Ubicado a pasos de los mejores cafés y bares, Mandalas es el punto de encuentro para viajeros de todo el mundo.
                            Disfruta de nuestra terraza con vista a los volcanes, únete a nuestras cenas familiares o simplemente relájate con un buen libro.
                        </p>
                        <StaggerReveal className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8" delay={0.2}>
                            {[
                                { icon: Wifi, label: "WiFi Alta Velocidad" },
                                { icon: Beer, label: "Bar & Happy Hour" },
                                { icon: Coffee, label: "Desayuno Inlcuido" },
                                { icon: Users, label: "Eventos Diarios" },
                                { icon: Music, label: "Música en Vivo" },
                                { icon: Sun, label: "Terraza Panorámica" },
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

            {/* Events Section */}
            <FadeIn>
                <EventsCalendar />
            </FadeIn>

            {/* Rooms Section */}
            <section className="py-24 bg-card">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em] mb-12 text-center">Nuestras Habitaciones</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Room 1 */}
                            <Card className="border-none shadow-lg overflow-hidden group hover-lift">
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 group-hover:scale-105 transition-transform duration-500" />
                                    {/* Placeholder for image */}
                                </div>
                                <CardHeader>
                                    <CardTitle>Dormitorio Compartido</CardTitle>
                                    <CardDescription>Ideal para conocer gente nueva</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        <li>• Camas con cortinas de privacidad</li>
                                        <li>• Lockers individuales</li>
                                        <li>• Enchufe y luz de lectura</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <BookingModal
                                        defaultLocation="pueblo"
                                        defaultRoomType="dorm"
                                        roomName="Dormitorio Compartido"
                                        pricePerNight={18}
                                    >
                                        <Button className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-500">Reservar Ahora</Button>
                                    </BookingModal>
                                </CardFooter>
                            </Card>

                            {/* Room 2 */}
                            <Card className="border-none shadow-lg overflow-hidden group hover-lift">
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-red-500 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Privada Estándar</CardTitle>
                                    <CardDescription>Tu propio espacio de confort</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        <li>• Cama Matrimonial</li>
                                        <li>• Baño Privado</li>
                                        <li>• Ventilador de techo</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <BookingModal
                                        defaultLocation="pueblo"
                                        defaultRoomType="private"
                                        roomName="Habitación Privada Estándar"
                                        pricePerNight={35}
                                    >
                                        <Button className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-500">Reservar Ahora</Button>
                                    </BookingModal>
                                </CardFooter>
                            </Card>

                            {/* Room 3 */}
                            <Card className="border-none shadow-lg overflow-hidden group hover-lift">
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500 to-amber-600 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Suite con Vista</CardTitle>
                                    <CardDescription>Lujo relajado frente al lago</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        <li>• Vista panorámica al lago</li>
                                        <li>• Balcón privado</li>
                                        <li>• Cama King Size</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <BookingModal
                                        defaultLocation="pueblo"
                                        defaultRoomType="suite"
                                        roomName="Suite con Vista"
                                        pricePerNight={55}
                                    >
                                        <Button className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-500">Reservar Ahora</Button>
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
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para la aventura?</h2>
                    <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">Reserva directamente con nosotros para obtener los mejores precios y beneficios exclusivos.</p>
                    <Button size="lg" className="rounded-full bg-white text-black hover:bg-stone-200 text-lg px-10 py-6">
                        Reservar Ahora
                    </Button>
                </FadeIn>
            </section>
        </div>
    )
}
