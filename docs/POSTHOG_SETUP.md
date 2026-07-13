# PostHog analytics setup

PostHog complements Vercel Web Analytics with the custom conversion events available on the free PostHog plan.

## Configure

1. Create a PostHog Cloud project and choose the US or EU region.
2. Copy the project token and ingestion host from the PostHog project settings.
3. Add these variables to Vercel for Production and Preview:

```bash
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Use `https://eu.i.posthog.com` when the project is in the EU region. The project token is intended for client-side use; never place a PostHog personal API key in a `NEXT_PUBLIC_` variable.

4. Redeploy after saving the variables.
5. Open the website and click a booking or WhatsApp button.
6. Confirm `$pageview`, `booking_intent`, and `whatsapp_intent` in PostHog Activity.

## Privacy contract

The client configuration disables autocapture, session replay, heatmaps, surveys, dead-click capture, exception capture, performance capture, feature flags and persistence. It does not identify visitors or create person profiles.

Pageviews are limited to public routes. Events from `/admin`, `/api` and `/my-booking` are discarded, and query strings or URL fragments are removed before an event is sent.

Custom events contain only:

- `property`: `mandalas`, `hideout`, or `unspecified`.
- `source`: the UI area that generated the click.

Never add names, email addresses, phone numbers, dates, guest counts, messages, reservation IDs, Cloudbeds URLs or query parameters to analytics events.

## Funnel

Create a funnel with:

1. `$pageview`
2. `booking_intent` or `whatsapp_intent`

Break down `booking_intent` by `property` and `source` to see which stay and placement produce the most outbound booking clicks.
