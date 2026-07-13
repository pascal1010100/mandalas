import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { init } = vi.hoisted(() => ({ init: vi.fn() }))

vi.mock("posthog-js", () => ({ default: { init } }))

type BeforeSend = (event: {
  event: string
  properties?: Record<string, unknown>
}) => unknown

describe("PostHog client instrumentation", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "")
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "")
    window.history.replaceState({}, "", "/")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("does not initialize without both public configuration values", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test")

    await import("../../instrumentation-client")

    expect(init).not.toHaveBeenCalled()
  })

  it("initializes anonymous analytics with privacy-sensitive features disabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test")
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com")

    await import("../../instrumentation-client")

    expect(init).toHaveBeenCalledWith(
      "phc_test",
      expect.objectContaining({
        api_host: "https://us.i.posthog.com",
        advanced_disable_feature_flags: true,
        advanced_disable_feature_flags_on_first_load: true,
        autocapture: false,
        capture_pageview: "history_change",
        capture_pageleave: false,
        capture_dead_clicks: false,
        capture_exceptions: false,
        capture_performance: false,
        disable_persistence: true,
        disable_session_recording: true,
        disable_surveys: true,
        enable_heatmaps: false,
        person_profiles: "never",
      }),
    )
  })

  it("removes query strings and blocks events on private routes", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test")
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com")

    await import("../../instrumentation-client")

    const config = init.mock.calls[0]?.[1] as { before_send: BeforeSend }
    const event = {
      event: "$pageview",
      properties: {
        $current_url: "https://www.mandalashostels.com/pueblo?utm_source=test",
        $referrer: "https://example.com/search?q=private",
      },
    }

    expect(config.before_send(event)).toEqual({
      event: "$pageview",
      properties: {
        $current_url: "https://www.mandalashostels.com/pueblo",
        $referrer: "https://example.com/search",
      },
    })

    window.history.replaceState({}, "", "/my-booking?token=private")
    expect(config.before_send(event)).toBeNull()
  })
})
