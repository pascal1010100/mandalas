import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/animations/fade-in"
import { ConsultationLink } from "@/components/shared/consultation-link"
import { Hero } from "@/components/shared/hero"

import styles from "./pueblo.module.css"

const fitDetails = [
    {
        title: "Setting",
        description: "Central San Pedro La Laguna",
    },
    {
        title: "Rhythm",
        description: "Walkable and social",
    },
    {
        title: "Best for",
        description: "Travelers who want a central, walkable base",
    },
]

export default function PuebloPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Hostel",
                        "name": "Mandalas Hostal",
                        "description": "A central, walkable and social base in San Pedro La Laguna.",
                        "url": "https://www.mandalashostels.com/pueblo",
                        "telephone": "+50257545638",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "San Pedro La Laguna",
                            "addressRegion": "Sololá",
                            "addressCountry": "GT"
                        },
                        "image": "https://www.mandalashostels.com/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"
                    })
                }}
            />
        <div className={styles.page}>
            <div data-pueblo-moment="hero">
                <Hero
                    title="Mandalas"
                    seoContext="Central hostel in San Pedro La Laguna"
                    subtitle="A central, walkable and social base in San Pedro La Laguna."
                    backgroundImage="/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"
                    backgroundImageMobile="/images/mandalas/hostelworld/pueblo-exterior.jpg"
                    backgroundPosition="center center"
                    backgroundPositionMobile="center center"
                    overlayClassName="bg-gradient-to-b from-black/34 via-black/16 to-black/54"
                    radialOverlayClassName="bg-[radial-gradient(circle_at_55%_35%,transparent_0%,rgba(0,0,0,0.1)_44%,rgba(0,0,0,0.56)_100%)]"
                    mobileHeight="full"
                    align="center"
                >
                    <div className={styles.heroActions}>
                        <ConsultationLink
                            location="Mandalas"
                            size="lg"
                            data-property-hero-booking-cta
                            className="h-12 gap-2 border-white/25 bg-white px-8 text-stone-950 hover:bg-stone-200"
                        >
                            Book Mandalas
                        </ConsultationLink>
                        <Link href="/hideout" className={styles.heroCompareLink}>
                            Compare Hideout
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </Hero>
            </div>

            <section
                className={styles.fitSection}
                aria-labelledby="pueblo-fit-title"
                data-pueblo-moment="fit"
            >
                <div className={`${styles.shell} ${styles.fitGrid}`}>
                    <FadeIn className={styles.fitCopy}>
                        <p className={styles.kicker}>At a glance</p>
                        <h2 id="pueblo-fit-title" className={styles.sectionHeading}>
                            For the town-first traveler
                        </h2>
                        <p className={styles.lead}>
                            Choose Mandalas when you want the more central and social of our two San Pedro stays.
                        </p>
                    </FadeIn>

                    <dl className={styles.fitFacts}>
                        {fitDetails.map((detail) => (
                            <div key={detail.title}>
                                <dt>{detail.title}</dt>
                                <dd>{detail.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section
                id="galeria"
                className={styles.storySection}
                aria-labelledby="pueblo-story-title"
                data-pueblo-moment="story"
            >
                <div className={styles.shell}>
                    <div className={styles.storyGrid}>
                        <FadeIn className={styles.storyCopy}>
                            <p className={styles.kicker}>Inside Mandalas</p>
                            <h2 id="pueblo-story-title" className={styles.displayHeading}>
                                Courtyard, stairs, lake
                            </h2>
                            <div className={styles.accentRule} aria-hidden="true" />
                            <p className={styles.lead}>
                                Mandalas brings together a planted courtyard, white stairways and views across Lake Atitlán.
                            </p>
                        </FadeIn>

                        <div className={styles.storyComposition}>
                            <figure className={styles.stairFrame}>
                                <Image
                                    src="/images/mandalas/hostelworld/pueblo-stair-detail.jpg"
                                    alt="White stairs and warm architectural details inside Mandalas"
                                    fill
                                    sizes="(min-width: 1024px) 42vw, 76vw"
                                    className={styles.coverImage}
                                />
                            </figure>
                            <figure className={styles.courtyardFrame}>
                                <Image
                                    src="/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"
                                    alt="Planted Mandalas courtyard with hammocks"
                                    fill
                                    sizes="(min-width: 1024px) 30vw, 58vw"
                                    className={styles.coverImage}
                                />
                            </figure>
                        </div>
                    </div>
                </div>

                <figure className={styles.storyReward}>
                    <Image
                        src="/images/mandalas/hostelworld/pueblo-lake-view.jpg"
                        alt="Lake Atitlán and its mountains seen from Mandalas"
                        fill
                        sizes="(min-width: 1024px) calc(100vw - 4rem), 100vw"
                        className={styles.rewardImage}
                    />
                    <figcaption className={styles.imageCaption}>The lake comes into view · Mandalas</figcaption>
                </figure>
            </section>

            <section
                className={styles.arrivalSection}
                aria-labelledby="pueblo-arrival-title"
                data-pueblo-moment="arrival"
            >
                <div className={`${styles.shell} ${styles.arrivalGrid}`}>
                    <div>
                        <p className={styles.kicker}>Before your stay</p>
                        <h2 id="pueblo-arrival-title" className={styles.sectionHeading}>
                            Arrive with the route in hand
                        </h2>
                    </div>
                    <div className={styles.arrivalCopy}>
                        <p className={styles.lead}>
                            Use the Mandalas travel guide to plan your journey to San Pedro and prepare your arrival.
                        </p>
                        <Link href="/guide#arrival" className={styles.arrivalLink}>
                            Plan your arrival
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            <section
                className={styles.bookingSection}
                aria-labelledby="pueblo-booking-title"
                data-pueblo-moment="booking"
            >
                <FadeIn className={styles.bookingInner}>
                    <p className={styles.kicker}>Official booking</p>
                    <h2 id="pueblo-booking-title" className={styles.bookingHeading}>
                        Check rooms, dates and prices
                    </h2>
                    <p className={styles.bookingCopy}>
                        Continue to the official Cloudbeds booking engine. Final availability, room details, prices, policies and confirmation happen in Cloudbeds.
                    </p>
                    <ConsultationLink
                        location="Mandalas"
                        size="lg"
                        className="h-12 gap-2 border-white/20 bg-white px-10 text-stone-950 hover:bg-stone-200"
                    >
                        Book Mandalas
                    </ConsultationLink>
                </FadeIn>
            </section>

            <section
                className={styles.compareSection}
                aria-labelledby="pueblo-compare-title"
                data-pueblo-moment="compare"
            >
                <div className={`${styles.shell} ${styles.compareGrid}`}>
                    <div>
                        <p className={styles.compareKicker}>A different rhythm</p>
                        <h2 id="pueblo-compare-title" className={styles.compareHeading}>
                            Prefer a quieter stay near the lake?
                        </h2>
                    </div>
                    <Link href="/hideout" className={styles.compareLink}>
                        Compare Mandalas Hideout
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </section>
        </div>
        </>
    )
}
