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
import { guideContent, type GuideRoute } from "./guide-content"

const guideSections = [
    { id: "routes", label: "Choose your route" },
    { id: "arrival", label: "Reach your stay" },
    { id: "checklist", label: "Before you leave" },
    { id: "faq", label: "If plans change" },
    { id: "sources", label: "Sources" },
] as const

const originRoutes = guideContent.routes.filter(({ id }) =>
    ["guatemala-city", "antigua", "panajachel"].includes(id),
)
const transportRoutes = guideContent.routes.filter(({ id }) =>
    ["road", "boat"].includes(id),
)

const propertyPresentation = {
    mandalas: {
        href: "/pueblo",
        label: "Central · walkable · social",
        accent: "amber" as const,
    },
    hideout: {
        href: "/hideout",
        label: "Quieter · outside the center",
        accent: "lime" as const,
    },
}

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-stone-950"

export default function GuidePage() {
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
                            {guideContent.eyebrow}
                        </p>
                        <h1 className="max-w-4xl text-balance font-heading text-[clamp(2.5rem,5.4vw,5rem)] font-light uppercase leading-[0.97] tracking-[0.035em] text-white drop-shadow-2xl">
                            {guideContent.title}
                        </h1>
                        <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-stone-200 sm:text-lg sm:leading-8">
                            {guideContent.introduction}
                        </p>
                        <a
                            href="#guide-index"
                            className={`${focusRing} mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-white/30 bg-stone-950/35 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-[background-color,color,border-color] duration-300 hover:border-white hover:bg-white hover:text-stone-950 motion-reduce:transition-none`}
                        >
                            Explore the guide
                            <ArrowDown className="size-4" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </header>

            <nav
                id="guide-index"
                aria-label="Guide sections"
                className="sticky top-20 z-30 scroll-mt-28 border-y border-white/10 bg-stone-950/95 supports-[backdrop-filter]:bg-stone-950/85 supports-[backdrop-filter]:backdrop-blur-md"
            >
                <div className="container mx-auto px-4 py-3 md:py-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400 md:sr-only">
                        In this guide
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

            <aside aria-label="Travel information notice" className="border-b border-amber-200/15 bg-amber-200/[0.065] text-white">
                <div className="container mx-auto flex max-w-6xl items-start gap-4 px-4 py-5 md:items-center md:py-6">
                    <CircleAlert className="mt-0.5 size-5 shrink-0 text-amber-200 md:mt-0" aria-hidden="true" />
                    <p className="text-sm leading-6 text-stone-300">
                        <strong className="mr-2 font-semibold text-amber-100">Important: travel details can change.</strong>
                        {" "}
                        {guideContent.verificationNotice}
                    </p>
                </div>
            </aside>

            <section id="routes" aria-labelledby="routes-heading" className="scroll-mt-40 py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 xl:gap-28">
                        <div className="lg:sticky lg:top-32 lg:self-start">
                            <SectionIntroduction
                                headingId="routes-heading"
                                label="Start here"
                                title="Choose the route that matches your ticket"
                                description="First identify where your booked transport ends. Once you know that endpoint, you’re past the hardest decision: it tells you whether San Pedro is your road destination or your next boat stop."
                            />
                        </div>

                        <div className="border-t border-white/15">
                            {originRoutes.map((route, index) => (
                                <RouteOverview key={route.id} route={route} index={index} />
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 border-t border-white/15 pt-10 sm:mt-20 sm:pt-12">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                            Your final connection
                        </p>
                        <div className="mt-7 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-2">
                            {transportRoutes.map((route) => (
                                <ConnectionOverview key={route.id} route={route} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section aria-labelledby="arrival-help-heading" className="border-y border-amber-200/15 bg-[linear-gradient(100deg,rgba(251,191,36,0.08),rgba(255,255,255,0.025)_52%,transparent)] py-8 sm:py-10">
                <div className="container mx-auto grid gap-6 px-4 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
                            Help with the final connection
                        </p>
                        <h2 id="arrival-help-heading" className="mt-3 font-heading text-2xl font-light uppercase leading-tight tracking-[0.08em] text-white sm:text-3xl">
                            Not sure how to reach your booked property?
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">
                            Send the Mandalas team your starting point, expected arrival time, and property name before you travel.
                        </p>
                    </div>
                    <a
                        href={buildContactHref("Hi Mandalas, I need help planning my arrival. My starting point is: __. I booked: __. My expected arrival time is: __.")}
                        target="_blank"
                        rel="noreferrer"
                        className={`${focusRing} inline-flex min-h-12 w-fit items-center gap-2 rounded-full border border-amber-200/35 bg-amber-100 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-amber-950 transition-[background-color,border-color] duration-300 hover:border-white hover:bg-white motion-reduce:transition-none md:justify-self-end`}
                    >
                        <MessageCircle className="size-4" aria-hidden="true" />
                        Ask about your arrival
                        <span className="sr-only"> Opens WhatsApp in a new tab.</span>
                    </a>
                </div>
            </section>

            <section id="arrival" aria-labelledby="arrival-heading" className="scroll-mt-40 bg-stone-900/55 py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16 xl:gap-24">
                        <div>
                            <SectionIntroduction
                                headingId="arrival-heading"
                                label="Once you reach San Pedro"
                                title="Three steps to the right front door"
                                description="Mandalas and Hideout are different destinations. Use the name on your reservation before you walk or enter a tuk-tuk."
                            />
                            <div className="relative mt-9 aspect-[16/10] overflow-hidden sm:aspect-[16/8] lg:aspect-[4/3]">
                                <Image
                                    src="/images/mandalas/pueblo-dock-boat.jpg"
                                    alt="San Pedro La Laguna waterfront and town on Lake Atitlán"
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
                            {guideContent.sanPedroArrival.map((step, index) => (
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
                                Choose your destination
                            </p>
                            <h2 id="properties-heading" className="mt-4 text-balance font-heading text-3xl font-light uppercase leading-tight tracking-[0.08em] text-white sm:text-4xl">
                                Match the property on your reservation
                            </h2>
                        </div>

                        <div className="mt-9 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-2">
                            {guideContent.properties.map((property) => {
                                const presentation = propertyPresentation[property.id]
                                const isMandalas = presentation.accent === "amber"

                                return (
                                    <article
                                        key={property.id}
                                        aria-label={`${property.propertyName} arrival details`}
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
                                                    Stay character
                                                </dt>
                                                <dd className="text-base leading-7 text-stone-200">
                                                    {property.positioning}
                                                </dd>
                                            </div>
                                            <div className="grid gap-2 py-5 sm:grid-cols-[7.5rem_1fr] sm:gap-5">
                                                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                                                    Arrival reference
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
                                                Open in Google Maps
                                                <ExternalLink className="size-3.5" aria-hidden="true" />
                                                <span className="sr-only"> Opens in a new tab.</span>
                                            </a>
                                            <Link
                                                href={presentation.href}
                                                className={`${focusRing} inline-flex min-h-11 items-center gap-2 border-b border-white/25 text-xs font-semibold uppercase tracking-[0.14em] text-stone-300 transition-[color,border-color] duration-300 hover:border-white hover:text-white motion-reduce:transition-none`}
                                            >
                                                Explore the property
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
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-600">Before you leave</p>
                        <h2 id="checklist-heading" className="mt-4 text-balance font-heading text-4xl font-light uppercase leading-tight tracking-[0.08em] md:text-5xl">
                            Four details worth checking once
                        </h2>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-stone-700 md:text-lg md:leading-8">
                            Save these four essentials before the trip. Once they are together, you have what you need to move through each connection with confidence.
                        </p>
                    </div>

                    <ul className="grid border-t border-stone-300 sm:grid-cols-2 sm:gap-x-10 xl:gap-x-14">
                        {guideContent.checklist.map((item, index) => (
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
                            If plans change
                        </p>
                        <h2 id="faq-heading" className="mt-4 text-balance font-heading text-4xl font-light uppercase leading-tight tracking-[0.08em] text-white md:text-5xl">
                            {guideContent.faqHeading}
                        </h2>
                        <p className="mt-6 max-w-xl leading-7 text-stone-400">
                            Plans can change. Start with the situation that matches yours, then take only the next step.
                        </p>
                    </div>

                    <div className="border-t border-white/15">
                        {guideContent.faqs.map((faq, index) => (
                            <FaqItem key={faq.id} faq={faq} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            <section id="sources" aria-labelledby="sources-heading" className="scroll-mt-40 border-y border-white/10 bg-stone-900/55 py-14 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Public references</p>
                            <h2 id="sources-heading" className="mt-2 font-heading text-2xl font-light uppercase tracking-[0.08em] text-white sm:text-3xl">
                                Sources behind this guide
                            </h2>
                        </div>
                        <p className="max-w-md text-sm leading-6 text-stone-400">
                            Addresses and transport references are linked for transparency.
                        </p>
                    </div>
                    <details className="group mt-7 border-y border-white/15">
                        <summary className={`${focusRing} flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 marker:hidden [&::-webkit-details-marker]:hidden`}>
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-300">
                                View {guideContent.sources.length} sources
                            </span>
                            <span className="flex shrink-0 items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-300">
                                <span className="group-open:hidden">Open</span>
                                <span className="hidden group-open:inline">Close</span>
                                <ArrowDown className="size-4 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                            </span>
                        </summary>
                        <ul className="grid border-t border-white/15 md:grid-cols-2 md:gap-x-10 xl:gap-x-14">
                            {guideContent.sources.map((source) => (
                                <SourceItem key={source.url} source={source} />
                            ))}
                        </ul>
                    </details>
                </div>
            </section>
        </div>
    )
}

function FaqItem({ faq, index }: { faq: (typeof guideContent.faqs)[number]; index: number }) {
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

function SourceItem({ source }: { source: (typeof guideContent.sources)[number] }) {
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
                <span className="sr-only"> Opens in a new tab.</span>
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

function RouteOverview({ route, index }: { route: GuideRoute; index: number }) {
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
                    <strong className="font-semibold text-stone-200">Before you go:</strong> {route.planningNote}
                </p>
            </div>
        </article>
    )
}

function ConnectionOverview({ route }: { route: GuideRoute }) {
    const isBoat = route.id === "boat"
    const Icon = isBoat ? ShipWheel : Signpost

    return (
        <article className="bg-stone-950 p-7 sm:p-9 lg:p-10">
            <div className="flex items-center gap-4">
                <span className={`flex size-11 items-center justify-center rounded-full border ${isBoat ? "border-lime-300/35 text-lime-200" : "border-amber-300/35 text-amber-200"}`}>
                    <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Travel mode</p>
                    <h3 className="mt-1 font-heading text-3xl font-light uppercase tracking-[0.08em] text-white">
                        {isBoat ? "By public boat" : "By road"}
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
