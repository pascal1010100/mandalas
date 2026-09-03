import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { FadeIn } from "@/components/animations/fade-in";
import { BookingLink } from "@/components/shared/booking-link";
import { ConsultationLink } from "@/components/shared/consultation-link";
import { Hero } from "@/components/shared/hero";
import { LocationMap } from "@/components/shared/location-map";
import { ReservationInquiryForm } from "@/components/shared/reservation-inquiry-form";
import { SocialLinks } from "@/components/shared/social-links";
import { Button } from "@/components/ui/button";
import { getBookingEngineUrl } from "@/lib/booking-engine";
import { publicContact } from "@/lib/public-contact";

type BookingEngineCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  location: string;
  href?: string;
  image: string;
  buttonLabel: string;
  accent: "amber" | "lime";
};

function BookingEngineCard({
  eyebrow,
  title,
  description,
  location,
  href,
  image,
  buttonLabel,
  accent,
}: BookingEngineCardProps) {
  const accentClass = accent === "amber" ? "text-amber-200" : "text-lime-200";

  return (
    <article className="group relative min-h-80 overflow-hidden border border-white/10 bg-stone-950 p-6 sm:p-8">
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
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
          <ConsultationLink
            location={location}
            href={href}
            trackingSource="contact_card"
            className="h-11 rounded-full border border-white/20 bg-white px-6 text-xs font-semibold uppercase tracking-[0.15em] text-stone-950 shadow-none hover:bg-stone-200"
          >
            {buttonLabel}
            <ArrowUpRight className="h-4 w-4" />
          </ConsultationLink>
          <p className="mt-3 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white/50">
            {href ? "Live availability · secure booking" : "Contact us to check availability"}
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
        backgroundImage="/images/mandalas/pueblo-dock-boat.webp"
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
            Choose your stay
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
                location="Mandalas"
                href={mandalasBookingUrl}
                image="/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"
                buttonLabel="Book Mandalas"
                accent="amber"
              />
              <BookingEngineCard
                eyebrow="Near the lake"
                title="Hideout"
                description="For quieter nights, slower mornings, and a calmer base outside the center."
                location="Mandalas Hideout"
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
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
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
          <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
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
