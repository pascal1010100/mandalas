import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { MobileCTA } from "@/components/shared/mobile-cta"
import Script from "next/script"
import { publicContact } from "@/lib/public-contact"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mandalas-sigma.vercel.app"

const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            name: "Mandalas Hostal",
            url: siteUrl,
            inLanguage: "es-GT",
            sameAs: [
                publicContact.instagram.mandalas,
                publicContact.instagram.hideout,
            ],
        },
        {
            "@type": "Hostel",
            "@id": `${siteUrl}/#hostel`,
            name: "Mandalas Hostal",
            alternateName: ["Mandala's Hostal", "Mandalas Hideout"],
            description: "Hostal en San Pedro La Laguna con dos sedes: Mandalas en el centro y Hideout cerca del Lago Atitlan.",
            url: siteUrl,
            telephone: publicContact.whatsappNumber ? `+${publicContact.whatsappNumber}` : undefined,
            email: publicContact.email,
            sameAs: [
                publicContact.instagram.mandalas,
                publicContact.instagram.hideout,
            ],
            image: [
                `${siteUrl}/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg`,
                `${siteUrl}/images/mandalas/hostelworld/hideout-terrace-dusk.jpg`,
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
                    image: `${siteUrl}/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg`,
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
                    image: `${siteUrl}/images/mandalas/hostelworld/hideout-terrace-dusk.jpg`,
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
