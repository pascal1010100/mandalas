"use client"

import { useState } from "react"

import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { LocationMap } from "@/components/shared/location-map"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
    const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success">("idle")

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-amber-500/30 overflow-hidden relative">

            {/* 1. Living Light Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Main Canvas */}
                <div className="absolute inset-0 bg-stone-950" />

                {/* Pueblo Breath (Amber) - Left/Center */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-amber-600/20 blur-[120px] rounded-full mix-blend-screen opacity-60 animate-pulse-slow" />

                {/* Hideout Breath (Lime) - Bottom/Right */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-lime-900/30 blur-[100px] rounded-full mix-blend-screen opacity-50 animate-pulse-slower" />
            </div>

            {/* 2. Texture Overlay (Noise) */}
            <div className="fixed inset-0 z-1 pointer-events-none opacity-[0.03] mix-blend-overlay">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                />
            </div>

            <div className="relative z-10">
                <Hero
                    title="Convergencia"
                    subtitle="Donde fuego y tierra se encuentran."
                    backgroundGradient="transparent"
                    height="large"
                    align="center"
                />

                <div className="container mx-auto px-4 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* 3. The Glass Monolith (Form) */}
                        <div className="lg:col-span-7">
                            <FadeIn>
                                <div className="relative backdrop-blur-2xl bg-stone-900/60 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/5">
                                    {/* Inner Glow */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-50" />

                                    <div className="mb-12">
                                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-stone-100 mb-6 tracking-tight leading-tight">
                                            Inicia el <span className="text-amber-500/80 italic font-serif">Ritual</span>
                                        </h2>
                                        <p className="text-stone-400 font-light text-lg max-w-lg leading-relaxed">
                                            El espacio está listo. Cuéntanos tu intención y nosotros preparamos el escenario.
                                        </p>
                                    </div>

                                    {submitStatus === "success" ? (
                                        <div className="py-20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-lime-600 flex items-center justify-center mx-auto shadow-2xl shadow-lime-900/20">
                                                <div className="w-10 h-10 text-white animate-pulse">✨</div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-bold font-heading text-stone-100">Mensaje Recibido</h3>
                                                <p className="text-stone-400 max-w-sm mx-auto leading-relaxed">
                                                    Tu intención ha sido liberada al universo (y a nuestro inbox). Te responderemos pronto.
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => setSubmitStatus("idle")}
                                                variant="outline"
                                                className="border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white rounded-full mt-4"
                                            >
                                                Enviar otro mensaje
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            setSubmitStatus("submitting")
                                            // Simulate delay
                                            setTimeout(() => setSubmitStatus("success"), 1500)
                                        }} className="space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4 group">
                                                    <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium group-focus-within:text-amber-500 transition-colors">Tu Nombre</Label>
                                                    <Input
                                                        required
                                                        id="name"
                                                        placeholder="Ej. Ana García"
                                                        className="border-b border-t-0 border-x-0 border-stone-800 bg-transparent px-0 h-10 text-xl font-light text-stone-200 placeholder:text-stone-700 focus-visible:border-amber-500 focus-visible:ring-0 rounded-none transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-4 group">
                                                    <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium group-focus-within:text-lime-500 transition-colors">Correo Electrónico</Label>
                                                    <Input
                                                        required
                                                        id="email"
                                                        type="email"
                                                        placeholder="contacto@email.com"
                                                        className="border-b border-t-0 border-x-0 border-stone-800 bg-transparent px-0 h-10 text-xl font-light text-stone-200 placeholder:text-stone-700 focus-visible:border-lime-500 focus-visible:ring-0 rounded-none transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 group">
                                                <Label htmlFor="subject" className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium group-focus-within:text-stone-300 transition-colors">Intención</Label>
                                                <Input
                                                    required
                                                    id="subject"
                                                    placeholder="¿Retiro, Aventura o Descanso Profundo?"
                                                    className="border-b border-t-0 border-x-0 border-stone-800 bg-transparent px-0 h-10 text-xl font-light text-stone-200 placeholder:text-stone-700 focus-visible:border-stone-400 focus-visible:ring-0 rounded-none transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-4 group">
                                                <Label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium group-focus-within:text-stone-300 transition-colors">Mensaje</Label>
                                                <Textarea
                                                    required
                                                    id="message"
                                                    placeholder="Comparte los detalles de tu viaje..."
                                                    className="min-h-[120px] resize-none border-b border-t-0 border-x-0 border-stone-800 bg-transparent px-0 text-xl font-light text-stone-200 placeholder:text-stone-700 focus-visible:border-stone-400 focus-visible:ring-0 rounded-none transition-colors leading-relaxed"
                                                />
                                            </div>

                                            <div className="pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={submitStatus === "submitting"}
                                                    size="lg"
                                                    className="w-full md:w-auto rounded-full px-12 py-8 text-lg font-medium tracking-wide bg-stone-100 text-stone-900 hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] border-0 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {submitStatus === "submitting" ? "Enviando..." : "Enviar Mensaje"}
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </FadeIn>
                        </div>

                        {/* 4. Portal Cards Sidebar (Artifacts) */}
                        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
                            <FadeIn delay={0.2}>
                                <div className="group p-8 py-10 bg-stone-900/40 backdrop-blur-sm border border-white/5 hover:bg-stone-900/60 hover:border-amber-500/20 transition-all duration-700 rounded-2xl relative overflow-hidden cursor-default">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/10 transition-all duration-700" />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-full bg-white/5 text-amber-500/80 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-all duration-500">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-heading font-bold text-xl text-stone-200 tracking-wide">Voz Viva</h3>
                                        </div>

                                        <p className="text-stone-500 font-light text-sm leading-relaxed mb-6 group-hover:text-stone-400 transition-colors">
                                            Para cuando la escritura no es suficiente. Escucha el sonido del pueblo.
                                        </p>

                                        <a href="tel:+50212345678" className="text-2xl text-stone-200 font-mono tracking-tighter hover:text-amber-200 transition-colors cursor-pointer hover:underline decoration-amber-500/50 underline-offset-4">+502 1234 5678</a>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.3}>
                                <div className="group p-8 py-10 bg-stone-900/40 backdrop-blur-sm border border-white/5 hover:bg-stone-900/60 hover:border-lime-500/20 transition-all duration-700 rounded-2xl relative overflow-hidden cursor-default">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-lime-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-lime-500/10 transition-all duration-700" />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-full bg-white/5 text-lime-500/80 group-hover:text-lime-400 group-hover:bg-lime-500/10 transition-all duration-500">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-heading font-bold text-xl text-stone-200 tracking-wide">Correo Etéreo</h3>
                                        </div>

                                        <p className="text-stone-500 font-light text-sm leading-relaxed mb-6 group-hover:text-stone-400 transition-colors">
                                            Para propuestas profundas, historias largas o planes detallados.
                                        </p>

                                        <a href="mailto:info@mandalashostal.com" className="text-lg text-stone-200 font-mono tracking-wide hover:text-lime-200 transition-colors cursor-pointer hover:underline decoration-lime-500/50 underline-offset-4">info@mandalashostal.com</a>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.4}>
                                <div className="relative h-[280px] w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000">
                                    <LocationMap />
                                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
