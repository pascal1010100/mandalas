import type { Metadata } from "next"
import Script from "next/script"

const siteUrl = "https://www.mandalashostels.com"
const pageUrl = `${siteUrl}/contact`

const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: "Contact and Stay Inquiry | Mandalas Hostal",
    description: "Contact Mandalas Hostal to check dates and choose between Mandalas in town or Hideout near the lake in San Pedro La Laguna.",
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
}

export const metadata: Metadata = {
    title: "Contact and Stay Inquiry",
    description:
        "Contact Mandalas Hostal to check dates and choose between Mandalas in town or Hideout near the lake in San Pedro La Laguna.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact and Stay Inquiry | Mandalas Hostal",
        description:
            "Check dates on WhatsApp and choose the stay that best fits your trip.",
        url: "/contact",
        images: [
            {
                url: "/images/mandalas/pueblo-dock-boat.webp",
                width: 1920,
                height: 1280,
                alt: "San Pedro La Laguna by Lake Atitlan",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact and Stay Inquiry | Mandalas Hostal",
        description: "Check dates and your ideal stay on WhatsApp.",
        images: ["/images/mandalas/pueblo-dock-boat.webp"],
    },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script
                id="contact-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
            />
            {children}
        </>
    )
}
