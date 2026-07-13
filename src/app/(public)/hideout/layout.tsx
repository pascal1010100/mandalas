import type { Metadata } from "next"
import Script from "next/script"

import { publicContact } from "@/lib/public-contact"

const siteUrl = "https://www.mandalashostels.com"
const pageUrl = `${siteUrl}/hideout`
const imageUrl = `${siteUrl}/images/mandalas/hostelworld/hideout-terrace-dusk.jpg`

const hideoutJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            url: pageUrl,
            name: "Mandalas Hideout near Lake Atitlan",
            description: "Mandalas Hideout is a quieter San Pedro La Laguna stay near Lake Atitlan with a terrace, kitchen, dorms, and private rooms.",
            inLanguage: "en",
            isPartOf: { "@id": `${siteUrl}/#website` },
            mainEntity: { "@id": `${pageUrl}#hostel` },
        },
        {
            "@type": "Hostel",
            "@id": `${pageUrl}#hostel`,
            name: "Mandalas Hideout",
            url: pageUrl,
            description: "A quieter hostel near Lake Atitlan in San Pedro La Laguna with a terrace, shared kitchen, dorms, and private rooms.",
            image: imageUrl,
            telephone: publicContact.whatsappNumber ? `+${publicContact.whatsappNumber}` : undefined,
            email: publicContact.email,
            sameAs: publicContact.instagram.hideout,
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
        absolute: "Quiet Hostel near Lake Atitlán | Mandalas Hideout",
    },
    description:
        "Mandalas Hideout is a quiet stay near Lake Atitlán, outside San Pedro La Laguna. Check live availability for dorms and private rooms and book direct.",
    alternates: {
        canonical: "/hideout",
    },
    openGraph: {
        title: "Quiet Hostel near Lake Atitlán | Mandalas Hideout",
        description:
            "Mandalas Hideout is a quiet stay near Lake Atitlán, outside San Pedro La Laguna. Check live availability for dorms and private rooms and book direct.",
        url: "/hideout",
        images: [
            {
                url: "/images/mandalas/hostelworld/hideout-terrace-dusk.jpg",
                width: 1200,
                height: 900,
                alt: "Mandalas Hideout terrace at dusk",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Quiet Hostel near Lake Atitlán | Mandalas Hideout",
        description:
            "Mandalas Hideout is a quiet stay near Lake Atitlán, outside San Pedro La Laguna. Check live availability for dorms and private rooms and book direct.",
        images: ["/images/mandalas/hostelworld/hideout-terrace-dusk.jpg"],
    },
}

export default function HideoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script
                id="hideout-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(hideoutJsonLd) }}
            />
            {children}
        </>
    )
}
