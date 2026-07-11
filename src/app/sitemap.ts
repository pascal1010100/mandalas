import type { MetadataRoute } from "next"

const siteUrl = "https://www.mandalashostels.com"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteUrl,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteUrl}/pueblo`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/hideout`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/contact`,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ]
}
