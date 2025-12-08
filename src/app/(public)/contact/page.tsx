"use client"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { LocationMap } from "@/components/shared/location-map"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="bg-stone-50 min-h-screen">
            <Hero
                title="Contáctanos"
                subtitle="Estamos aquí para ayudarte a planificar tu próxima aventura en el lago Atitlán."
                backgroundGradient="linear-gradient(to right, #4b5563, #1f2937)"
                height="large"
                align="center"
            />

            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info & Form */}
                    <FadeIn>
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold text-stone-800 mb-6">Envíanos un mensaje</h2>
                                <p className="text-stone-600 mb-8">
                                    ¿Tienes dudas sobre disponibilidad, grupos o eventos? Escríbenos y te responderemos lo antes posible.
                                </p>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre</Label>
                                            <Input id="name" placeholder="Tu nombre" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="tu@email.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Asunto</Label>
                                        <Input id="subject" placeholder="¿En qué podemos ayudarte?" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Mensaje</Label>
                                        <Textarea id="message" placeholder="Escribe tu mensaje aquí..." className="min-h-[150px]" />
                                    </div>
                                    <Button size="lg" className="w-full md:w-auto rounded-full px-8">Enviar Mensaje</Button>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-200 pt-8">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="p-3 bg-stone-100 rounded-full">
                                        <Phone className="w-6 h-6 text-stone-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900">Teléfono</h3>
                                        <p className="text-stone-600 text-sm">+502 1234 5678</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="p-3 bg-stone-100 rounded-full">
                                        <Mail className="w-6 h-6 text-stone-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900">Email</h3>
                                        <p className="text-stone-600 text-sm">info@mandalas.com</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="p-3 bg-stone-100 rounded-full">
                                        <MapPin className="w-6 h-6 text-stone-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900">Ubicación</h3>
                                        <p className="text-stone-600 text-sm">San Pedro La Laguna</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Map Section */}
                    <FadeIn delay={0.2} className="h-full">
                        <div className="sticky top-24 h-full min-h-[500px] flex flex-col justify-center">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-stone-800 mb-2">Nuestras Ubicaciones</h2>
                                <p className="text-stone-600">Encuentra fácilmente el Pueblo y el Hideout.</p>
                            </div>
                            <LocationMap />
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    )
}
