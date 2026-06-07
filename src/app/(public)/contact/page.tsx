"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  CalendarDays,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  UserRound,
  UsersRound,
} from "lucide-react";

import { FadeIn } from "@/components/animations/fade-in";
import { BookingLink } from "@/components/shared/booking-link";
import { Hero } from "@/components/shared/hero";
import { LocationMap } from "@/components/shared/location-map";
import { SocialLinks } from "@/components/shared/social-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { buildContactHref, publicContact } from "@/lib/public-contact";

const fieldClass =
  "h-11 border-white/20 px-0 text-white placeholder:text-stone-500 shadow-none focus-visible:border-amber-200/80 md:text-base";

const selectTriggerClass =
  "h-11 w-full rounded-none border-x-0 border-t-0 border-b-2 border-white/20 bg-transparent px-0 text-base text-white shadow-none focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-stone-500 md:text-base";

const formLabelClass =
  "text-[0.68rem] uppercase tracking-[0.22em] text-white/60";

function normalizeLocation(value: string | null) {
  if (!value) return null;
  if (value.toLowerCase().includes("hideout")) return "Hideout";
  if (value.toLowerCase().includes("mandalas")) return "Mandalas";

  return null;
}

function ReservationInquiryForm() {
  const [name, setName] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");
  const [location, setLocation] = useState("No estoy seguro");
  const [roomType, setRoomType] = useState("No estoy seguro");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedLocation = searchParams.get("sede");
    const selectedRoom = searchParams.get("habitacion");
    const normalizedLocation = normalizeLocation(selectedLocation);

    queueMicrotask(() => {
      if (normalizedLocation) {
        setLocation(normalizedLocation);
      }

      if (selectedRoom) {
        setRoomType(selectedRoom);
      }
    });
  }, []);

  const whatsappMessage = useMemo(() => {
    return [
      "Hola Mandalas, quiero consultar una estadía.",
      "",
      `Nombre: ${name || "Pendiente"}`,
      `Fechas: ${dates || "Pendiente"}`,
      `Personas: ${guests || "Pendiente"}`,
      `Sede preferida: ${location}`,
      `Tipo de habitación: ${roomType}`,
      message ? `Mensaje: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [dates, guests, location, message, name, roomType]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(
      buildContactHref(whatsappMessage),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form
      id="consulta"
      onSubmit={handleSubmit}
      className="relative overflow-hidden border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.045)_44%,rgba(255,255,255,0.025))] p-5 shadow-2xl shadow-black/30 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/45 to-transparent" />

      <div className="mb-9 grid gap-6 border-b border-white/10 pb-7 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/70">
            Consulta personalizada
          </p>
          <h2 className="max-w-xl font-heading text-2xl font-light uppercase leading-tight tracking-[0.14em] text-white md:text-3xl">
            Diseña tu estadía
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-300">
            Déjanos lo esencial y convertimos tu intención de viaje en un
            mensaje claro: fechas, sede ideal y tipo de habitación.
          </p>
        </div>

        <p className="max-w-36 border-l border-white/15 pl-4 text-[0.65rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-white/50 max-sm:border-l-0 max-sm:border-t max-sm:pt-4 max-sm:pl-0">
          Respuesta humana, sin pago automático.
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="guest-name" className={formLabelClass}>
              Nombre
            </Label>
            <UserRound className="h-4 w-4 text-white/40" />
          </div>
          <Input
            id="guest-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre"
            className={fieldClass}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="guest-count" className={formLabelClass}>
              Personas
            </Label>
            <UsersRound className="h-4 w-4 text-white/40" />
          </div>
          <Input
            id="guest-count"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            placeholder="2 personas"
            className={fieldClass}
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="travel-dates" className={formLabelClass}>
              Fechas
            </Label>
            <CalendarDays className="h-4 w-4 text-white/40" />
          </div>
          <Input
            id="travel-dates"
            value={dates}
            onChange={(event) => setDates(event.target.value)}
            placeholder="12 al 15 de julio"
            className={fieldClass}
          />
        </div>

        <div className="space-y-3">
          <Label className={formLabelClass}>
            Sede
          </Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-stone-950 text-white shadow-2xl shadow-black/40">
              <SelectItem value="Mandalas">Mandalas</SelectItem>
              <SelectItem value="Hideout">Hideout</SelectItem>
              <SelectItem value="No estoy seguro">No estoy seguro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className={formLabelClass}>
            Habitación
          </Label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-stone-950 text-white shadow-2xl shadow-black/40">
              <SelectItem value="Dormitorio Mixto">Dormitorio mixto</SelectItem>
              <SelectItem value="Dormitorio Solo Chicas">
                Dormitorio solo chicas
              </SelectItem>
              <SelectItem value="Habitación Privada">
                Habitación privada
              </SelectItem>
              <SelectItem value="No estoy seguro">No estoy seguro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label
            htmlFor="extra-message"
            className={formLabelClass}
          >
            Detalles para cuidarte mejor
          </Label>
          <Textarea
            id="extra-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Llegada tarde, cama privada, más calma, terraza, lago..."
            className={`${fieldClass} min-h-24 resize-none px-0`}
          />
        </div>
      </div>

      <div className="mt-8 border-y border-white/15 py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/55">
          <span>{location}</span>
          <span className="h-px w-8 bg-amber-200/45" />
          <span>{roomType}</span>
        </div>
      </div>

      <Button
        type="submit"
        className="mt-6 h-12 w-full rounded-full border border-amber-100/30 bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-stone-950 shadow-none transition-colors hover:bg-amber-100 hover:text-stone-950"
      >
        <Send className="h-4 w-4" />
        Consultar por WhatsApp
      </Button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      <Hero
        title="Contacto"
        subtitle="Dinos tus fechas y el tipo de viaje que traes. Te orientamos hacia la sede que mejor encaja."
        backgroundImage="/images/mandalas/pueblo-dock-boat.jpg"
        backgroundPosition="center 58%"
        height="large"
        align="center"
      >
        <Button
          asChild
          size="lg"
          className="h-12 rounded-full border border-white/25 bg-white px-7 text-xs font-semibold uppercase tracking-[0.14em] text-stone-950 shadow-none hover:bg-stone-200 gap-2 sm:px-8 sm:tracking-[0.16em]"
        >
          <a href="#consulta">
            <ArrowDown className="h-4 w-4" />
            Consultar fechas
          </a>
        </Button>
      </Hero>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <FadeIn className="order-2 lg:order-1 lg:col-span-5">
            <div className="space-y-8">
              <div>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                  Reserva con intención
                </p>
                <h2 className="mb-5 max-w-xl break-words font-heading text-[1.2rem] font-light uppercase leading-tight tracking-[0.08em] text-white [text-wrap:balance] sm:text-3xl sm:tracking-[0.1em] md:text-4xl md:tracking-[0.14em]">
                  Una conversación, dos formas de quedarse
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-stone-400 md:text-lg">
                  El sitio recoge lo importante antes de escribir: fechas,
                  personas, sede y habitación. Así la respuesta llega más clara
                  y la conversación empieza mejor.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-white/10 p-3 text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        WhatsApp
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-stone-400">
                        Para resolver fechas, tarifas finales, llegada y dudas
                        puntuales con una persona del hostal.
                      </p>
                      <BookingLink
                        location="Mandalas Hostal"
                        variant="outline"
                        className="border-white/15 bg-transparent text-white hover:bg-white hover:text-stone-950 gap-2"
                      >
                        Enviar mensaje
                      </BookingLink>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-lime-500/10 p-3 text-lime-300">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        Elige el ritmo
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-stone-400">
                        Mandalas para estar en el centro. Hideout para dormir
                        más tranquilo cerca del lago.
                      </p>
                      <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                        <span>Mandalas</span>
                        <span>/</span>
                        <span>Hideout</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-amber-500/10 p-3 text-amber-300">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">Correo</h3>
                      <p className="mb-4 text-sm leading-relaxed text-stone-400">
                        Para grupos, colaboraciones o consultas que necesitan
                        más detalle.
                      </p>
                      <a
                        href={`mailto:${publicContact.email}`}
                        className="text-sm text-stone-100 underline decoration-white/20 underline-offset-4 hover:text-amber-200"
                      >
                        {publicContact.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-white/10 p-3 text-white">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        Instagram
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-stone-400">
                        Mira el ambiente reciente de cada sede antes de decidir.
                      </p>
                      <SocialLinks
                        className="gap-2"
                        itemClassName="border-white/15 px-3 py-2 text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <ReservationInquiryForm />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <FadeIn>
          <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            <MapPin className="h-4 w-4" />
            San Pedro La Laguna
          </div>
          <div className="relative h-[360px] w-full overflow-hidden rounded-lg border border-white/10 bg-stone-900 sm:h-[460px]">
            <LocationMap />
            <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-stone-500">
            Ambas sedes están en San Pedro La Laguna: una más céntrica para
            moverte caminando y otra más calmada, camino al lago.
          </p>
        </FadeIn>
      </section>

      <section className="border-t border-white/10 bg-stone-900/60 py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                [
                  "Respuesta directa",
                  "El formulario prepara el mensaje y WhatsApp cierra la conversación.",
                ],
                [
                  "Llegada clara",
                  "Te orientamos con ubicación y recomendaciones antes de llegar.",
                ],
                [
                  "Dos ambientes",
                  "Centro vivo o pausa cerca del lago, según tu viaje.",
                ],
              ].map(([title, description]) => (
                <div key={title} className="border-t border-white/10 pt-6">
                  <h3 className="mb-3 font-heading text-xl font-light uppercase tracking-[0.14em] text-white">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
