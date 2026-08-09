import { expect, test } from "@playwright/test"

const properties = [
    {
        path: "/pueblo",
        heading: "Mandalas",
        accessibleHeading: "Central hostel in San Pedro La Laguna — Mandalas",
        bookingLabel: "Book Mandalas",
        bookingUrl: "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq",
        instagramUrl: "https://www.instagram.com/mandalas_hostal/",
    },
    {
        path: "/hideout",
        heading: "Hideout",
        accessibleHeading: "Quiet hostel near Lake Atitlán — Hideout",
        bookingLabel: "Book Hideout",
        bookingUrl: "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq",
        instagramUrl: "https://www.instagram.com/mandalashideout/",
    },
]

const publicPaths = ["/", "/pueblo", "/hideout", "/guide", "/contact"]

function boxesOverlap(
    first: { x: number; y: number; width: number; height: number },
    second: { x: number; y: number; width: number; height: number },
) {
    return first.x < second.x + second.width
        && first.x + first.width > second.x
        && first.y < second.y + second.height
        && first.y + first.height > second.y
}

test("home presents both stays", async ({ page }) => {
    const response = await page.goto("/")

    expect(response?.ok()).toBeTruthy()
    await expect(page).toHaveTitle("Mandalas Hostels | San Pedro La Laguna, Atitlán")
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.getByRole("heading", {
        level: 1,
        name: "Choose your stay in San Pedro La Laguna",
        exact: true,
    })).toBeVisible()
    await expect(page.locator('main a[href="/pueblo"]').first()).toBeVisible()
    await expect(page.locator('main a[href="/hideout"]').first()).toBeVisible()
    await expect(page.locator("main").getByRole("link", {
        name: "Choose your stay",
        exact: true,
    }).first()).toHaveAttribute("href", "/contact#book-directly")
    await expect(page.locator("a button")).toHaveCount(0)
    await expect(page.locator("body")).not.toHaveAttribute("translate", "no")
    await expect(page.locator("body")).not.toHaveClass(/notranslate/)
})

for (const property of properties) {
    test(`${property.heading} exposes its critical links`, async ({ page }) => {
        const response = await page.goto(property.path)

        expect(response?.ok()).toBeTruthy()
        await expect(page.getByRole("heading", {
            level: 1,
            name: property.accessibleHeading,
            exact: true,
        })).toBeVisible()

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
    await expect(page.getByRole("link", { name: /Travel guide arriving at Lake Atitlán/i })).toBeVisible()
    await expect(page.getByRole("link", { name: "BOOK HIDEOUT", exact: true })).toHaveAttribute(
        "href",
        "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq",
    )
})

test("mobile guide navigation opens as a compact right sidebar", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only sidebar check")

    await page.goto("/guide")
    await page.getByRole("button", { name: "Open navigation menu" }).click()

    const sidebar = page.getByRole("dialog")
    const sidebarBox = await sidebar.boundingBox()
    const viewport = page.viewportSize()

    expect(sidebarBox).not.toBeNull()
    expect(viewport).not.toBeNull()
    expect(sidebarBox!.width).toBeGreaterThan(viewport!.width * 0.45)
    expect(sidebarBox!.width).toBeLessThan(viewport!.width * 0.55)
    await expect(sidebar.getByRole("link", { name: /Travel guide arriving at Lake Atitlán/i })).toBeVisible()
    const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
})

test("mobile home keeps both stays in the first viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only comparison check")

    await page.goto("/")

    const mandalas = page.locator('main a[aria-label="View Mandalas details"]')
    const hideout = page.locator('main a[aria-label="View Mandalas Hideout details"]')
    const mandalasBox = await mandalas.boundingBox()
    const hideoutBox = await hideout.boundingBox()
    const viewport = page.viewportSize()

    expect(mandalasBox).not.toBeNull()
    expect(hideoutBox).not.toBeNull()
    expect(viewport).not.toBeNull()
    expect(hideoutBox!.y).toBeLessThan(viewport!.height)
    expect(hideoutBox!.y + hideoutBox!.height).toBeLessThanOrEqual(viewport!.height + 2)

    const menuBox = await page.getByRole("button", { name: "Open navigation menu" }).boundingBox()
    expect(menuBox).not.toBeNull()
    expect(menuBox!.width).toBeGreaterThanOrEqual(44)
    expect(menuBox!.height).toBeGreaterThanOrEqual(44)

    const fixedCta = page.locator("div.fixed").filter({
        has: page.getByRole("link", { name: "Book Hideout", exact: true }),
    })
    const hideoutMeta = hideout.getByText("WiFi / Music / Lake", { exact: true })
    const fixedCtaBox = await fixedCta.boundingBox()
    const hideoutMetaBox = await hideoutMeta.boundingBox()

    expect(fixedCtaBox).not.toBeNull()
    expect(hideoutMetaBox).not.toBeNull()
    expect(boxesOverlap(fixedCtaBox!, hideoutMetaBox!)).toBeFalsy()
})

