import Image from "next/image"
import Link from "next/link"
import {
    ArrowDown,
    ArrowRight,
    CircleAlert,
    ExternalLink,
    MapPin,
    MessageCircle,
    ShipWheel,
    Signpost,
} from "lucide-react"

import { buildContactHref } from "@/lib/public-contact"
import { guideContent, type GuideContent, type GuideRoute } from "./guide-content"

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-stone-950"

export default function GuidePage() {
    return <GuidePageContent content={guideContent} />
}

export function GuidePageContent({ content, locale = "en" }: { content: GuideContent; locale?: "en" | "es" }) {
    const es = locale === "es"
    const prefix = es ? "/es" : ""
    const guideSections = [
        { id: "routes", label: es ? "Elige tu ruta" : "Choose your route" },
        { id: "arrival", label: es ? "Llega a tu estancia" : "Reach your stay" },
        { id: "checklist", label: es ? "Antes de salir" : "Before you leave" },
        { id: "faq", label: es ? "Si cambian los planes" : "If plans change" },
        { id: "sources", label: es ? "Fuentes" : "Sources" },
    ] as const
    const originRoutes = content.routes.filter(({ id }) => ["guatemala-city", "antigua", "panajachel"].includes(id))
    const transportRoutes = content.routes.filter(({ id }) => ["road", "boat"].includes(id))
    const propertyPresentation = {
        mandalas: { href: `${prefix}/pueblo`, label: es ? "Céntrico · caminable · social" : "Central · walkable · social", accent: "amber" as const },
        hideout: { href: `${prefix}/hideout`, label: es ? "Más tranquilo · fuera del centro" : "Quieter · outside the center", accent: "lime" as const },
    }
    const t = es ? {
        explore: "Explorar la guía", sections: "Secciones de la guía", inGuide: "En esta guía", noticeAria: "Aviso sobre información de viaje", important: "Importante: los detalles del viaje pueden cambiar.",
        start: "Empieza aquí", routeTitle: "Elige la ruta que coincide con tu boleto", routeDescription: "Primero identifica dónde termina el transporte que reservaste. Ese destino indica si San Pedro es tu llegada por carretera o tu siguiente parada en lancha.", connection: "Tu conexión final",
        help: "Ayuda con la conexión final", unsure: "¿No sabes cómo llegar a la propiedad que reservaste?", helpDescription: "Envía al equipo de Mandalas tu punto de partida, hora estimada de llegada y nombre de la propiedad antes de viajar.", ask: "Consultar sobre mi llegada", newTab: " Abre en una pestaña nueva.",
        once: "Cuando llegues a San Pedro", steps: "Tres pasos hasta la puerta correcta", stepsDescription: "Mandalas y Hideout son destinos diferentes. Usa el nombre de tu reserva antes de caminar o subir a un tuk-tuk.", waterfrontAlt: "La ribera y el pueblo de San Pedro La Laguna junto al Lago de Atitlán",
        chooseDestination: "Elige tu destino", match: "Haz coincidir la propiedad de tu reserva", arrivalDetails: "detalles de llegada", character: "Tipo de estancia", reference: "Referencia de llegada", maps: "Abrir en Google Maps", property: "Conocer la propiedad",
        before: "Antes de salir", four: "Cuatro detalles que conviene revisar una vez", fourDescription: "Guarda estos cuatro datos antes del viaje. Juntos te darán lo necesario para avanzar por cada conexión con confianza.",
        changes: "Si cambian los planes", changesDescription: "Los planes pueden cambiar. Empieza por la situación que se parece a la tuya y da solamente el siguiente paso.", references: "Referencias públicas", sources: "Fuentes de esta guía", sourcesDescription: "Las direcciones y referencias de transporte están enlazadas para mayor transparencia.", open: "Abrir", close: "Cerrar",
    } : {
        explore: "Explore the guide", sections: "Guide sections", inGuide: "In this guide", noticeAria: "Travel information notice", important: "Important: travel details can change.",
        start: "Start here", routeTitle: "Choose the route that matches your ticket", routeDescription: "First identify where your booked transport ends. Once you know that endpoint, you’re past the hardest decision: it tells you whether San Pedro is your road destination or your next boat stop.", connection: "Your final connection",
        help: "Help with the final connection", unsure: "Not sure how to reach your booked property?", helpDescription: "Send the Mandalas team your starting point, expected arrival time, and property name before you travel.", ask: "Ask about your arrival", newTab: " Opens in a new tab.",
        once: "Once you reach San Pedro", steps: "Three steps to the right front door", stepsDescription: "Mandalas and Hideout are different destinations. Use the name on your reservation before you walk or enter a tuk-tuk.", waterfrontAlt: "San Pedro La Laguna waterfront and town on Lake Atitlán",
        chooseDestination: "Choose your destination", match: "Match the property on your reservation", arrivalDetails: "arrival details", character: "Stay character", reference: "Arrival reference", maps: "Open in Google Maps", property: "Explore the property",
        before: "Before you leave", four: "Four details worth checking once", fourDescription: "Save these four essentials before the trip. Once they are together, you have what you need to move through each connection with confidence.",
        changes: "If plans change", changesDescription: "Plans can change. Start with the situation that matches yours, then take only the next step.", references: "Public references", sources: "Sources behind this guide", sourcesDescription: "Addresses and transport references are linked for transparency.", open: "Open", close: "Close",
    }
    return (
        <div className="min-h-screen bg-stone-950 text-white selection:bg-amber-200 selection:text-amber-950">
            <header className="relative flex min-h-[88svh] items-center overflow-hidden pb-10 pt-24 sm:pb-14 md:min-h-[90vh] md:pb-16 md:pt-28">
                <Image
                    src="/images/mandalas/guide-lancha.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-[52%_center] motion-safe:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-stone-950" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,9,0.62)_0%,rgba(12,10,9,0.22)_58%,rgba(12,10,9,0.06)_100%)]" />

                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl">
                        <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                            <span className="h-px w-8 bg-amber-300" aria-hidden="true" />
                            {content.eyebrow}
                        </p>
                        <h1 className="max-w-4xl text-balance font-heading text-[clamp(2.5rem,5.4vw,5rem)] font-light uppercase leading-[0.97] tracking-[0.035em] text-white drop-shadow-2xl">
                            {content.title}
                        </h1>
                        <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-stone-200 sm:text-lg sm:leading-8">
                            {content.introduction}
                        </p>
                        <a
                            href="#guide-index"
                            className={`${focusRing} mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-white/30 bg-stone-950/35 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-[background-color,color,border-color] duration-300 hover:border-white hover:bg-white hover:text-stone-950 motion-reduce:transition-none`}
                        >
                            {t.explore}
                            <ArrowDown className="size-4" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </header>

            <nav
                id="guide-index"
                aria-label={t.sections}
                className="sticky top-20 z-30 scroll-mt-28 border-y border-white/10 bg-stone-950/95 supports-[backdrop-filter]:bg-stone-950/85 supports-[backdrop-filter]:backdrop-blur-md"
            >
                <div className="container mx-auto px-4 py-3 md:py-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400 md:sr-only">
                        {t.inGuide}
                    </p>
                    <ol className="-mx-4 flex snap-x snap-mandatory gap-1 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
                        {guideSections.map((section, index) => (
                            <li key={section.id} className="shrink-0 snap-start md:shrink">
                                <a
                                    href={`#${section.id}`}
                                    className={`${focusRing} group flex min-h-11 items-center gap-3 border-b border-transparent px-4 py-2 text-sm text-stone-300 transition-[color,background-color,border-color] duration-300 hover:border-white/35 hover:bg-white/[0.045] hover:text-white motion-reduce:transition-none md:justify-between md:px-3`}
                                >
                                    <span className="whitespace-nowrap">
                                        <span className="mr-2 text-xs tabular-nums text-stone-400" aria-hidden="true">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        {section.label}
                                    </span>
                                    <ArrowDown className="hidden size-3.5 shrink-0 text-stone-400 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none xl:block" aria-hidden="true" />
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            </nav>

            <aside aria-label={t.noticeAria} className="border-b border-amber-200/15 bg-amber-200/[0.065] text-white">
                <div className="container mx-auto flex max-w-6xl items-start gap-4 px-4 py-5 md:items-center md:py-6">
                    <CircleAlert className="mt-0.5 size-5 shrink-0 text-amber-200 md:mt-0" aria-hidden="true" />
                    <p className="text-sm leading-6 text-stone-300">
                        <strong className="mr-2 font-semibold text-amber-100">{t.important}</strong>
                        {" "}
                        {content.verificationNotice}
                    </p>
                </div>
            </aside>

            <section id="routes" aria-labelledby="routes-heading" className="scroll-mt-40 py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 xl:gap-28">
                        <div className="lg:sticky lg:top-32 lg:self-start">
                            <SectionIntroduction
                                headingId="routes-heading"
                                label={t.start}
                                title={t.routeTitle}
                                description={t.routeDescription}
                            />
                        </div>

                        <div className="border-t border-white/15">
                            {originRoutes.map((route, index) => (
                                <RouteOverview key={route.id} route={route} index={index} locale={locale} />
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 border-t border-white/15 pt-10 sm:mt-20 sm:pt-12">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                            {t.connection}
                        </p>
                        <div className="mt-7 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-2">
                            {transportRoutes.map((route) => (
                                <ConnectionOverview key={route.id} route={route} locale={locale} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section aria-labelledby="arrival-help-heading" className="border-y border-amber-200/15 bg-[linear-gradient(100deg,rgba(251,191,36,0.08),rgba(255,255,255,0.025)_52%,transparent)] py-8 sm:py-10">
                <div className="container mx-auto grid gap-6 px-4 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
                            {t.help}
                        </p>
                        <h2 id="arrival-help-heading" className="mt-3 font-heading text-2xl font-light uppercase leading-tight tracking-[0.08em] text-white sm:text-3xl">
                            {t.unsure}
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">
                            {t.helpDescription}
                        </p>
                    </div>
                    <a
                        href={buildContactHref(es ? "Hola Mandalas, necesito ayuda para planificar mi llegada. Mi punto de partida es: __. Reservé: __. Mi hora estimada de llegada es: __." : "Hi Mandalas, I need help planning my arrival. My starting point is: __. I booked: __. My expected arrival time is: __.")}
                        target="_blank"
                        rel="noreferrer"
                        className={`${focusRing} inline-flex min-h-12 w-fit items-center gap-2 rounded-full border border-amber-200/35 bg-amber-100 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-amber-950 transition-[background-color,border-color] duration-300 hover:border-white hover:bg-white motion-reduce:transition-none md:justify-self-end`}
                    >
                        <MessageCircle className="size-4" aria-hidden="true" />
                        {t.ask}
                        <span className="sr-only">{t.newTab}</span>
                    </a>
                </div>
            </section>

            <section id="arrival" aria-labelledby="arrival-heading" className="scroll-mt-40 bg-stone-900/55 py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16 xl:gap-24">
                        <div>
                            <SectionIntroduction
                                headingId="arrival-heading"
                                label={t.once}
                                title={t.steps}
                                description={t.stepsDescription}
                            />
                            <div className="relative mt-9 aspect-[16/10] overflow-hidden sm:aspect-[16/8] lg:aspect-[4/3]">
                                <Image
                                    src="/images/mandalas/pueblo-dock-boat.jpg"
                                    alt={t.waterfrontAlt}
                                    fill
                                    sizes="(min-width: 1024px) 44vw, 100vw"
                                    className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-transparent to-transparent" />
                                <p className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.16em] text-white sm:bottom-6 sm:left-6">
                                    San Pedro La Laguna
                                </p>
                            </div>
                        </div>

                        <ol className="border-t border-white/15">
                            {content.sanPedroArrival.map((step, index) => (
                                <li key={step.title} className="grid gap-4 border-b border-white/15 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6 sm:py-8">
                                    <span className="text-sm tabular-nums text-amber-200" aria-hidden="true">
                                        0{index + 1}
                                    </span>
                                    <div>
                                        <h3 className="font-heading text-2xl font-light uppercase leading-tight tracking-[0.08em] text-white">
                                            {step.title}
                                        </h3>
                                        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">
                                            {step.body}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <section aria-labelledby="properties-heading" className="mt-16 sm:mt-20">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                                {t.chooseDestination}
                            </p>
                            <h2 id="properties-heading" className="mt-4 text-balance font-heading text-3xl font-light uppercase leading-tight tracking-[0.08em] text-white sm:text-4xl">
                                {t.match}
                            </h2>
                        </div>

                        <div className="mt-9 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-2">
                            {content.properties.map((property) => {
                                const presentation = propertyPresentation[property.id]
                                const isMandalas = presentation.accent === "amber"

                                return (
                                    <article
                                        key={property.id}
                                        aria-label={`${property.propertyName} ${t.arrivalDetails}`}
                                        className="flex min-h-full flex-col bg-stone-950 p-7 sm:p-9 lg:p-10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`h-px w-8 ${isMandalas ? "bg-amber-200" : "bg-lime-200"}`} aria-hidden="true" />
                                            <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isMandalas ? "text-amber-200" : "text-lime-200"}`}>
                                                {presentation.label}
                                            </p>
                                        </div>
                                        <h3 className="mt-4 font-heading text-3xl font-light uppercase tracking-[0.08em] text-white sm:text-4xl">
                                            {property.propertyName}
                                        </h3>

                                        <dl className="mt-7 divide-y divide-white/10 border-y border-white/10">
                                            <div className="grid gap-2 py-5 sm:grid-cols-[7.5rem_1fr] sm:gap-5">
                                                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                                                    {t.character}
                                                </dt>
                                                <dd className="text-base leading-7 text-stone-200">
                                                    {property.positioning}
                                                </dd>
                                            </div>
                                            <div className="grid gap-2 py-5 sm:grid-cols-[7.5rem_1fr] sm:gap-5">
                                                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                                                    {t.reference}
                                                </dt>
                                                <dd className="text-sm leading-6 text-stone-300">
                                                    {property.arrivalAdvice}
                                                </dd>
                                            </div>
                                        </dl>

                                        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-7">
                                            <a
                                                href={property.mapLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`${focusRing} inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.14em] transition-[background-color,color,border-color] duration-300 motion-reduce:transition-none ${isMandalas ? "border-amber-200/35 bg-amber-200/[0.07] text-amber-100 hover:border-amber-100 hover:bg-amber-100 hover:text-amber-950" : "border-lime-200/35 bg-lime-200/[0.07] text-lime-100 hover:border-lime-100 hover:bg-lime-100 hover:text-lime-950"}`}
                                            >
                                                {t.maps}
                                                <ExternalLink className="size-3.5" aria-hidden="true" />
                                                <span className="sr-only">{t.newTab}</span>
                                            </a>
                                            <Link
                                                href={presentation.href}
                                                className={`${focusRing} inline-flex min-h-11 items-center gap-2 border-b border-white/25 text-xs font-semibold uppercase tracking-[0.14em] text-stone-300 transition-[color,border-color] duration-300 hover:border-white hover:text-white motion-reduce:transition-none`}
                                            >
                                                {t.property}
                                                <ArrowRight className="size-3.5" aria-hidden="true" />
                                            </Link>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </section>
                </div>
            </section>

            <section id="checklist" aria-labelledby="checklist-heading" className="scroll-mt-40 border-y border-stone-300 bg-stone-100 py-16 text-stone-950 sm:py-20 lg:py-24">
                <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 xl:gap-28">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-600">{t.before}</p>
                        <h2 id="checklist-heading" className="mt-4 text-balance font-heading text-4xl font-light uppercase leading-tight tracking-[0.08em] md:text-5xl">
                            {t.four}
                        </h2>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-stone-700 md:text-lg md:leading-8">
                            {t.fourDescription}
                        </p>
                    </div>

                    <ul className="grid border-t border-stone-300 sm:grid-cols-2 sm:gap-x-10 xl:gap-x-14">
                        {content.checklist.map((item, index) => (
                            <li key={item.id} className="border-b border-stone-300 py-6 md:py-7">
                                <div className="flex items-start gap-4">
                                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-stone-400 text-xs tabular-nums text-stone-600" aria-hidden="true">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold leading-6 text-stone-950">{item.label}</h3>
                                        <p className="mt-2 text-sm leading-6 text-stone-700">{item.detail}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-40 py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 xl:gap-28">
                    <div className="lg:sticky lg:top-32 lg:self-start">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                            {t.changes}
                        </p>
                        <h2 id="faq-heading" className="mt-4 text-balance font-heading text-4xl font-light uppercase leading-tight tracking-[0.08em] text-white md:text-5xl">
                            {content.faqHeading}
                        </h2>
                        <p className="mt-6 max-w-xl leading-7 text-stone-400">
                            {t.changesDescription}
                        </p>
                    </div>

                    <div className="border-t border-white/15">
                        {content.faqs.map((faq, index) => (
                            <FaqItem key={faq.id} faq={faq} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            <section id="sources" aria-labelledby="sources-heading" className="scroll-mt-40 border-y border-white/10 bg-stone-900/55 py-14 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">{t.references}</p>
                            <h2 id="sources-heading" className="mt-2 font-heading text-2xl font-light uppercase tracking-[0.08em] text-white sm:text-3xl">
                                {t.sources}
                            </h2>
                        </div>
                        <p className="max-w-md text-sm leading-6 text-stone-400">
                            {t.sourcesDescription}
                        </p>
                    </div>
                    <details className="group mt-7 border-y border-white/15">
                        <summary className={`${focusRing} flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 marker:hidden [&::-webkit-details-marker]:hidden`}>
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-300">
                                {es ? `Ver ${content.sources.length} fuentes` : `View ${content.sources.length} sources`}
                            </span>
                            <span className="flex shrink-0 items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-300">
                                <span className="group-open:hidden">{t.open}</span>
                                <span className="hidden group-open:inline">{t.close}</span>
                                <ArrowDown className="size-4 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                            </span>
                        </summary>
                        <ul className="grid border-t border-white/15 md:grid-cols-2 md:gap-x-10 xl:gap-x-14">
                            {content.sources.map((source) => (
                                <SourceItem key={source.url} source={source} newTabLabel={t.newTab} />
                            ))}
                        </ul>
                    </details>
                </div>
            </section>
        </div>
    )
}

function FaqItem({ faq, index }: { faq: GuideContent["faqs"][number]; index: number }) {
    return (
        <details className="group border-b border-white/15">
            <summary className={`${focusRing} grid min-h-16 cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-center gap-3 py-6 marker:hidden [&::-webkit-details-marker]:hidden sm:gap-5`}>
                <span className="text-xs tabular-nums text-stone-400" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-lg font-medium leading-snug tracking-[0.03em] text-white sm:text-xl">
                    {faq.question}
                </span>
                <ArrowDown className="size-4 text-stone-400 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
            </summary>
            <p className="max-w-2xl pb-7 pl-11 pr-8 leading-7 text-stone-300 sm:pl-[3.25rem]">
                {faq.answer}
            </p>
        </details>
    )
}

function SourceItem({ source, newTabLabel }: { source: GuideContent["sources"][number]; newTabLabel: string }) {
    return (
        <li className="border-b border-white/15">
            <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className={`${focusRing} group flex min-h-full flex-col py-7 transition-colors hover:bg-white/[0.035] motion-reduce:transition-none sm:px-4 md:py-8`}
            >
                <span className="flex items-start justify-between gap-5">
                    <span className="font-heading text-xl font-medium leading-snug tracking-[0.03em] text-white md:text-2xl">
                        {source.label}
                    </span>
                    <ExternalLink className="mt-1 size-4 shrink-0 text-stone-400 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
                </span>
                <span className="sr-only">{newTabLabel}</span>
                <span className="mt-5 text-sm leading-6 text-stone-400">
                    {source.note}
                </span>
            </a>
        </li>
    )
}

function SectionIntroduction({
    headingId,
    label,
    title,
    description,
}: {
    headingId: string
    label: string
    title: string
    description: string
}) {
    return (
        <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">{label}</p>
            <h2 id={headingId} className="mt-4 text-balance font-heading text-4xl font-light uppercase leading-tight tracking-[0.08em] text-white md:text-5xl">
                {title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-400 md:text-lg md:leading-8">
                {description}
            </p>
        </div>
    )
}

function RouteOverview({ route, index, locale = "en" }: { route: GuideRoute; index: number; locale?: "en" | "es" }) {
    return (
        <article className="grid gap-4 border-b border-white/15 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6 sm:py-8">
            <span className="text-sm tabular-nums text-amber-200" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
            </span>
            <div>
                <h3 className="font-heading text-2xl font-light uppercase leading-tight tracking-[0.08em] text-white">
                    {route.origin}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{route.summary}</p>
                <p className="mt-3 text-sm leading-6 text-stone-400">
                    <strong className="font-semibold text-stone-200">{locale === "es" ? "Antes de salir:" : "Before you go:"}</strong> {" "}{route.planningNote}
                </p>
            </div>
        </article>
    )
}

function ConnectionOverview({ route, locale = "en" }: { route: GuideRoute; locale?: "en" | "es" }) {
    const isBoat = route.id === "boat"
    const Icon = isBoat ? ShipWheel : Signpost

    return (
        <article className="bg-stone-950 p-7 sm:p-9 lg:p-10">
            <div className="flex items-center gap-4">
                <span className={`flex size-11 items-center justify-center rounded-full border ${isBoat ? "border-lime-300/35 text-lime-200" : "border-amber-300/35 text-amber-200"}`}>
                    <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">{locale === "es" ? "Medio de viaje" : "Travel mode"}</p>
                    <h3 className="mt-1 font-heading text-3xl font-light uppercase tracking-[0.08em] text-white">
                        {isBoat ? (locale === "es" ? "En lancha pública" : "By public boat") : (locale === "es" ? "Por carretera" : "By road")}
                    </h3>
                </div>
            </div>
            <p className="mt-6 leading-7 text-stone-300">{route.summary}</p>

            <ul className="mt-7 space-y-4 border-t border-white/10 pt-6">
                {route.steps.map((step) => (
                    <li key={step.title} className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-6">
                        <span className={`mt-2 size-1.5 rounded-full ${isBoat ? "bg-lime-300" : "bg-amber-300"}`} aria-hidden="true" />
                        <p className="text-stone-400">
                            <strong className="font-semibold text-white">{step.title}.</strong> {step.body}
                        </p>
                    </li>
                ))}
            </ul>

            <div className="mt-7 flex gap-3 border-t border-white/10 pt-6 text-sm leading-6 text-stone-300">
                <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
                <p>{route.planningNote}</p>
            </div>
        </article>
    )
}
