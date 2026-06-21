import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mandalashostels.com"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/api", "/my-booking"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
