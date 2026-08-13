import { StrictMode } from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { HomeIntro } from "./home-intro"

describe("HomeIntro", () => {
  afterEach(() => {
    cleanup()
    document.body.style.overflow = ""
    window.sessionStorage.clear()
    vi.unstubAllEnvs()
  })

  it("renders an authored intro without modal semantics", () => {
    render(
      <StrictMode>
        <HomeIntro />
      </StrictMode>,
    )

    const motion = screen.getByTestId("home-intro-motion")

    expect(motion.getAttribute("aria-hidden")).toBe("true")
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(screen.queryByRole("button", { name: /skip/i })).toBeNull()
  })

  it("makes the two-hostel proposition explicit", () => {
    render(<HomeIntro />)

    expect(screen.getByTestId("home-intro-thesis").textContent).toContain("Two")
    expect(screen.getByTestId("home-intro-thesis").textContent).toContain("hostels.")
    expect(screen.getByTestId("home-intro-thesis").textContent).not.toContain("One town")
    expect(screen.getByTestId("home-intro-motion").textContent).toContain("Mandalas Hostel")
    expect(screen.getByTestId("home-intro-motion").textContent).toContain("Mandalas Hideout")
    expect(screen.getByTestId("home-intro-motion").textContent).toContain("In town · Rooftop · Social")
    expect(screen.getByTestId("home-intro-motion").textContent).toContain("Near the lake · Calm")
  })

  it("does not lock scrolling or write session state", () => {
    document.body.style.overflow = "clip"
    render(<HomeIntro />)

    expect(document.body.style.overflow).toBe("clip")
    expect(window.sessionStorage.length).toBe(0)
  })

  it("remains available in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    render(<HomeIntro />)

    expect(screen.getByTestId("home-intro-motion")).toBeTruthy()
  })
})
