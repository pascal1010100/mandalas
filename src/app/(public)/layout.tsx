import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { MobileCTA } from "@/components/shared/mobile-cta"
import Script from "next/script"

const siteUrl = "https://www.mandalashostels.com"

const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Mandalas Hostal",
    url: siteUrl,
    inLanguage: "en",
}

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="dark flex min-h-screen flex-col bg-background text-foreground">
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
