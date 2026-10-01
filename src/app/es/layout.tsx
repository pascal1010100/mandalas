import type { Metadata } from "next"
import Script from "next/script"

import { Footer } from "@/components/shared/footer"
import { MobileCTA } from "@/components/shared/mobile-cta"
import { Navbar } from "@/components/shared/navbar"

const siteUrl = "https://www.mandalashostels.com"

export const metadata: Metadata = {
    title: {
        default: "Mandalas Hostels | San Pedro La Laguna, Atitlán",
        template: "%s | Mandalas Hostal",
    },
    description: "Elige entre Mandalas en el centro y Hideout cerca del Lago de Atitlán. Consulta habitaciones, fechas y precios en los motores oficiales de Cloudbeds.",
    openGraph: {
        siteName: "Mandalas Hostal",
        locale: "es_GT",
        alternateLocale: ["en_US"],
        type: "website",
    },
    robots: { index: true, follow: true },
}

const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/es/#website`,
    name: "Mandalas Hostal",
    url: `${siteUrl}/es`,
    inLanguage: "es",
}

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
    return (
        <div lang="es" className="dark flex min-h-screen flex-col bg-background text-foreground">
            <Script id="mandalas-es-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer locale="es" />
            <MobileCTA />
        </div>
    )
}
