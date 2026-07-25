import posthog from "posthog-js"

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

const PRIVATE_PATH_PREFIXES = ["/admin", "/api", "/my-booking"]

function isPrivatePath(pathname: string) {
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

function withoutQueryOrHash(value: unknown) {
  if (typeof value !== "string") return value

  try {
    const url = new URL(value, window.location.origin)
    return `${url.origin}${url.pathname}`
  } catch {
    return undefined
  }
}

if (projectToken && apiHost) {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: "2026-05-30",
    autocapture: false,
    advanced_disable_feature_flags: true,
    advanced_disable_feature_flags_on_first_load: true,
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
    before_send(event) {
      if (!event) return null
      if (isPrivatePath(window.location.pathname)) return null

      if (event.properties) {
        event.properties.$current_url = withoutQueryOrHash(
          event.properties.$current_url,
        )
        event.properties.$referrer = withoutQueryOrHash(
          event.properties.$referrer,
        )
        event.properties.$initial_referrer = withoutQueryOrHash(
          event.properties.$initial_referrer,
        )
      }

      return event
    },
  })
}
