import type { Metadata } from "next"
import Script from "next/script"
import { guideContent } from "./guide-content"

const siteUrl = "https://www.mandalashostels.com"
const pageUrl = `${siteUrl}/guide`
const canonicalTitle = "Practical Guide to San Pedro La Laguna | Mandalas Hostal"
const description =
    "Plan your trip to San Pedro La Laguna on Lake Atitlán with practical information about routes from Antigua and Panajachel, local boats, tuk-tuks and cash."
const imageUrl = `${siteUrl}/images/mandalas/guide-lancha.png`
const socialImageUrl = `${siteUrl}/images/mandalas/guide-social.jpg`

const guideJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    url: pageUrl,
    headline: canonicalTitle,
    description,
    inLanguage: "en",
    keywords: [
        "how to get to San Pedro La Laguna",
        "Lake Atitlán transportation",
        "Panajachel to San Pedro boat",
        "Mandalas Hostels directions",
    ],
    about: {
        "@type": "Place",
        name: "San Pedro La Laguna",
        containedInPlace: { "@type": "BodyOfWater", name: "Lake Atitlán" },
    },
    mentions: [
        { "@type": "LodgingBusiness", name: "Mandalas Hostal", url: `${siteUrl}/pueblo` },
        { "@type": "LodgingBusiness", name: "Mandalas Hideout", url: `${siteUrl}/hideout` },
    ],
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

const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumbs`,
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Mandalas Hostels",
            item: siteUrl,
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Getting to San Pedro La Laguna",
            item: pageUrl,
        },
    ],
}

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: guideContent.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
        },
    })),
}

export const metadata: Metadata = {
    title: { absolute: canonicalTitle },
    description,
    alternates: {
        canonical: "/guide",
    },
    openGraph: {
        title: canonicalTitle,
        description,
        url: "/guide",
        type: "article",
        images: [
            {
                url: socialImageUrl,
                width: 1200,
                height: 630,
                alt: "Boat crossing Lake Atitlán near San Pedro La Laguna",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: canonicalTitle,
        description,
        images: [socialImageUrl],
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
            <Script
                id="guide-breadcrumb-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Script
                id="guide-faq-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            {children}
        </>
    )
}
