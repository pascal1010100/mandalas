import { Hero } from "@/components/shared/hero"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal"
import { Waves, Moon, Sprout, BedDouble, DoorClosed, ShieldCheck, MapPin, Bike, Utensils, Clock, Luggage, Wifi, Music2, Instagram } from "lucide-react"
import { ConsultationLink } from "@/components/shared/consultation-link"
import { ExperienceSection } from "@/components/shared/experience-section"
import { PracticalDetails } from "@/components/shared/practical-details"
import { PropertyGallery } from "@/components/shared/property-gallery"
import { StayOptions } from "@/components/shared/stay-options"
import { publicContact } from "@/lib/public-contact"

export default function HideoutPage() {
    return <HideoutPageContent />
}

export function HideoutPageContent({ locale = "en" }: { locale?: "en" | "es" }) {
    const es = locale === "es"
    const features = es ? [
        { icon: Waves, label: "Camina al lago" }, { icon: Bike, label: "Bicicletas gratis" }, { icon: Utensils, label: "Cocina equipada" }, { icon: Wifi, label: "WiFi para trabajar" }, { icon: Moon, label: "Noches tranquilas" }, { icon: Sprout, label: "Fuera del centro" },
    ] : [
        { icon: Waves, label: "Walk to lake" }, { icon: Bike, label: "Free bikes" }, { icon: Utensils, label: "Equipped kitchen" }, { icon: Wifi, label: "Work-ready WiFi" }, { icon: Moon, label: "Quiet nights" }, { icon: Sprout, label: "Outside center" },
    ]
    const quickDetails = es ? [
        { icon: Waves, title: "Lago cercano", description: "A pocos minutos caminando de la orilla." }, { icon: Bike, title: "Bicicletas", description: "Bicicletas gratuitas para huéspedes, útiles para ir al centro." }, { icon: Utensils, title: "Cocina", description: "Cocina equipada para preparar algo durante tu estancia." }, { icon: Clock, title: "Horarios", description: "Check-in de 15:00 a 24:00. Check-out hasta las 10:00." }, { icon: Luggage, title: "Equipaje", description: "Servicio gratuito para guardar equipaje." }, { icon: MapPin, title: "Ubicación", description: "Aproximadamente a 1.7 km del centro de San Pedro." },
    ] : [
        { icon: Waves, title: "Lake nearby", description: "A few minutes walking from the shore." }, { icon: Bike, title: "Bikes", description: "Free bikes for guests, useful for moving into town." }, { icon: Utensils, title: "Kitchen", description: "Equipped kitchen for preparing something light during your stay." }, { icon: Clock, title: "Hours", description: "Check-in 15:00-24:00. Check-out until 10:00." }, { icon: Luggage, title: "Luggage", description: "Free luggage storage available." }, { icon: MapPin, title: "Location", description: "About 1.7 km from the center of San Pedro." },
    ]
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Hostel",
                        "name": "Mandalas Hideout",
                        "description": es ? "Una base más tranquila para dormir mejor, caminar junto al lago y bajar el volumen de San Pedro." : "A quieter base for better sleep, lake walks, and turning down the volume of San Pedro.",
                        "url": `https://www.mandalashostels.com${es ? "/es" : ""}/hideout`,
                        "inLanguage": locale,
                        "telephone": "+50257545638",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "San Pedro La Laguna",
                            "addressRegion": "Sololá",
                            "addressCountry": "GT"
                        },
                        "image": "https://www.mandalashostels.com/images/mandalas/hostelworld/hideout-terrace-dusk.jpg"
                    })
                }}
            />
        <div className="bg-background min-h-screen">
            <Hero
                title="Hideout"
                seoContext={es ? "Hostal tranquilo cerca del Lago de Atitlán" : "Quiet hostel near Lake Atitlán"}
                subtitle={es ? "Una base más tranquila para dormir mejor, caminar junto al lago y bajar el volumen de San Pedro." : "A quieter base for better sleep, lake walks, and turning down the volume of San Pedro."}
                backgroundImage="/images/mandalas/hostelworld/hideout-terrace-dusk.jpg"
                backgroundImageMobile="/images/mandalas/hostelworld/hideout-exterior-volcano.jpg"
                backgroundPosition="32% 50%"
                backgroundPositionMobile="center 44%"
                overlayClassName="bg-gradient-to-b from-black/28 via-black/12 to-black/58"
                radialOverlayClassName="bg-[radial-gradient(circle_at_55%_35%,transparent_0%,rgba(0,0,0,0.08)_44%,rgba(0,0,0,0.48)_100%)]"
                imageClassName="brightness-[1.08] saturate-[1.05]"
                align="left"
            >
                <ConsultationLink
                    locale={locale}
                    location="Mandalas Hideout"
                    size="lg"
                    data-property-hero-booking-cta
                    className="h-12 border-white/25 bg-white px-8 text-stone-950 hover:bg-stone-200 gap-2"
                >
                    {es ? "Reservar Hideout" : "Book Hideout"}
                </ConsultationLink>
            </Hero>

            {/* Intro Section */}
            <section className="py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-light font-heading text-foreground uppercase tracking-[0.2em]">{es ? "Baja el ritmo" : "Slow the rhythm"}</h2>
                        <div className="mx-auto h-px w-24 bg-lime-300/40" />
                        <p className="text-lg text-muted-foreground leading-loose font-light tracking-wide max-w-2xl mx-auto">
                            {es ? "Hideout es The Hideout Hub: un lugar para trabajar cerca de las montañas, disfrutar buena música y un bar acogedor, y acercarte al lago sin prisa. Los huéspedes de ambas propiedades Mandalas también pueden disfrutarlo." : "Hideout is The Hideout Hub: a place to work remotely near the mountains, enjoy good music and a welcoming bar, and move toward the lake slowly. Guests staying at either Mandalas property can enjoy it too."}
                        </p>
                        <StaggerReveal className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8" delay={0.2}>
                            {features.map((feature, idx) => (
                                <StaggerItem key={idx} className="flex flex-col items-center gap-4 text-muted-foreground/80 group">
                                    <feature.icon className="w-6 h-6 text-lime-600/80 stroke-[1.5px] group-hover:text-lime-500 transition-colors" />
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
                                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-lime-300/60">
                                    {es ? "Conviene saber" : "Good to know"}
                                </p>
                                <h2 className="font-heading text-3xl font-light uppercase leading-tight tracking-[0.14em] text-white md:text-4xl">
                                    {es ? "Tranquilo y práctico" : "Quiet, but practical"}
                                </h2>
                                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    {es ? "Hideout funciona como un refugio: noches más tranquilas, acceso sencillo al lago y lo necesario para que el viaje no dependa siempre del centro." : "Hideout works like a refuge: calmer nights, simple lake access, and what you need so the trip does not always depend on the center."}
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {quickDetails.map((detail) => (
                                    <div key={detail.title} className="border-t border-white/10 py-5">
                                        <detail.icon className="mb-4 h-5 w-5 text-lime-300/70" />
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
                eyebrow={es ? "El lugar" : "The place"}
                title={es ? "Montañas cerca, noches más suaves" : "Mountains nearby, softer nights"}
                description={es ? "Hideout se entiende mejor por sus contrastes: una entrada frente al volcán, una terraza para bajar el ritmo y espacios comunes más tranquilos que el centro." : "Hideout is best understood by its contrasts: a volcano-facing entrance, a terrace for slowing down, and common spaces that feel gentler than the center."}
                accent="lime"
                images={[
                    {
                        src: "/images/mandalas/hostelworld/hideout-terrace-dusk.jpg",
                        alt: es ? "Terraza de Mandalas Hideout al atardecer" : "Mandalas Hideout terrace at dusk",
                        label: es ? "Terraza" : "Terrace",
                    },
                    {
                        src: "/images/mandalas/hostelworld/hideout-courtyard-night.jpg",
                        alt: es ? "Patio de Mandalas Hideout por la noche" : "Mandalas Hideout courtyard at night",
                        label: es ? "Patio" : "Courtyard",
                    },
                    {
                        src: "/images/mandalas/hostelworld/hideout-exterior-volcano.jpg",
                        alt: es ? "Entrada de Mandalas Hideout con el volcán al fondo" : "Mandalas Hideout entrance with volcano in the background",
                        label: es ? "Entrada" : "Entrance",
                    },
                ]}
            />

            <ExperienceSection
                eyebrow={es ? "Trabajo, música y lago" : "Work, music, lake time"}
                title={es ? "Un mejor ritmo para el día" : "A better rhythm for the day"}
                description={es ? "Trabaja cuando lo necesites, conoce gente con buena música y mantén cerca el lago y las montañas sin quedarte en medio del ruido del pueblo. El acceso está incluido para huéspedes registrados de ambas propiedades." : "Work when you need to, meet people over good music, and keep the lake and mountains close without staying in the middle of the town's noise. Access is included for registered guests from either Mandalas property."}
                accent="lime"
                items={[
                    {
                        icon: Wifi,
                        title: es ? "Trabajo a distancia" : "Work remotely",
                        description: es ? "Dos redes WiFi, incluida una opción más rápida que puede superar 100 Mbps según disponibilidad, y una base relajada para trabajar." : "Two Wi-Fi networks, including a faster option that can exceed 100 Mbps depending on availability, plus a relaxed base for getting work done.",
                    },
                    {
                        icon: Music2,
                        title: es ? "Bar y buena música" : "Bar and good music",
                        description: es ? "Un bar acogedor con buena música y un gran ambiente para disfrutar la tarde o la noche." : "A welcoming bar with good music and a great atmosphere for easing into the afternoon or evening.",
                    },
                    {
                        icon: Waves,
                        title: es ? "Lago y montañas" : "Lake and mountains",
                        description: es ? "Empieza sin prisa, acércate al agua y vuelve a un lugar donde la naturaleza sigue siendo parte de la estancia." : "Start slowly, head to the water, and return to a place that keeps nature part of the stay.",
                    },
                ]}
            />

            <PracticalDetails
                eyebrow={es ? "Cómo se siente" : "How it feels"}
                title={es ? "Una estancia con pausa" : "A stay with pause"}
                description={es ? "Elige Hideout si prefieres dormir con más calma, moverte junto al lago y volver a un lugar menos concurrido." : "Choose Hideout if you prefer calmer sleep, lake movement, and returning to a less crowded place."}
                accent="lime"
                details={[
                    {
                        icon: Sprout,
                        title: es ? "Fuera del centro" : "Outside the center",
                        description: es ? "Ideal si priorizas la calma y prefieres no dormir en medio del movimiento." : "Ideal if you prioritize calm and prefer not to sleep in the middle of the movement.",
                    },
                    {
                        icon: Waves,
                        title: es ? "Lago cercano" : "Lake nearby",
                        description: es ? "A pocos minutos a pie para caminar, nadar, remar o empezar el día con más calma." : "A few minutes on foot for walking, swimming, kayaking, or starting the day more slowly.",
                    },
                    {
                        icon: Bike,
                        title: es ? "Movimiento sencillo" : "Easy movement",
                        description: es ? "Las bicicletas ayudan a llegar al centro sin tener que dormir en medio de él." : "The bikes help you reach the center without having to sleep right on top of it.",
                    },
                    {
                        icon: MapPin,
                        title: es ? "San Pedro sigue cerca" : "San Pedro stays close",
                        description: es ? "La estancia está aproximadamente a 1.7 km del centro, suficiente para sentir una energía distinta." : "The stay is about 1.7 km from the center, enough to feel a different energy.",
                    },
                    {
                        icon: Waves,
                        title: es ? "Acceso a Hideout Hub" : "Hideout Hub access",
                        description: es ? "Los huéspedes de ambas propiedades pueden usar el bar y los espacios de trabajo de Hideout. Consulta en recepción las condiciones actuales de acceso al lago." : "Guests from either property can use the Hideout bar and work-friendly spaces. Ask reception about current lake access arrangements.",
                    },
                    {
                        icon: Bike,
                        title: es ? "Acceso a Mandalas en el pueblo" : "Mandalas town access",
                        description: es ? "Los huéspedes de Hideout pueden ir al pueblo cuando quieran un ritmo más céntrico." : "Hideout guests can head into town when they want a more central rhythm.",
                    },
                ]}
            />

            <StayOptions
                locale={locale}
                eyebrow={es ? "Dormir en Hideout" : "Sleep at Hideout"}
                title={es ? "Formas de dormir con más calma" : "Ways to sleep with more quiet"}
                description={es ? "Opciones compartidas y privadas para bajar el ritmo, con detalles, fechas y precios finales en el motor oficial de Cloudbeds." : "Shared and private options for slowing down, with room details, dates and final prices in the official Cloudbeds engine."}
                location="Mandalas Hideout"
                accent="lime"
                options={[
                    {
                        icon: ShieldCheck,
                        title: es ? "Dormitorio femenino" : "Female Dorm",
                        subtitle: es ? "calma" : "calm",
                        description: es ? "Para viajeras que buscan una base compartida con una energía más suave." : "For women travelers looking for a shared base with softer energy.",
                        details: es ? ["Solo mujeres", "Más tranquilidad", "Lago cercano"] : ["Female only", "More quiet", "Lake nearby"],
                        price: es ? "Según fecha" : "By date",
                        roomName: "Female Dorm",
                    },
                    {
                        icon: BedDouble,
                        title: es ? "Dormitorio mixto" : "Mixed Dorm",
                        subtitle: es ? "social tranquilo" : "soft social",
                        description: es ? "Para compartir el viaje sin dormir encima del ruido del centro." : "For sharing the trip without sleeping on top of the center's noise.",
                        details: es ? ["Compartido", "Lago cercano", "Caminatas"] : ["Shared", "Lake nearby", "Walks"],
                        price: es ? "Según fecha" : "By date",
                        roomName: "Mixed Dorm",
                    },
                    {
                        icon: DoorClosed,
                        title: es ? "Habitación privada" : "Private Room",
                        subtitle: es ? "pausa" : "pause",
                        description: es ? "Para parejas o viajeros sin prisa que quieren más privacidad para descansar." : "For couples or slower travelers who want more privacy to rest.",
                        details: es ? ["Privacidad", "Más tranquilidad", "Viaje sin prisa"] : ["Privacy", "More quiet", "Slow travel"],
                        price: es ? "Según fecha" : "By date",
                        roomName: "Private Room",
                    },
                ]}
            />

            {/* CTA */}
            <section className="py-24 bg-stone-900 text-white text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-light font-heading uppercase tracking-[0.12em] mb-6">{es ? "Baja el ritmo" : "Slow down"}</h2>
                    <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">{es ? "Elige tus fechas y reserva directamente el lado más tranquilo de San Pedro." : "Choose your dates and book the quieter side of San Pedro directly."}</p>
                    <div className="flex flex-col items-center gap-5">
                        <ConsultationLink
                            locale={locale}
                            location="Mandalas Hideout"
                            size="lg"
                            className="h-12 border-white/20 bg-white px-10 text-stone-950 hover:bg-stone-200 gap-2"
                        >
                            {es ? "Reservar Hideout" : "Book Hideout"}
                        </ConsultationLink>
                        <a
                            href={publicContact.instagram.hideout}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-stone-500 transition-colors hover:text-lime-200"
                        >
                            <Instagram className="h-4 w-4" />
                            @mandalashideout
                        </a>
                    </div>
                </FadeIn>
            </section>
        </div>
        </>
    )
}
