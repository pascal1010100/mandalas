import { expect, test } from "@playwright/test"

const hideoutEngine = "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq"
const mandalasEngine = "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq"

test("all visible and sticky Hideout booking destinations use its confirmed engine in both languages", async ({ page }) => {
  for (const path of ["/", "/hideout", "/contact", "/es", "/es/hideout", "/es/contacto"]) {
    const response = await page.goto(path)
    expect(response?.ok(), path).toBeTruthy()
    const hideoutLinks = page.locator("a").filter({ hasText: /^\s*(?:book|reservar)\s+hideout\s*$/i })
    expect(await hideoutLinks.count(), `${path}: Hideout booking links`).toBeGreaterThan(0)
    for (const link of await hideoutLinks.all()) await expect(link).toHaveAttribute("href", hideoutEngine)
    const mandalasLinks = page.locator("a").filter({ hasText: /^\s*(?:book|reservar)\s+mandalas\s*$/i })
    for (const link of await mandalasLinks.all()) await expect(link).toHaveAttribute("href", mandalasEngine)
  }
})

test("Hideout booking click requests the confirmed external destination without sending a reservation", async ({ page }) => {
  // Abort the outgoing navigation before any Cloudbeds request is sent.
  // This tests our CTA, not Cloudbeds availability or checkout.
  await page.route("https://hotels.cloudbeds.com/**", route => route.abort())
  await page.goto("/es/hideout")
  const outgoing = page.waitForRequest(request => request.url() === hideoutEngine)
  await page.locator("main").getByRole("link", { name: "Reservar Hideout", exact: true }).first().click({ noWaitAfter: true })
  expect((await outgoing).url()).toBe(hideoutEngine)
})
