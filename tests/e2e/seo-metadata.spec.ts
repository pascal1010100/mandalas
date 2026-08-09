import { expect, test } from "@playwright/test"

const pages = [
    {
        path: "/",
        title: "Mandalas Hostels | San Pedro La Laguna, Atitlán",
        description: "Choose between Mandalas in town and Hideout near Lake Atitlán. Check live availability and book direct for your stay in San Pedro La Laguna.",
        socialDescription: "Choose between Mandalas in town and Hideout near Lake Atitlán. Check live availability and book direct for your stay in San Pedro La Laguna.",
        canonical: "https://www.mandalashostels.com",
        image: "https://www.mandalashostels.com/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
    },
    {
        path: "/pueblo",
        title: "Central Hostel in San Pedro La Laguna | Mandalas",
        description: "Stay in central San Pedro La Laguna at Mandalas Hostal, with a rooftop, shared kitchen, dorms and private rooms. Check live availability and book direct.",
        socialDescription: "Stay in central San Pedro La Laguna at Mandalas Hostal, with a rooftop, shared kitchen, dorms and private rooms. Check live availability and book direct.",
        canonical: "https://www.mandalashostels.com/pueblo",
        image: "https://www.mandalashostels.com/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
    },
    {
        path: "/hideout",
        title: "Quiet Hostel near Lake Atitlán | Mandalas Hideout",
        description: "Mandalas Hideout is a quiet stay near Lake Atitlán, outside San Pedro La Laguna. Check live availability for dorms and private rooms and book direct.",
        socialDescription: "Mandalas Hideout is a quiet stay near Lake Atitlán, outside San Pedro La Laguna. Check live availability for dorms and private rooms and book direct.",
        canonical: "https://www.mandalashostels.com/hideout",
        image: "https://www.mandalashostels.com/images/mandalas/hostelworld/hideout-terrace-dusk.jpg",
    },
    {
        path: "/contact",
        title: "Contact and Stay Inquiry | Mandalas Hostal",
        description: "Contact Mandalas Hostal to check dates and choose between Mandalas in town or Hideout near the lake in San Pedro La Laguna.",
        socialDescription: "Check dates on WhatsApp and choose the stay that best fits your trip.",
        twitterDescription: "Check dates and your ideal stay on WhatsApp.",
        canonical: "https://www.mandalashostels.com/contact",
        image: "https://www.mandalashostels.com/images/mandalas/pueblo-dock-boat.webp",
    },
    {
        path: "/guide",
        title: "Practical Guide to San Pedro La Laguna | Mandalas Hostal",
        description: "Plan your trip to San Pedro La Laguna on Lake Atitlán with practical information about routes from Antigua and Panajachel, local boats, tuk-tuks and cash.",
        socialDescription: "Plan your trip to San Pedro La Laguna on Lake Atitlán with practical information about routes from Antigua and Panajachel, local boats, tuk-tuks and cash.",
        canonical: "https://www.mandalashostels.com/guide",
        image: "https://www.mandalashostels.com/images/mandalas/guide-social.jpg",
    },
]

for (const metadata of pages) {
    test(`${metadata.path} exposes direct-booking metadata`, async ({ page }) => {
        const response = await page.goto(metadata.path)

        expect(response?.ok()).toBeTruthy()
        await expect(page).toHaveTitle(metadata.title)
        await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", metadata.description)
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", metadata.canonical)

        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", metadata.title)
        await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", metadata.socialDescription)
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", metadata.canonical)
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", metadata.image)

        await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image")
        await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", metadata.title)
        await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
            "content",
            metadata.twitterDescription ?? metadata.socialDescription,
        )
        await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", metadata.image)

        const structuredData = page.locator('script[type="application/ld+json"]')
        await expect(structuredData.first()).toBeAttached()
        expect(await structuredData.count()).toBeGreaterThan(0)

        for (const content of await structuredData.allTextContents()) {
            expect(() => JSON.parse(content)).not.toThrow()
        }
    })
}

test("/guide exposes coherent metadata and Article structured data", async ({ page }) => {
    const response = await page.goto("/guide")

    expect(response?.ok()).toBeTruthy()
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator("h1")).toContainText("How to get to San Pedro La Laguna and Mandalas Hostels")
    await expect(page).toHaveTitle("Practical Guide to San Pedro La Laguna | Mandalas Hostal")
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://www.mandalashostels.com/guide",
    )
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article")
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        "https://www.mandalashostels.com/guide",
    )
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        "https://www.mandalashostels.com/images/mandalas/guide-social.jpg",
    )

    const article = JSON.parse(await page.locator("#guide-structured-data").textContent() ?? "{}")

    expect(article).toMatchObject({
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": "https://www.mandalashostels.com/guide#article",
        url: "https://www.mandalashostels.com/guide",
        headline: "Practical Guide to San Pedro La Laguna",
        inLanguage: "en",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://www.mandalashostels.com/guide",
        },
        image: {
            "@type": "ImageObject",
            url: "https://www.mandalashostels.com/images/mandalas/guide-lancha.png",
            width: 1024,
            height: 1024,
        },
        author: {
            "@type": "Organization",
            name: "Mandalas Hostal",
            url: "https://www.mandalashostels.com",
        },
        publisher: {
            "@type": "Organization",
            name: "Mandalas Hostal",
            url: "https://www.mandalashostels.com",
        },
    })
    expect(article).not.toHaveProperty("datePublished")
    expect(article).not.toHaveProperty("dateModified")
})

test("sitemap includes the canonical /guide URL exactly once", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml")
    expect(sitemap.ok()).toBeTruthy()

    const xml = await sitemap.text()
    const guideUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
        .map((match) => match[1])
        .filter((url) => url.includes("/guide"))

    expect(guideUrls).toEqual(["https://www.mandalashostels.com/guide"])
})

test("robots and sitemap expose only the canonical public surface", async ({ request }) => {
    const robots = await request.get("/robots.txt")
    expect(robots.ok()).toBeTruthy()
    const robotsText = await robots.text()
    expect(robotsText).toMatch(/Sitemap: https:\/\/www\.mandalashostels\.com\/sitemap\.xml/)
    expect(robotsText).toMatch(/Disallow: \/admin/)
    expect(robotsText).toMatch(/Disallow: \/api/)
    expect(robotsText).toMatch(/Disallow: \/my-booking/)

    const sitemap = await request.get("/sitemap.xml")
    expect(sitemap.ok()).toBeTruthy()
    const xml = await sitemap.text()
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])

    expect(urls).toEqual([
        "https://www.mandalashostels.com",
        "https://www.mandalashostels.com/pueblo",
        "https://www.mandalashostels.com/hideout",
        "https://www.mandalashostels.com/contact",
        "https://www.mandalashostels.com/guide",
    ])
})
