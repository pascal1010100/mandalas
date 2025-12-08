"use client"

import { BookingModal } from "@/components/shared/booking-modal"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Waves, Mountain, Flame, Cloud, Stars } from "lucide-react"

export default function HideoutPage() {
    return (
        <div className="bg-stone-50 min-h-screen">
            <Hero
                title="Mandalas Hideout"
                subtitle="Desconecta del mundo y reconecta contigo mismo en nuestro santuario natural."
                // Green/Teal Gradient
                backgroundGradient="linear-gradient(to bottom right, #059669, #0891b2)"
                align="center"
            >
                <Button size="lg" className="rounded-full bg-white text-teal-700 hover:bg-stone-100 font-bold text-lg px-8">
                    Reservar Retiro
                </Button>
            </Hero>

            {/* Intro Section */}
            <section className="py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-stone-800 tracking-tighter">Paz en la Naturaleza</h2>
                        <p className="text-lg md:text-xl text-stone-600 leading-relaxed">
                            Escondido entre jardines exuberantes y con acceso directo al lago, Hideout es el lugar perfecto para yoga temprano, tardes de hamaca y noches bajo las estrellas.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8">
                            {[
                                { icon: Leaf, label: "Jardines Tropicales" },
                                { icon: Waves, label: "Acceso al Lago" },
                                { icon: Mountain, label: "Vistas al Volcán" },
                                { icon: Flame, label: "Fogatas Nocturnas" },
                                { icon: Cloud, label: "Deck de Yoga" },
                                { icon: Stars, label: "Cielos Estrellados" },
                            ].map((feature, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-3 text-stone-700">
                                    <feature.icon className="w-8 h-8 text-teal-600" />
                                    <span className="font-medium">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Rooms Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <h2 className="text-3xl md:text-5xl font-bold text-stone-800 tracking-tighter mb-12 text-center">Alojamientos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Room 1 */}
                            <Card className="border-none shadow-lg overflow-hidden group">
                                <div className="h-64 bg-stone-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-green-400 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Bungalow Ecológico</CardTitle>
                                    <CardDescription>Rustic chic en armonía con el entorno</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-stone-600 space-y-2">
                                        <li>• Baño privado al aire libre</li>
                                        <li>• Porche con hamaca</li>
                                        <li>• Construcción de bambú</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full rounded-full" variant="outline">Ver Disponibilidad</Button>
                                </CardFooter>
                            </Card>

                            {/* Room 2 */}
                            <Card className="border-none shadow-lg overflow-hidden group">
                                <div className="h-64 bg-stone-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-500 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Glamping Tent</CardTitle>
                                    <CardDescription>Acampa con estilo y confort</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-stone-600 space-y-2">
                                        <li>• Cama Queen real</li>
                                        <li>• Electricidad y WiFi</li>
                                        <li>• Sonidos de la naturaleza</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full rounded-full" variant="outline">Ver Disponibilidad</Button>
                                </CardFooter>
                            </Card>

                            {/* Room 3 */}
                            <Card className="border-none shadow-lg overflow-hidden group">
                                <div className="h-64 bg-stone-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-600 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Dormitorio Nature</CardTitle>
                                    <CardDescription>Comparte en un ambiente tranquilo</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-stone-600 space-y-2">
                                        <li>• Espacioso y aireado</li>
                                        <li>• Vistas al jardín</li>
                                        <li>• Ideal para grupos</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full rounded-full" variant="outline">Ver Disponibilidad</Button>
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
