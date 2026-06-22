import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { MobileCTA } from "@/components/shared/mobile-cta"
import Script from "next/script"
import { publicContact } from "@/lib/public-contact"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mandalashostels.com"
const primaryImageUrl = `${siteUrl}/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg`
const hideoutImageUrl = `${siteUrl}/images/mandalas/hostelworld/hideout-terrace-dusk.jpg`
const logoUrl = `${siteUrl}/mandalas-favicon.png`

const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            name: "Mandalas Hostal",
            url: siteUrl,
            inLanguage: "en",
            sameAs: [
                publicContact.instagram.mandalas,
                publicContact.instagram.hideout,
            ],
        },
        {
            "@type": "WebPage",
            "@id": `${siteUrl}/#webpage`,
            url: siteUrl,
            name: "Mandalas Hostal | San Pedro La Laguna Hostel",
            inLanguage: "en",
            isPartOf: { "@id": `${siteUrl}/#website` },
            primaryImageOfPage: { "@id": `${primaryImageUrl}#image` },
        },
        {
            "@type": "ImageObject",
            "@id": `${primaryImageUrl}#image`,
            url: primaryImageUrl,
            contentUrl: primaryImageUrl,
            width: 1600,
            height: 1067,
            caption: "Hammocks and courtyard at Mandalas Hostal in San Pedro La Laguna",
        },
        {
            "@type": "Hostel",
            "@id": `${siteUrl}/#hostel`,
            name: "Mandalas Hostal",
            alternateName: ["Mandala's Hostal", "Mandalas Hideout"],
            description: "A San Pedro La Laguna hostel with two stays: Mandalas in town and Hideout near Lake Atitlan.",
            url: siteUrl,
            logo: logoUrl,
            telephone: publicContact.whatsappNumber ? `+${publicContact.whatsappNumber}` : undefined,
            email: publicContact.email,
            sameAs: [
                publicContact.instagram.mandalas,
                publicContact.instagram.hideout,
            ],
            image: [
                primaryImageUrl,
                hideoutImageUrl,
            ],
            address: {
                "@type": "PostalAddress",
                addressLocality: "San Pedro La Laguna",
                addressRegion: "Solola",
                addressCountry: "GT",
            },
            amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
                { "@type": "LocationFeatureSpecification", name: "Shared kitchen", value: true },
                { "@type": "LocationFeatureSpecification", name: "Rooftop terrace", value: true },
                { "@type": "LocationFeatureSpecification", name: "WhatsApp booking inquiry", value: true },
            ],
            hasPart: [
                {
                    "@type": "Hostel",
                    name: "Mandalas Hostal",
                    url: `${siteUrl}/pueblo`,
                    sameAs: publicContact.instagram.mandalas,
                    image: primaryImageUrl,
                    address: {
                        "@type": "PostalAddress",
                        addressLocality: "San Pedro La Laguna",
                        addressRegion: "Solola",
                        addressCountry: "GT",
                    },
                },
                {
                    "@type": "Hostel",
                    name: "Mandalas Hideout",
                    url: `${siteUrl}/hideout`,
                    sameAs: publicContact.instagram.hideout,
                    image: hideoutImageUrl,
                    address: {
                        "@type": "PostalAddress",
                        addressLocality: "San Pedro La Laguna",
                        addressRegion: "Solola",
                        addressCountry: "GT",
                    },
                },
            ],
        },
    ],
}

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="dark flex min-h-screen flex-col bg-background pb-20 text-foreground md:pb-0">
            <Script
                id="mandalas-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
            />
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <MobileCTA />
        </div>
    )
}
