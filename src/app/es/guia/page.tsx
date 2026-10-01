import type { Metadata } from "next"

import { GuidePageContent } from "@/app/(public)/guide/page"
import { guideContentEs } from "./guide-content-es"

const siteUrl = "https://www.mandalashostels.com"
const pageUrl = `${siteUrl}/es/guia`
const title = "Guía para llegar a San Pedro La Laguna | Mandalas Hostal"
const description = "Planifica cómo llegar a San Pedro La Laguna y al Lago de Atitlán desde Ciudad de Guatemala, Antigua o Panajachel, con información sobre lanchas y tuk-tuks."

export const metadata: Metadata = {
    title: { absolute: title }, description,
    alternates: { canonical: "/es/guia", languages: { "es-GT": "/es/guia", en: "/guide", "x-default": "/guide" } },
    openGraph: { title, description, url: "/es/guia", type: "article", images: [{ url: "/images/mandalas/guide-social.jpg", width: 1200, height: 630, alt: "Lancha cruzando el Lago de Atitlán cerca de San Pedro La Laguna" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/images/mandalas/guide-social.jpg"] },
}

export default function SpanishGuidePage() {
    const article = { "@context": "https://schema.org", "@type": "Article", "@id": `${pageUrl}#article`, url: pageUrl, headline: title, description, inLanguage: "es", image: `${siteUrl}/images/mandalas/guide-lancha.png`, author: { "@type": "Organization", name: "Mandalas Hostal", url: siteUrl }, publisher: { "@type": "Organization", name: "Mandalas Hostal", url: siteUrl } }
    const faq = { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${pageUrl}#faq`, mainEntity: guideContentEs.faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }
    return <><script id="guia-es-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} /><script id="guia-es-faq-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} /><GuidePageContent content={guideContentEs} locale="es" /></>
}
