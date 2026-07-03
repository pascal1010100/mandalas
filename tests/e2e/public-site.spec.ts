import { expect, test } from "@playwright/test"

const properties = [
    {
        path: "/pueblo",
        heading: "Mandalas",
        bookingLabel: "Book Mandalas",
        bookingUrl: "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq",
        instagramUrl: "https://www.instagram.com/mandalas_hostal/",
    },
    {
        path: "/hideout",
        heading: "Hideout",
        bookingLabel: "Book Hideout",
        bookingUrl: "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq",
        instagramUrl: "https://www.instagram.com/mandalashideout/",
    },
]

test("home presents both stays", async ({ page }) => {
    const response = await page.goto("/")

    expect(response?.ok()).toBeTruthy()
    await expect(page).toHaveTitle(/Mandalas Hostal/)
    await expect(page.locator('main a[href="/pueblo"]').first()).toBeVisible()
    await expect(page.locator('main a[href="/hideout"]').first()).toBeVisible()
})

for (const property of properties) {
    test(`${property.heading} exposes its critical links`, async ({ page }) => {
        const response = await page.goto(property.path)

        expect(response?.ok()).toBeTruthy()
        await expect(page.getByRole("heading", { level: 1, name: property.heading, exact: true })).toBeVisible()

        const bookingLink = page.locator("main").getByRole("link", {
            name: property.bookingLabel,
            exact: true,
        }).first()

        await expect(bookingLink).toBeVisible()
        await expect(bookingLink).toHaveAttribute("href", property.bookingUrl)
        await expect(page.locator(`a[href="${property.instagramUrl}"]`).first()).toBeVisible()
    })
}

test("mobile navigation exposes the essential destinations", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only navigation check")

    await page.goto("/hideout")
    await page.getByRole("button", { name: "Open navigation menu" }).click()

    await expect(page.getByRole("link", { name: /Mandalas in the center of San Pedro/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /Hideout nature and slower nights/i })).toBeVisible()
    await expect(page.getByRole("link", { name: "Contact", exact: true })).toBeVisible()
    await expect(page.getByRole("link", { name: "BOOK NOW", exact: true })).toHaveAttribute(
        "href",
        "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq",
    )
})

test("navbar booking control reveals the booking choices on contact", async ({ page }, testInfo) => {
    await page.goto("/contact")

    if (testInfo.project.name === "mobile-chromium") {
        await page.getByRole("button", { name: "Open navigation menu" }).click()
        await page.getByRole("link", { name: "BOOK NOW", exact: true }).click()
    } else {
        await page.locator("nav").getByRole("link", { name: "Book now", exact: true }).click()
    }

    await expect(page).toHaveURL(/\/contact#book-directly$/)
    await expect(page.locator("#book-directly")).toBeInViewport()
})
