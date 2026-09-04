import { expect, test, type Locator } from "@playwright/test"

const properties = [
    {
        path: "/pueblo",
        bookingLabel: "Book Mandalas",
        bookingUrl: "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq",
        heroSelector: "main a[href*='hotels.cloudbeds.com/en/reservation/5VReHj']",
    },
    {
        path: "/hideout",
        bookingLabel: "Book Hideout",
        bookingUrl: "/contact?location=Hideout#inquiry",
        heroSelector: "[data-property-hero-booking-cta]",
    },
]

async function scrollHeroCtaAboveViewport(heroBookingCta: Locator) {
    await heroBookingCta.evaluate((element) => {
        const rect = element.getBoundingClientRect()
        window.scrollTo(0, window.scrollY + rect.bottom + 1)
    })

    await expect.poll(() => heroBookingCta.evaluate((element) => (
        element.getBoundingClientRect().bottom
    ))).toBeLessThanOrEqual(0)
}

for (const property of properties) {
    test(`${property.path} reveals its mobile booking bar only after the hero CTA`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "mobile-chromium", "Mobile portrait behavior")

        await page.goto(property.path)

        const heroBookingCta = page.locator(property.heroSelector).first()
        const mobileBookingBar = page.locator("[data-property-mobile-booking-bar]")

        await expect(heroBookingCta).toBeVisible()
        await expect(heroBookingCta).toBeInViewport()
        await expect(heroBookingCta).toHaveAttribute("href", property.bookingUrl)
        await expect(mobileBookingBar).toHaveCount(0)

        await scrollHeroCtaAboveViewport(heroBookingCta)

        await expect(mobileBookingBar).toBeVisible()
        await expect(mobileBookingBar.getByRole("link", {
            name: property.bookingLabel,
            exact: true,
        })).toHaveAttribute("href", property.bookingUrl)

        await heroBookingCta.scrollIntoViewIfNeeded()
        await expect(heroBookingCta).toBeVisible()
        await expect(heroBookingCta).toBeInViewport()
        await expect(mobileBookingBar).toHaveCount(0)
    })

    test(`${property.path} keeps the mobile booking bar hidden on desktop`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "desktop-chromium", "Desktop preservation check")

        await page.goto(property.path)
        await scrollHeroCtaAboveViewport(page.locator(property.heroSelector).first())

        await expect(page.locator("[data-property-mobile-booking-bar]")).toBeHidden()
    })
}