test("public routes do not overflow horizontally on tablets", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith("tablet-"), "Tablet-only layout check")

    for (const path of publicPaths) {
        await page.goto(path)
        const dimensions = await page.evaluate(() => ({
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
        }))

        expect(dimensions.scrollWidth, `${path} should not overflow horizontally`).toBeLessThanOrEqual(
            dimensions.clientWidth + 1,
        )
    }
})

test("tablet home hero labels do not collide with its central message", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith("tablet-"), "Tablet-only hero check")

    await page.goto("/")

    const message = page.getByText("Choose your rhythm", { exact: true })
    if (!(await message.isVisible())) return

    const messageBox = await message.boundingBox()
    const labelBoxes = await Promise.all([
        page.getByText("Social base in town", { exact: true }).boundingBox(),
        page.getByText("Work + lake hub", { exact: true }).boundingBox(),
    ])

    expect(messageBox).not.toBeNull()
    for (const labelBox of labelBoxes) {
        expect(labelBox).not.toBeNull()
        expect(boxesOverlap(messageBox!, labelBox!)).toBeFalsy()
    }
})

test("mobile landscape navigation keeps its final action reachable", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-landscape-chromium", "Landscape-only navigation check")

    await page.goto("/hideout")
    await page.getByRole("button", { name: "Open navigation menu" }).click()

    const finalAction = page.getByRole("link", { name: "BOOK HIDEOUT", exact: true })
    await finalAction.scrollIntoViewIfNeeded()
    await expect(finalAction).toBeInViewport()
})

test("reduced-motion preference disables cinematic transforms", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")

    const heroImage = page
        .locator("main article")
        .filter({ has: page.getByRole("link", { name: "View Mandalas details" }) })
        .locator("img")
    const motion = await heroImage.evaluate((element) => {
        const styles = window.getComputedStyle(element)
        return {
            transform: styles.transform,
            transitionDuration: styles.transitionDuration,
        }
    })

    expect(motion.transform).toBe("none")
    expect(motion.transitionDuration).toBe("0s")
})

test("navbar booking control reveals the booking choices on contact", async ({ page }) => {
    await page.goto("/contact")

    const menuTrigger = page.getByRole("button", { name: "Open navigation menu" })
    if (await menuTrigger.isVisible()) {
        await menuTrigger.click()
        await page.getByRole("link", { name: "CHOOSE YOUR STAY", exact: true }).click()
    } else {
        await page.locator("nav").getByRole("link", { name: "Choose your stay", exact: true }).click()
    }

    await expect(page).toHaveURL(/\/contact#book-directly$/)
    await expect(page.locator("#book-directly")).toBeInViewport()
})

test("contact preserves direct booking and the prefilled WhatsApp inquiry", async ({ page }) => {
    await page.addInitScript(() => {
        window.open = ((url?: string | URL) => {
            window.sessionStorage.setItem("mandalas-test-window-open", String(url))
            return null
        }) as typeof window.open
    })

    await page.goto("/contact?location=Hideout&room=Private%20Room#inquiry")

    const directBooking = page.locator("#book-directly")
    await expect(directBooking.getByRole("link", { name: "Book Mandalas", exact: true })).toHaveAttribute(
        "href",
        "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq",
    )
    await expect(directBooking.getByRole("link", { name: "Book Hideout", exact: true })).toHaveAttribute(
        "href",
        "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq",
    )

    const inquiry = page.locator("#inquiry")
    await expect(inquiry.getByRole("combobox").nth(0)).toContainText("Hideout")
    await expect(inquiry.getByRole("combobox").nth(1)).toContainText("Private room")

    await inquiry.getByLabel("Name").fill("Test Guest")
    await inquiry.getByLabel("Guests").fill("2")
    await inquiry.getByLabel("Dates").fill("July 12 to 15")
    await inquiry.getByRole("button", { name: "Ask on WhatsApp" }).click()

    const openedUrl = await page.evaluate(() =>
        window.sessionStorage.getItem("mandalas-test-window-open"),
    )

    expect(openedUrl).toMatch(/^https:\/\/wa\.me\//)
    expect(openedUrl).toContain("Test%20Guest")
    expect(openedUrl).toContain("Private%20Room")
})

test("contact defers the map until the visitor scrolls near it", async ({ page }) => {
    await page.goto("/contact")

    const loadingMap = page.getByRole("status", { name: "Interactive map loading" })

    await expect(loadingMap).toBeAttached()
    await expect(page.locator(".leaflet-container")).toHaveCount(0)

    await loadingMap.scrollIntoViewIfNeeded()

    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 10_000 })
})
