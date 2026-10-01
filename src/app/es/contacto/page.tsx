import type { Metadata } from "next"

import { ContactPageContent } from "@/app/(public)/contact/page"

const siteUrl = "https://www.mandalashostels.com"
const description = "Contacta a Mandalas Hostal para consultar fechas y elegir entre Mandalas en el centro o Hideout cerca del lago en San Pedro La Laguna."

export const metadata: Metadata = {
    title: { absolute: "Contacto y consultas de hospedaje | Mandalas Hostal" }, description,
    alternates: { canonical: "/es/contacto", languages: { "es-GT": "/es/contacto", en: "/contact", "x-default": "/contact" } },
    openGraph: { title: "Contacto y consultas de hospedaje | Mandalas Hostal", description, url: "/es/contacto", images: [{ url: "/images/mandalas/pueblo-dock-boat.webp", width: 1920, height: 1280, alt: "San Pedro La Laguna junto al Lago de Atitlán" }] },
    twitter: { card: "summary_large_image", title: "Contacto y consultas de hospedaje | Mandalas Hostal", description, images: ["/images/mandalas/pueblo-dock-boat.webp"] },
}

export default function SpanishContactPage() {
    const jsonLd = { "@context": "https://schema.org", "@type": "ContactPage", "@id": `${siteUrl}/es/contacto#webpage`, url: `${siteUrl}/es/contacto`, name: "Contacto y consultas de hospedaje | Mandalas Hostal", description, inLanguage: "es" }
    return <><script id="contacto-es-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><ContactPageContent locale="es" /></>
}
