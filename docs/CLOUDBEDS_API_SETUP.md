# Cloudbeds API setup

Mandalas Hideout and Mandalas Pueblo are separate Cloudbeds properties. Each property must use its own server-side API key.

## Local environment

Add the credentials to `.env.local`. Never use a `NEXT_PUBLIC_` prefix and never commit or share the keys.

```bash
CLOUDBEDS_API_BASE_URL=https://api.cloudbeds.com/api/v1.3
CLOUDBEDS_HIDEOUT_API_KEY=
CLOUDBEDS_HIDEOUT_PROPERTY_ID=
CLOUDBEDS_MANDALAS_API_KEY=
CLOUDBEDS_MANDALAS_PROPERTY_ID=
CLOUDBEDS_WEBHOOK_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
NEXT_PUBLIC_SITE_URL=
```

The property IDs are optional during the initial verification because `getHotels` can discover them.

## Verify Hideout

The verification command makes read-only calls to `getHotels` and `getHotelDetails`. It never prints the API key or guest information.

```bash
pnpm cloudbeds:verify
```

List the physical rooms and their Cloudbeds room-type identifiers without accessing reservation or guest data:

```bash
pnpm cloudbeds:rooms
```

Summarize reservations checking in during the next 30 days without requesting guest details:

```bash
pnpm cloudbeds:reservations
```

The API key should currently have only the `Read` scopes for Hotel, Room, Reservation, and Guest.

## Real-time reservation events without a database

The webhook is stateless: it validates each Cloudbeds event, applies an operational rule, and immediately sends a Telegram alert. It does not store the event or guest information.

Before enabling it:

1. Generate a long random value for `CLOUDBEDS_WEBHOOK_SECRET` and add it only to the deployment environment.
2. Create a Telegram bot and configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` only on the server.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin and deploy the application to obtain a public HTTPS URL.
4. Subscribe the required Cloudbeds reservation events to:

```text
https://YOUR_DOMAIN/api/webhooks/cloudbeds?token=YOUR_WEBHOOK_SECRET
```

Start with `reservation/created`, `reservation/status_changed`, `reservation/dates_changed`, `reservation/accommodation_changed`, and `reservation/accommodation_removed`. The endpoint accepts only the configured Hideout property ID and rejects unsupported event types and oversized payloads.

Cloudbeds can deliver duplicate webhooks. The application suppresses matching events for ten minutes inside one running instance, which is useful but not a durable guarantee in a serverless deployment. Every alert therefore includes the Cloudbeds reservation ID so the team can verify it before acting.

Do not create the Cloudbeds subscriptions until the public endpoint and Telegram delivery have both been tested.

## Hideout room mapping

Cloudbeds returns 14 physical units grouped into six room types. Their stable `roomID` and `roomTypeID` values are mapped to the existing local room IDs in `src/infrastructure/cloudbeds/room-mapping.ts`. Dorm beds use local unit IDs `1` through `5`.
