import { expect, test } from "@playwright/test"

const bookingUrl = "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq"

test("Pueblo presents its hybrid decision and booking story", async ({ page }) => {
    const response = await page.goto("/pueblo")

    expect(response?.ok()).toBeTruthy()
    await expect(page.locator("[data-pueblo-moment]")).toHaveCount(6)
    await expect(page.getByRole("heading", { level: 2, name: "For the town-first traveler" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: "Courtyard, stairs, lake" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: "Arrive with the route in hand" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: "Check rooms, dates and prices" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: "Prefer a quieter stay near the lake?" })).toBeVisible()

    const heroBookingCta = page.locator("[data-property-hero-booking-cta]")
    await expect(heroBookingCta).toHaveCount(1)
    await expect(heroBookingCta).toHaveAttribute("href", bookingUrl)

    const pageBookingLinks = page.locator("main").getByRole("link", { name: "Book Mandalas", exact: true })
    await expect(pageBookingLinks).toHaveCount(2)
    for (const bookingLink of await pageBookingLinks.all()) {
        await expect(bookingLink).toHaveAttribute("href", bookingUrl)
    }

    await expect(page.getByRole("link", { name: "Compare Hideout" })).toHaveAttribute("href", "/hideout")
    await expect(page.getByRole("link", { name: /Compare Mandalas Hideout/ })).toHaveAttribute("href", "/hideout")
    await expect(page.getByRole("link", { name: "Plan your arrival" })).toHaveAttribute("href", "/guide#arrival")
    await expect(page.locator("#galeria")).toHaveCount(1)
    await expect(page.getByText(/Final availability, room details, prices, policies and confirmation happen in Cloudbeds/)).toBeVisible()
    await expect(page.getByText(/central, walkable and social base/i)).toBeVisible()
})

test("Pueblo uses real photography assigned to its vertical story", async ({ page }) => {
    await page.goto("/pueblo")

    const editorialImages = [
        "White stairs and warm architectural details inside Mandalas",
        "Planted Mandalas courtyard with hammocks",
        "Lake Atitlán and its mountains seen from Mandalas",
    ]

    for (const alt of editorialImages) {
        await expect(page.getByRole("img", { name: alt, exact: true })).toBeVisible()
    }
})

test("Pueblo avoids unverified amenities and room categories", async ({ page }) => {
    await page.goto("/pueblo")

    const content = page.locator("main")
    await expect(content).not.toContainText(/shared kitchen|mixed dorm|female dorm|private room|women-only/i)
    await expect(content).not.toContainText(/rooftop|common areas|meeting other travelers/i)
    await expect(content).not.toContainText(/free wi-?fi|free lockers|laundry|tours|check-in|check-out|0\.3 km|dock nearby|bike parking|shared guest access/i)
    await expect(content).toContainText("Cloudbeds")
})

test("mobile Pueblo keeps its hybrid order without horizontal overflow", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only layout check")

    await page.goto("/pueblo")

    const moments = await page.locator("[data-pueblo-moment]").evaluateAll((elements) => (
        elements.map((element) => element.getAttribute("data-pueblo-moment"))
    ))
    expect(moments).toEqual(["hero", "fit", "story", "arrival", "booking", "compare"])

    const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
})
