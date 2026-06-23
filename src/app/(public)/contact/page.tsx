"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
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
import { getBookingEngineUrl } from "@/lib/booking-engine";
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
  const [location, setLocation] = useState("Not sure yet");
  const [roomType, setRoomType] = useState("Not sure yet");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedLocation = searchParams.get("location") || searchParams.get("sede");
    const selectedRoom = searchParams.get("room") || searchParams.get("habitacion");
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
      "Hi Mandalas, I would like to ask about a stay.",
      "",
      `Name: ${name || "Pending"}`,
      `Dates: ${dates || "Pending"}`,
      `Guests: ${guests || "Pending"}`,
      `Preferred stay: ${location}`,
      `Room type: ${roomType}`,
      message ? `Message: ${message}` : "",
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
      id="inquiry"
      onSubmit={handleSubmit}
      className="relative w-full max-w-full scroll-mt-24 overflow-hidden border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.045)_44%,rgba(255,255,255,0.025))] p-5 shadow-2xl shadow-black/30 sm:p-8 md:scroll-mt-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/45 to-transparent" />

      <div className="mb-9 grid gap-6 border-b border-white/10 pb-7 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/70">
            Personal help
          </p>
          <h2 className="max-w-xl font-heading text-2xl font-light uppercase leading-tight tracking-[0.14em] text-white md:text-3xl">
            Need a hand choosing?
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-300">
            For groups, special plans, or a recommendation between the two
            stays, leave us the essentials and we will help personally.
          </p>
        </div>

        <p className="max-w-36 border-l border-white/15 pl-4 text-[0.65rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-white/50 max-sm:border-l-0 max-sm:border-t max-sm:pt-4 max-sm:pl-0">
          Groups, special requests, and personal advice.
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="guest-name" className={formLabelClass}>
              Name
            </Label>
            <UserRound className="h-4 w-4 text-white/40" />
          </div>
          <Input
            id="guest-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className={fieldClass}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="guest-count" className={formLabelClass}>
              Guests
            </Label>
            <UsersRound className="h-4 w-4 text-white/40" />
          </div>
          <Input
            id="guest-count"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            placeholder="2 guests"
            className={fieldClass}
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="travel-dates" className={formLabelClass}>
              Dates
            </Label>
            <CalendarDays className="h-4 w-4 text-white/40" />
          </div>
          <Input
            id="travel-dates"
            value={dates}
            onChange={(event) => setDates(event.target.value)}
            placeholder="July 12 to 15"
            className={fieldClass}
          />
        </div>

        <div className="space-y-3">
          <Label className={formLabelClass}>
            Stay
          </Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-stone-950 text-white shadow-2xl shadow-black/40">
              <SelectItem value="Mandalas">Mandalas</SelectItem>
              <SelectItem value="Hideout">Hideout</SelectItem>
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className={formLabelClass}>
            Room
          </Label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-stone-950 text-white shadow-2xl shadow-black/40">
              <SelectItem value="Mixed Dorm">Mixed dorm</SelectItem>
              <SelectItem value="Female Dorm">
                Female dorm
              </SelectItem>
              <SelectItem value="Private Room">
                Private room
              </SelectItem>
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label
            htmlFor="extra-message"
            className={formLabelClass}
          >
            Helpful details
          </Label>
          <Textarea
            id="extra-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Late arrival, private room, quieter stay, rooftop, lake..."
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
        Ask on WhatsApp
      </Button>
    </form>
  );
}

type BookingEngineCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  image: string;
  buttonLabel: string;
  accent: "amber" | "lime";
};

