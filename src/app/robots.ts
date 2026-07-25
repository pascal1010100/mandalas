import type { MetadataRoute } from "next"

const siteUrl = "https://www.mandalashostels.com"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // Keep private routes blocked until their access and noindex behavior
            // have also been verified in a Vercel preview.
            disallow: ["/admin", "/api", "/my-booking"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    }
}
