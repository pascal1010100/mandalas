import { expect, test, type Page } from "@playwright/test"

const INTRO_TEST_ID = "home-intro-motion"
const TARGET_VIEWPORTS = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
    { name: "compact mobile", width: 320, height: 568 },
] as const

async function openHome(page: Page) {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" })
    expect(response?.ok()).toBeTruthy()

    const motion = page.getByTestId(INTRO_TEST_ID)
    await expect(motion).toBeAttached()
    return motion
}

test.describe("integrated home intro", () => {
    test.beforeEach(({}, testInfo) => {
        test.skip(testInfo.project.name !== "desktop-chromium")
    })

    test("keeps both real property choices actionable from first paint", async ({ page }) => {
        const motion = await openHome(page)
        const mandalas = page.getByRole("link", { name: "View Mandalas Hostal details" })
        const hideout = page.getByRole("link", { name: "View Mandalas Hideout details" })

        await expect(motion).toHaveCSS("pointer-events", "none")
        await expect(mandalas).toBeVisible()
        await expect(hideout).toBeVisible()
        await expect(mandalas).toHaveAttribute("href", "/pueblo")
        await expect(hideout).toHaveAttribute("href", "/hideout")
        await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden")
        await expect(page.getByRole("dialog")).toHaveCount(0)
    })

    test("states the proposition clearly, then reveals the hero in one beat", async ({ page }) => {
        const motion = await openHome(page)
        const thesis = page.getByTestId("home-intro-thesis")

        await expect(thesis).toContainText("Two")
        await expect(thesis).toContainText("hostels.")
        await expect(thesis).not.toContainText("One town")
        await expect(motion).toContainText("Mandalas Hostal")
        await expect(motion).toContainText("Mandalas Hideout")
        await expect(motion).toHaveCSS("visibility", "hidden", { timeout: 4_000 })
    })

    test("respects reduced motion by showing the actionable hero immediately", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" })
        const motion = await openHome(page)

        await expect(motion).toHaveCSS("display", "none")
        await expect(page.getByRole("link", { name: "View Mandalas Hostal details" })).toBeVisible()
        await expect(page.getByRole("link", { name: "View Mandalas Hideout details" })).toBeVisible()
    })
})

test.describe("home intro target viewports", () => {
    test.beforeEach(({}, testInfo) => {
        test.skip(testInfo.project.name !== "desktop-chromium")
    })

    for (const viewport of TARGET_VIEWPORTS) {
        test(`${viewport.name} keeps both stays visible without overflow`, async ({ page }) => {
            await page.setViewportSize(viewport)
            const motion = await openHome(page)

            await expect(page.getByRole("link", { name: "View Mandalas Hostal details" })).toBeVisible()
            await expect(page.getByRole("link", { name: "View Mandalas Hideout details" })).toBeVisible()

            const layout = await motion.evaluate((element) => {
                const root = element.getBoundingClientRect()
                const hero = element.parentElement?.getBoundingClientRect()
                const thesis = element.querySelector<HTMLElement>('[data-testid="home-intro-thesis"]')
                const thesisRect = thesis?.getBoundingClientRect()

                return {
                    fillsHero: hero !== undefined
                        && Math.abs(root.width - hero.width) <= 1
                        && Math.abs(root.height - hero.height) <= 1,
                    hasHorizontalOverflow: document.documentElement.scrollWidth
                        > document.documentElement.clientWidth + 1,
                    bodyScrollLocked: getComputedStyle(document.body).overflow === "hidden",
                    thesisFitsHero: thesisRect !== undefined
                        && hero !== undefined
                        && thesisRect.left >= hero.left
                        && thesisRect.right <= hero.right
                        && thesisRect.top >= hero.top
                        && thesisRect.bottom <= hero.bottom,
                }
            })

            expect(layout).toEqual({
                fillsHero: true,
                hasHorizontalOverflow: false,
                bodyScrollLocked: false,
                thesisFitsHero: true,
            })
        })
    }
})
