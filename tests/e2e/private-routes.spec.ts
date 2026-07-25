import { expect, test } from "@playwright/test"

function expectPrivateMetadata(html: string) {
    expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"\s*\/?>/)
    expect(html).not.toContain('rel="canonical"')
    expect(html).not.toContain('property="og:')
    expect(html).not.toContain('name="twitter:')
    expect(html).not.toContain("https://www.mandalashostels.com/images/")
}

test("admin login does not inherit public metadata", async ({ request }) => {
    const response = await request.get("/admin/login")

    expect(response.ok()).toBeTruthy()
    expectPrivateMetadata(await response.text())
})

test("admin routes do not inherit public metadata", async ({ request }) => {
    const response = await request.get("/admin")

    expect(response.ok()).toBeTruthy()
    expectPrivateMetadata(await response.text())
})

test("my booking remains noindex without public canonical or social metadata", async ({ request }) => {
    const response = await request.get("/my-booking")

    expect(response.ok()).toBeTruthy()
    expectPrivateMetadata(await response.text())
})