function BookingEngineCard({
  eyebrow,
  title,
  description,
  href,
  image,
  buttonLabel,
  accent,
}: BookingEngineCardProps) {
  const accentClass = accent === "amber" ? "text-amber-200" : "text-lime-200";

  return (
    <article className="group relative min-h-80 overflow-hidden border border-white/10 bg-stone-950 p-6 sm:p-8">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${image}')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(12,10,9,0.94),rgba(12,10,9,0.62)_58%,rgba(12,10,9,0.28))]" />

      <div className="relative flex h-full min-h-64 flex-col items-start">
        <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${accentClass}`}>
          {eyebrow}
        </p>
        <h3 className="mt-4 font-heading text-4xl font-light uppercase tracking-[0.14em] text-white">
          {title}
        </h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-300">
          {description}
        </p>

        <div className="mt-auto pt-8">
          <Button
            asChild
            className="h-11 rounded-full border border-white/20 bg-white px-6 text-xs font-semibold uppercase tracking-[0.15em] text-stone-950 shadow-none hover:bg-stone-200"
          >
            <a href={href ?? "#inquiry"}>
              <CalendarDays className="h-4 w-4" />
              {buttonLabel}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
          <p className="mt-3 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white/50">
            Live availability · secure booking
          </p>
        </div>
      </div>
    </article>
  );
}

export default function ContactPage() {
  const mandalasBookingUrl = getBookingEngineUrl("Mandalas");
  const hideoutBookingUrl = getBookingEngineUrl("Hideout");

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      <Hero
        title="Contact"
        subtitle="Tell us your dates and the kind of trip you are bringing. We will guide you toward the stay that fits best."
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
          <a href="#book-directly">
            <CalendarDays className="h-4 w-4" />
            Book your stay
          </a>
        </Button>
      </Hero>

      <section id="book-directly" className="scroll-mt-24 border-y border-white/10 bg-stone-900/60 py-16 md:scroll-mt-28 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          <FadeIn>
            <div className="mb-9 max-w-2xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/70">
                Direct booking
              </p>
              <h2 className="font-heading text-3xl font-light uppercase tracking-[0.12em] text-white md:text-5xl">
                Already know your stay?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-400 md:text-lg">
                Check live availability, final prices, and reserve directly with the stay that fits your trip.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <BookingEngineCard
                eyebrow="Town center"
                title="Mandalas"
                description="For rooftop sunsets, walkable plans, and being close to San Pedro's energy."
                href={mandalasBookingUrl}
                image="/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"
                buttonLabel="Book Mandalas"
                accent="amber"
              />
              <BookingEngineCard
                eyebrow="Near the lake"
                title="Hideout"
                description="For quieter nights, slower mornings, and a calmer base outside the center."
                href={hideoutBookingUrl}
                image="/images/mandalas/hostelworld/hideout-terrace-dusk.jpg"
                buttonLabel="Book Hideout"
                accent="lime"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl overflow-hidden px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <FadeIn className="order-2 lg:order-1 lg:col-span-5">
            <div className="min-w-0 space-y-8">
              <div>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                  Personal help
                </p>
                <h2 className="mb-5 max-w-xl break-words font-heading text-[1.2rem] font-light uppercase leading-tight tracking-[0.08em] text-white [text-wrap:balance] sm:text-3xl sm:tracking-[0.1em] md:text-4xl md:tracking-[0.14em]">
                  Not sure which stay fits?
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-stone-400 md:text-lg">
                  Tell us about your dates, group, or travel style. We are here
                  for personal advice, special plans, and questions before you book.
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
                        For groups, arrival details, special requests, and
                        questions with a person from the hostel.
                      </p>
                      <BookingLink
                        location="Mandalas Hostal"
                        variant="outline"
                        className="border-white/15 bg-transparent text-white hover:bg-white hover:text-stone-950 gap-2"
                      >
                        Send message
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
                        Choose the rhythm
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-stone-400">
                        Mandalas for being in town. Hideout for sleeping more
                        quietly near the lake.
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
                      <h3 className="mb-2 font-semibold text-white">Email</h3>
                      <p className="mb-4 text-sm leading-relaxed text-stone-400">
                        For groups, collaborations, or questions that need more
                        detail.
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
                        See the recent atmosphere of each stay before deciding.
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

          <div className="order-1 min-w-0 lg:order-2 lg:col-span-7">
            <ReservationInquiryForm />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl overflow-hidden px-4 pb-16 md:pb-24">
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
            Both stays are in San Pedro La Laguna: one more central for moving
            on foot, and one calmer on the way toward the lake.
          </p>
        </FadeIn>
      </section>

      <section className="border-t border-white/10 bg-stone-900/60 py-16">
        <div className="mx-auto w-full max-w-7xl px-4">
          <FadeIn>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                [
                  "Direct reply",
                  "The form prepares the message and WhatsApp carries the conversation.",
                ],
                [
                  "Clear arrival",
                  "We guide you with location and recommendations before you arrive.",
                ],
                [
                  "Two atmospheres",
                  "Town energy or lake-side pause, depending on your trip.",
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
