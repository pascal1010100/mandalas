import type { MetadataRoute } from "next"

const siteUrl = "https://www.mandalashostels.com"

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        {
            url: siteUrl,
            spanishUrl: `${siteUrl}/es`,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteUrl}/pueblo`,
            spanishUrl: `${siteUrl}/es/pueblo`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/hideout`,
            spanishUrl: `${siteUrl}/es/hideout`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/contact`,
            spanishUrl: `${siteUrl}/es/contacto`,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/guide`,
            spanishUrl: `${siteUrl}/es/guia`,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ] as const

    return routes.flatMap(({ url, spanishUrl, changeFrequency, priority }) => {
        const languages = { en: url, "es-GT": spanishUrl, "x-default": url }
        return [
            { url, changeFrequency, priority, alternates: { languages } },
            { url: spanishUrl, changeFrequency, priority, alternates: { languages } },
        ]
    })
}
