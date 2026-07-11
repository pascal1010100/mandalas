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
            description: "Mandalas Hostal is the central San Pedro La Laguna stay with a rooftop, kitchen, shared dorms, and private rooms.",
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
            description: "A central San Pedro La Laguna hostel with a rooftop, shared kitchen, dorms, and private rooms.",
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
    title: "Mandalas Hostal in San Pedro La Laguna",
    description:
        "Mandalas Hostal is the central San Pedro La Laguna stay: rooftop, kitchen, shared dorms, simple private rooms, and WhatsApp inquiries.",
    alternates: {
        canonical: "/pueblo",
    },
    openGraph: {
        title: "Mandalas Hostal in San Pedro La Laguna",
        description:
            "A central San Pedro La Laguna hostel with a rooftop, social energy, and personal WhatsApp inquiries.",
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
        title: "Mandalas Hostal in San Pedro La Laguna",
        description: "A central hostel with a rooftop, kitchen, and WhatsApp inquiries.",
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
