import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { MobileCTA } from "@/components/shared/mobile-cta"
import Script from "next/script"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mandalas-sigma.vercel.app"

const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "Hostel",
    name: "Mandalas Hostal",
    url: siteUrl,
    image: [
        `${siteUrl}/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg`,
        `${siteUrl}/images/mandalas/hostelworld/hideout-exterior-volcano.jpg`,
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
