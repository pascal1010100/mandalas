import type { Metadata } from "next"
import Script from "next/script"

import { publicContact } from "@/lib/public-contact"

const siteUrl = "https://www.mandalashostels.com"
const pageUrl = `${siteUrl}/pueblo`
const imageUrl = `${siteUrl}/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg`

const puebloJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            url: pageUrl,
            name: "Mandalas Hostal in San Pedro La Laguna",
            description: "Mandalas Hostal is the central, walkable and social Mandalas stay in San Pedro La Laguna.",
            inLanguage: "en",
            isPartOf: { "@id": `${siteUrl}/#website` },
            mainEntity: { "@id": `${pageUrl}#hostel` },
        },
        {
            "@type": "Hostel",
            "@id": `${pageUrl}#hostel`,
            name: "Mandalas Hostal",
            alternateName: "Mandala's Hostal",
            url: pageUrl,
            description: "A central, walkable and social hostel in San Pedro La Laguna, Lake Atitlán.",
            image: imageUrl,
            telephone: publicContact.whatsappNumber ? `+${publicContact.whatsappNumber}` : undefined,
            email: publicContact.email,
            sameAs: publicContact.instagram.mandalas,
            address: {
                "@type": "PostalAddress",
                addressLocality: "San Pedro La Laguna",
                addressRegion: "Solola",
                addressCountry: "GT",
            },
        },
    ],
}

export const metadata: Metadata = {
    title: {
        absolute: "Central Hostel in San Pedro La Laguna | Mandalas",
    },
    description:
        "Choose Mandalas Hostal for a central, walkable and social stay in San Pedro La Laguna. Check current rooms, dates and prices in the official Cloudbeds engine.",
    alternates: {
        canonical: "/pueblo",
        languages: { en: "/pueblo", "es-GT": "/es/pueblo", "x-default": "/pueblo" },
    },
    openGraph: {
        title: "Central Hostel in San Pedro La Laguna | Mandalas",
        description:
            "Choose Mandalas Hostal for a central, walkable and social stay in San Pedro La Laguna. Check current rooms, dates and prices in the official Cloudbeds engine.",
        url: "/pueblo",
        images: [
            {
                url: "/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
                width: 1200,
                height: 800,
                alt: "Courtyard with hammocks at Mandalas Hostal in San Pedro La Laguna",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Central Hostel in San Pedro La Laguna | Mandalas",
        description:
            "Choose Mandalas Hostal for a central, walkable and social stay in San Pedro La Laguna. Check current rooms, dates and prices in the official Cloudbeds engine.",
        images: ["/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"],
    },
}

export default function PuebloLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script
                id="pueblo-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(puebloJsonLd) }}
            />
            {children}
        </>
    )
}
