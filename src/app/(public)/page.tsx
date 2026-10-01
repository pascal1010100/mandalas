import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin, MessageCircle, SunMedium, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HomeIntro } from "@/components/home/home-intro"
import { ConsultationLink } from "@/components/shared/consultation-link"
import heroStyles from "./home-hero.module.css"

const BACKGROUNDS = {
  pueblo: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
  // Keep the terrace image for the Hideout detail page; the home card uses
  // the warmer night interior to make the two properties feel distinct.
  hideout: "/images/mandalas/hostelworld/hideout-exterior-volcano.jpg",
}

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", "es-GT": "/es", "x-default": "/" },
  },
}

export default function LandingPage() {
  return <HomePageContent />
}

export function HomePageContent({ locale = "en" }: { locale?: "en" | "es" }) {
  const es = locale === "es"
  const prefix = es ? "/es" : ""
  const contactPath = es ? "/es/contacto" : "/contact"
  const copy = es ? {
    schemaDescription: "Elige entre Mandalas en el centro y Hideout cerca del Lago de Atitlán. Consulta habitaciones, fechas y precios en los motores oficiales de Cloudbeds.",
    twoHostels: "Dos hostales",
    twoRhythms: "Dos ritmos",
    puebloKicker: "En el centro · Caminable y social",
    puebloDescription: "Quédate en el centro, recorre San Pedro a pie y deja que el día encuentre su ritmo.",
    puebloMeta: "Centro · Caminable · Social",
    hideoutKicker: "Cerca del lago · Estancia tranquila",
    hideoutDescription: "Trabaja a distancia, disfruta buena música y mantén el lago cerca.",
    hideoutMeta: "WiFi · Música · Lago",
    feeling: "La experiencia de tu estancia",
    heading: "Elige tu hospedaje en San Pedro La Laguna",
    subheading: "Una estancia para moverte. Otra para volver a respirar.",
    intro: "Mandalas funciona como dos ritmos conectados por el mismo lago: el centro para salir y Hideout para bajar el ritmo.",
    townEnergy: "Energía del centro",
    townEnergyDescription: "Planes caminables y una base más social para entrar directamente en el ritmo de San Pedro.",
    lakeQuiet: "Lago y tranquilidad",
    lakeQuietDescription: "Una base más calmada para dormir mejor, caminar junto al lago y volver sin el ruido del centro.",
    guidedInquiry: "Orientación personal",
    rightRhythm: "El ritmo adecuado",
    rightRhythmDescription: "Envíanos tus fechas y tu estilo de viaje. Te orientaremos hacia la estancia que tenga más sentido.",
    bookMandalas: "Reservar Mandalas",
    bookHideout: "Reservar Hideout",
    chooseStay: "Elige tu hospedaje",
    center: "Centro",
    social: "Social",
    socialDescription: "Para caminar, hacer planes fácilmente y estar cerca de lo que sucede.",
    slow: "Calma",
    slowDescription: "Más tranquilidad, el lago cerca y noches más suaves.",
    chooseByEnergy: "Elige según tu energía: una base en el centro o un refugio más pausado.",
    walkableCenter: "Centro caminable",
    walkableSocial: "Caminable y social",
    lakeNearby: "Lago cercano",
    rooms: "Dormitorios y habitaciones privadas",
    explore: "Conocer",
    puebloAlt: "Patio de Mandalas con hamacas y arquitectura blanca",
    hideoutAlt: "Exterior de Mandalas Hideout con el volcán al fondo",
  } : {
    schemaDescription: "Choose between Mandalas in town and Hideout near Lake Atitlán. Check rooms, dates and prices in the official Cloudbeds engines.",
    twoHostels: "Two hostels",
    twoRhythms: "Two rhythms",
    puebloKicker: "In town · Walkable and social",
    puebloDescription: "Stay in town, walk San Pedro, and let the day find its rhythm.",
    puebloMeta: "Center · Walkable · Social",
    hideoutKicker: "Near lake · Calm stay",
    hideoutDescription: "Work remotely, enjoy good music, and keep the lake close.",
    hideoutMeta: "WiFi · Music · Lake",
    feeling: "The Feel Of The Stay",
    heading: "Choose your stay in San Pedro La Laguna",
    subheading: "One stay for movement. One stay to breathe again.",
    intro: "Mandalas works best as two rhythms connected by the same lake: town for going out, Hideout for slowing down.",
    townEnergy: "Town energy",
    townEnergyDescription: "Walkable plans and a more social base for stepping straight into San Pedro.",
    lakeQuiet: "Lake and quiet",
    lakeQuietDescription: "A calmer base for better sleep, easy lake walks, and returning without carrying the center's noise.",
    guidedInquiry: "Guided inquiry",
    rightRhythm: "The right rhythm",
    rightRhythmDescription: "Send your dates and travel style. We will guide you toward the stay that makes the most sense.",
    bookMandalas: "Book Mandalas",
    bookHideout: "Book Hideout",
    chooseStay: "Choose your stay",
    center: "Center",
    social: "Social",
    socialDescription: "For walking, easy plans, and being close to what is happening.",
    slow: "Slow",
    slowDescription: "More quiet, lake nearby, softer nights.",
    chooseByEnergy: "Choose by energy: lake-town base or slower hideout.",
    walkableCenter: "Walkable center",
    walkableSocial: "Walkable and social",
    lakeNearby: "Lake nearby",
    rooms: "Dorms and private rooms",
    explore: "Explore",
    puebloAlt: "Mandalas courtyard with hammocks and white architecture",
    hideoutAlt: "Mandalas Hideout exterior with volcano in the background",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "name": "Mandalas Hostels",
            "description": copy.schemaDescription,
            "url": es ? "https://www.mandalashostels.com/es" : "https://www.mandalashostels.com",
            "inLanguage": locale,
            "telephone": "+50257545638",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "San Pedro La Laguna",
              "addressRegion": "Sololá",
              "addressCountry": "GT"
            }
          })
        }}
      />
    <div className="bg-background">
      <section className={`relative flex min-h-[100svh] flex-col overflow-hidden bg-black md:min-h-screen md:flex-row ${heroStyles.hero}`}>
        <HomeIntro locale={locale} />
        <div className="pointer-events-none absolute inset-x-0 top-28 z-30 hidden justify-center px-4 md:flex">
          <p className="font-heading text-lg font-light uppercase tracking-[0.24em] text-white/85 lg:text-xl">
            {copy.twoHostels} <span className="px-1 text-white/40">·</span> {copy.twoRhythms}
          </p>
        </div>

        {/* Cinematic Noise Texture */}
        <div
          className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIxIi8+PC9zdmc+")`
          }}
        />

        {/* Pueblo Section */}
        <HomePanel
          href={`${prefix}/pueblo`}
          label="Mandalas Hostal"
          kicker={copy.puebloKicker}
          title="Mandalas Hostal"
          description={copy.puebloDescription}
          meta={copy.puebloMeta}
          background={BACKGROUNDS.pueblo}
          accent="amber"
          borderClass="border-b md:border-b-0 md:border-r"
          exploreLabel={copy.explore}
          locale={locale}
        />

        <HomePanel
          href={`${prefix}/hideout`}
          label="Mandalas Hideout"
          kicker={copy.hideoutKicker}
          title="Mandalas Hideout"
          description={copy.hideoutDescription}
          meta={copy.hideoutMeta}
          background={BACKGROUNDS.hideout}
          accent="lime"
          imageClassName="scale-100"
          imagePosition="center center"
          reserveMobileCtaSpace
          exploreLabel={copy.explore}
          locale={locale}
        />
      </section>

      <section className="relative overflow-hidden bg-stone-950 py-20 text-white md:py-28">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-4">
          <div className="relative grid gap-12 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div className="max-w-3xl">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                {copy.feeling}
              </p>
              <h1 className="max-w-3xl font-heading text-4xl font-light uppercase leading-[1.05] tracking-[0.1em] text-white md:text-6xl md:tracking-[0.14em]">
                {copy.heading}
              </h1>
              <h2 className="mt-5 max-w-2xl font-heading text-xl font-light uppercase leading-relaxed tracking-[0.12em] text-white/55 md:text-2xl">
                {copy.subheading}
              </h2>
            </div>

            <div className="max-w-xl xl:justify-self-end xl:pb-2">
              <p className="text-lg leading-relaxed text-white/62">
                {copy.intro}
              </p>
            </div>
          </div>

          <div className="relative mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
            <div className="order-2 flex flex-col justify-between border-y border-white/10 py-8 lg:order-1 lg:border-y-0 lg:border-r lg:py-0 lg:pr-10">
              <div className="grid gap-7">
                <RhythmPoint
                  icon={SunMedium}
                  eyebrow="Mandalas Hostal"
                  title={copy.townEnergy}
                  description={copy.townEnergyDescription}
                />
                <RhythmPoint
                  icon={Waves}
                  eyebrow="Mandalas Hideout"
                  title={copy.lakeQuiet}
                  description={copy.lakeQuietDescription}
                />
                <RhythmPoint
                  icon={MessageCircle}
                  eyebrow={copy.guidedInquiry}
                  title={copy.rightRhythm}
                  description={copy.rightRhythmDescription}
                />
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <ConsultationLink
                  locale={locale}
                  location="Mandalas"
                  className="h-12 border-white/20 bg-white px-8 text-stone-950 hover:bg-stone-200"
                >
                  {copy.bookMandalas}
                </ConsultationLink>
                <ConsultationLink
                  locale={locale}
                  location="Mandalas Hideout"
                  className="h-12 border-lime-200/30 bg-lime-200 px-8 text-stone-950 hover:bg-lime-100"
                >
                  {copy.bookHideout}
                </ConsultationLink>
                <Button asChild variant="outline" className="h-12 w-full rounded-full border-white/20 bg-transparent px-8 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-none hover:bg-white hover:text-stone-950 sm:col-span-2 lg:col-span-1">
                  <Link href={`${contactPath}#book-directly`}>
                    {copy.chooseStay}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="order-1 grid min-h-[38rem] gap-4 lg:order-2 lg:grid-cols-[0.58fr_0.42fr]">
              <Link href={`${prefix}/pueblo`} className="group relative overflow-hidden border border-white/10 bg-stone-900">
                <Image
                  src="/images/mandalas/hostelworld/pueblo-exterior.jpg"
                  alt={copy.puebloAlt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  style={{ objectPosition: "center 52%" }}
                  className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-black/5" />
                <div className="relative flex h-full min-h-[22rem] flex-col justify-between p-6 md:p-8">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[10px] sm:tracking-[0.22em]">
                    <span>01</span>
                    <span>{copy.center}</span>
                  </div>
                  <div>
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-200/75">
                      Mandalas
                    </p>
                    <h2 className="font-heading text-4xl font-light uppercase leading-none tracking-[0.14em] text-white md:text-6xl">
                      {copy.social}
                    </h2>
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/68">
                      {copy.socialDescription}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="grid gap-4">
                <Link href={`${prefix}/hideout`} className="group relative overflow-hidden border border-white/10 bg-stone-900">
                  <Image
                    src={BACKGROUNDS.hideout}
                    alt={copy.hideoutAlt}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                  <div className="relative flex min-h-[18rem] flex-col justify-end p-6 md:p-7">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-lime-200/75">
                      Hideout
                    </p>
                    <h2 className="font-heading text-3xl font-light uppercase tracking-[0.12em] text-white md:text-4xl">
                      {copy.slow}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-white/64">
                      {copy.slowDescription}
                    </p>
                  </div>
                </Link>

                <div className="relative overflow-hidden border border-white/10 bg-white/[0.035] p-6 md:p-7">
                  <MapPin className="mb-8 h-5 w-5 text-white/70" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-[10px] sm:tracking-[0.24em]">
                    San Pedro La Laguna
                  </p>
                  <p className="mt-4 text-2xl font-light leading-snug text-white md:text-3xl">
                    {copy.chooseByEnergy}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid border-t border-white/10 pt-6 text-xs uppercase tracking-[0.18em] text-white/70 md:grid-cols-4 md:gap-8">
            <div className="py-3 md:py-0">{copy.walkableCenter}</div>
            <div className="border-t border-white/10 py-3 md:border-l md:border-t-0 md:py-0 md:pl-8">{copy.walkableSocial}</div>
            <div className="border-t border-white/10 py-3 md:border-l md:border-t-0 md:py-0 md:pl-8">{copy.lakeNearby}</div>
            <div className="border-t border-white/10 py-3 md:border-l md:border-t-0 md:py-0 md:pl-8">
              {copy.rooms}
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

type HomePanelProps = {
  href: string
  label: string
  kicker: string
  title: string
  description: string
  meta: string
  background: string
  accent: "amber" | "lime"
  borderClass?: string
  imageClassName?: string
  imagePosition?: string
  reserveMobileCtaSpace?: boolean
  exploreLabel?: string
  locale?: "en" | "es"
}

function HomePanel({
  href,
  label,
  kicker,
  title,
  description,
  meta,
  background,
  accent,
  borderClass,
  imageClassName,
  imagePosition,
  reserveMobileCtaSpace = false,
  exploreLabel = "Explore",
  locale = "en",
}: HomePanelProps) {
  const accentClass = accent === "amber" ? "bg-amber-300/80" : "bg-lime-300/80"
  const lightClass = accent === "amber" ? "bg-amber-200/10" : "bg-lime-200/10"
  const overlayClass = accent === "amber"
    ? "from-amber-950/25 via-black/10 to-black/75"
    : "from-lime-950/25 via-black/10 to-black/78"

  return (
    <article
      className={`group relative z-10 flex-1 overflow-hidden border-white/10 hover:z-20 ${heroStyles.panel} ${borderClass || ""}`}
    >
      <Image
        src={background}
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
        className={`${imageClassName || "scale-[1.025]"} object-cover brightness-[0.96] saturate-[0.98] transition duration-[1100ms] ease-out group-hover:scale-[1.055] group-hover:brightness-100 group-hover:saturate-100 motion-reduce:transform-none motion-reduce:duration-0 motion-reduce:transition-none`}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${overlayClass}`} />
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none ${lightClass}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,transparent_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.52)_100%)]" />
      <div className={`absolute bottom-0 left-0 h-px w-full origin-left scale-x-[0.72] opacity-50 transition duration-500 group-hover:scale-x-100 group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none ${accentClass}`} />

      <Link
        href={href}
        aria-label={locale === "es" ? `Ver detalles de ${label}` : `View ${label} details`}
        className={`relative z-10 flex h-full min-h-[50svh] flex-col justify-end p-5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80 sm:min-h-[50vh] sm:p-7 md:min-h-screen md:p-9 lg:p-12 xl:p-16 ${heroStyles.link} ${reserveMobileCtaSpace ? `pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-9 lg:pb-12 xl:pb-16 ${heroStyles.linkWithBookingBar}` : ""}`}
      >
        <div className={`mb-auto flex items-center pt-16 md:pt-40 xl:pt-24 ${heroStyles.top}`}>
          <div className={`inline-flex max-w-full items-center gap-3 ${heroStyles.chip}`}>
            <span className={`h-px w-6 ${accentClass}`} />
            <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] text-white/80 sm:tracking-[0.22em]">
              {kicker}
            </p>
          </div>
        </div>

        <div className="max-w-xl transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
          <h2 className={`font-heading max-w-full text-balance text-3xl font-light uppercase leading-[0.96] tracking-[0.06em] text-white sm:text-4xl sm:tracking-[0.1em] md:text-5xl md:tracking-[0.08em] lg:text-6xl xl:text-7xl xl:tracking-[0.1em] 2xl:tracking-[0.12em] ${heroStyles.title}`}>
            {title}
          </h2>
          <p className={`mt-3 max-w-[20rem] text-sm font-light leading-relaxed text-white/78 sm:mt-5 sm:min-h-[3.5rem] sm:max-w-md sm:text-base ${heroStyles.description}`}>
            {description}
          </p>
          <div className={`mt-4 flex flex-col items-start gap-3 border-t border-white/15 pt-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-5 ${heroStyles.details}`}>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70 sm:tracking-[0.22em]">
              {meta}
            </span>
            <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              <span className={`hidden h-px w-8 origin-right scale-x-[0.35] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transform-none motion-reduce:transition-none sm:block ${accentClass}`} />
              {exploreLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function RhythmPoint({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof MessageCircle
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
      <Icon className="mt-1 h-5 w-5 text-white/70" />
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[10px] sm:tracking-[0.22em]">
          {eyebrow}
        </p>
        <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {description}
        </p>
      </div>
    </div>
  )
}
