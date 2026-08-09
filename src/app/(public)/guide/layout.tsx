import type { Metadata } from "next"
import Script from "next/script"

const siteUrl = "https://www.mandalashostels.com"
const pageUrl = `${siteUrl}/guide`
const pageTitle = "Practical Guide to San Pedro La Laguna"
const socialTitle = `${pageTitle} | Mandalas Hostal`
const description =
    "Plan your trip to San Pedro La Laguna on Lake Atitlán with practical information about routes from Antigua and Panajachel, local boats, tuk-tuks and cash."
const imageUrl = `${siteUrl}/images/mandalas/guide-lancha.png`

const guideJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    url: pageUrl,
    headline: pageTitle,
    description,
    inLanguage: "en",
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": pageUrl,
    },
    image: {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1024,
        height: 1024,
    },
    isPartOf: { "@id": `${siteUrl}/#website` },
    author: {
        "@type": "Organization",
        name: "Mandalas Hostal",
        url: siteUrl,
    },
    publisher: {
        "@type": "Organization",
        name: "Mandalas Hostal",
        url: siteUrl,
    },
}

export const metadata: Metadata = {
    title: pageTitle,
    description,
    alternates: {
        canonical: "/guide",
    },
    openGraph: {
        title: socialTitle,
        description,
        url: "/guide",
        type: "article",
        images: [
            {
                url: imageUrl,
                width: 1024,
                height: 1024,
                alt: "Boat crossing Lake Atitlán near San Pedro La Laguna",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: socialTitle,
        description,
        images: [imageUrl],
    },
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script
                id="guide-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
            />
            {children}
        </>
    )
}
