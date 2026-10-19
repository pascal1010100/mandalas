import { expect, test } from "@playwright/test"

const spanishPaths = ["/es", "/es/pueblo", "/es/hideout", "/es/guia", "/es/contacto"]
const routePairs = [["/", "/es"], ["/pueblo", "/es/pueblo"], ["/hideout", "/es/hideout"], ["/guide", "/es/guia"], ["/contact", "/es/contacto"]] as const

test("Spanish browser preference selects the Spanish home", async ({ browser }) => {
    const context = await browser.newContext({ locale: "es-GT" })
    const page = await context.newPage()

    try {
        await page.goto("/")
        await expect(page).toHaveURL(/\/es$/)
        await expect(page.locator("html")).toHaveAttribute("lang", "es")
    } finally {
        await context.close()
    }
})

test("English and Spanish routes keep the same page structure", async ({ page }) => {
    for (const [englishPath, spanishPath] of routePairs) {
        await page.goto(englishPath)
        const english = await page.locator("main").evaluate((main) => ({ sections: main.querySelectorAll("section").length, headings: main.querySelectorAll("h1, h2, h3").length, images: main.querySelectorAll("img").length }))
        await page.goto(spanishPath)
        const spanish = await page.locator("main").evaluate((main) => ({ sections: main.querySelectorAll("section").length, headings: main.querySelectorAll("h1, h2, h3").length, images: main.querySelectorAll("img").length }))
        expect(spanish, spanishPath).toEqual(english)
    }
})

test("Spanish home exposes both stays and localized booking paths", async ({ page }) => {
    const response = await page.goto("/es")

    expect(response?.ok()).toBeTruthy()
    await expect(page.locator("html")).toHaveAttribute("lang", "es")
    await expect(page.getByRole("heading", { level: 1, name: "Elige tu hospedaje en San Pedro La Laguna" })).toBeVisible()
    await expect(page.locator('main a[href="/es/pueblo"]').first()).toBeVisible()
    await expect(page.locator('main a[href="/es/hideout"]').first()).toBeVisible()
    await expect(page.locator('a[href="https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq"]').first()).toBeVisible()
})

test("Spanish direct booking keeps the two Cloudbeds properties separate", async ({ page }) => {
    await page.goto("/es/contacto", { waitUntil: "domcontentloaded" })

    const directBooking = page.locator("#book-directly")
    await expect(directBooking.getByRole("link", { name: "Reservar Mandalas", exact: true })).toHaveAttribute(
        "href", "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq",
    )
    await expect(directBooking.getByRole("link", { name: "Reservar Hideout", exact: true })).toHaveAttribute(
        "href", "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq",
    )
})

test("Spanish pages remain within the viewport", async ({ page }) => {
    for (const path of spanishPaths) {
        const response = await page.goto(path)
        expect(response?.ok(), path).toBeTruthy()
        await expect(page.locator("h1"), `${path} needs one primary heading`).toHaveCount(1)

        const dimensions = await page.evaluate(() => ({
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
        }))

        expect(dimensions.scrollWidth, `${path} should not overflow horizontally`).toBeLessThanOrEqual(dimensions.clientWidth + 1)
    }
})

test("language switch preserves the equivalent page", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop navigation check")

    await page.goto("/pueblo")
    await page.getByRole("link", { name: "Ver sitio en español" }).click()
    await expect(page).toHaveURL(/\/es\/pueblo$/)
    await expect(page.locator("html")).toHaveAttribute("lang", "es")

    await page.getByRole("link", { name: "View site in English" }).click()
    await expect(page).toHaveURL(/\/pueblo$/)
    await expect(page.locator("html")).toHaveAttribute("lang", "en")
})

test("Spanish mobile menu exposes localized destinations", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile navigation check")

    await page.goto("/es/hideout")
    await page.getByRole("button", { name: "Abrir menú de navegación" }).click()

    const menu = page.getByRole("dialog")
    await expect(menu.getByRole("link", { name: /Mandalas en el centro de San Pedro/i })).toHaveAttribute("href", "/es/pueblo")
    await expect(menu.getByRole("link", { name: /Guía de viaje cómo llegar al Lago de Atitlán/i })).toHaveAttribute("href", "/es/guia")
    await expect(menu.getByRole("link", { name: "Contacto", exact: true })).toHaveAttribute("href", "/es/contacto")
    await expect(menu.getByRole("link", { name: "RESERVAR HIDEOUT", exact: true })).toHaveAttribute("href", "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq")
})
