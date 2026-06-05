"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Coffee, MapPin, MessageCircle, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingLink } from "@/components/shared/booking-link"

const BACKGROUNDS = {
  pueblo: "linear-gradient(rgba(120, 53, 15, 0.22), rgba(28, 25, 23, 0.68)), url('/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg')",
  hideout: "linear-gradient(rgba(63, 98, 18, 0.18), rgba(20, 83, 45, 0.72)), url('/images/mandalas/hostelworld/hideout-exterior-volcano.jpg')"
}

export default function LandingPage() {
  const [hovered, setHovered] = useState<"pueblo" | "hideout" | null>(null)

  return (
    <main className="bg-background">
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black md:min-h-screen md:flex-row">
        <div className="absolute inset-x-0 top-24 z-30 flex justify-center px-4 pointer-events-none">
          <div className="hidden md:flex flex-col items-center text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/55">
              San Pedro La Laguna
            </p>
            <h1 className="mt-3 font-heading text-2xl font-light uppercase tracking-[0.28em] text-white/90">
              Mandalas
            </h1>
          </div>
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
          href="/pueblo"
          label="Mandalas"
          kicker="Centro del pueblo"
          title="Mandalas"
          description="Para estar en el centro, subir a la terraza y dejar que San Pedro suceda caminando."
          meta="Rooftop / Centro / Lago"
          background={BACKGROUNDS.pueblo}
          accent="amber"
          isActive={hovered === "pueblo"}
          isDimmed={hovered === "hideout"}
          onMouseEnter={() => setHovered("pueblo")}
          onMouseLeave={() => setHovered(null)}
          borderClass="border-b md:border-b-0 md:border-r"
        />

        <HomePanel
          href="/hideout"
          label="Mandalas Hideout"
          kicker="Fuera del centro"
          title="Hideout"
          description="Para bajar el volumen, tener montaña alrededor y volver a noches más tranquilas."
          meta="Volcán / Lago / Pausa"
          background={BACKGROUNDS.hideout}
          accent="lime"
          isActive={hovered === "hideout"}
          isDimmed={hovered === "pueblo"}
          onMouseEnter={() => setHovered("hideout")}
          onMouseLeave={() => setHovered(null)}
        />
      </section>

      <section className="bg-stone-950 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Mandalas Hostal
              </p>
              <h1 className="max-w-4xl font-heading text-4xl font-light uppercase leading-[1.08] tracking-[0.12em] text-white md:text-6xl">
                Dos ritmos, un mismo lago
              </h1>
            </div>

            <div className="max-w-xl lg:pb-2">
              <p className="text-lg leading-relaxed text-white/65">
                Quédate cerca del movimiento o baja el ritmo junto al lago. En Mandalas la reserva empieza simple: escribes, cuentas tus fechas y elegimos contigo el lugar que mejor calza con tu viaje.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <BookingLink
                  location="Mandalas Hostal"
                  className="rounded-full bg-white px-8 py-6 text-stone-950 hover:bg-stone-200"
                >
                  Consultar fechas
                </BookingLink>
                <Link href="/contact">
                  <Button variant="outline" className="rounded-full border-white/20 bg-transparent px-8 py-6 text-white hover:bg-white hover:text-stone-950">
                    Contacto
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20 grid border-y border-white/10 md:grid-cols-3">
            <HomeNote
              icon={MapPin}
              title="San Pedro a tu manera"
              description="Centro caminable o una base más tranquila fuera del ruido."
            />
            <HomeNote
              icon={Coffee}
              title="Sin complicar el viaje"
              description="Resuelve disponibilidad, llegada y dudas por WhatsApp."
            />
            <HomeNote
              icon={Moon}
              title="Con alma de hostal"
              description="Espacios sencillos, gente viajando y el lago siempre cerca."
            />
          </div>
        </div>
      </section>
    </main>
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
  isActive: boolean
  isDimmed: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  borderClass?: string
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
  isActive,
  isDimmed,
  onMouseEnter,
  onMouseLeave,
  borderClass,
}: HomePanelProps) {
  const accentClass = accent === "amber" ? "bg-amber-300/80" : "bg-lime-300/80"
  const lightClass = accent === "amber" ? "bg-amber-200/10" : "bg-lime-200/10"
  const panelState = isActive
    ? { scale: 1.006, y: -2 }
    : isDimmed
      ? { scale: 0.994, y: 0 }
      : { scale: 1, y: 0 }

  return (
    <motion.div
      className={`relative flex-1 group overflow-hidden cursor-pointer border-white/10 ${isActive ? "z-20 shadow-2xl shadow-black/35" : "z-10"} ${borderClass || ""}`}
      animate={panelState}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        animate={{
          scale: isActive ? 1.09 : isDimmed ? 1.025 : 1.04,
          filter: isActive
            ? "saturate(1.08) brightness(1.04)"
            : isDimmed
              ? "saturate(0.72) brightness(0.72) blur(1.5px)"
              : "saturate(0.95) brightness(0.92)",
        }}
        transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ backgroundImage: background }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/85"
        animate={{ opacity: isActive ? 0.82 : isDimmed ? 1.16 : 1 }}
        transition={{ duration: 0.7 }}
      />
      <motion.div
        className={`absolute inset-0 ${lightClass}`}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,transparent_0%,rgba(0,0,0,0.16)_45%,rgba(0,0,0,0.65)_100%)]" />
      <motion.div
        className={`absolute bottom-0 left-0 h-px w-full ${accentClass}`}
        animate={{ opacity: isActive ? 1 : isDimmed ? 0.22 : 0.5, scaleX: isActive ? 1 : 0.72 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
      />

      <Link href={href} className="relative z-10 flex h-full min-h-[54svh] flex-col justify-end p-6 text-white sm:min-h-[50vh] sm:p-7 md:min-h-screen md:p-12 lg:p-16">
        <motion.div
          className="mb-auto flex items-center justify-between gap-5 pt-16 md:pt-24"
          animate={{ opacity: isDimmed ? 0.55 : 1 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:tracking-[0.28em]">
            {label}
          </p>
          <ArrowUpRight className="h-5 w-5 text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
        </motion.div>

        <motion.div
          className="max-w-xl"
          animate={{ y: isActive ? -8 : 0, opacity: isDimmed ? 0.72 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:mb-5 sm:tracking-[0.28em]">
            {kicker}
          </p>
          <h2 className="font-heading text-[2rem] font-light uppercase leading-none tracking-[0.06em] text-white sm:text-5xl sm:tracking-[0.12em] md:text-7xl md:tracking-[0.16em]">
            {title}
          </h2>
          <p className="mt-5 max-w-[20rem] text-sm font-light leading-relaxed text-white/70 sm:mt-6 sm:min-h-[4.5rem] sm:max-w-md sm:text-base">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 border-t border-white/15 pt-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:tracking-[0.22em]">
              {meta}
            </span>
            <motion.span
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/75"
              animate={{ opacity: isActive ? 1 : 0.72 }}
              transition={{ duration: 0.4 }}
            >
              <motion.span
                className={`hidden h-px w-8 sm:block ${accentClass}`}
                animate={{ scaleX: isActive ? 1 : 0.35 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "right" }}
              />
              Entrar
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

function HomeNote({ icon: Icon, title, description }: { icon: typeof MessageCircle; title: string; description: string }) {
  return (
    <div className="border-white/10 py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
      <Icon className="mb-6 h-5 w-5 text-white/45" />
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-white/55">
        {description}
      </p>
    </div>
  )
}
