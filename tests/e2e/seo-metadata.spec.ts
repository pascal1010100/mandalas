import { expect, test } from "@playwright/test"

const pages = [
    {
        path: "/",
        title: "Mandalas Hostels | San Pedro La Laguna, Atitlán",
        description: "Choose between Mandalas in town and Hideout near Lake Atitlán. Check live availability and book direct for your stay in San Pedro La Laguna.",
        canonical: "https://www.mandalashostels.com",
        image: "https://www.mandalashostels.com/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
    },
    {
        path: "/pueblo",
        title: "Central Hostel in San Pedro La Laguna | Mandalas",
        description: "Stay in central San Pedro La Laguna at Mandalas Hostal, with a rooftop, shared kitchen, dorms and private rooms. Check live availability and book direct.",
        canonical: "https://www.mandalashostels.com/pueblo",
        image: "https://www.mandalashostels.com/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg",
    },
    {
        path: "/hideout",
        title: "Quiet Hostel near Lake Atitlán | Mandalas Hideout",
        description: "Mandalas Hideout is a quiet stay near Lake Atitlán, outside San Pedro La Laguna. Check live availability for dorms and private rooms and book direct.",
        canonical: "https://www.mandalashostels.com/hideout",
        image: "https://www.mandalashostels.com/images/mandalas/hostelworld/hideout-terrace-dusk.jpg",
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
        await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", metadata.description)
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", metadata.canonical)
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", metadata.image)

        await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image")
        await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", metadata.title)
        await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", metadata.description)
        await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", metadata.image)
    })
}
